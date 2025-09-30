// Event Detail Page JavaScript Logic

document.addEventListener('DOMContentLoaded', function() {
    const eventId = getUrlParameter('id');
    
    if (!eventId) {
        showError('Missing event ID parameter', 'error-text');
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    loadEventDetails(eventId);
    setupModalEvents();
});

// Load event details
async function loadEventDetails(eventId) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const contentElement = document.getElementById('event-content');
    
    try {
        showLoading();
        errorElement.style.display = 'none';
        contentElement.style.display = 'none';
        
        const event = await apiRequest(`/api/events/${eventId}`);
        
        hideLoading();
        
        // Render event details
        renderEventDetails(event);
        
        contentElement.style.display = 'block';
        
        // Add page animation effect
        contentElement.style.opacity = '0';
        contentElement.style.transform = 'translateY(20px)';
        setTimeout(() => {
            contentElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            contentElement.style.opacity = '1';
            contentElement.style.transform = 'translateY(0)';
        }, 100);
        
    } catch (error) {
        console.error('Failed to load event details:', error);
        hideLoading();
        
        if (error.message.includes('404')) {
            document.getElementById('error-text').textContent = 'Event does not exist or has been deleted';
        } else {
            document.getElementById('error-text').textContent = 'Failed to load event information, please try again later';
        }
        
        errorElement.style.display = 'block';
    }
}

// Render event details
function renderEventDetails(event) {
    // Set page title
    document.title = `${event.name} - Charity Event Management Platform`;
    
    // Event header
    const eventHeader = document.getElementById('event-header');
    if (event.image_url) {
        eventHeader.style.backgroundImage = `url('${event.image_url}')`;
    }
    
    document.getElementById('event-title').textContent = event.name;
    document.getElementById('event-organization').textContent = `Organizer: ${event.organization_name}`;
    
    // Basic info
    document.getElementById('event-location').textContent = event.location;
    document.getElementById('event-category').textContent = event.category_name || 'Uncategorized';
    document.getElementById('event-price').textContent = formatCurrency(event.ticket_price);
    
    // Event description
    document.getElementById('event-description').textContent = event.full_description || event.description;
    
    // Format date and time
    const eventDateTime = new Date(event.event_date + 'T' + (event.event_time || '00:00:00'));
    document.getElementById('event-date').textContent = formatDate(eventDateTime);
    
    // Fundraising info
    if (event.goal_amount > 0) {
        const progressPercentage = calculateProgress(event.current_amount, event.goal_amount);
        
        document.getElementById('goal-amount').textContent = formatCurrency(event.goal_amount);
        document.getElementById('current-amount').textContent = formatCurrency(event.current_amount);
        document.getElementById('progress-percentage').textContent = `${progressPercentage}%`;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${progressPercentage}%`;
        
        // Progress bar animation
        setTimeout(() => {
            progressBar.style.transition = 'width 1.5s ease-in-out';
        }, 500);
    } else {
        document.getElementById('fundraising-section').style.display = 'none';
    }
    
    // Attendance info
    if (event.max_attendees) {
        document.getElementById('current-attendees').textContent = `${event.current_attendees || 0} people`;
        document.getElementById('max-attendees').textContent = `${event.max_attendees} people`;
        
        const remaining = event.max_attendees - (event.current_attendees || 0);
        document.getElementById('remaining-spots').textContent = `${Math.max(0, remaining)} people`;
        
        // If full, update button state
        if (remaining <= 0) {
            const registerBtn = document.getElementById('register-btn');
            registerBtn.textContent = '🚫 Fully Booked';
            registerBtn.classList.add('btn-secondary');
            registerBtn.disabled = true;
        }
    } else {
        document.getElementById('attendance-section').style.display = 'none';
    }
    
    // Organizer info
    document.getElementById('org-name').textContent = event.organization_name;
    document.getElementById('org-email').textContent = event.contact_email || 'N/A';
    document.getElementById('org-phone').textContent = event.contact_phone || 'N/A';
    document.getElementById('org-description').textContent = event.organization_description || 'No description available';
    
    if (event.website) {
        const websiteLink = document.getElementById('org-website');
        websiteLink.href = event.website;
        websiteLink.style.display = 'inline-block';
    }
    
    // Check event status
    const eventDate = new Date(event.event_date);
    const now = new Date();
    
    if (eventDate < now) {
        const registerBtn = document.getElementById('register-btn');
        registerBtn.textContent = '⏰ Event Ended';
        registerBtn.classList.add('btn-secondary');
        registerBtn.disabled = true;
    }
}

// Setup modal events
function setupModalEvents() {
    const registerBtn = document.getElementById('register-btn');
    const modal = document.getElementById('register-modal');
    const closeBtn = modal.querySelector('.close');
    
    registerBtn.addEventListener('click', function() {
        if (!this.disabled) {
            modal.style.display = 'block';
        }
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Close modal
function closeModal() {
    const modal = document.getElementById('register-modal');
    modal.style.display = 'none';
}

// Share functionality
function shareEvent() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('event-title').textContent,
            text: document.getElementById('event-description').textContent,
            url: window.location.href
        });
    } else {
        // Copy link to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Event link copied to clipboard');
        });
    }
}

// Add to calendar functionality
function addToCalendar(event) {
    const startDate = new Date(event.event_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assume 2 hours duration
    
    const calendarEvent = {
        title: event.name,
        start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        description: event.description,
        location: event.location
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${calendarEvent.start}/${calendarEvent.end}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;
    
    window.open(calendarUrl, '_blank');
}

// Favorite functionality
function toggleFavorite(eventId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
    const index = favorites.indexOf(eventId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showMessage('Removed from favorites', 'success');
    } else {
        favorites.push(eventId);
        showMessage('Added to favorites', 'success');
    }
    
    localStorage.setItem('favoriteEvents', JSON.stringify(favorites));
    updateFavoriteButton(eventId);
}

function updateFavoriteButton(eventId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
    const favoriteBtn = document.getElementById('favorite-btn');
    
    if (favoriteBtn) {
        if (favorites.includes(eventId)) {
            favoriteBtn.textContent = '💖 Favorited';
            favoriteBtn.classList.add('btn-success');
        } else {
            favoriteBtn.textContent = '🤍 Favorite';
            favoriteBtn.classList.remove('btn-success');
        }
    }
}

// Show message
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.padding = '1rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.color = 'white';
    messageDiv.style.fontWeight = 'bold';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Related event recommendations
async function loadRelatedEvents(currentEventId, categoryId) {
    try {
        const events = await apiRequest(`/api/events/search?category=${categoryId}`);
        const relatedEvents = events.filter(event => event.id != currentEventId).slice(0, 3);
        
        if (relatedEvents.length > 0) {
            const relatedSection = document.createElement('section');
            relatedSection.className = 'container';
            relatedSection.innerHTML = `
                <div class="page-title">
                    <h2>Related Events</h2>
                </div>
                <div class="events-grid">
                    ${relatedEvents.map(event => createEventCard(event)).join('')}
                </div>
            `;
            
            document.querySelector('.footer').before(relatedSection);
        }
    } catch (error) {
        console.error('Failed to load related events:', error);
    }
}
