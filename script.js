const mobileMenuButton = document.querySelector(".mobile-menu-btn");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");
const currentYear = document.getElementById("current-year");
const blogGrid = document.getElementById("blog-grid");
const blogModal = document.getElementById("blog-modal");
const blogModalBody = document.getElementById("blog-modal-body");

currentYear.textContent = String(new Date().getFullYear());

const blogPosts = [
  {
    id: 1,
    category: "Wallet Recovery",
    title: "How to Recover Access to an Ethereum Wallet Without Losing Evidence",
    focus: "wallet access recovery",
    audience: "individual holders and family offices",
    risk: "accidental overwrites and panic-driven device resets",
  },
  {
    id: 2,
    category: "Incident Response",
    title: "First 60 Minutes After a Suspicious Ethereum Transaction",
    focus: "incident response",
    audience: "victims and internal security teams",
    risk: "unauthorized movement across fast bridges and mixers",
  },
  {
    id: 3,
    category: "Forensics",
    title: "Blockchain Tracing Fundamentals for Stolen ETH Investigations",
    focus: "forensic chain tracing",
    audience: "investigators and compliance analysts",
    risk: "mislabeling intermediary wallets and false attribution",
  },
  {
    id: 4,
    category: "Security",
    title: "Preventing Seed Phrase Leakage in High-Risk Environments",
    focus: "seed phrase protection",
    audience: "remote teams and founders",
    risk: "clipboard interception and social engineering",
  },
  {
    id: 5,
    category: "Legal",
    title: "Building a Court-Ready Ethereum Asset Loss Dossier",
    focus: "legal evidence packaging",
    audience: "counsel, claimants, and dispute teams",
    risk: "broken chain-of-custody and incomplete timelines",
  },
  {
    id: 6,
    category: "Exchange Workflow",
    title: "When and How to Escalate a Crypto Loss Case to Exchanges",
    focus: "exchange escalation",
    audience: "retail victims and treasury operators",
    risk: "delayed filings and unsupported claim formats",
  },
  {
    id: 7,
    category: "Operations",
    title: "Multi-Signature Wallet Failures: Recovery Paths That Work",
    focus: "multisig incident handling",
    audience: "DAO contributors and institutional teams",
    risk: "key holder unavailability and policy misconfiguration",
  },
  {
    id: 8,
    category: "Risk Management",
    title: "Designing Ethereum Treasury Controls to Reduce Recovery Events",
    focus: "treasury risk controls",
    audience: "CFO offices and operations leads",
    risk: "manual transfer mistakes and weak approval workflows",
  },
  {
    id: 9,
    category: "Smart Contracts",
    title: "Recoverability Analysis After DeFi Smart Contract Incidents",
    focus: "smart contract incident review",
    audience: "protocol teams and impacted users",
    risk: "rapid secondary transfers and fragmented logs",
  },
  {
    id: 10,
    category: "Compliance",
    title: "Aligning Ethereum Recovery Cases with AML Expectations",
    focus: "AML-aligned case management",
    audience: "compliance officers and legal advisors",
    risk: "incomplete KYC context and poor source mapping",
  },
  {
    id: 11,
    category: "Governance",
    title: "DAO Incident Playbooks for Asset Protection and Recovery",
    focus: "DAO recovery governance",
    audience: "governance leads and signers",
    risk: "slow consensus and unclear ownership records",
  },
  {
    id: 12,
    category: "Education",
    title: "Ethereum Scam Patterns Every New Investor Must Recognize",
    focus: "scam prevention education",
    audience: "new investors and advisors",
    risk: "phishing approvals and fake support channels",
  },
  {
    id: 13,
    category: "Process",
    title: "The Recovery Case Lifecycle from Intake to Resolution",
    focus: "case lifecycle management",
    audience: "service teams and clients",
    risk: "lost context between handoffs",
  },
  {
    id: 14,
    category: "Infrastructure",
    title: "Secure Communication Standards for Recovery Engagements",
    focus: "secure case communication",
    audience: "incident coordinators and clients",
    risk: "identity spoofing and off-channel leakage",
  },
  {
    id: 15,
    category: "Analytics",
    title: "Using Address Clustering to Improve Recovery Outcomes",
    focus: "address clustering analytics",
    audience: "forensic teams and analysts",
    risk: "heuristic overreach and noisy attributions",
  },
  {
    id: 16,
    category: "Architecture",
    title: "Cold Wallet, Warm Wallet, Hot Wallet: Recovery Implications",
    focus: "wallet architecture planning",
    audience: "asset managers and custodians",
    risk: "single-point key exposure",
  },
  {
    id: 17,
    category: "Readiness",
    title: "Recovery Readiness Audits for Ethereum-Focused Teams",
    focus: "recovery readiness auditing",
    audience: "security leaders and operations managers",
    risk: "undocumented dependencies and stale backups",
  },
  {
    id: 18,
    category: "Data Integrity",
    title: "How to Preserve Transaction Evidence Across Devices",
    focus: "evidence preservation",
    audience: "clients and first responders",
    risk: "metadata loss during ad-hoc exports",
  },
  {
    id: 19,
    category: "Leadership",
    title: "Communicating Ethereum Loss Incidents to Stakeholders",
    focus: "stakeholder incident communication",
    audience: "executives and board-level stakeholders",
    risk: "unclear updates that erode trust",
  },
  {
    id: 20,
    category: "Strategy",
    title: "Building a Continuous Improvement Loop After Crypto Incidents",
    focus: "post-incident recovery strategy",
    audience: "cross-functional response programs",
    risk: "recurring failures and untracked lessons learned",
  },
];

