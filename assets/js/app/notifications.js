/* App-shell notifications (task 317). Loaded on every app page.
 *
 * The bell was markup only: a permanently-lit red dot on a button that did
 * nothing. Now the dot reflects a real unread count, the button opens the
 * list, and reading them clears it — through the data layer, so the same
 * bell works live and offline. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    var NT = GeFi.notify;
    if (!NT) return;

    var bell = document.querySelector("[data-app-bell]");
    var dot = document.querySelector("[data-app-bell-dot]");
    if (!bell) return;

    var items = [];
    var panel = null;
    var stream = null;

    /* ------------------------------------------------------------ render */
    function renderBadge() {
      var n = NT.unreadCount(items);
      bell.setAttribute("data-app-bell-count", String(n));
      bell.setAttribute(
        "aria-label",
        n ? "Notifications, " + n + " unread" : "Notifications, none unread"
      );
      if (dot) {
        /* The dot means "there is something unread". Before this it was
         * always on, which told the reader nothing. */
        dot.hidden = n === 0;
        dot.textContent = n > 9 ? "9+" : n ? String(n) : "";
      }
    }

    function closePanel() {
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      panel = null;
      bell.setAttribute("aria-expanded", "false");
    }

    function openPanel() {
      closePanel();
      panel = document.createElement("div");
      panel.className = "app-notifpanel";
      panel.setAttribute("data-app-notifpanel", "");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Notifications");

      var head = document.createElement("div");
      head.className = "app-notifpanel__head";
      var title = document.createElement("p");
      title.className = "app-notifpanel__title";
      title.textContent = "Notifications";
      head.appendChild(title);
      if (NT.unreadCount(items)) {
        var mark = document.createElement("button");
        mark.type = "button";
        mark.className = "app-btn app-btn--ghost";
        mark.setAttribute("data-app-notif-markall", "");
        mark.textContent = "Mark all read";
        mark.addEventListener("click", markAllRead);
        head.appendChild(mark);
      }
      panel.appendChild(head);

      var list = document.createElement("ul");
      list.className = "app-notifpanel__list";
      list.setAttribute("data-app-notif-list", "");
      list.setAttribute("role", "list");
      if (!items.length) {
        var empty = document.createElement("li");
        empty.className = "app-notifpanel__empty";
        empty.textContent = "Nothing yet.";
        list.appendChild(empty);
      }
      items.forEach(function (n) {
        var li = document.createElement("li");
        li.className = "app-notifpanel__item" + (n.unread ? " is-unread" : "");
        li.setAttribute("data-app-notif", n.id || n.title);
        li.setAttribute("data-app-notif-unread", n.unread ? "true" : "false");
        var t = document.createElement("p");
        t.className = "app-notifpanel__itemtitle";
        t.textContent = n.title;
        var d = document.createElement("p");
        d.className = "app-notifpanel__itemdetail";
        d.textContent = n.detail || "";
        li.appendChild(t);
        li.appendChild(d);
        list.appendChild(li);
      });
      panel.appendChild(list);

      var note = document.createElement("p");
      note.className = "app-notifpanel__note";
      note.textContent = "In-app only — email and push are recorded preferences with no provider behind them.";
      panel.appendChild(note);

      bell.parentNode.appendChild(panel);
      bell.setAttribute("aria-expanded", "true");
    }

    /* ------------------------------------------------------------ actions */
    function markAllRead() {
      items.forEach(function (n) { n.unread = false; });
      renderBadge();
      openPanel();
      document.documentElement.setAttribute("data-app-notif-read", "all");
      GeFi.api.post("/notifications/read", {}).then(function () {}, function () {});
    }

    bell.setAttribute("aria-haspopup", "dialog");
    bell.setAttribute("aria-expanded", "false");
    bell.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panel) closePanel();
      else openPanel();
    });
    document.addEventListener("click", function (e) {
      if (panel && !panel.contains(e.target) && e.target !== bell) closePanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel) {
        closePanel();
        bell.focus();
      }
    });

    /* -------------------------------------------------------------- load */
    function load() {
      return GeFi.api.get("/notifications?limit=50").then(
        function (r) {
          if (r && r.items) items = r.items;
          renderBadge();
          if (panel) openPanel();
        },
        function () {
          renderBadge();
        }
      );
    }

    renderBadge();
    load().then(function () {
      /* New notifications arrive without a reload — placing an order in one
       * tab lights the bell here. Offline there is nothing to stream. */
      stream = GeFi.api.stream(
        "/notifications/stream",
        function (name, data) {
          if (!data || !data.title) return;
          if (items.some(function (n) { return n.id && n.id === data.id; })) return;
          items.unshift(data);
          renderBadge();
          if (panel) openPanel();
          document.documentElement.setAttribute("data-app-notif-pushed", data.title);
        },
        { events: ["notification.created"], simulate: function () { return function () {}; } }
      );
    });

    window.addEventListener("beforeunload", function () {
      if (stream && stream.close) stream.close();
    });
  });
})(window, document);
