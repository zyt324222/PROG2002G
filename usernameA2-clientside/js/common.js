// ==================== 配置 ====================

// 自动设置 API 基础路径（开发环境走本地，生产环境走同源）
const API_BASE_URL = 'http://localhost:3000' ;


// ==================== 通用 API 请求 ====================
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'API request failed');
        }

        return result.data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}


// ==================== 格式化工具 ====================
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount) {
    if (!amount || amount === 0 || amount === '0.00') return 'Free';
    return `¥${parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}

function calculateProgress(current, goal) {
    if (!goal || goal <= 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
}


// ==================== UI 渲染 ====================
function getEventStatusBadge(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);

    if (!eventDate) return '<span class="badge badge-secondary">Unknown</span>';

    if (event < now) {
        return '<span class="badge badge-danger">Ended</span>';
    } else if (event - now < 24 * 60 * 60 * 1000) {
        return '<span class="badge badge-warning">Starting Soon</span>';
    } else {
        return '<span class="badge badge-success">Open for Registration</span>';
    }
}

function createEventCard(event) {
    const progressPercentage = calculateProgress(event.current_amount, event.goal_amount);
    const statusBadge = getEventStatusBadge(event.event_date);

    return `
        <div class="card">
            <img src="${event.image_url || '/images/default-event.png'}" 
                 alt="${event.name || 'Event'}" 
                 class="card-img" 
                 onerror="this.src='/images/default-event.png'">
            <div class="card-body">
                <div class="card-meta">
                    <span class="badge">${event.category_name || 'Uncategorized'}</span>
                    ${statusBadge}
                </div>
                <h3 class="card-title">${event.name || 'Untitled Event'}</h3>
                <p class="card-text">${event.description || 'No description available.'}</p>
                <div class="card-meta">
                    <span>📅 ${formatDate(event.event_date)}</span>
                    <span>📍 ${event.location || 'N/A'}</span>
                </div>
                <div class="card-meta">
                    <span>💰 ${formatCurrency(event.ticket_price)}</span>
                    <span>🏢 ${event.organization_name || 'N/A'}</span>
                </div>
                ${event.goal_amount > 0 ? `
                <div class="progress">
                    <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                </div>
                <div class="card-meta">
                    <span>Goal: ${formatCurrency(event.goal_amount)}</span>
                    <span>Raised: ${formatCurrency(event.current_amount)}</span>
                </div>
                ` : ''}
                <div class="card-footer">
                    <a href="/event?id=${event.id}" class="btn">View Details</a>
                    <span class="participants">
                        ${event.current_attendees || 0} participants
                    </span>
                </div>
            </div>
        </div>
    `;
}


// ==================== 状态提示 ====================
function showError(message, containerId = 'error-message') {
    const el = document.getElementById(containerId);
    if (el) {
        el.textContent = message;
        el.classList.add('visible');
    }
}

function hideError(containerId = 'error-message') {
    const el = document.getElementById(containerId);
    if (el) {
        el.classList.remove('visible');
    }
}

function showLoading(containerId = 'loading') {
    const el = document.getElementById(containerId);
    if (el) el.classList.add('visible');
}

function hideLoading(containerId = 'loading') {
    const el = document.getElementById(containerId);
    if (el) el.classList.remove('visible');
}


// ==================== 工具函数 ====================
function getUrlParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

function scrollToElement(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 高亮当前导航
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // 按钮点击效果
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 150);
        });
    });
});
