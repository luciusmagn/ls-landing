document.documentElement.classList.add("js");

/* ---- Year ---- */

var yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

var requestPathNode = document.getElementById("request-path");

if (requestPathNode) {
  requestPathNode.textContent = window.location.pathname || "/";
}

/* ---- Newsletter Signup ---- */

var newsletterForm = document.getElementById("newsletter-form");
var newsletterFeedback = document.getElementById("newsletter-feedback");
var newsletterSubmit = document.getElementById("newsletter-submit");

function newsletterEndpoint() {
  var hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:8888/app/api/newsletter-signup";
  }

  return "https://hiisi.app/app/api/newsletter-signup";
}

function newsletterFeedbackSet(status, message) {
  if (!newsletterFeedback) {
    return;
  }

  newsletterFeedback.className = "newsletter-feedback is-" + status;
  newsletterFeedback.textContent = message;
}

if (newsletterForm && newsletterFeedback) {
  newsletterForm.addEventListener("submit", function handleNewsletterSubmit(event) {
    event.preventDefault();

    var emailField = document.getElementById("newsletter-email");
    var email = emailField ? emailField.value.trim() : "";

    if (!email) {
      newsletterFeedbackSet("error", "Please enter your email address.");
      return;
    }

    if (newsletterSubmit) {
      newsletterSubmit.disabled = true;
    }

    newsletterFeedbackSet("pending", "Submitting...");

    fetch(newsletterEndpoint(), {
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        email: email
      })
    })
      .then(function handleResponse(response) {
        if (!response.ok) {
          throw new Error("Newsletter request failed.");
        }

        return response.json();
      })
      .then(function handlePayload(payload) {
        var status = payload && payload.status ? payload.status : "success";
        var message = payload && payload.message
          ? payload.message
          : "You are in! We will notify you when Hiisi launches.";

        newsletterFeedbackSet(status, message);

        if (status === "success") {
          newsletterForm.reset();
        }
      })
      .catch(function handleFailure() {
        newsletterFeedbackSet("error", "Something went wrong. Please try again.");
      })
      .finally(function handleFinally() {
        if (newsletterSubmit) {
          newsletterSubmit.disabled = false;
        }
      });
  });
}

/* ---- Mobile Menu ---- */

var siteHeader = document.querySelector(".site-header");
var menuToggle = document.querySelector("[data-menu-toggle]");
var menuPanel = document.querySelector("[data-menu-panel]");

function setMenuOpen(isOpen) {
  if (!siteHeader || !menuToggle) {
    return;
  }

  siteHeader.classList.toggle("is-menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

if (siteHeader && menuToggle) {
  menuToggle.addEventListener("click", function handleMenuToggle() {
    setMenuOpen(!siteHeader.classList.contains("is-menu-open"));
  });

  if (menuPanel) {
    menuPanel.addEventListener("click", function handleMenuPanelClick(event) {
      if (event.target.closest("a")) {
        setMenuOpen(false);
      }
    });
  }

  document.addEventListener("click", function handleDocumentClick(event) {
    if (!siteHeader.classList.contains("is-menu-open")) {
      return;
    }

    if (!siteHeader.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", function handleKeyDown(event) {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", function handleResize() {
    if (window.innerWidth > 820) {
      setMenuOpen(false);
    }
  });
}

/* ---- Active Nav Tracking ---- */

var navItems = Array.from(document.querySelectorAll("[data-nav]"))
  .map(function buildNavItem(link) {
    var href = link.getAttribute("href");

    if (!href || href.charAt(0) !== "#") {
      return null;
    }

    var section = document.getElementById(href.slice(1));

    if (!section) {
      return null;
    }

    return {
      link: link,
      section: section
    };
  })
  .filter(Boolean);

function siteHeaderHeight() {
  if (!siteHeader) {
    return 0;
  }

  return siteHeader.getBoundingClientRect().height;
}

function setActiveNav(sectionId) {
  navItems.forEach(function updateNavItem(item) {
    if (item.section.id === sectionId) {
      item.link.classList.add("is-active");
    } else {
      item.link.classList.remove("is-active");
    }
  });
}

function currentSectionId() {
  var bestItem = navItems[0] || null;
  var bestDistance = Number.POSITIVE_INFINITY;
  var headerOffset = siteHeaderHeight();
  var focusLine = headerOffset + Math.max(72, (window.innerHeight - headerOffset) * 0.28);

  if (navItems.length === 0) {
    return null;
  }

  if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 4)) {
    return navItems[navItems.length - 1].section.id;
  }

  navItems.forEach(function inspectItem(item) {
    var rect = item.section.getBoundingClientRect();
    var distance = Math.min(
      Math.abs(rect.top - focusLine),
      Math.abs(rect.bottom - focusLine)
    );

    if (rect.top <= focusLine && rect.bottom >= focusLine) {
      bestItem = item;
      bestDistance = 0;
      return;
    }

    if (distance < bestDistance) {
      bestDistance = distance;
      bestItem = item;
    }
  });

  return bestItem ? bestItem.section.id : null;
}

if (navItems.length > 0) {
  var syncNav = function syncNav() {
    var sectionId = currentSectionId();

    if (sectionId) {
      setActiveNav(sectionId);
    }
  };

  syncNav();
  window.addEventListener("scroll", syncNav, { passive: true });
  window.addEventListener("resize", syncNav);
  window.addEventListener("load", syncNav);
}
