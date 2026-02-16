/* ============================================================
   Lambda Symbolics -- Landing Page Scripts
   ============================================================ */

document.documentElement.classList.add("js");

/* ---- Year ---- */

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

/* ---- Scroll Reveal ---- */

const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    function handleReveal(entries, currentObserver) {
      entries.forEach(function processEntry(entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealNodes.forEach(function observeNode(node) {
    observer.observe(node);
  });
} else {
  revealNodes.forEach(function showNode(node) {
    node.classList.add("is-visible");
  });
}

/* ---- Cursor Glow ---- */

var frameRequested = false;

window.addEventListener("pointermove", function handlePointerMove(event) {
  if (frameRequested) {
    return;
  }

  frameRequested = true;
  window.requestAnimationFrame(function updateCursor() {
    document.body.style.setProperty("--cursor-x", event.clientX + "px");
    document.body.style.setProperty("--cursor-y", event.clientY + "px");
    frameRequested = false;
  });
});

/* ---- Active Nav Tracking ---- */

var navLinks = Array.from(document.querySelectorAll("[data-nav]"));
var sections = navLinks
  .map(function getSection(link) {
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "#") {
      return null;
    }
    return document.getElementById(href.slice(1));
  })
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length > 0) {
  var activeIndex = -1;

  var navObserver = new IntersectionObserver(
    function handleNavIntersection(entries) {
      entries.forEach(function processNavEntry(entry) {
        var idx = sections.indexOf(entry.target);
        if (idx === -1) {
          return;
        }

        if (entry.isIntersecting) {
          activeIndex = idx;
          updateActiveNav();
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-80px 0px -40% 0px",
    },
  );

  sections.forEach(function observeSection(section) {
    navObserver.observe(section);
  });

  function updateActiveNav() {
    navLinks.forEach(function setActiveState(link, i) {
      if (i === activeIndex) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }
}

/* ---- Typing Effect ---- */

var typedElement = document.querySelector(".hero-typed");

if (typedElement) {
  var phrases = ["that ships.", "that lasts.", "that works.", "with precision."];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typingSpeed = 80;
  var deletingSpeed = 50;
  var pauseBetween = 2200;
  var pauseBeforeDelete = 1800;

  function typeNextChar() {
    var currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      typedElement.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        if (phraseIndex === phrases.length - 1) {
          /* Stop on the last phrase -- do not loop forever */
          return;
        }
        setTimeout(function startDeleting() {
          isDeleting = true;
          typeNextChar();
        }, pauseBeforeDelete);
        return;
      }

      setTimeout(typeNextChar, typingSpeed);
    } else {
      charIndex--;
      typedElement.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeNextChar, pauseBetween - pauseBeforeDelete);
        return;
      }

      setTimeout(typeNextChar, deletingSpeed);
    }
  }

  /* Start the typing animation after the hero is visible */
  setTimeout(typeNextChar, 1200);
}

/* ---- Smooth Scroll for Anchor Links (fallback for older browsers) ---- */

document.addEventListener("click", function handleAnchorClick(event) {
  var link = event.target.closest("a[href^='#']");
  if (!link) {
    return;
  }

  var targetId = link.getAttribute("href").slice(1);
  var target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  /* Only intervene if native smooth scroll is not supported */
  if (!("scrollBehavior" in document.documentElement.style)) {
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  }
});
