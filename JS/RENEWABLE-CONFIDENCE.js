// Cached DOM queries and device detection
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let isScrolling = false;
let scrollTimeout;
let videoCheckInterval;

// Wait for DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements only once
  const leftCursor = document.querySelector('.left-cursor');
  const rightCursor = document.querySelector('.right-cursor');
  const logoIcon = document.querySelector('.logo-icon');
  const contactLink = document.querySelector('.contact-link');
  const carouselTrack = document.querySelector('.carousel-track');
  
  // Initialize videos with better performance handling
  initializeVideos();
  
  // Start carousel with better performance
  if (carouselTrack) {
    // Force a reflow before changing animation state
    void carouselTrack.offsetWidth;
    carouselTrack.style.animationPlayState = 'running';
  }
  
  // Set up scroll handler with throttling
  setupScrollHandler(leftCursor, rightCursor, carouselTrack);
  
  // Only set up mouse/touch handlers if needed
  if (!isMobile) {
    setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink);
  } else {
    setupMobileInteractions();
  }
  
  // Setup visibility change handler
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Optimize video initialization and handling
function initializeVideos() {
  const allVideos = document.querySelectorAll('video');
  if (allVideos.length === 0) return;
  
  allVideos.forEach(video => {
    // Set properties only once
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    
    // Play video with error handling
    playVideoSafely(video);
    
    // Use passive event listeners for better performance
    video.addEventListener('pause', function() {
      playVideoSafely(this);
    }, { passive: true });
    
    video.addEventListener('ended', function() {
      this.currentTime = 0;
      playVideoSafely(this);
    }, { passive: true });
  });
  
  // Check videos less frequently on mobile to conserve battery
  const checkInterval = isMobile ? 5000 : 3000;
  
  // Clear existing interval if any
  if (videoCheckInterval) {
    clearInterval(videoCheckInterval);
  }
  
  // Set up new interval with optimized frequency
  videoCheckInterval = setInterval(function() {
    // Only check videos if page is visible
    if (document.visibilityState === 'visible') {
      const videos = document.querySelectorAll('video');
      videos.forEach(playVideoSafely);
    }
  }, checkInterval);
}

// Helper function to safely play videos
function playVideoSafely(video) {
  if (video.paused) {
    // Use Promise with silent error handling
    video.play().catch(() => {});
  }
}

// Handle visibility changes efficiently
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    const videos = document.querySelectorAll('video');
    
    // Use requestAnimationFrame to defer non-critical operations
    requestAnimationFrame(() => {
      videos.forEach(playVideoSafely);
    });
  }
}

// Optimized scroll handler with throttling
function setupScrollHandler(leftCursor, rightCursor, carouselTrack) {
  window.addEventListener('scroll', function() {
    // Avoid unnecessary operations if already scrolling
    if (!isScrolling) {
      isScrolling = true;
      
      // Hide cursors immediately
      if (leftCursor) leftCursor.style.display = 'none';
      if (rightCursor) rightCursor.style.display = 'none';
      
      // Resume carousel animation
      if (carouselTrack) {
        carouselTrack.style.animationPlayState = 'running';
      }
    }
    
    // Clear previous timeout to implement throttling
    clearTimeout(scrollTimeout);
    
    // Set a new timeout - only run once scrolling stops
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 100); // Increased timeout for better performance
  }, { passive: true }); // Use passive listener for scroll events
}

// Desktop-specific interactions
function setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink) {
  // Optimize mousemove with throttling
  let mouseMoveThrottle = false;
  
  document.addEventListener('mousemove', function(e) {
    // Skip processing during throttle period or scrolling
    if (mouseMoveThrottle || isScrolling) return;
    
    mouseMoveThrottle = true;
    
    // Use requestAnimationFrame for visual updates
    requestAnimationFrame(() => {
      const isOverClickable = e.target.closest('.top-bar') ||
        e.target === logoIcon ||
        e.target === contactLink;
      
      if (isOverClickable) {
        leftCursor.style.display = 'none';
        rightCursor.style.display = 'none';
      } else {
        const middle = window.innerWidth / 2;
        const isLeftSide = e.clientX < middle;
        
        const cursor = isLeftSide ? leftCursor : rightCursor;
        const otherCursor = isLeftSide ? rightCursor : leftCursor;
        
        otherCursor.style.display = 'none';
        cursor.style.display = 'block';
        
        // Revert to left/top positioning for cursor visibility
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
      
      // Reset throttle after frame renders
      mouseMoveThrottle = false;
    });
  }, { passive: true });
  
  // Click handler for navigation
  document.addEventListener('click', function(e) {
    if (e.target.closest('.top-bar') ||
        e.target === logoIcon ||
        e.target === contactLink ||
        e.target.closest('.team-member a')) {
      return;
    }
    
    const middle = window.innerWidth / 2;
    window.location.href = e.clientX < middle ? './index.html' : './Partners.html';
  });
}

// Mobile-specific interactions
function setupMobileInteractions() {
  let touchStartX = 0;
  
  // Use more efficient touch handling
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    // Only process significant swipes (increased threshold)
    if (Math.abs(diff) > 75) {
      window.location.href = diff > 0 ? './Partners.html' : './index.html';
    }
  }, { passive: true });
}