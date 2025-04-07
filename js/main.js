/**
 * Main JavaScript File
 * Handles navigation, scrolling, and other interactive functionality
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupScrollSpy();
  setInitialActiveState();
  initDarkMode();
});

// Set up navigation functionality
function setupNavigation() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-icon');

  // Add click event to each navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      // Only prevent default and handle smooth scrolling for in-page links
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);

        // Scroll to the target section if it exists on this page
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });

          // Update active class manually
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          document.querySelectorAll(`.nav-icon[href="${targetId}"]`).forEach(navLink => {
            navLink.classList.add('active');
          });
        }
      }
      // External page links will work normally without preventDefault
    });
  });
}

// Set the initial active state for navigation links based on current page
function setInitialActiveState() {
  // Get the current page path (e.g., '/how-it-works.html')
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop();

  // Remove active class from all navigation items
  document.querySelectorAll('.nav-icon').forEach(item => {
    item.classList.remove('active');
  });

  // Set active class based on current page
  if (pageName === '' || pageName === 'index.html') {
    // If we're on the home page, activate the home link
    document.querySelectorAll('.nav-icon[href="#home"]').forEach(item => {
      item.classList.add('active');
    });
  } else {
    // For other pages, find links that match the current page
    document.querySelectorAll(`.nav-icon[href="${pageName}"]`).forEach(item => {
      item.classList.add('active');
    });
  }
}

// Set up scroll spy to highlight active navigation items
function setupScrollSpy() {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    // Get all sections
    const sections = document.querySelectorAll('section[id]');

    // Determine which section is in view
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all navigation items
        document.querySelectorAll('.nav-icon').forEach(item => {
          item.classList.remove('active');
        });

        // Add active class to corresponding navigation items
        document.querySelectorAll(`.nav-icon[href="#${sectionId}"]`).forEach(item => {
          item.classList.add('active');
        });
      }
    });
  });

  // Trigger scroll event on page load to set initial active state
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
}

// Initialize dark mode based on system preference
function initDarkMode() {
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }
}
