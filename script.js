document.addEventListener('DOMContentLoaded', function() {
    // Function to open the Google Apps Script web app
    window.openApp = function() {
        const appUrl = 'https://script.google.com/macros/s/AKfycbyqiuKArcANAmOeYkHmdzd8iNLKGCXaH22nryH-lws8HxVB8l4URC5N8MYVoEA6ilCv/exec';
        const appFrame = document.getElementById('appFrame');
        const previewPlaceholder = document.getElementById('previewPlaceholder');

        if (appFrame && previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
            appFrame.src = appUrl;
            appFrame.style.display = 'block';
        }
    };
});
