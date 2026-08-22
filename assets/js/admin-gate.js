/* Admin preview gate (/admin/, Task 110).
 *
 * Any passphrase opens the seeded dashboard preview: this page issues no
 * credentials and talks to no backend. It sets the same sessionStorage gate
 * the dashboard's own "Enter preview" button sets, then navigates there.
 */
(function (window, document) {
  "use strict";

  var form = document.querySelector("[data-admin-gate]");
  if (!form) return;

  var status = document.querySelector("[data-admin-status]");
  var GATE_KEY = "gefi-dash-preview";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector("[data-admin-pass]");
    if (input && !input.value) {
      if (status) {
        status.textContent = "Enter any passphrase — this preview accepts them all.";
        status.setAttribute("data-kind", "error");
      }
      return;
    }
    if (status) {
      status.textContent = "Opening the operator preview…";
      status.setAttribute("data-kind", "success");
    }
    try {
      sessionStorage.setItem(GATE_KEY, "1");
    } catch (err) {
      /* storage unavailable: the dashboard's own gate will ask again */
    }
    window.location.href = "/dashboard/";
  });
})(window, document);
