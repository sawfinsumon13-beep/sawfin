(function (global) {
  var USERS_KEY = "apex_users";
  var SESSION_KEY = "apex_session";

  function readUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function currentSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email: user.email,
        name: user.name,
        company: user.company || "",
        phone: user.phone || "",
        createdAt: user.createdAt,
        signedInAt: new Date().toISOString(),
      })
    );
  }

  function normalizeEmail(email) {
    return String(email || "")
      .trim()
      .toLowerCase();
  }

  function hashPassword(password) {
    var data = new TextEncoder().encode("apex|" + String(password || ""));
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) {
          return b.toString(16).padStart(2, "0");
        })
        .join("");
    });
  }

  function findUser(email) {
    var target = normalizeEmail(email);
    return readUsers().find(function (u) {
      return u.email === target;
    });
  }

  function register(payload) {
    var email = normalizeEmail(payload.email);
    var name = String(payload.name || "").trim();
    var password = String(payload.password || "");
    var confirm = String(payload.confirm || "");

    if (!name) return Promise.reject(new Error("Please enter your full name."));
    if (!email || email.indexOf("@") < 0) {
      return Promise.reject(new Error("Please enter a valid email address."));
    }
    if (password.length < 8) {
      return Promise.reject(new Error("Password must be at least 8 characters."));
    }
    if (password !== confirm) {
      return Promise.reject(new Error("Passwords do not match."));
    }
    if (findUser(email)) {
      return Promise.reject(new Error("An account with this email already exists. Please sign in."));
    }

    return hashPassword(password).then(function (passwordHash) {
      var users = readUsers();
      var user = {
        email: email,
        name: name,
        company: String(payload.company || "").trim(),
        phone: String(payload.phone || "").trim(),
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      writeUsers(users);
      setSession(user);
      return currentSession();
    });
  }

  function login(email, password, remember) {
    var user = findUser(email);
    if (!user) {
      return Promise.reject(new Error("No account found for that email. Please register."));
    }
    return hashPassword(password).then(function (hash) {
      if (hash !== user.passwordHash) {
        return Promise.reject(new Error("Incorrect password."));
      }
      setSession(user);
      if (!remember) {
        // session still stored in localStorage for this static demo site
      }
      return currentSession();
    });
  }

  function logout() {
    setSession(null);
  }

  function currentUser() {
    return currentSession();
  }

  function updateHeaderAuthLinks() {
    var user = currentUser();
    document.querySelectorAll(".header-signin, [data-auth-link]").forEach(function (el) {
      if (user) {
        el.textContent = user.name ? user.name.split(" ")[0] : "Account";
        el.setAttribute("href", "account.html");
        el.setAttribute("title", "Signed in as " + user.email);
      } else {
        el.textContent = "Sign In";
        el.setAttribute("href", "account.html");
        el.removeAttribute("title");
      }
    });
  }

  global.AuthStore = {
    register: register,
    login: login,
    logout: logout,
    currentUser: currentUser,
    updateHeaderAuthLinks: updateHeaderAuthLinks,
  };
})(window);
