document.addEventListener('DOMContentLoaded', function() {
    // Function to open the Google Apps Script web app
    window.openApp = function() {
        const appUrl = 'https://script.google.com/macros/s/AKfycbzr0J2Le-weonsVdFQw2lmf9TKdPPshhhyxPGUMf1k/dev';
        const appFrame = document.getElementById('appFrame');
        const previewPlaceholder = document.getElementById('previewPlaceholder');

        if (appFrame && previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
            appFrame.src = appUrl;
            appFrame.style.display = 'block';
        }
    };
});
