document.addEventListener('DOMContentLoaded', function () {
  const leftCursor = document.querySelector('.left-cursor');
  const rightCursor = document.querySelector('.right-cursor');
  const logoIcon = document.querySelector('.logo-icon');
  const contactLink = document.querySelector('.contact-link');
  const teamLinks = document.querySelectorAll('.team-member a');

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  let isScrolling = false;

  // =====================
  // DESKTOP BEHAVIOR ONLY
  // =====================
  if (!isMobile) {
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
        e.target.closest('.team-member a');

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

    document.addEventListener('click', function (e) {
      if (
        e.target.closest('.top-bar') ||
        e.target === logoIcon ||
        e.target === contactLink ||
        e.target.closest('.team-member a')
      ) {
        return;
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;

      if (isLeftSide) {
        window.location.href = './Journey.html';
      } else {
        window.location.href = './contact.html';
      }
    });

    [logoIcon, contactLink, ...teamLinks].forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
      });
      el.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'none';
      });
    });
  }

  // =====================
  // MOBILE SWIPE NAVIGATION ONLY
  // =====================
  if (isMobile) {
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe Left → go to contact
          window.location.href = './contact.html';
        } else {
          // Swipe Right → go to journey
          window.location.href = './Journey.html';
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
