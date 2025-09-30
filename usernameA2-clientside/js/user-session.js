// User Session Management

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user data
function getCurrentUser() {
    const userSession = localStorage.getItem('userSession');
    return userSession ? JSON.parse(userSession) : null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('isLoggedIn');
    
    // Show logout message
    showMessage('You have been successfully logged out.', 'success');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

// Update navigation bar based on login status
function updateNavigationBar() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Remove existing user info or auth link
    const existingUserInfo = navMenu.querySelector('.user-info');
    const existingAuthLink = navMenu.querySelector('.btn-auth');
    
    if (existingUserInfo) existingUserInfo.remove();
    if (existingAuthLink) existingAuthLink.remove();

    if (isUserLoggedIn()) {
        const user = getCurrentUser();
        if (user) {
            // Create user info dropdown
            const userInfoLi = document.createElement('li');
            userInfoLi.className = 'user-info';
            userInfoLi.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn" onclick="toggleUserDropdown()">
                        <img src="${user.avatar}" alt="User Avatar" class="user-avatar">
                        <span class="user-name">${user.firstName} ${user.lastName}</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        <div class="user-info-header">
                            <img src="${user.avatar}" alt="User Avatar" class="user-avatar-large">
                            <div class="user-details">
                                <div class="user-full-name">${user.firstName} ${user.lastName}</div>
                                <div class="user-email">${user.email}</div>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" onclick="showUserProfile()">
                            <span class="dropdown-icon">👤</span>
                            My Profile
                        </a>
                        <a href="#" class="dropdown-item" onclick="showMyEvents()">
                            <span class="dropdown-icon">🎫</span>
                            My Events
                        </a>
                        <a href="#" class="dropdown-item" onclick="showSettings()">
                            <span class="dropdown-icon">⚙️</span>
                            Settings
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item logout-item" onclick="logoutUser()">
                            <span class="dropdown-icon">🚪</span>
                            Logout
                        </a>
                    </div>
                </div>
            `;
            navMenu.appendChild(userInfoLi);
        }
    } else {
        // Show login/register link
        const authLi = document.createElement('li');
        authLi.innerHTML = '<a href="./auth.html" class="nav-link btn-auth">Login/Register</a>';
        navMenu.appendChild(authLi);
    }
}

// Toggle user dropdown menu
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userDropdown = document.querySelector('.user-dropdown');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    
    if (userDropdown && dropdownMenu && !userDropdown.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// User profile functions
function showUserProfile() {
    const user = getCurrentUser();
    if (!user) return;

    const modal = createModal('User Profile', `
        <div class="profile-content">
            <div class="profile-header">
                <img src="${user.avatar}" alt="User Avatar" class="profile-avatar">
                <div class="profile-info">
                    <h3>${user.firstName} ${user.lastName}</h3>
                    <p class="profile-email">${user.email}</p>
                    ${user.phone ? `<p class="profile-phone">📞 ${user.phone}</p>` : ''}
                    <p class="profile-member-since">Member since: ${new Date(user.loginTime).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="profile-stats">
                <div class="stat-item">
                    <div class="stat-number">0</div>
                    <div class="stat-label">Events Attended</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">$0</div>
                    <div class="stat-label">Total Donated</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">0</div>
                    <div class="stat-label">Certificates</div>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    toggleUserDropdown(); // Close the dropdown
}

function showMyEvents() {
    const modal = createModal('My Events', `
        <div class="my-events-content">
            <div class="events-tabs">
                <button class="tab-btn active" onclick="showEventTab('upcoming')">Upcoming Events</button>
                <button class="tab-btn" onclick="showEventTab('past')">Past Events</button>
            </div>
            <div class="events-list" id="myEventsList">
                <div class="empty-state">
                    <div class="empty-icon">🎫</div>
                    <h3>No events yet</h3>
                    <p>You haven't registered for any events yet. <a href="/search">Browse events</a> to get started!</p>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    toggleUserDropdown(); // Close the dropdown
}

function showSettings() {
    const user = getCurrentUser();
    const modal = createModal('Settings', `
        <div class="settings-content">
            <div class="settings-section">
                <h4>Account Information</h4>
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" value="${user.firstName}" class="form-control" readonly>
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" value="${user.lastName}" class="form-control" readonly>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="${user.email}" class="form-control" readonly>
                </div>
                ${user.phone ? `
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" value="${user.phone}" class="form-control" readonly>
                </div>
                ` : ''}
            </div>
            <div class="settings-section">
                <h4>Preferences</h4>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" checked> Email notifications
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" checked> Event reminders
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox"> Newsletter subscription
                    </label>
                </div>
            </div>
            <div class="settings-actions">
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                <button class="btn" onclick="showMessage('Settings saved successfully!', 'success'); closeModal();">Save Changes</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    toggleUserDropdown(); // Close the dropdown
}

// Utility function to create modal
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.style.display === 'block') {
            modal.remove();
        }
    });
}

// Show message function (if not already defined)
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.temp-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `temp-message ${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.padding = '1rem 1.5rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.color = 'white';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.style.maxWidth = '400px';
    messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    if (type === 'error') {
        messageDiv.style.background = '#e74c3c';
    } else if (type === 'success') {
        messageDiv.style.background = '#27ae60';
    } else {
        messageDiv.style.background = '#3498db';
    }
    
    document.body.appendChild(messageDiv);
    
    // Animate in
    messageDiv.style.transform = 'translateX(100%)';
    setTimeout(() => {
        messageDiv.style.transition = 'transform 0.3s ease';
        messageDiv.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Initialize user session on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigationBar();
    
    // Add welcome message for newly logged in users
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true' && isUserLoggedIn()) {
        const user = getCurrentUser();
        setTimeout(() => {
            showMessage(`Welcome back, ${user.firstName}! 🎉`, 'success');
        }, 500);
    }
});