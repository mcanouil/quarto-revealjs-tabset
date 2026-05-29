/**
 * @module RevealJsTabset
 * @version 1.3.0
 * @license MIT
 * @copyright 2026 Mickaël Canouil
 * @author Mickaël Canouil
 */

window.RevealJsTabset = function () {
  return {
    id: "RevealJsTabset",
    init: function (deck) {
      const TABLIST_SELECTOR = "ul.panel-tabset-tabby";
      const TAB_SELECTOR = "ul.panel-tabset-tabby > li";
      const TAB_LINK_SELECTOR = "ul.panel-tabset-tabby > li a";
      const SKIP_PDF_CLONE_ATTR = "data-tabset-skip-pdf-clone";
      const INITIAL_TAB_ATTR = "data-tab-active";

      /**
       * Get all tab panes for a given tabset element.
       * @param {Element} tabset The tabset container element.
       * @returns {HTMLCollection} Collection of tab pane elements.
       */
      function getTabPanes(tabset) {
        const tabContent = tabset.querySelector(".tab-content");
        return tabContent ? tabContent.children : [];
      }

      /**
       * Parse a non-negative integer attribute value, returning a fallback when the value
       * is missing, empty, or out of range.
       * @param {string|null|undefined} value The raw attribute value.
       * @param {number} max Exclusive upper bound (typically tab count).
       * @param {number} fallback Value to return when parsing fails or is out of range.
       * @returns {number} A safe integer index within [0, max).
       */
      function parseIndex(value, max, fallback) {
        if (value === null || value === undefined || value === "") return fallback;
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed < 0 || parsed >= max) return fallback;
        return parsed;
      }

      /**
       * Apply ARIA roles to a tabset so assistive technology recognises the structure.
       * @param {Element} tabset The tabset container element.
       */
      function applyAriaRoles(tabset) {
        const tablist = tabset.querySelector(TABLIST_SELECTOR);
        if (tablist) {
          tablist.setAttribute("role", "tablist");
          const tabItems = tablist.querySelectorAll(":scope > li");
          tabItems.forEach(function (li) {
            li.setAttribute("role", "presentation");
            const link = li.querySelector("a");
            if (link) {
              link.setAttribute("role", "tab");
              if (!link.hasAttribute("aria-selected")) {
                link.setAttribute("aria-selected", "false");
              }
            }
          });
        }
        const tabPanes = getTabPanes(tabset);
        Array.from(tabPanes).forEach(function (pane) {
          pane.setAttribute("role", "tabpanel");
          pane.setAttribute("tabindex", "0");
        });
      }

      /**
       * Initialise tabset fragments on ready.
       * Adds ARIA roles, optionally activates a non-zero initial tab via
       * `data-tab-active`, then sets up fragment indices for tab content and
       * creates invisible fragment triggers for tab navigation.
       */
      deck.on("ready", function () {
        const tabsetSlides = document.querySelectorAll(
          ".reveal .slides section .panel-tabset",
        );

        tabsetSlides.forEach(function (tabset) {
          const tabs = tabset.querySelectorAll(TAB_SELECTOR);
          const tabCount = tabs.length;

          if (tabCount === 0) {
            console.warn(
              "RevealJsTabset: encountered an empty .panel-tabset; skipping.",
              tabset,
            );
            return;
          }

          applyAriaRoles(tabset);

          if (tabCount === 1) return;

          const initialTabIndex = parseIndex(
            tabset.getAttribute(INITIAL_TAB_ATTR),
            tabCount,
            0,
          );
          if (initialTabIndex > 0) {
            const tabLinks = tabset.querySelectorAll(TAB_LINK_SELECTOR);
            if (tabLinks[initialTabIndex]) {
              tabLinks[initialTabIndex].click();
            }
          }

          const tabPanes = getTabPanes(tabset);
          const parentNode = tabset.parentNode;
          let currentIndex = 0;

          for (let i = 0; i < tabCount; i++) {
            if (tabPanes[i]) {
              const fragmentsInPane = tabPanes[i].querySelectorAll(".fragment");
              fragmentsInPane.forEach(function (fragment) {
                fragment.setAttribute("data-fragment-index", currentIndex);
                currentIndex++;
              });
            }

            if (i < tabCount - 1) {
              const fragmentDiv = document.createElement("div");
              fragmentDiv.className = "panel-tabset-fragment fragment";
              fragmentDiv.dataset.tabIndex = i + 1;
              fragmentDiv.setAttribute("data-fragment-index", currentIndex);
              fragmentDiv.style.display = "none";
              fragmentDiv.setAttribute("aria-hidden", "true");
              parentNode.appendChild(fragmentDiv);
              currentIndex++;
            }
          }
        });
      });

      /**
       * Handle fragment shown events.
       * When a tabset fragment is shown, click the corresponding tab.
       */
      deck.on("fragmentshown", function (event) {
        if (!event.fragment.classList.contains("panel-tabset-fragment")) return;

        const tabset = deck.getCurrentSlide().querySelector(".panel-tabset");
        if (!tabset) return;

        const tabLinks = tabset.querySelectorAll(TAB_LINK_SELECTOR);
        const tabIndex = parseIndex(event.fragment.dataset.tabIndex, tabLinks.length, -1);
        if (tabIndex < 0) return;

        tabLinks[tabIndex].click();
      });

      /**
       * Handle fragment hidden events.
       * When a tabset fragment is hidden (going backwards), click the previous tab.
       */
      deck.on("fragmenthidden", function (event) {
        if (!event.fragment.classList.contains("panel-tabset-fragment")) return;

        const tabset = deck.getCurrentSlide().querySelector(".panel-tabset");
        if (!tabset) return;

        const tabLinks = tabset.querySelectorAll(TAB_LINK_SELECTOR);
        const tabIndex = parseIndex(event.fragment.dataset.tabIndex, tabLinks.length, -1);
        if (tabIndex < 0) return;

        const targetIndex = tabIndex > 0 ? tabIndex - 1 : 0;
        tabLinks[targetIndex].click();
      });

      /**
       * Update tab link and pane states for a given active tab index.
       * @param {Element} tabset The tabset container element.
       * @param {number} activeTabIndex The index of the tab to activate.
       */
      function updateTabState(tabset, activeTabIndex) {
        if (!tabset) return;
        const tabLinks = tabset.querySelectorAll(TAB_LINK_SELECTOR);
        const tabPanesArray = Array.from(getTabPanes(tabset));

        tabLinks.forEach(function (link, index) {
          const li = link.parentElement;
          const isActive = index === activeTabIndex;

          li.classList.toggle("active", isActive);
          link.setAttribute("aria-selected", isActive ? "true" : "false");
          link.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        tabPanesArray.forEach(function (panel, index) {
          const isActive = index === activeTabIndex;

          panel.classList.toggle("active", isActive);
          panel.style.display = isActive ? "block" : "none";
          if (isActive) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        });
      }

      /**
       * Strip element IDs from a cloned subtree so that duplicates do not appear in
       * the live document.
       * Tabby and Reveal selectors that depend on a unique id break otherwise.
       * Print/PDF output only needs visual fidelity, so removing the id is safe.
       * @param {Element} root The cloned subtree root.
       */
      function stripIds(root) {
        if (root.id) root.removeAttribute("id");
        const ided = root.querySelectorAll("[id]");
        ided.forEach(function (element) {
          element.removeAttribute("id");
        });
      }

      /**
       * Handle PDF export mode.
       * When `pdfSeparateFragments` is enabled, update tab visibility based on the
       * visible fragments (existing behaviour).
       * Otherwise, clone each tabset slide so every tab appears on its own PDF
       * page without affecting other fragments in the deck.
       * Slides carrying `data-tabset-skip-pdf-clone` opt out of cloning.
       */
      deck.on("pdf-ready", function () {
        const config = deck.getConfig();
        const separateFragments = config.pdfSeparateFragments !== false;
        const slides = document.querySelectorAll(".reveal .slides section");

        if (separateFragments) {
          slides.forEach(function (slide) {
            const tabset = slide.querySelector(".panel-tabset");
            if (!tabset) return;

            const fragments = slide.querySelectorAll(".panel-tabset-fragment");
            const tabLinks = tabset.querySelectorAll(TAB_LINK_SELECTOR);
            let activeTabIndex = 0;

            fragments.forEach(function (fragment) {
              if (fragment.classList.contains("visible")) {
                const tabIndex = parseIndex(
                  fragment.dataset.tabIndex,
                  tabLinks.length,
                  -1,
                );
                if (tabIndex > activeTabIndex) {
                  activeTabIndex = tabIndex;
                }
              }
            });

            updateTabState(tabset, activeTabIndex);
          });
          return;
        }

        slides.forEach(function (slide) {
          const tabset = slide.querySelector(".panel-tabset");
          if (!tabset) return;

          if (slide.hasAttribute(SKIP_PDF_CLONE_ATTR)) {
            updateTabState(tabset, 0);
            return;
          }

          const tabLinks = tabset.querySelectorAll(TAB_LINK_SELECTOR);
          const tabCount = tabLinks.length;
          if (tabCount <= 1) return;

          const pageElement = slide.closest(".pdf-page") || slide;

          updateTabState(tabset, 0);

          let insertAfter = pageElement;
          for (let i = 1; i < tabCount; i++) {
            const clone = pageElement.cloneNode(true);
            stripIds(clone);
            const cloneTabset = clone.querySelector(".panel-tabset");
            updateTabState(cloneTabset, i);
            insertAfter.parentNode.insertBefore(
              clone,
              insertAfter.nextSibling,
            );
            insertAfter = clone;
          }
        });
      });
    },
  };
};
