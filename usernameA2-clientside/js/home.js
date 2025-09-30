// Homepage JavaScript logic

document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupPersonalizedContent();
});

// Setup personalized content for logged-in users
function setupPersonalizedContent() {
    if (typeof isUserLoggedIn === 'function' && isUserLoggedIn()) {
        const user = getCurrentUser();
        if (user) {
            // Add personalized welcome message
            addPersonalizedWelcome(user);
            
            // Show recommended events based on user preferences
            showRecommendedEvents();
        }
    }
}

function addPersonalizedWelcome(user) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Create personalized welcome banner
        const welcomeBanner = document.createElement('div');
        welcomeBanner.className = 'personalized-welcome';
        welcomeBanner.innerHTML = `
            <div class="container">
                <div class="welcome-content">
                    <div class="welcome-avatar">
                        <img src="${user.avatar}" alt="User Avatar">
                    </div>
                    <div class="welcome-text">
                        <h3>Welcome back, ${user.firstName}! 👋</h3>
                        <p>Discover amazing charity events and make a difference in your community</p>
                    </div>
                    <div class="welcome-stats">
                        <div class="stat">
                            <span class="stat-number">0</span>
                            <span class="stat-label">Events Joined</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">$0</span>
                            <span class="stat-label">Donated</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after hero section
        heroSection.parentNode.insertBefore(welcomeBanner, heroSection.nextSibling);
    }
}

function showRecommendedEvents() {
    // This would typically fetch personalized recommendations
    // For now, we'll just highlight some events
    const eventsSection = document.querySelector('#events');
    if (eventsSection) {
        // Add a "Recommended for You" section header
        const sectionTitle = eventsSection.querySelector('.page-title');
        if (sectionTitle) {
            sectionTitle.innerHTML = `
                <h2>🌟 Recommended Events for You</h2>
                <p>Events we think you'll love based on your interests</p>
            `;
        }
    }
}

// Load event list
async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    
    try {

        hideError();
        
        const events = await apiRequest('/api/events');
        
      
        
        if (events.length === 0) {
            eventsContainer.innerHTML = `
                <div class="card" style="grid-column: 1 / -1;">
                    <div class="card-body" style="text-align: center;">
                        <h3>😔 No Events Available</h3>
                        <p>There are currently no ongoing charity events. Please check back later.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Render event cards
        eventsContainer.innerHTML = events.map(event => createEventCard(event)).join('');
        
        // Add card animation effects
        const cards = eventsContainer.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
    } catch (error) {
        console.error('Failed to load events:', error);
        hideLoading();
        showError('Failed to load event information. Please try again later.');
    }
}

// Add page scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        navbar.style.backdropFilter = 'none';
    }
});

// Smooth scroll to anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animated stats numbers effect
function animateNumbers() {
    const numberElements = document.querySelectorAll('.info-item h3');
    
    numberElements.forEach(element => {
        const text = element.textContent;
        const numbers = text.match(/\d+/g);
        
        if (numbers) {
            numbers.forEach(number => {
                const targetNumber = parseInt(number);
                let currentNumber = 0;
                const increment = targetNumber / 50;
                
                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= targetNumber) {
                        currentNumber = targetNumber;
                        clearInterval(timer);
                    }
                    element.textContent = text.replace(number, Math.floor(currentNumber));
                }, 20);
            });
        }
    });
}

// Trigger animation when stats section enters view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
});

// Observe stats section
const statsSection = document.querySelector('#about .event-info');
if (statsSection) {
    observer.observe(statsSection);
}
