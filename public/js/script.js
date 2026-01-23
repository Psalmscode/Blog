// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const headerSearchBtn = document.querySelector('.header_button .searchBtn');
    const searchClose = document.getElementById('searchClose');

    // Open search bar when header search button is clicked
    if (headerSearchBtn) {
        headerSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchBar.classList.add('open');
            searchInput.focus();
            this.setAttribute('aria-expanded', 'true');
        });
    }

    // Close search bar
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            searchBar.classList.remove('open');
        });
    }

    // Close search bar on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            searchBar.classList.remove('open');
        }
        // Open search bar on Ctrl+/
        if (event.key === '/' && event.ctrlKey) {
            event.preventDefault();
            searchBar.classList.add('open');
            searchInput.focus();
        }
    });

    // Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    
    // Apply saved theme on page load
    if (currentTheme === 'dark-mode') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
            updateThemeIcon(isDarkMode);
        });
    }
    
    // Update theme icon based on mode
    function updateThemeIcon(isDarkMode) {
        const icon = themeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});
