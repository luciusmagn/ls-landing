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
  var headerOffset = 120;
  var bestItem = navItems[0] || null;

  navItems.forEach(function inspectItem(item) {
    var top = item.section.getBoundingClientRect().top;

    if (top - headerOffset <= 0) {
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

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function handleNavIntersection() {
        syncNav();
      },
      {
        threshold: [0, 0.2, 0.5, 0.8],
        rootMargin: "-96px 0px -55% 0px"
      }
    );

    navItems.forEach(function observeSection(item) {
      navObserver.observe(item.section);
    });
  } else {
    window.addEventListener("scroll", syncNav, { passive: true });
    window.addEventListener("resize", syncNav);
  }
}
