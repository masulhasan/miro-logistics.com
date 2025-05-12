$(document).ready(function() {
  // Ripple effect
  $(".full-landing-image").ripples({
    perturbance: 0.4,
    dropRadius: 100,
    resolution: 256,
    damping: 0.05,
    spread: 0.05,
    interactive: true,
    crossOrigin: ''
  });

  // Automatic drops
  setInterval(function() {
    const $el = $('.full-landing-image');
    $el.ripples('drop', 
      Math.random() * $el.width(),
      Math.random() * $el.height(),
      25 + Math.random() * 15,
      0.03 + Math.random() * 0.03
    );
  }, 2000);

  // Cursor elements
  const leftCursor = document.querySelector('.left-cursor');
  const rightCursor = document.querySelector('.right-cursor');
  const leftActive = document.querySelector('.left-active');
  const rightActive = document.querySelector('.right-active');
  const logoIcon = document.querySelector('.logo-icon');
  const contactLink = document.querySelector('.contact-link');
  let isScrolling = false;
  
  // Hide during scroll
  window.addEventListener('scroll', function() {
    isScrolling = true;
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
    leftActive.classList.remove('active');
    rightActive.classList.remove('active');
    setTimeout(() => isScrolling = false, 50);
  });
  
  // Smooth cursor movement with active zones
  document.addEventListener('mousemove', function(e) {
    if (isScrolling) return;
    
    // Check if hovering over clickable elements
    const isOverClickable = e.target.closest('.top-bar') || 
                           e.target === logoIcon || 
                           e.target === contactLink;
    
    if (isOverClickable) {
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
      leftActive.classList.remove('active');
      rightActive.classList.remove('active');
      return;
    }
    
    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;
    
    if (isLeftSide) {
      leftCursor.style.display = 'block';
      leftCursor.style.left = e.clientX + 'px';
      leftCursor.style.top = e.clientY + 'px';
      rightCursor.style.display = 'none';
      leftActive.classList.add('active');
      rightActive.classList.remove('active');
      leftCursor.classList.add('active');
      rightCursor.classList.remove('active');
    } else {
      rightCursor.style.display = 'block';
      rightCursor.style.left = e.clientX + 'px';
      rightCursor.style.top = e.clientY + 'px';
      leftCursor.style.display = 'none';
      rightActive.classList.add('active');
      leftActive.classList.remove('active');
      rightCursor.classList.add('active');
      leftCursor.classList.remove('active');
    }
  });
  
  // Hide when mouse leaves window
  document.addEventListener('mouseout', function() {
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
    leftActive.classList.remove('active');
    rightActive.classList.remove('active');
    leftCursor.classList.remove('active');
    rightCursor.classList.remove('active');
  });

  // Pointer cursor for interactive elements
  [logoIcon, contactLink].forEach(el => {
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
          e.target === contactLink) {
          return;
      }
      
      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;
      
      if (isLeftSide) {
          // Go to previous page (replace with your actual previous page)
          window.location.href = './Contact.html';
      } else {
          // Go to next page (contact.html)
          window.location.href = './Contact.html';
      }
  });
});