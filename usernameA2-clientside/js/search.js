// Search Page JavaScript Logic

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    setupEventListeners();
});

// Load event categories
async function loadCategories() {
    try {
        const categories = await apiRequest('/api/categories');
        const categorySelect = document.getElementById('category');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    const searchForm = document.getElementById('search-form');
    const clearButton = document.getElementById('clear-filters');
    
    // Search form submit
    searchForm.addEventListener('submit', handleSearch);
    
    // Clear filters button
    clearButton.addEventListener('click', clearFilters);
    
    // Real-time search (optional)
    const inputs = searchForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', debounce(handleSearch, 500));
    });
}

// Handle search
async function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    
    const formData = new FormData(document.getElementById('search-form'));
    const searchParams = new URLSearchParams();
    
    // Build search parameters
    for (let [key, value] of formData.entries()) {
        if (value.trim()) {
            searchParams.append(key, value.trim());
        }
    }
    
    const resultsContainer = document.getElementById('search-results');
    const resultsTitle = document.getElementById('search-results-title');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    
    try {
        showLoading();
        hideError();
        noResults.style.display = 'none';
        resultsTitle.style.display = 'none';
        
        const events = await apiRequest(`/api/events/search?${searchParams.toString()}`);
        
        hideLoading();
        
        if (events.length === 0) {
            noResults.style.display = 'block';
            resultsContainer.innerHTML = '';
            return;
        }
        
        // Show search results
        resultsTitle.style.display = 'block';
        resultsCount.textContent = `Found ${events.length} matching events`;
        
        resultsContainer.innerHTML = events.map(event => createEventCard(event)).join('');
        
        // Add animation effects
        const cards = resultsContainer.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Scroll to results section
        setTimeout(() => {
            resultsTitle.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        
    } catch (error) {
        console.error('Search failed:', error);
        hideLoading();
        showError('Search failed, please try again later.');
    }
}

// Clear filter conditions
function clearFilters() {
    const form = document.getElementById('search-form');
    form.reset();
    
    // Hide search results
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-results-title').style.display = 'none';
    document.getElementById('no-results').style.display = 'none';
    hideError();
    
    // Add clear animation effect
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.transform = 'scale(0.95)';
        setTimeout(() => {
            group.style.transition = 'transform 0.3s ease';
            group.style.transform = 'scale(1)';
        }, index * 50);
    });
}

// Advanced search feature (extendable)
function setupAdvancedSearch() {
    // Price range filter
    const priceFilter = document.createElement('div');
    priceFilter.className = 'form-group';
    priceFilter.innerHTML = `
        <label class="form-label">Price Range</label>
        <div style="display: flex; gap: 1rem;">
            <input type="number" id="min-price" placeholder="Min Price" class="form-control" style="flex: 1;">
            <input type="number" id="max-price" placeholder="Max Price" class="form-control" style="flex: 1;">
        </div>
    `;
    
    // Can be added to the form when needed
}

// Search history feature
function saveSearchHistory(params) {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const searchItem = {
        params: Object.fromEntries(params),
        timestamp: new Date().toISOString()
    };
    
    history.unshift(searchItem);
    // Keep only the 10 most recent searches
    if (history.length > 10) {
        history.splice(10);
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    // Can be displayed in the UI
    return history;
}

// Search suggestions feature
function setupSearchSuggestions() {
    const locationInput = document.getElementById('location');
    
    locationInput.addEventListener('input', debounce(async function() {
        const query = this.value.trim();
        if (query.length < 2) return;
        
        // Implement search suggestion feature here
        // Example: fetch location suggestions from API
    }, 300));
}

// Export search results feature
function exportSearchResults(events) {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Event Name,Date,Location,Category,Price,Organisation\n"
        + events.map(event => 
            `"${event.name}","${formatDate(event.event_date)}","${event.location}","${event.category_name}","${formatCurrency(event.ticket_price)}","${event.organization_name}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "charity_events_search_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
