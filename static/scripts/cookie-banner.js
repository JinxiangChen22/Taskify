(function () {
  var STORAGE_KEY = "taskifyCookieConsent";

  function getConsent() {
    try {
      return window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      window.localStorage && window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // If storage is blocked, keep the banner behavior graceful.
    }
  }

  function showBannerIfNeeded() {
    var banner = document.getElementById("taskify-cookie-banner");
    if (!banner) return;

    var consent = getConsent();
    if (consent === "accepted" || consent === "declined") {
      banner.style.display = "none";
      return;
    }

    banner.style.display = "block";

    var acceptBtn = document.getElementById("taskify-cookie-banner-accept");
    var declineBtn = document.getElementById("taskify-cookie-banner-decline");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        setConsent("accepted");
        banner.style.display = "none";
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener("click", function () {
        setConsent("declined");
        banner.style.display = "none";
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBannerIfNeeded);
  } else {
    showBannerIfNeeded();
  }
})();

