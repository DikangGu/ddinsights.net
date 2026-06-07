(function () {
  "use strict";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }

  if (btn) {
    btn.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark");
    });
  }

  // Follow OS changes only when the user hasn't picked explicitly.
  try {
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", function (e) {
      if (!localStorage.getItem("theme")) {
        root.setAttribute("data-theme", e.matches ? "light" : "dark");
      }
    });
  } catch (e) {}
})();
