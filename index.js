document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const websiteUrl = document.getElementById('website-url');
    const generateBtn = document.getElementById('generate-btn');
    const qrImage = document.getElementById('qr-image');
    const qrPlaceholder = document.querySelector('.qr-placeholder');
    const notification = document.getElementById('notification');
    const formatOptions = document.querySelectorAll('[data-format]');
    const bgOptions = document.querySelectorAll('[data-bg]');
    const sizeSelect = document.getElementById('size');
    const loadingContainer = document.getElementById('loading-container');
    
    // Default settings
    let currentFormat = 'png';
    let currentBg = 'white';
    
    // Format selection
    formatOptions.forEach(option => {
        option.addEventListener('click', function() {
            formatOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            currentFormat = this.dataset.format;
        });
    });
    
    // Background selection (ignored by new API, but kept for consistency)
    bgOptions.forEach(option => {
        option.addEventListener('click', function() {
            bgOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            currentBg = this.dataset.bg;
        });
    });
    
    // Generate QR code
    generateBtn.addEventListener('click', function() {
        const url = websiteUrl.value.trim();
        
        if (!url) {
            showNotification('Please enter a valid URL');
            return;
        }
        
        // Show loading animation
        loadingContainer.style.display = 'block';
        qrImage.style.display = 'none';
        qrPlaceholder.style.display = 'none';
        
        // Construct QR code URL
        const size = sizeSelect.value;  // E.g., "300"
        const sizePx = `${size}x${size}`;  // E.g., "300x300"
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${sizePx}&data=${encodeURIComponent(url)}&format=${currentFormat}`;
        
        // Simulate loading for demo purposes
        setTimeout(() => {
            qrImage.src = qrUrl;
            
            // When image loads, hide loading and show QR code
            qrImage.onload = function() {
                loadingContainer.style.display = 'none';
                qrImage.style.display = 'block';
                setupDownloadButtons(qrUrl);
                showNotification('QR Code generated successfully!');
            };
            
            // Handle image loading errors
            qrImage.onerror = function() {
                loadingContainer.style.display = 'none';
                qrPlaceholder.style.display = 'block';
                showNotification('Failed to generate QR code. Please try again.');
            };
        }, 1500);
    });
    
    // Setup download buttons
    function setupDownloadButtons(qrUrl) {
        const downloadPng = document.getElementById('download-png');
        const downloadSvg = document.getElementById('download-svg');
        
        downloadPng.onclick = function() {
            const pngUrl = qrUrl.replace(/format=svg/, 'format=png');
            downloadFile(pngUrl, 'my-qr-code.png');
        };
        
        downloadSvg.onclick = function() {
            const svgUrl = qrUrl.replace(/format=png/, 'format=svg');
            downloadFile(svgUrl, 'my-qr-code.svg');
        };
        
        document.getElementById('share-btn').onclick = function() {
            if (navigator.share) {
                navigator.share({
                    title: 'My QR Code',
                    text: 'Check out QR code I created!',
                    url: qrUrl
                }).catch(console.error);
            } else {
                showNotification('Web Share API not supported in your browser');
            }
        };
    }
    
    // Download file helper
    function downloadFile(url, filename) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
    
    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});
