(function () {
  "use strict";

  var cfg = window.GEFI_AUTH || {};
  var apiBase = (cfg.apiBase || "").replace(/\/$/, "");
  var dashboardUrl = cfg.dashboardUrl || "/";
  var mode = cfg.mode === "register" ? "register" : "signin";

  var statusEl = document.querySelector("[data-auth-status]");
  var providers = document.querySelectorAll("[data-provider]");

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.dataset.kind = kind || "";
  }

  function setBusy(btn, busy) {
    if (!btn) return;
    btn.disabled = !!busy;
    btn.classList.toggle("is-busy", !!busy);
  }

  function returnTo() {
    var params = new URLSearchParams(window.location.search);
    var rt = params.get("return_to");
    if (rt && /^https?:\/\//.test(rt)) return rt;
    return dashboardUrl;
  }

  function startOAuth(provider) {
    if (!apiBase) {
      setStatus("Sign-in service is being deployed. Please try again shortly.", "error");
      return;
    }
    var url = apiBase + "/auth/" + provider + "/start"
      + "?mode=" + encodeURIComponent(mode)
      + "&return_to=" + encodeURIComponent(returnTo());
    window.location.assign(url);
  }

  function b64urlToBuf(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    var pad = s.length % 4;
    if (pad) s += "=".repeat(4 - pad);
    var bin = atob(s);
    var buf = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
  }

  function bufToB64url(buf) {
    var bytes = new Uint8Array(buf);
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function decodeChallenge(opts) {
    if (opts.challenge) opts.challenge = b64urlToBuf(opts.challenge);
    if (opts.user && opts.user.id) opts.user.id = b64urlToBuf(opts.user.id);
    (opts.allowCredentials || []).forEach(function (c) { c.id = b64urlToBuf(c.id); });
    (opts.excludeCredentials || []).forEach(function (c) { c.id = b64urlToBuf(c.id); });
    return opts;
  }

  function encodeAttestation(cred) {
    return {
      id: cred.id,
      rawId: bufToB64url(cred.rawId),
      type: cred.type,
      response: {
        clientDataJSON: bufToB64url(cred.response.clientDataJSON),
        attestationObject: cred.response.attestationObject ? bufToB64url(cred.response.attestationObject) : undefined,
        authenticatorData: cred.response.authenticatorData ? bufToB64url(cred.response.authenticatorData) : undefined,
        signature: cred.response.signature ? bufToB64url(cred.response.signature) : undefined,
        userHandle: cred.response.userHandle ? bufToB64url(cred.response.userHandle) : undefined
      },
      clientExtensionResults: cred.getClientExtensionResults ? cred.getClientExtensionResults() : {}
    };
  }

  function checkPasskeySupport() {
    if (!window.PublicKeyCredential || !navigator.credentials) {
      setStatus("Passkeys aren't supported on this browser. Try GitHub or Google.", "error");
      return false;
    }
    return true;
  }

  function startPasskey(btn) {
    if (!checkPasskeySupport()) return;
    if (!apiBase) {
      setStatus("Sign-in service is being deployed. Please try again shortly.", "error");
      return;
    }
    setBusy(btn, true);
    setStatus("Follow the prompt from your browser or device…", "info");

    var endpoint = mode === "register" ? "/auth/passkey/register/begin" : "/auth/passkey/signin/begin";

    fetch(apiBase + endpoint, { method: "POST", credentials: "include" })
      .then(function (r) { if (!r.ok) throw new Error("network"); return r.json(); })
      .then(function (data) {
        var opts = decodeChallenge(data.publicKey || data);
        var promise = mode === "register"
          ? navigator.credentials.create({ publicKey: opts })
          : navigator.credentials.get({ publicKey: opts });
        return promise.then(function (cred) { return { cred: cred, sessionId: data.sessionId }; });
      })
      .then(function (out) {
        var finishEndpoint = mode === "register" ? "/auth/passkey/register/finish" : "/auth/passkey/signin/finish";
        return fetch(apiBase + finishEndpoint, {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId: out.sessionId, credential: encodeAttestation(out.cred) })
        });
      })
      .then(function (r) { if (!r.ok) throw new Error("verify"); return r.json(); })
      .then(function () {
        setStatus("Signed in. Redirecting…", "success");
        window.location.assign(returnTo());
      })
      .catch(function (err) {
        var msg = err && err.name === "NotAllowedError"
          ? "Passkey prompt was dismissed."
          : "Sign-in service is being deployed. Please try again shortly.";
        setStatus(msg, "error");
        setBusy(btn, false);
      });
  }

  providers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var p = btn.getAttribute("data-provider");
      if (p === "passkey") return startPasskey(btn);
      if (p === "github" || p === "google") return startOAuth(p);
    });
  });
})();
