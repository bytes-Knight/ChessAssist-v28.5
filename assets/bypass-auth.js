(function () {
  const AUTH_TEXT = ["register", "login", "already have an account", "not a member"];
  const AUTH_PLACEHOLDER = ["username", "password", "confirm"];

  function normalized(value) {
    return String(value || "").trim().toLowerCase();
  }

  function hasAuthText(node) {
    const text = normalized(node.textContent);
    return AUTH_TEXT.some((marker) => text.includes(marker));
  }

  function hasAuthInput(node) {
    const inputs = node.querySelectorAll("input");
    let matches = 0;

    for (const input of inputs) {
      const placeholder = normalized(input.getAttribute("placeholder"));
      if (AUTH_PLACEHOLDER.some((marker) => placeholder.includes(marker))) matches += 1;
    }

    return matches >= 2;
  }

  function hideElement(el) {
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("pointer-events", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
  }

  function bypassAuthUI() {
    if (!document.body) return;

    const popupCandidates = Array.from(document.body.children).filter((el) => el instanceof HTMLElement);

    for (const el of popupCandidates) {
      const style = window.getComputedStyle(el);
      const isPopupPosition = style.position === "fixed" || style.position === "absolute";
      const zIndex = Number.parseInt(style.zIndex || "0", 10);
      if (!isPopupPosition || zIndex < 500) continue;

      if (hasAuthText(el) || hasAuthInput(el)) {
        hideElement(el);
      }
    }

    document.body.style.pointerEvents = "auto";
    document.body.style.overflow = "auto";
    document.body.style.filter = "none";
  }

  const observer = new MutationObserver(() => bypassAuthUI());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener("load", bypassAuthUI);
  setTimeout(bypassAuthUI, 250);
  setTimeout(bypassAuthUI, 800);
})();
