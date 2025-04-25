// Initialize AOS with optimized settings for mobile
AOS.init({
once: false,
mirror: true,
anchorPlacement: 'top-bottom', // Animations now enabled on phones
throttleDelay: 99, // Lower throttle delay for better performance
disableMutationObserver: false,
startEvent: 'DOMContentLoaded',
offset: 50, // Smaller offset to trigger animations earlier
delay: 0, // No delay for animations to start
duration: 800, // Standard duration for all animations
easing: 'ease-out' // Smoother easing
});

// Fix AOS-related scrolling issues
document.addEventListener('DOMContentLoaded', function() {
  // Get all elements with AOS attributes
  const aosElements = document.querySelectorAll('[data-aos]');
  
  // Override any overflow styles AOS might apply
  aosElements.forEach(element => {
    // Add event listener for when animation starts/ends
    element.addEventListener('aos:in', function() {
      // Force overflow to be visible for this element
      element.style.overflow = 'visible';
    });
    
    // Set initial overflow to visible
    element.style.overflow = 'visible';
  });
  
  // Special handling for footer section and last elements
  const footerSection = document.querySelector('footer');
  const lastSections = document.querySelectorAll('section:last-of-type, .section-container:last-of-type');
  
  // If there's a footer with AOS, ensure it behaves correctly
  if (footerSection && footerSection.getAttribute('data-aos')) {
    // Make sure footer has proper overflow
    footerSection.style.overflow = 'visible';
    
    // Add specific animation completion handler
    footerSection.addEventListener('aos:in', function() {
      footerSection.style.transform = 'none';
      footerSection.style.opacity = '1';
    });
  }
  
  // Handle last sections to prevent scrolling issues
  lastSections.forEach(section => {
    if (section.getAttribute('data-aos')) {
      section.style.overflow = 'visible';
      
      // Force animation completion when close to bottom
      window.addEventListener('scroll', function() {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If the section is within 200px of the viewport bottom
        if (rect.top < windowHeight + 200) {
          // Force animation to complete
          if (section.classList.contains('aos-animate') === false) {
            section.classList.add('aos-animate');
            section.style.transform = 'none';
            section.style.opacity = '1';
          }
        }
      }, { passive: true });
    }
  });
  
  // Fix for iOS scroll restoration issues
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.addEventListener('scroll', function() {
      // Do minimal work in scroll event
      requestAnimationFrame(function() {
        document.body.style.overflow = 'auto';
      });
    }, { passive: true });
  }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing close buttons that might have been dynamically added
    const existingCloseButtons = document.querySelectorAll('.dynamically-added-close');
    existingCloseButtons.forEach(button => button.remove());
    
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu-button');
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    const body = document.body;
    // Get the burger icon spans
    const burgerSpans = menuToggle ? menuToggle.querySelectorAll('span') : [];

    // Function to toggle menu
    function toggleMenu(open) {
        if (!mobileMenu) return; // Safety check
        
        if (open) {
            mobileMenu.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            body.style.position = 'fixed'; // Fix the body position
            body.style.width = '100%'; // Ensure body width is 100%
            body.style.top = `-${window.scrollY}px`; // Maintain scroll position
            if (menuToggle) menuToggle.style.display = 'none'; // Hide the menu toggle when open
            
        } else {
            mobileMenu.classList.remove('active');
            const scrollY = body.style.top;
            body.style.overflow = ''; // Restore scrolling
            body.style.position = ''; // Restore position
            body.style.width = ''; // Restore width
            body.style.top = ''; // Restore top position
            if (menuToggle) menuToggle.style.display = ''; // Show the menu toggle when closed
            
            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    }

    // Handle menu toggle click
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            toggleMenu(true);
        });
    }

    // Handle close button click
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            toggleMenu(false);
        });
    }

    // Close menu when clicking on links - with optimizations for mobile
    if (mobileLinks && mobileLinks.length > 0) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                
                // First close the menu
                toggleMenu(false);
                
                // Then scroll to the section after a small delay
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 100); // Reduced delay for better UX
                }
            });
        });
    }

    // Optimize event listener for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Swipe to close menu
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            touchStartX < touchEndX && touchEndX - touchStartX > 50) {
            toggleMenu(false);
        }
    }, {passive: true});

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            (menuToggle === null || e.target !== menuToggle) &&
            (menuToggle === null || !menuToggle.contains(e.target))) {
            toggleMenu(false);
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (mobileMenu && e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    });
    
    // Check for viewport changes
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    function handleScreenChange(e) {
        if (mobileMenu && e.matches && mobileMenu.classList.contains('active')) {
            toggleMenu(false);
        }
    }
    
    mediaQuery.addEventListener('change', handleScreenChange);
    
    // Ensure menu toggle is visible on page load/reload
    if (menuToggle) {
        window.addEventListener('pageshow', function(e) {
            if (mobileMenu && !mobileMenu.classList.contains('active')) {
                menuToggle.style.display = '';
            }
        });
    }
    
    // Fix for iOS Safari
    window.addEventListener('orientationchange', function() {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            setTimeout(function() {
                document.documentElement.scrollTop = 0;
            }, 50);
        }
    });
});

