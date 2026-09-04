document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var css = document.createElement("style");
  css.textContent = `
    html { scroll-behavior: smooth; }
    body.mac-modal-open { overflow: hidden; }
    .mac-reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
    .mac-reveal.mac-visible { opacity: 1; transform: none; }
    .mac-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0,0,0,.82); backdrop-filter: blur(9px); opacity: 0; visibility: hidden; transition: .22s ease; }
    .mac-modal.is-open { opacity: 1; visibility: visible; }
    .mac-modal-box { position: relative; width: min(520px,100%); padding: 32px; border: 1px solid #8a6427; border-radius: 22px; background: linear-gradient(145deg,#17120a,#0d0d0d); box-shadow: 0 30px 100px rgba(0,0,0,.65); }
    .mac-modal-box h2 { margin: 8px 0 10px; line-height: 1.08; }
    .mac-modal-box p { color: #bdb7ab; }
    .mac-modal-close { position: absolute; right: 12px; top: 7px; border: 0; background: none; color: #ddd; font-size: 32px; cursor: pointer; }
    .mac-modal-note { font-size: .9rem; margin: 18px 0; }
    .mac-modal-box .btn { width: 100%; margin-top: 8px; }
    .mac-modal-secondary { display:block; text-align:center; margin-top:14px; color:#c7a35b; text-decoration:none; }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior:auto; } .mac-reveal { opacity:1; transform:none; transition:none; } .mac-modal { transition:none; } }
    @media (max-width: 520px) { .mac-modal-box { padding: 26px 20px; } }
  `;
  document.head.appendChild(css);

  var menu = document.getElementById("menu");
  var nav = document.getElementById("navlinks");
  function closeNav() {
    if (!menu || !nav) return;
    nav.classList.remove("open");
    menu.textContent = "☰";
    menu.setAttribute("aria-expanded", "false");
  }
  if (menu && nav) {
    menu.setAttribute("aria-expanded", "false");
    menu.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menu.textContent = open ? "✕" : "☰";
      menu.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var selector = a.getAttribute("href");
      if (!selector || selector === "#") return;
      var target = document.querySelector(selector);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  var videos = Array.prototype.slice.call(document.querySelectorAll("video"));
  videos.forEach(function (video) {
    video.addEventListener("play", function () {
      videos.forEach(function (other) { if (other !== video) other.pause(); });
    });
    video.addEventListener("dblclick", function () {
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    });
  });

  var revealItems = document.querySelectorAll(".video-card, .benefit, .price, .quote, .step, .trainer, .cta, .head");
  revealItems.forEach(function (el) { el.classList.add("mac-reveal"); });
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("mac-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: .12 });
    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("mac-visible"); });
  }

  document.querySelectorAll("details").forEach(function (detail) {
    detail.addEventListener("toggle", function () {
      if (!detail.open) return;
      document.querySelectorAll("details").forEach(function (other) {
        if (other !== detail) other.removeAttribute("open");
      });
    });
  });

  var footer = document.querySelector("footer");
  if (footer) footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, "© " + new Date().getFullYear());

  var modal = document.createElement("div");
  modal.className = "mac-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="mac-modal-box" role="dialog" aria-modal="true" aria-labelledby="macModalTitle">
      <button class="mac-modal-close" type="button" aria-label="Close">×</button>
      <div class="kicker">ENROLLMENT</div>
      <h2 id="macModalTitle">MAC AI COURSE TRAINING</h2>
      <p id="macModalText"></p>
      <p class="mac-modal-note">Tap below to message Andrew directly on WhatsApp and arrange payment.</p>
      <a id="macModalWhatsApp" class="btn primary" href="#" target="_blank" rel="noopener">Continue on WhatsApp →</a>
      <a class="mac-modal-secondary" href="https://t.me/itsjustmavins" target="_blank" rel="noopener">Prefer Telegram? Message Andrew →</a>
    </div>`;
  document.body.appendChild(modal);

  var modalTitle = document.getElementById("macModalTitle");
  var modalText = document.getElementById("macModalText");
  var modalWhatsApp = document.getElementById("macModalWhatsApp");
  var closeButton = modal.querySelector(".mac-modal-close");

  function openEnrollment(type) {
    var oneOnOne = type === "one";
    modalTitle.textContent = oneOnOne ? "One-on-One AI Training" : "MAC AI COURSE TRAINING";
    modalText.textContent = oneOnOne ? "Private one-on-one training with Andrew Mavins — ₦9,999." : "10-day practical AI video training — ₦7,999.";
    var message = oneOnOne ? "Hello Andrew, I want the one-on-one MAC AI training." : "Hello Andrew, I want to enroll for MAC AI COURSE TRAINING.";
    modalWhatsApp.href = "https://wa.me/2349116833478?text=" + encodeURIComponent(message);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("mac-modal-open");
    closeButton.focus();
  }
  function closeEnrollment() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mac-modal-open");
  }

  var pricingButtons = document.querySelectorAll("#pricing .price a.btn");
  if (pricingButtons.length >= 2) {
    pricingButtons[0].addEventListener("click", function (e) { e.preventDefault(); openEnrollment("course"); });
    pricingButtons[1].addEventListener("click", function (e) { e.preventDefault(); openEnrollment("one"); });
  }
  closeButton.addEventListener("click", closeEnrollment);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeEnrollment(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("is-open")) closeEnrollment(); });
});