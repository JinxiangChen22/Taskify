(function () {
  var STORAGE_KEY = "taskify-lang";
  var translations = {};

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function apply() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (translations[key] !== undefined) el.textContent = translations[key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (translations[key] !== undefined) el.placeholder = translations[key];
    });
    document.querySelectorAll("[data-i18n-val]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-val");
      if (translations[key] !== undefined) el.value = translations[key];
    });
    var lang = getLang();
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.textContent = lang === "en" ? "EN" : "中文";
    });
  }

  function load(lang, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/static/locales/" + lang + ".json", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        translations = JSON.parse(xhr.responseText);
        cb();
      }
    };
    xhr.send();
  }

  function toggle() {
    var next = getLang() === "en" ? "zh" : "en";
    setLang(next);
    load(next, apply);
  }

  document.addEventListener("DOMContentLoaded", function () {
    load(getLang(), apply);
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.addEventListener("click", toggle);
    });
  });
})();
