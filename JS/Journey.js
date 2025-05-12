document.addEventListener('DOMContentLoaded', function() {
  const leftCursor = document.querySelector('.left-cursor');
  const rightCursor = document.querySelector('.right-cursor');
  const logoIcon = document.querySelector('.logo-icon');
  const contactLink = document.querySelector('.contact-link');
  const featureButtons = document.querySelectorAll('.feature-button');
  let isScrolling = false;

  // Hide during scroll
  window.addEventListener('scroll', function() {
    isScrolling = true;
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
    setTimeout(() => isScrolling = false, 50);
  });

  // Smooth cursor movement with instant switching
  document.addEventListener('mousemove', function(e) {
    if (isScrolling) return;
    
    // Check if hovering over clickable elements
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

  // Hide when mouse leaves window
  document.addEventListener('mouseout', function() {
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
  });

  // Pointer cursor for interactive elements
  [logoIcon, contactLink, ...featureButtons].forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.style.cursor = 'pointer';
    });
    el.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'none';
    });
  });

  // Click navigation functionality
  document.addEventListener('click', function(e) {
    // Don't navigate if clicking on interactive elements
    if (e.target.closest('.top-bar') || 
        e.target === logoIcon || 
        e.target === contactLink ||
        e.target.closest('.feature-button')) {
      return;
    }
    
    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;
    
    if (isLeftSide) {
      // Go to previous page
      window.location.href = './In-Numbers.html';
    } else {
      // Go to next page
      window.location.href = './Team.html';
    }
  });
});