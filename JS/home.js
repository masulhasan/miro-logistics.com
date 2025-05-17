$(document).ready(function () {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // Ripple effect only on non-mobile
  if (!isMobile) {
    $(".full-landing-image").ripples({
      perturbance: 0.4,
      dropRadius: 100,
      resolution: 256,
      damping: 0.05,
      spread: 0.05,
      interactive: true,
      crossOrigin: ""
    });

    setInterval(function () {
      const $el = $(".full-landing-image");
      $el.ripples("drop",
        Math.random() * $el.width(),
        Math.random() * $el.height(),
        25 + Math.random() * 15,
        0.03 + Math.random() * 0.03
      );
    }, 2000);
  }

  // Custom cursors only on non-mobile
  if (!isMobile) {
    const leftCursor = document.querySelector(".left-cursor");
    const rightCursor = document.querySelector(".right-cursor");
    const leftActive = document.querySelector(".left-active");
    const rightActive = document.querySelector(".right-active");
    const logoIcon = document.querySelector(".logo-icon");
    const contactLink = document.querySelector(".contact-link");

    let isScrolling = false;

    window.addEventListener("scroll", function () {
      isScrolling = true;
      leftCursor.style.display = "none";
      rightCursor.style.display = "none";
      leftActive.classList.remove("active");
      rightActive.classList.remove("active");
      setTimeout(() => isScrolling = false, 50);
    });

    document.addEventListener("mousemove", function (e) {
      if (isScrolling) return;

      const isOverClickable = e.target.closest(".top-bar") ||
        e.target === logoIcon ||
        e.target === contactLink;

      if (isOverClickable) {
        leftCursor.style.display = "none";
        rightCursor.style.display = "none";
        leftActive.classList.remove("active");
        rightActive.classList.remove("active");
        return;
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;

      if (isLeftSide) {
        leftCursor.style.display = "block";
        leftCursor.style.left = e.clientX + "px";
        leftCursor.style.top = e.clientY + "px";
        rightCursor.style.display = "none";
        leftActive.classList.add("active");
        rightActive.classList.remove("active");
        leftCursor.classList.add("active");
        rightCursor.classList.remove("active");
      } else {
        rightCursor.style.display = "block";
        rightCursor.style.left = e.clientX + "px";
        rightCursor.style.top = e.clientY + "px";
        leftCursor.style.display = "none";
        rightActive.classList.add("active");
        leftActive.classList.remove("active");
        rightCursor.classList.add("active");
        leftCursor.classList.remove("active");
      }
    });

    document.addEventListener("mouseout", function () {
      leftCursor.style.display = "none";
      rightCursor.style.display = "none";
      leftActive.classList.remove("active");
      rightActive.classList.remove("active");
      leftCursor.classList.remove("active");
      rightCursor.classList.remove("active");
    });

    [logoIcon, contactLink].forEach(el => {
      el.addEventListener("mouseenter", () => {
        document.body.style.cursor = "pointer";
      });
      el.addEventListener("mouseleave", () => {
        document.body.style.cursor = "none";
      });
    });

    // Click navigation (desktop only)
    document.addEventListener("click", function (e) {
      if (e.target.closest(".top-bar") ||
        e.target === logoIcon ||
        e.target === contactLink) {
        return;
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;

      if (isLeftSide) {
        window.location.href = "./Contact.html";
      } else {
        window.location.href = "./Renewable-confidence.html";
      }
    });
  }

  // Swipe navigation on mobile only
  if (isMobile) {
    let touchStartX = null;
    let touchEndX = null;

    document.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      if (!touchStartX || !touchEndX) return;

      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe Left
          window.location.href = "./Renewable-confidence.html";
        } else {
          // Swipe Right
          window.location.href = "./Contact.html";
        }
      }

      touchStartX = null;
      touchEndX = null;
    }
  }
});
