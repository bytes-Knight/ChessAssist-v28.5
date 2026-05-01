(function () {
  const AUTH_TEXT = [/register/i, /login/i, /already have an account/i, /not a member/i];
  const AUTH_PLACEHOLDER = [/username/i, /password/i, /confirm/i];

  function hasAuthMarkers(root) {
    if (!(root instanceof HTMLElement)) return false;

    const text = (root.textContent || "").trim();
    if (AUTH_TEXT.some((re) => re.test(text))) return true;

    const fields = root.querySelectorAll("input");
    let authFieldCount = 0;
    for (const field of fields) {
      const placeholder = (field.getAttribute("placeholder") || "").trim();
      if (AUTH_PLACEHOLDER.some((re) => re.test(placeholder))) authFieldCount += 1;
    }

    return authFieldCount >= 2;
  }

  function looksLikePopup(el) {
    if (!(el instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(el);
    if (!style) return false;

    const isOverlayPosition = style.position === "fixed" || style.position === "absolute";
    const z = Number.parseInt(style.zIndex || "0", 10);
    const rect = el.getBoundingClientRect();

    return (
      isOverlayPosition &&
      z >= 1000 &&
      rect.width >= 150 &&
      rect.width <= 420 &&
      rect.height >= 120 &&
      rect.height <= 520
    );
  }

  function bypassAuthUI() {
    const bodyChildren = Array.from(document.body.children || []);

    for (const node of bodyChildren) {
      if (!(node instanceof HTMLElement)) continue;
      const hasMarkers = hasAuthMarkers(node);
      const popupLike = looksLikePopup(node);
      if ((hasMarkers && popupLike) || (popupLike && hasAuthMarkers(document.body))) {
        node.remove();
      }
    }

    document.body.style.filter = "none";
    document.body.style.pointerEvents = "auto";
    document.body.style.overflow = "auto";
  }

  const observer = new MutationObserver(bypassAuthUI);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener("load", bypassAuthUI);
  setTimeout(bypassAuthUI, 300);
  setTimeout(bypassAuthUI, 1000);
})();
