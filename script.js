document.addEventListener('DOMContentLoaded', function() {
    // Function to open the Google Apps Script web app
    window.openApp = function() {
        const appUrl = 'https://script.google.com/macros/s/AKfycbwb7NpbMm9D2EWLy1dbA6dgExN2n880dEs_Dfy0Klzqs60asIvXMKj-wqqZrqJA6gKW/exec';
        const appFrame = document.getElementById('appFrame');
        const previewPlaceholder = document.getElementById('previewPlaceholder');

        if (appFrame && previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
            appFrame.src = appUrl;
            appFrame.style.display = 'block';
        }
    };
});
