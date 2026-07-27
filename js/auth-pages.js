(function () {
  function setStatus(el, message, isError) {
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
    el.className = "auth-status" + (isError ? " auth-status-error" : " auth-status-ok");
  }

  function redirectAfterAuth() {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next") || "account.html";
    window.location.href = next;
  }

  function renderAccountDashboard(root, user) {
    root.innerHTML =
      '<div class="auth-shell">' +
      '<div class="auth-card">' +
      "<h1>My account</h1>" +
      '<p class="auth-lead">Welcome back, <strong>' +
      (user.name || user.email) +
      "</strong>.</p>" +
      '<dl class="account-meta">' +
      "<dt>Email</dt><dd>" +
      user.email +
      "</dd>" +
      (user.company ? "<dt>Company / Lab</dt><dd>" + user.company + "</dd>" : "") +
      (user.phone ? "<dt>Phone</dt><dd>" + user.phone + "</dd>" : "") +
      "<dt>Member since</dt><dd>" +
      (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—") +
      "</dd>" +
      "</dl>" +
      '<div class="auth-actions-row">' +
      '<a class="btn btn-primary" href="section-peptides.html">Buy peptides</a>' +
      '<a class="btn btn-secondary" href="products.html">Browse catalog</a>' +
      '<button type="button" class="btn btn-outline" id="logout-btn">Sign out</button>' +
      "</div>" +
      '<p class="auth-footnote">Your account is saved in this browser for ordering research peptides via Email or WhatsApp.</p>' +
      "</div></div>";

    document.getElementById("logout-btn").addEventListener("click", function () {
      AuthStore.logout();
      AuthStore.updateHeaderAuthLinks();
      window.location.href = "account.html";
    });
  }

  function initSignIn() {
    var root = document.getElementById("auth-root");
    if (!root) return;

    var user = AuthStore.currentUser();
    if (user) {
      renderAccountDashboard(root, user);
      return;
    }

    root.innerHTML =
      '<div class="auth-shell">' +
      '<div class="auth-card">' +
      "<h1>Sign In</h1>" +
      '<p class="auth-lead">Sign in to your Apex Bioreagents account to save lab details and speed up peptide orders.</p>' +
      '<form id="signin-form" class="auth-form" novalidate>' +
      '<div class="form-group">' +
      '<label for="signin-email">Username or Email <span class="req">*</span></label>' +
      '<input id="signin-email" name="email" type="email" autocomplete="username" required>' +
      "</div>" +
      '<div class="form-group">' +
      '<label for="signin-password">Password <span class="req">*</span></label>' +
      '<div class="password-field">' +
      '<input id="signin-password" name="password" type="password" autocomplete="current-password" required>' +
      '<button type="button" class="password-toggle" data-target="signin-password" aria-label="Show password">Show</button>' +
      "</div></div>" +
      '<div class="auth-row">' +
      '<label class="checkbox-label"><input type="checkbox" name="remember" checked> Remember Me</label>' +
      '<a href="contact.html">Lost your password?</a>' +
      "</div>" +
      '<button type="submit" class="btn btn-primary btn-block">Login</button>' +
      '<p id="signin-status" class="auth-status" hidden></p>' +
      "</form>" +
      '<p class="auth-switch">Not a member yet? <a href="register.html">Register now.</a></p>' +
      "</div></div>";

    bindPasswordToggles(root);
    document.getElementById("signin-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target;
      var status = document.getElementById("signin-status");
      AuthStore.login(form.email.value, form.password.value, form.remember.checked)
        .then(function () {
          AuthStore.updateHeaderAuthLinks();
          setStatus(status, "Signed in successfully. Redirecting…", false);
          setTimeout(redirectAfterAuth, 400);
        })
        .catch(function (err) {
          setStatus(status, err.message || "Unable to sign in.", true);
        });
    });
  }

  function initRegister() {
    var root = document.getElementById("auth-root");
    if (!root) return;

    if (AuthStore.currentUser()) {
      window.location.href = "account.html";
      return;
    }

    root.innerHTML =
      '<div class="auth-shell">' +
      '<div class="auth-card">' +
      "<h1>Create an account</h1>" +
      '<p class="auth-lead">Register to buy peptides and research peptides faster. Save your lab contact details for Email and WhatsApp orders.</p>' +
      '<form id="register-form" class="auth-form" novalidate>' +
      '<div class="form-group">' +
      '<label for="reg-name">Full name <span class="req">*</span></label>' +
      '<input id="reg-name" name="name" type="text" autocomplete="name" required>' +
      "</div>" +
      '<div class="form-group">' +
      '<label for="reg-email">Email <span class="req">*</span></label>' +
      '<input id="reg-email" name="email" type="email" autocomplete="email" required>' +
      "</div>" +
      '<div class="form-group">' +
      '<label for="reg-company">Company / Lab</label>' +
      '<input id="reg-company" name="company" type="text" autocomplete="organization">' +
      "</div>" +
      '<div class="form-group">' +
      '<label for="reg-phone">Phone</label>' +
      '<input id="reg-phone" name="phone" type="tel" autocomplete="tel">' +
      "</div>" +
      '<div class="form-group">' +
      '<label for="reg-password">Password <span class="req">*</span></label>' +
      '<div class="password-field">' +
      '<input id="reg-password" name="password" type="password" autocomplete="new-password" minlength="8" required>' +
      '<button type="button" class="password-toggle" data-target="reg-password" aria-label="Show password">Show</button>' +
      "</div>" +
      '<p class="field-hint">At least 8 characters.</p>' +
      "</div>" +
      '<div class="form-group">' +
      '<label for="reg-confirm">Confirm password <span class="req">*</span></label>' +
      '<div class="password-field">' +
      '<input id="reg-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required>' +
      '<button type="button" class="password-toggle" data-target="reg-confirm" aria-label="Show password">Show</button>' +
      "</div></div>" +
      '<label class="checkbox-label auth-terms">' +
      '<input type="checkbox" name="terms" required> I agree that products are for research purposes only, not for human consumption.' +
      "</label>" +
      '<button type="submit" class="btn btn-primary btn-block">Create account</button>' +
      '<p id="register-status" class="auth-status" hidden></p>' +
      "</form>" +
      '<p class="auth-switch">Already have an account? <a href="account.html">Sign in.</a></p>' +
      "</div></div>";

    bindPasswordToggles(root);
    document.getElementById("register-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target;
      var status = document.getElementById("register-status");
      if (!form.terms.checked) {
        setStatus(status, "Please confirm the research-use terms.", true);
        return;
      }
      AuthStore.register({
        name: form.name.value,
        email: form.email.value,
        company: form.company.value,
        phone: form.phone.value,
        password: form.password.value,
        confirm: form.confirm.value,
      })
        .then(function () {
          AuthStore.updateHeaderAuthLinks();
          setStatus(status, "Account created. Redirecting…", false);
          setTimeout(function () {
            window.location.href = "account.html";
          }, 400);
        })
        .catch(function (err) {
          setStatus(status, err.message || "Unable to create account.", true);
        });
    });
  }

  function bindPasswordToggles(root) {
    root.querySelectorAll(".password-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = document.getElementById(btn.getAttribute("data-target"));
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.textContent = show ? "Hide" : "Show";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.dataset.page === "account") initSignIn();
    if (document.body.dataset.page === "register") initRegister();
  });
})();
