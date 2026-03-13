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

/* ---- Scroll Reveal ---- */

var revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

function showAllRevealNodes() {
  revealNodes.forEach(function showNode(node) {
    node.classList.add("is-visible");
  });
}

if ("IntersectionObserver" in window) {
  var revealObserver = new IntersectionObserver(
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
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px"
    }
  );

  revealNodes.forEach(function observeNode(node) {
    revealObserver.observe(node);
  });
} else {
  showAllRevealNodes();
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
