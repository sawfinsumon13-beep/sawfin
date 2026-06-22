const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");
const backToTop = document.querySelector(".to-top");
const hero3dCanvas = document.querySelector("#hero-3d-canvas");

const initHero3DBackground = () => {
  if (!hero3dCanvas) return;

  const context = hero3dCanvas.getContext("2d");
  if (!context) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0.5, y: 0.5 };
  const particles = [];
  const particleCount = 90;
  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let time = 0;

  const respawnParticle = (particle, forceDepth = false) => {
    particle.x = Math.random() * 2 - 1;
    particle.y = Math.random() * 2 - 1;
    particle.z = forceDepth ? Math.random() : 1;
    particle.size = 0.7 + Math.random() * 1.9;
    particle.cyan = Math.random() > 0.52;
  };

  for (let index = 0; index < particleCount; index += 1) {
    const particle = {};
    respawnParticle(particle, true);
    particles.push(particle);
  }

  const resizeCanvas = () => {
    const bounds = hero3dCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    hero3dCanvas.width = Math.max(1, Math.floor(width * dpr));
    hero3dCanvas.height = Math.max(1, Math.floor(height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawFrame = () => {
    time += 0.012;
    context.clearRect(0, 0, width, height);

    const glowCenterX = width * (0.5 + (pointer.x - 0.5) * 0.12);
    const glowCenterY = height * 0.35;
    const glow = context.createRadialGradient(glowCenterX, glowCenterY, 10, glowCenterX, glowCenterY, width * 0.55);
    glow.addColorStop(0, "rgba(98, 126, 234, 0.16)");
    glow.addColorStop(1, "rgba(98, 126, 234, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.z -= 0.0032;
      if (particle.z <= 0.03) respawnParticle(particle);

      const depth = particle.z;
      const parallaxX = (pointer.x - 0.5) * 0.34 * depth;
      const parallaxY = (pointer.y - 0.5) * 0.24 * depth;
      const driftY = Math.sin(time + particle.x * 4) * 0.018;
      const screenX = width / 2 + (particle.x + parallaxX) * width * 0.66 * depth;
      const screenY = height / 2 + (particle.y + parallaxY + driftY) * height * 0.56 * depth;
      const radius = particle.size * (0.45 + depth * 2.25);
      const alpha = 0.1 + depth * 0.65;
      const color = particle.cyan ? "0, 212, 255" : "98, 126, 234";

      context.beginPath();
      context.fillStyle = `rgba(${color}, ${alpha})`;
      context.arc(screenX, screenY, radius, 0, Math.PI * 2);
      context.fill();
    });

    if (!reducedMotionQuery.matches) {
      animationFrameId = window.requestAnimationFrame(drawFrame);
    }
  };

  const handlePointerMove = (event) => {
    const bounds = hero3dCanvas.getBoundingClientRect();
    pointer.x = (event.clientX - bounds.left) / bounds.width;
    pointer.y = (event.clientY - bounds.top) / bounds.height;
  };

  resizeCanvas();
  drawFrame();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", handlePointerMove);

  if (reducedMotionQuery.matches && animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

initHero3DBackground();

if (header) {
  const handleHeaderState = () => {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  handleHeaderState();
  window.addEventListener("scroll", handleHeaderState);
}

if (navToggle && header && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (backToTop) {
  const toggleToTop = () => {
    if (window.scrollY > 420) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  };

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  toggleToTop();
  window.addEventListener("scroll", toggleToTop);
}

const animatedElements = document.querySelectorAll("[data-animate]");
if (animatedElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));
}

const statNumbers = document.querySelectorAll(".stat-number[data-target]");
if (statNumbers.length) {
  const startCounter = (element) => {
    const target = Number(element.dataset.target || "0");
    const suffix = element.dataset.suffix || "";
    const duration = 1300;
    let start = 0;
    let startTime = null;

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (target - start) + start);
      element.textContent = `${current}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(update);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    window.requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  statNumbers.forEach((counter) => counterObserver.observe(counter));
}

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  if (!button) return;
  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((faq) => faq.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

const faqSearch = document.querySelector("[data-faq-search]");
if (faqSearch) {
  faqSearch.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase().trim();
    faqItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.classList.toggle("hidden-by-search", Boolean(value) && !text.includes(value));
    });
  });
}

const blogSearch = document.querySelector("[data-blog-search]");
const blogCards = document.querySelectorAll(".blog-card");
if (blogSearch && blogCards.length) {
  blogSearch.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase().trim();
    blogCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const excerpt = card.querySelector("p")?.textContent.toLowerCase() || "";
      const category = card.dataset.category?.toLowerCase() || "";
      const matches = !value || title.includes(value) || excerpt.includes(value) || category.includes(value);
      card.classList.toggle("hidden-by-search", !matches);
    });
  });
}

const readerBox = document.querySelector("#blog-reader");
const readerCategory = document.querySelector("#reader-category");
const readerTitle = document.querySelector("#reader-title");
const readerMeta = document.querySelector("#reader-meta");
const readerContent = document.querySelector("#reader-content");
const readMoreLinks = document.querySelectorAll(".read-more[data-article-id]");

const articleAngles = {
  "article-1": "crypto recovery after wallet hacks and urgent first-hour response",
  "article-2": "cross-chain stolen fund tracing for active crypto recovery cases",
  "article-3": "crypto scam recovery after fake support and impersonation attacks",
  "article-4": "exchange coordination strategy for stronger crypto recovery escalation",
  "article-5": "wrong-address crypto transfer recovery and realistic options",
  "article-6": "avoiding fake recovery scams and secondary fraud after asset loss",
  "article-7": "DeFi exploit crypto recovery planning for investors and teams",
  "article-8": "evidence file preparation for crypto recovery claims and reports",
  "article-9": "stablecoin recovery strategy for unauthorized USDT and USDC transfers",
  "article-10": "wallet-drain emergency containment during live crypto recovery",
  "article-11": "crypto recovery success factors and case outcome analysis",
  "article-12": "how to choose a trusted crypto recovery service provider",
};

const countWords = (html) => html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;

const buildLongFormArticle = (title, category, angle) => {
  const categoryLabel = category ? category[0].toUpperCase() + category.slice(1) : "Insights";
  const safeAngle = angle || "crypto incident response planning";
  return `
    <h3>Why ${title} Matters in Modern Crypto Recovery</h3>
    <p>In 2026, crypto incident response is no longer a niche service. It is now a core operational requirement for high-value holders, active traders, web3 founders, and treasury teams. This guide explores ${safeAngle} through a practical, SEO-friendly lens built around real execution rather than vague advice. The objective is simple: help readers make faster and better decisions when minutes matter. Strong recovery outcomes usually begin with strong structure. When teams follow a repeatable process, they preserve evidence quality, protect legal options, and reduce secondary losses that often happen after the first compromise. For anyone searching for crypto recovery consultation, Ethereum wallet investigation, or blockchain tracing best practices, this long-form guide provides actionable direction.</p>
    <p>A recurring problem in digital asset incidents is informational chaos. People collect screenshots in random folders, share partial narratives in chat apps, and contact multiple providers without a unified case brief. That fragmentation delays progress and weakens strategic clarity. Instead, think in layers: timeline integrity, transaction evidence, counterparty mapping, escalation readiness, and post-incident security hardening. If each layer is handled carefully, outcomes improve significantly. This article was designed to be read by both technical and non-technical audiences, so each recommendation includes plain-language context and an execution mindset. Whether your incident is active or historical, the same principles apply: protect evidence, reduce noise, escalate with precision, and build controls that prevent repeat compromise.</p>

    <h3>1) Build a Clear Incident Command Layer in the First Hour</h3>
    <p>The first hour should focus on decision clarity, not panic-driven activity. Assign one owner responsible for timeline control and evidence discipline. This person does not need to be the most technical member of the team; they need to be the most organized communicator. Create a working incident brief with five fields: what happened, when it happened, what assets are affected, what is still unknown, and what immediate actions are permitted. Restrict ad hoc wallet interactions during this phase. Every unnecessary click can create additional exposure. If you are running a business wallet or family office wallet stack, define who can approve emergency actions and who must only observe. Clear command structure reduces conflicting instructions and protects response quality from minute one.</p>
    <p>From an SEO and discoverability perspective, many users search phrases like "what to do after crypto wallet hack" or "first steps after Ethereum theft." The consistent answer across mature incident teams is procedural discipline. Start a single source of truth document and preserve an immutable chronology of events. Include UTC timestamps, actor names, and exact action descriptions. This timeline becomes the backbone for forensic analysis, exchange escalation, legal collaboration, and insurance communication where applicable. Without it, even strong analysts lose time validating context. With it, teams can move from confusion to controlled execution quickly. A disciplined first-hour framework is one of the highest-leverage improvements any crypto holder can adopt.</p>

    <h3>2) Preserve Evidence in a Way That Supports Investigation and Legal Use</h3>
    <p>Evidence preservation should be treated as a formal workflow, not an afterthought. Capture wallet addresses, transaction hashes, suspicious contract addresses, token approvals, message logs, and platform ticket references in a structured package. Include full URLs and explorer links to avoid ambiguity later. Screenshots are useful, but they are not enough. Always store text-based identifiers that can be independently verified by investigators and counsel. If communication occurred through email, Telegram, Discord, or social channels, export data while preserving metadata when possible. Label each artifact with source, timestamp, and relevance so analysts can prioritize quickly. This improves chain-of-custody quality and reduces duplication during multi-stakeholder reviews.</p>
    <p>Many recovery opportunities are lost because evidence is either incomplete or poorly organized. A strong package improves speed and credibility when contacting exchanges, compliance teams, and legal counsel. Use a predictable naming model: YYYYMMDD-HHMM-ArtifactType-ShortDescription. Keep the original file untouched and create a working copy for annotation. If you suspect device compromise, isolate collection steps from potentially infected environments. The goal is not to create perfect forensic certainty in one pass; the goal is to avoid accidental evidence degradation while giving specialists enough high-quality context to work effectively. Investors who treat evidence like a strategic asset generally achieve clearer investigative outcomes and faster decision cycles.</p>

    <h3>3) Trace Blockchain Movement with Hypothesis-Driven Logic</h3>
    <p>Blockchain tracing is most effective when driven by hypotheses rather than random exploration. Start by identifying the initial outflow transactions tied to the incident, then classify downstream behavior into meaningful patterns: rapid dispersion, bridge transfer, swap laundering, exchange deposit behavior, or dormant parking. Each pattern suggests a different strategic next step. For example, early signals of centralized exchange interaction may justify faster compliance escalation, while extensive smart contract routing may require deeper attribution analysis before outreach. Build a movement map that distinguishes confirmed facts from analytical assumptions. Mixing those categories is a common source of reporting error and weak stakeholder trust.</p>
    <p>A high-quality tracing brief should answer four questions: where did assets move, how quickly did they move, what infrastructure was used, and what intervention points may still exist. Avoid overclaiming attribution unless confidence thresholds are explicit. This is especially important for readers researching terms like "blockchain forensics service" or "crypto transaction tracing consultant." Reliable investigators communicate uncertainty clearly while still delivering practical options. If your analysis includes clusters, mention heuristic limitations and alternative interpretations. Transparent confidence language does not weaken your report; it strengthens credibility with legal and compliance audiences who depend on defensible statements.</p>

    <h3>4) Escalate to Exchanges and Counterparties with High-Signal Documentation</h3>
    <p>When escalation is necessary, quality of communication matters as much as speed. Exchanges and compliance teams receive large volumes of low-detail reports, so concise and structured submissions stand out. Include incident summary, affected addresses, key transaction hashes, timeline highlights, and supporting links in a single packet. State what you are requesting clearly: monitoring, internal review, temporary action, or contact point confirmation. Keep language professional and specific; emotional escalation without evidence usually slows response. If your case spans jurisdictions, ensure terminology remains neutral and verifiable so it can travel across legal contexts without confusion.</p>
    <p>Good escalation strategy is iterative. Start with a complete baseline request, then provide meaningful updates rather than fragmented messages. Track ticket IDs, timestamps, and response status in the same command document used for incident control. If an exchange requests additional evidence, respond with structured deltas instead of rebuilding the full package every time. This creates an auditable communication trail and reduces process fatigue. For organizations, assign one communication owner to prevent duplicate outreach from multiple team members. Consistent contact improves accountability and gives counterparties confidence that your case handling is disciplined and serious.</p>

    <h3>5) Connect Technical Findings to Legal and Strategic Decisions</h3>
    <p>Technical analysis has limited value if it is not translated into decision-ready language. Leadership, counsel, and operations teams need different outputs from the same dataset. Build layered reporting: executive summary for decisions, technical appendix for analysts, and evidence index for legal workflows. In each layer, separate confirmed observations from probability-based assessments. This allows stakeholders to act without misinterpreting confidence levels. Readers searching for "crypto legal evidence guide" often need this exact bridge between blockchain detail and practical action planning. A strong report does not attempt to prove everything; it proves enough to support informed next steps.</p>
    <p>Strategic options typically fall into four tracks: immediate containment, counterpart escalation, legal preparation, and control remediation. Your report should indicate which track is most time-sensitive and why. Include dependencies, such as pending exchange feedback or unresolved attribution questions, so decision makers understand sequencing risk. If outside counsel is involved, provide a consistent evidence index to avoid rework and reduce translation overhead. Teams that align technical and legal streams early usually avoid costly delays later. The objective is coordinated momentum, not isolated expert outputs that never converge into action.</p>

    <h3>6) Harden Security Controls After the Incident</h3>
    <p>Post-incident hardening is where long-term value is created. Without it, teams often repeat the same failure mode within months. Start with identity-layer controls, signer policy reviews, approval boundaries, and communication channel integrity. Remove unnecessary token approvals, rotate sensitive credentials, and enforce strong device hygiene standards. For organizations, define separation of duties across transaction creation, approval, and execution. For individuals, simplify wallet architecture to reduce cognitive overload and avoid hidden operational risk. Security posture should be measurable, not aspirational. Build a checklist with owners and completion dates so controls are actually implemented.</p>
    <p>High-performing security programs combine technical controls with behavioral protocols. Train users to verify destination addresses through independent channels, pause under pressure, and escalate suspicious requests quickly. Simulate realistic phishing and impersonation scenarios to build practical judgment. If you hold significant digital assets, maintain an incident rehearsal routine at least quarterly. Preparedness reduces response latency and improves confidence during real events. For SEO relevance, this is where terms like "crypto wallet security best practices" and "digital asset risk assessment" become actionable rather than theoretical. The goal is not perfection; the goal is resilient operations under stress.</p>

    <h3>7) Create a Repeatable Recovery Playbook for Future Incidents</h3>
    <p>The final step is institutional memory. Convert everything learned into a reusable playbook that future responders can execute without guesswork. Your playbook should include trigger criteria, first-hour workflow, evidence templates, communication scripts, escalation matrix, and post-incident hardening checklist. Keep it lightweight enough to use during real pressure. Overly complex manuals are rarely followed when incidents unfold quickly. Include version history and assign ownership so the document evolves with each case. This approach turns one difficult incident into a long-term capability upgrade for your team or portfolio.</p>
    <p>From a growth perspective, long-form educational content like this also supports brand trust and search visibility. Publishing practical, transparent guidance positions Ethereum Recovery Service as a credible source for blockchain investigation, crypto recovery consultation, and operational security strategy. That trust compounds over time. Readers do not convert because of style alone; they convert when clarity, competence, and consistency are visible in every section. If your situation requires expert support, the fastest path is a structured consultation where your case data can be reviewed against this framework and turned into a prioritized response plan.</p>

    <h3>Conclusion: Clarity, Speed, and Evidence Quality Win</h3>
    <p>${title} is not only a content topic; it represents a practical discipline that can protect real value when stakes are high. By combining incident command structure, evidence integrity, hypothesis-driven tracing, precise escalation, and long-term control hardening, clients can move from reactive decisions to strategic execution. If you need tailored guidance for ${safeAngle}, Ethereum Recovery Service can help you translate raw incident data into an informed recovery roadmap.</p>
    <p><strong>Need a private consultation?</strong> Contact Ethereum Recovery Service for confidential support across ${categoryLabel.toLowerCase()} workflows, blockchain investigation, and digital asset risk reduction.</p>
  `;
};

if (readMoreLinks.length && readerBox && readerCategory && readerTitle && readerMeta && readerContent) {
  readMoreLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const card = link.closest(".blog-card");
      if (!card) return;

      const articleId = link.dataset.articleId || "article-1";
      const title = card.querySelector("h3")?.textContent?.trim() || "Crypto Recovery Insight";
      const category = card.dataset.category || "insights";
      const categoryLabel = category[0].toUpperCase() + category.slice(1);
      const angle = articleAngles[articleId] || "crypto incident response strategy";
      const articleHtml = buildLongFormArticle(title, category, angle);
      const wordCount = countWords(articleHtml);

      readerCategory.textContent = `${categoryLabel} Article`;
      readerTitle.textContent = title;
      readerMeta.textContent = `Approx. ${wordCount} words - SEO-friendly long-form guidance for ${angle}.`;
      readerContent.innerHTML = articleHtml;
      readerBox.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

document.querySelectorAll(".newsletter-form, .contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("[type='submit']");
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.textContent = "Submitted";
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.textContent = originalText || "Submit";
      submitButton.disabled = false;
      form.reset();
    }, 1400);
  });
});

const yearTarget = document.querySelector("[data-year]");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (body) {
  body.classList.add("js-ready");
}