const sectionBlueprints = [
  { heading: "Incident Intake and Baseline Verification", anchor: "intake" },
  { heading: "Timeline Reconstruction and Critical Milestones", anchor: "timeline" },
  { heading: "Transaction Mapping and Wallet Attribution", anchor: "mapping" },
  { heading: "Exchange, Custodian, and Counterparty Coordination", anchor: "coordination" },
  { heading: "Legal and Compliance Documentation", anchor: "compliance" },
  { heading: "Containment and Ongoing Risk Reduction", anchor: "containment" },
  { heading: "Operational Communication with Stakeholders", anchor: "communication" },
  { heading: "Case Closure and Continuous Improvement", anchor: "closure" },
];

const sentencePatterns = [
  "For {audience}, the practical starting point in {focus} is to establish a verified baseline of facts before attempting any technical intervention, because even small assumptions can introduce irreversible mistakes later in the workflow.",
  "A disciplined team documents wallet identifiers, transaction hashes, timestamps, tool versions, and communication artifacts in a structured evidence log so that every action remains reproducible under scrutiny.",
  "When {risk} becomes visible, responders should prioritize containment decisions that preserve optionality, which means delaying rushed actions that could destroy signal, invalidate legal claims, or confuse counterparties.",
  "In high-pressure cases, clarity improves when analysts separate confirmed observations from working hypotheses, then assign confidence levels to each statement and update those ratings as new chain data appears.",
  "Because Ethereum activity often crosses bridges, exchanges, and third-party services within minutes, the response plan must include prewritten escalation packets that can be transmitted without rewriting core facts each time.",
  "Strong {focus} practice balances technical depth with procedural consistency, ensuring that each analyst can explain not only what was observed on-chain but also why the team selected one intervention path over another.",
  "Clients gain better outcomes when they understand decision gates in advance, including which conditions trigger legal counsel, which conditions trigger exchange outreach, and which conditions require broader incident notification.",
  "To reduce investigation drift, case leads should schedule recurring evidence reviews where participants validate assumptions, close contradictions, and refine objectives against measurable milestones.",
  "Even when immediate asset return is not possible, maintaining a clean narrative of movements, counterparties, and event chronology substantially increases leverage in subsequent enforcement, arbitration, or compliance channels.",
  "As the case matures, analysts translate technical findings into operational recommendations so organizations can harden controls, improve approvals, and prevent repetition of the same failure mode.",
  "A robust review includes screenshots, signed notes, and deterministic exports from trusted tooling, because memory-based reconstructions rarely survive legal or regulatory challenge.",
  "If multiple teams participate, assign one owner for final evidence packaging so artifacts remain versioned, timestamped, and indexed in a format external reviewers can consume quickly.",
];

