document.addEventListener('DOMContentLoaded', function() {
    // Function to open the Google Apps Script web app
    window.openApp = function() {
        const appUrl = 'https://script.google.com/macros/s/AKfycbxMYiiDaHgCfIBkTkyshI5G8qxlDOgGFnRFA1gvlM9qV2Rk8KQAhcC9NKPqtrza27sA/exec';
        const appFrame = document.getElementById('appFrame');
        const previewPlaceholder = document.getElementById('previewPlaceholder');

        if (appFrame && previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
            appFrame.src = appUrl;
            appFrame.style.display = 'block';
        }
    };
});
