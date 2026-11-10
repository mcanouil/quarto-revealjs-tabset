/**
 * @module RevealJsTabset
 * @version 1.5.0
 * @license MIT
 * @copyright 2026 Mickaël Canouil
 * @author Mickaël Canouil
 */

window.RevealJsTabset = function () {
  const kTrigger = "panel-tabset-fragment-trigger";
  const kClassOn = "tabset-fragments";
  const kClassOff = "no-tabset-fragments";
  const kSkipPdfClone = "data-tabset-skip-pdf-clone";
  const kInitialTab = "data-tab-active";

  let warned = false;

  function tabLinks(tabset) {
    return Array.from(
      tabset.querySelectorAll(":scope > ul.panel-tabset-tabby > li > a")
    );
  }

  function panes(tabset) {
    return Array.from(tabset.querySelectorAll(":scope > .tab-content > div"));
  }

  function parentTabset(tabset) {
    return tabset.parentElement
      ? tabset.parentElement.closest(".panel-tabset")
      : null;
  }

  function isFragmented(tabset) {
    const wantsOn = tabset.classList.contains(kClassOn) ||
      !tabset.classList.contains(kClassOff);
    if (!wantsOn) {
      return false;
    }
    if (tabLinks(tabset).length < 2 || panes(tabset).length < 2) {
      return false;
    }
    const outer = parentTabset(tabset);
    if (outer && !isFragmented(outer)) {
      if (tabset.classList.contains(kClassOn) && !warned) {
        warned = true;
        console.warn(
          "RevealJsTabset: the class '.tabset-fragments' on a tabset inside a tabset that is not fragmented is ignored."
        );
      }
      return false;
    }
    return true;
  }

  // Items of a container, in document order: fragments and fragmented
  // tabsets that do not belong to another fragmented tabset inside the container.
  function itemsOf(container) {
    return Array.from(
      container.querySelectorAll(".fragment, .panel-tabset")
    ).filter(function (el) {
      if (el.classList.contains(kTrigger)) {
        return false;
      }
      if (el.classList.contains("panel-tabset") && !isFragmented(el)) {
        return false;
      }
      for (let up = el.parentElement; up && up !== container; up = up.parentElement) {
        if (up.classList.contains("panel-tabset") && isFragmented(up)) {
          return false;
        }
      }
      return true;
    });
  }

  // Reveal.js rule: explicit indices first, ascending, equal values together;
  // then the elements without an index, one group each, in document order.
  function orderGroups(items) {
    const indexed = new Map();
    const unindexed = [];
    items.forEach(function (el) {
      const raw = el.getAttribute("data-fragment-index");
      const index = raw === null ? NaN : parseInt(raw, 10);
      if (Number.isNaN(index)) {
        unindexed.push([el]);
      } else {
        if (!indexed.has(index)) {
          indexed.set(index, []);
        }
        indexed.get(index).push(el);
      }
    });
    const groups = Array.from(indexed.keys())
      .sort(function (a, b) {
        return a - b;
      })
      .map(function (key) {
        return indexed.get(key);
      });
    return groups.concat(unindexed);
  }

  function makeTrigger(tabset, step) {
    const trigger = document.createElement("div");
    trigger.className = "fragment " + kTrigger;
    trigger.setAttribute("data-tabset-step", String(step));
    trigger.setAttribute("aria-hidden", "true");
    trigger.style.display = "none";
    tabset.appendChild(trigger);
    return trigger;
  }

  function expandTabset(tabset) {
    const groups = [];
    panes(tabset).forEach(function (pane, k) {
      if (k > 0) {
        groups.push([makeTrigger(tabset, k)]);
      }
      groups.push(...expandGroups(orderGroups(itemsOf(pane))));
    });
    return groups;
  }

  function expandGroups(groups) {
    const expanded = [];
    groups.forEach(function (group) {
      if (
        group.length === 1 && group[0].classList.contains("panel-tabset")
      ) {
        expanded.push(...expandTabset(group[0]));
      } else {
        expanded.push(group);
      }
    });
    return expanded;
  }

  function fragmentSlide(slide) {
    const groups = expandGroups(orderGroups(itemsOf(slide)));
    groups.forEach(function (group, index) {
      group.forEach(function (el) {
        el.setAttribute("data-fragment-index", String(index));
      });
    });
  }

  function hasFragmentedTabset(slide) {
    return Array.from(slide.querySelectorAll(".panel-tabset")).some(
      isFragmented
    );
  }

  function syncTabs(slide) {
    if (!slide) {
      return;
    }
    slide.querySelectorAll(".panel-tabset").forEach(function (tabset) {
      const triggers = tabset.querySelectorAll(
        ":scope > ." + kTrigger + ".visible"
      );
      if (triggers.length === 0 && !tabset.querySelector(":scope > ." + kTrigger)) {
        return;
      }
      let k = 0;
      triggers.forEach(function (trigger) {
        k = Math.max(k, parseInt(trigger.getAttribute("data-tabset-step"), 10));
      });
      const link = tabLinks(tabset)[k];
      if (link && link.getAttribute("aria-selected") !== "true") {
        link.click();
      }
    });
  }

  function applyTabState(tabset, k) {
    Array.from(
      tabset.querySelectorAll(":scope > ul.panel-tabset-tabby > li")
    ).forEach(function (li, i) {
      li.classList.toggle("active", i === k);
      const link = li.querySelector(":scope > a");
      if (link) {
        link.setAttribute("aria-selected", i === k ? "true" : "false");
      }
    });
    panes(tabset).forEach(function (pane, i) {
      pane.classList.toggle("active", i === k);
      pane.hidden = i !== k;
      pane.style.display = i === k ? "block" : "none";
    });
  }

  function visibleStep(tabset) {
    let k = 0;
    tabset
      .querySelectorAll(":scope > ." + kTrigger + ".visible")
      .forEach(function (trigger) {
        k = Math.max(k, parseInt(trigger.getAttribute("data-tabset-step"), 10));
      });
    return k;
  }

  function triggeredTabsets(page) {
    return Array.from(page.querySelectorAll(".panel-tabset")).filter(
      function (tabset) {
        return tabset.querySelector(":scope > ." + kTrigger) !== null;
      }
    );
  }

  function setPageNumber(page, base, k) {
    const number = page.querySelector(".slide-number-pdf");
    if (number && base !== null) {
      number.textContent = base + "." + k;
    }
  }

  function printPages(deck) {
    const config = deck.getConfig();
    const pages = Array.from(deck.getRevealElement().querySelectorAll(".pdf-page"));
    pages.forEach(function (page) {
      const tabsets = triggeredTabsets(page);
      if (tabsets.length === 0) {
        return;
      }
      if (config.pdfSeparateFragments !== false) {
        tabsets.forEach(function (tabset) {
          applyTabState(tabset, visibleStep(tabset));
        });
        return;
      }
      if (page.querySelector("section[" + kSkipPdfClone + "]")) {
        tabsets.forEach(function (tabset) {
          applyTabState(tabset, 0);
        });
        return;
      }
      const count = Math.max.apply(
        null,
        tabsets.map(function (tabset) {
          return panes(tabset).length;
        })
      );
      const baseNumber = page.querySelector(".slide-number-pdf");
      const base = baseNumber ? baseNumber.textContent : null;
      let previous = page;
      for (let k = 0; k < count; k++) {
        let current = page;
        if (k > 0) {
          current = page.cloneNode(true);
          current.querySelectorAll("[id]").forEach(function (el) {
            el.removeAttribute("id");
          });
          previous.after(current);
          previous = current;
        }
        triggeredTabsets(current).forEach(function (tabset) {
          applyTabState(tabset, Math.min(k, panes(tabset).length - 1));
        });
        setPageNumber(current, base, k + 1);
      }
    });
  }

  function activateInitialTabs(slides) {
    slides.forEach(function (tabset) {
      if (isFragmented(tabset)) {
        return;
      }
      const links = tabLinks(tabset);
      const raw = tabset.getAttribute(kInitialTab);
      const index = raw === null || raw === "" ? NaN : parseInt(raw, 10);
      if (links.length > 1 && index > 0 && index < links.length) {
        links[index].click();
      }
    });
  }

  return {
    id: "RevealJsTabset",
    init: function (deck) {
      if (deck.hasPlugin("QuartoTabsetFragments")) {
        console.info(
          "RevealJsTabset: Quarto's tabset-fragments option is on, so the extension steps aside. Remove the extension or turn the option off."
        );
        return;
      }
      const config = deck.getConfig();
      if (config.fragments === false) {
        return;
      }

      deck
        .getRevealElement()
        .querySelectorAll(".slides section")
        .forEach(function (slide) {
          if (
            slide.querySelector("section") ||
            slide.getAttribute("data-visibility") === "hidden"
          ) {
            return;
          }
          if (hasFragmentedTabset(slide)) {
            fragmentSlide(slide);
          }
        });

      const sync = function () {
        syncTabs(deck.getCurrentSlide());
      };
      deck.on("ready", function () {
        activateInitialTabs(
          Array.from(deck.getRevealElement().querySelectorAll(".slides .panel-tabset"))
        );
      });
      deck.on("pdf-ready", function () {
        printPages(deck);
      });
      ["ready", "slidechanged", "fragmentshown", "fragmenthidden"].forEach(
        function (name) {
          deck.on(name, sync);
        }
      );
    },
  };
};