const reinforcementPatterns = [
  "Teams that repeatedly train against realistic scenarios make fewer errors during live events, and that preparation compounds over time as procedures, templates, and contacts remain current instead of stale.",
  "Recovery programs perform best when technical controls, legal readiness, and communication discipline are treated as one integrated system rather than separate checklists owned by disconnected departments.",
  "A transparent post-incident review should convert lessons into concrete control changes with accountable owners, measurable acceptance criteria, and a scheduled validation cycle.",
  "The highest-performing organizations treat every case as structured feedback, using objective metrics to improve mean detection time, response precision, and documentation quality.",
];

function replaceTokens(text, post) {
  return text
    .replaceAll("{focus}", post.focus)
    .replaceAll("{audience}", post.audience)
    .replaceAll("{risk}", post.risk);
}

function countWords(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function createParagraph(post, sectionIndex, variant) {
  const sentences = [];
  const sentenceCount = 6;

  for (let i = 0; i < sentenceCount; i += 1) {
    const patternIndex =
      (sectionIndex * sentenceCount + i + variant * 3) % sentencePatterns.length;
    sentences.push(replaceTokens(sentencePatterns[patternIndex], post));
  }

  return sentences.join(" ");
}

function generateLongArticle(post) {
  let html = "";
  let textAccumulator = "";

  const intro = [
    `This guide explains a complete approach to ${post.focus}, built for ${post.audience}.`,
    "It is designed to be practical under pressure, evidence-friendly for legal follow-through, and clear enough for leadership teams to make confident decisions during difficult moments.",
    `Throughout the process, we pay close attention to ${post.risk}, because unmanaged secondary risk is often what turns a recoverable event into a long-term loss.`,
  ].join(" ");

  html += `<p>${intro}</p>`;
  textAccumulator += ` ${intro}`;

  sectionBlueprints.forEach((section, index) => {
    const paragraphA = createParagraph(post, index, 0);
    const paragraphB = createParagraph(post, index, 1);
    html += `<h3>${section.heading}</h3><p>${paragraphA}</p><p>${paragraphB}</p>`;
    textAccumulator += ` ${section.heading} ${paragraphA} ${paragraphB}`;
  });

  let reinforcementIndex = 0;
  while (countWords(textAccumulator) < 1500) {
    const extra = replaceTokens(
      reinforcementPatterns[reinforcementIndex % reinforcementPatterns.length],
      post
    );
    html += `<p>${extra}</p>`;
    textAccumulator += ` ${extra}`;
    reinforcementIndex += 1;
  }

  const finalWordCount = countWords(textAccumulator);
  return { html, wordCount: finalWordCount };
}

const articleCache = new Map();

function getArticle(post) {
  if (!articleCache.has(post.id)) {
    articleCache.set(post.id, generateLongArticle(post));
  }
  return articleCache.get(post.id);
}

function renderBlogCards() {
  const cardsMarkup = blogPosts
    .map((post) => {
      const article = getArticle(post);
      const excerpt = `Learn the professional workflow for ${post.focus}, with evidence preservation, escalation strategy, and post-incident hardening guidance.`;

      return `
        <article class="glass blog-card reveal">
          <div class="blog-meta">
            <span>${post.category}</span>
            <span>Article #${post.id}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${excerpt}</p>
          <p class="blog-word-count">${article.wordCount}+ words</p>
          <button class="btn btn-secondary read-blog-btn" data-post-id="${post.id}">
            Read Full Article
          </button>
        </article>
      `;
    })
    .join("");

  blogGrid.innerHTML = cardsMarkup;
}

function openBlogModal(postId) {
  const post = blogPosts.find((item) => item.id === postId);
  if (!post) {
    return;
  }

  const article = getArticle(post);

  blogModalBody.innerHTML = `
    <header>
      <p class="kicker">${post.category}</p>
      <h2>${post.title}</h2>
      <p class="blog-word-count">${article.wordCount} words</p>
    </header>
    ${article.html}
  `;

  blogModal.classList.add("active");
  blogModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeBlogModal() {
  blogModal.classList.remove("active");
  blogModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 450) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent =
    "Your case has been received. A recovery specialist will contact you shortly.";
  contactForm.reset();
});

blogGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".read-blog-btn");
  if (!button) {
    return;
  }
  const postId = Number(button.dataset.postId);
  openBlogModal(postId);
});

blogModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) {
    closeBlogModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && blogModal.classList.contains("active")) {
    closeBlogModal();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function observeRevealElements() {
  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

renderBlogCards();
observeRevealElements();
