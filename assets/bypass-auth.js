(function () {
  const AUTH_TEXT = [/register/i, /login/i, /already have an account/i, /not a member/i];
  const AUTH_PLACEHOLDER = [/username/i, /password/i, /confirm/i];

  function isAuthNode(el) {
    if (!(el instanceof HTMLElement)) return false;
    const text = (el.textContent || "").trim();
    const placeholder = (el.getAttribute("placeholder") || "").trim();
    if (AUTH_TEXT.some((re) => re.test(text))) return true;
    if (AUTH_PLACEHOLDER.some((re) => re.test(placeholder))) return true;
    return false;
  }

  function purgeAuthUI() {
    const nodes = Array.from(document.querySelectorAll("*"));
    const authNodes = nodes.filter(isAuthNode);

    for (const node of authNodes) {
      const parent = node.parentElement;
      if (parent && parent !== document.body) {
        parent.remove();
      } else {
        node.remove();
      }
    }

    document.body.style.filter = "none";
    document.body.style.pointerEvents = "auto";
    document.body.style.overflow = "auto";
  }

  const observer = new MutationObserver(() => purgeAuthUI());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  setInterval(purgeAuthUI, 200);
  window.addEventListener("load", purgeAuthUI);
})();
