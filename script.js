// Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZwQrxxXeDnT1llTZb3h7Mj059z4y_3JuKnmQ2p5yIdQXbxttoDblg4coapbSy-gkq/exec';

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const toast = document.getElementById('toast');
const connectionStatus = document.getElementById('connectionStatus');
const apiResponse = document.getElementById('apiResponse');
const fetchBtn = document.getElementById('fetchBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    hideLoadingScreen();
});

// Initialize application
function initializeApp() {
    // Animate elements on scroll
    observeElements();
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Initialize navigation
    setupNavigation();
}

// Hide loading screen
function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hide');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 1500);
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', submitForm);
    }
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// Close mobile menu
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

// Observe elements for animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe feature cards and service items
    document.querySelectorAll('.feature-card, .service-item').forEach(el => {
        observer.observe(el);
    });
}

// Connect to Google Apps Script service
async function connectToService() {
    showToast('Connecting to service...', 'info');
    updateConnectionStatus('connecting');
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            updateConnectionStatus('connected');
            showToast('Successfully connected to service!', 'success');
            
            // Update service status indicator
            const serviceStatus = document.getElementById('serviceStatus');
            if (serviceStatus) {
                const indicator = serviceStatus.querySelector('.status-indicator');
                const text = serviceStatus.querySelector('span:last-child');
                if (indicator && text) {
                    indicator.style.background = '#4caf50';
                    text.textContent = 'Connected';
                }
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Connection error:', error);
        updateConnectionStatus('error');
        showToast('Failed to connect to service', 'error');
    }
}

// Fetch data from Google Apps Script
async function fetchData() {
    if (!fetchBtn) return;
    
    const originalText = fetchBtn.innerHTML;
    fetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
    fetchBtn.disabled = true;
    
    updateConnectionStatus('loading');
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.text();
            displayApiResponse(data);
            updateConnectionStatus('connected');
            showToast('Data fetched successfully!', 'success');
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        displayApiResponse(`Error: ${error.message}`, true);
        updateConnectionStatus('error');
        showToast('Failed to fetch data', 'error');
    } finally {
        fetchBtn.innerHTML = originalText;
        fetchBtn.disabled = false;
    }
}

// Display API response
function displayApiResponse(data, isError = false) {
    if (!apiResponse) return;
    
    const responseContainer = apiResponse;
    
    if (isError) {
        responseContainer.innerHTML = `
            <div class="error-response">
                <i class="fas fa-exclamation-triangle" style="color: #f44336; font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3 style="color: #f44336; margin-bottom: 1rem;">Connection Error</h3>
                <p style="color: #666; margin-bottom: 1rem;">${data}</p>
                <small style="color: #999;">Please check your internet connection and try again.</small>
            </div>
        `;
    } else {
        // Try to parse JSON, if it fails, display as plain text
        let formattedData;
        try {
            const jsonData = JSON.parse(data);
            formattedData = `<pre><code>${JSON.stringify(jsonData, null, 2)}</code></pre>`;
        } catch {
            formattedData = `<div class="response-data">
                <h3 style="margin-bottom: 1rem; color: #333;">Response Data:</h3>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; border-left: 4px solid #667eea;">
                    ${data.replace(/\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length))}
                </div>
            </div>`;
        }
        
        responseContainer.innerHTML = `
            <div class="success-response">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle" style="color: #4caf50; font-size: 1.5rem; margin-right: 0.5rem;"></i>
                    <h3 style="color: #4caf50; margin: 0;">Data Retrieved Successfully</h3>
                </div>
                ${formattedData}
                <div style="margin-top: 1rem; padding: 0.5rem; background: #e8f5e8; border-radius: 4px; font-size: 0.9rem; color: #2e7d32;">
                    <i class="fas fa-info-circle"></i> Connected to Google Apps Script
                </div>
            </div>
        `;
    }
}

// Update connection status
function updateConnectionStatus(status) {
    if (!connectionStatus) return;
    
    const statusDot = connectionStatus.querySelector('.status-dot');
    const statusText = connectionStatus.querySelector('span:last-child');
    
    if (!statusDot || !statusText) return;
    
    switch (status) {
        case 'connected':
            statusDot.style.background = '#4caf50';
            statusDot.classList.add('connected');
            statusText.textContent = 'Connected';
            break;
        case 'connecting':
        case 'loading':
            statusDot.style.background = '#ff9800';
            statusDot.classList.remove('connected');
            statusText.textContent = status === 'connecting' ? 'Connecting...' : 'Loading...';
            break;
        case 'error':
            statusDot.style.background = '#f44336';
            statusDot.classList.remove('connected');
            statusText.textContent = 'Connection Failed';
            break;
        default:
            statusDot.style.background = '#f44336';
            statusDot.classList.remove('connected');
            statusText.textContent = 'Disconnected';
    }
}

// Submit contact form
async function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate form submission to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });
        
        if (response.ok) {
            showToast('Message sent successfully!', 'success');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showToast('Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    if (!toast) return;
    
    const toastContent = toast.querySelector('.toast-content');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-content i');
    
    if (!toastContent || !toastMessage || !toastIcon) return;
    
    // Set icon based on type
    switch (type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle';
            toast.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle';
            toast.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
            break;
        case 'info':
        default:
            toastIcon.className = 'fas fa-info-circle';
            toast.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after animation
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Particle animation for hero section
function initParticleAnimation() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.querySelector('.hero-particles');
    
    if (!hero || !particlesContainer) return;
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 4 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(255, 255, 255, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 10 + 10}s infinite linear`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particle animation when DOM is loaded
document.addEventListener('DOMContentLoaded', initParticleAnimation);

// Add some utility functions for enhanced user experience
function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Apply ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn').forEach(addRippleEffect);
});

// Add CSS for ripple effect
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Export functions for global access
window.connectToService = connectToService;
window.fetchData = fetchData;
window.submitForm = submitForm;