// File download function
function downloadFile(fileUrl, fileName) {
// Create a loading indicator
const loadingToast = document.createElement('div');
loadingToast.textContent = 'Downloading...';
loadingToast.style.position = 'fixed';
loadingToast.style.bottom = '20px';
loadingToast.style.right = '20px';
loadingToast.style.backgroundColor = 'rgba(95, 43, 126, 0.9)';
loadingToast.style.color = 'white';
loadingToast.style.padding = '10px 20px';
loadingToast.style.borderRadius = '5px';
loadingToast.style.zIndex = '1000';
document.body.appendChild(loadingToast);

// Fetch the file
fetch(fileUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        document.body.removeChild(loadingToast);
        
        // Show success message
        const successToast = document.createElement('div');
        successToast.textContent = 'Download complete!';
        successToast.style.position = 'fixed';
        successToast.style.bottom = '20px';
        successToast.style.right = '20px';
        successToast.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
        successToast.style.color = 'white';
        successToast.style.padding = '10px 20px';
        successToast.style.borderRadius = '5px';
        successToast.style.zIndex = '1000';
        document.body.appendChild(successToast);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(successToast);
        }, 3000);
    })
    .catch(error => {
        console.error('Error downloading file:', error);
        document.body.removeChild(loadingToast);
        
        // Show error message
        const errorToast = document.createElement('div');
        errorToast.textContent = 'Error downloading file. Please try again later.';
        errorToast.style.position = 'fixed';
        errorToast.style.bottom = '20px';
        errorToast.style.right = '20px';
        errorToast.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
        errorToast.style.color = 'white';
        errorToast.style.padding = '10px 20px';
        errorToast.style.borderRadius = '5px';
        errorToast.style.zIndex = '1000';
        document.body.appendChild(errorToast);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(errorToast);
        }, 3000);
    });
}

// Initialize Particles.js for neural network effect
particlesJS("particles-js", {
"particles": {
    "number": {
        "value": 50,
        "density": {
            "enable": true,
            "value_area": 900
        }
    },
    "color": {
        "value": "#5f2b7e"
    },
    "shape": {
        "type": "circle",
        "stroke": {
            "width": 0,
            "color": "#000000"
        },
    },
    "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
            "enable": false
        }
    },
    "size": {
        "value": 3,
        "random": true,
        "anim": {
            "enable": false
        }
    },
    "line_linked": {
        "enable": true,
        "distance": 160,
        "color": "#8543af",
        "opacity": 0.4,
        "width": 1
    },
    "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
    }
},
"interactivity": {
    "detect_on": "canvas",
    "events": {
        "onhover": {
            "enable": true,
            "mode": "grab"
        },
        "onclick": {
            "enable": false,
            "mode": "push"
        },
        "resize": true
    },
    "modes": {
        "grab": {
            "distance": 140,
            "line_linked": {
                "opacity": 1
            }
        },
        "push": {
            "particles_nb": 4
        }
    }
},
"retina_detect": false
});

// JavaScript for smooth scrolling
// Modify the global smooth scrolling to avoid conflicts with mobile menu
document.querySelectorAll('a[href^="#"]:not(#mobile-menu a)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const projectImage = document.querySelector('.project-image-container');
    
    // Open lightbox when gallery item is clicked
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex';
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Open lightbox when project image is clicked
    if (projectImage) {
        projectImage.addEventListener('click', function() {
            const img = this.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = 'flex';
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }
    
    // Close lightbox when close button is clicked
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightboxClose.click();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightboxClose.click();
        }
    });
});