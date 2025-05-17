document.addEventListener('DOMContentLoaded', function () {
  const leftCursor = document.querySelector('.left-cursor');
  const rightCursor = document.querySelector('.right-cursor');
  const logoIcon = document.querySelector('.logo-icon');
  const contactLink = document.querySelector('.contact-link');
  const featureButtons = document.querySelectorAll('.feature-button');

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Feature button click effects
  featureButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      featureButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ======================
  // DESKTOP ONLY: Cursors and click
  // ======================
  if (!isMobile) {
    let isScrolling = false;

    window.addEventListener('scroll', function () {
      isScrolling = true;
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
      setTimeout(() => isScrolling = false, 50);
    });

    document.addEventListener('mousemove', function (e) {
      if (isScrolling) return;

      const isOverClickable = e.target.closest('.top-bar') ||
        e.target === logoIcon ||
        e.target === contactLink ||
        e.target.closest('.feature-button');

      if (isOverClickable) {
        leftCursor.style.display = 'none';
        rightCursor.style.display = 'none';
        document.body.style.cursor = 'pointer';
        return;
      } else {
        document.body.style.cursor = 'none';
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;

      if (isLeftSide) {
        leftCursor.style.display = 'block';
        leftCursor.style.left = e.clientX + 'px';
        leftCursor.style.top = e.clientY + 'px';
        rightCursor.style.display = 'none';
      } else {
        rightCursor.style.display = 'block';
        rightCursor.style.left = e.clientX + 'px';
        rightCursor.style.top = e.clientY + 'px';
        leftCursor.style.display = 'none';
      }
    });

    document.addEventListener('mouseout', function () {
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
    });

    [logoIcon, contactLink, ...featureButtons].forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
      });
      el.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'none';
      });
    });

    // Desktop click navigation
    document.addEventListener('click', function (e) {
      if (e.target.closest('.top-bar') ||
        e.target === logoIcon ||
        e.target === contactLink ||
        e.target.closest('.feature-button')) {
        return;
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;

      if (isLeftSide) {
        window.location.href = './In-Numbers.html';
      } else {
        window.location.href = './Team.html';
      }
    });
  }

  // ======================
  // MOBILE ONLY: Swipe
  // ======================
  if (isMobile) {
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe Left → next page
          window.location.href = './Team.html';
        } else {
          // Swipe Right → previous page
          window.location.href = './In-Numbers.html';
        }
      }
    }

    document.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);
  }
});
