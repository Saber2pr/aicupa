(function () {
  // ─── Mobile nav toggle ───────────────────────────────────────────────────────
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll(".nav-mobile a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ─── Scroll-triggered fade-in animations ─────────────────────────────────────
  var fadeElements = document.querySelectorAll(".fade-in-on-scroll");
  if (fadeElements.length && "IntersectionObserver" in window) {
    var observerOptions = {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.1
    };

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ─── Hero preview video (load on demand) ─────────────────────────────────────
  var heroMedia = document.querySelector(".hero-preview__media");
  if (heroMedia) {
    var heroVideo = heroMedia.querySelector(".hero-preview__video");
    var heroPlayButton = heroMedia.querySelector(".hero-preview__play");

    if (heroVideo && heroPlayButton) {
      var playHeroVideo = function () {
        var videoSrc = heroVideo.getAttribute("data-src");
        if (!heroVideo.getAttribute("src") && videoSrc) {
          heroVideo.setAttribute("src", videoSrc);
          heroVideo.load();
        }

        // User click allows unmuted playback in modern browsers.
        heroVideo.muted = false;
        heroVideo.removeAttribute("muted");
        heroVideo.volume = 1;

        var playPromise = heroVideo.play();
        heroMedia.classList.add("is-playing");
        heroMedia.classList.remove("is-paused");

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            heroMedia.classList.remove("is-playing");
            heroMedia.classList.remove("is-paused");
          });
        }
      };

      heroPlayButton.addEventListener("click", function () {
        playHeroVideo();
      });

      heroVideo.addEventListener("click", function () {
        if (heroVideo.paused) {
          playHeroVideo();
          return;
        }

        heroVideo.pause();
      });

      heroVideo.addEventListener("pause", function () {
        if (heroVideo.currentTime > 0 && !heroVideo.ended) {
          heroMedia.classList.add("is-paused");
        }
      });

      heroVideo.addEventListener("play", function () {
        heroMedia.classList.remove("is-paused");
      });
    }
  }
})();