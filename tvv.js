/* TinyVerticalVideo Widget - Final Enhanced Version */
/* Responsive button scaling and custom avatar URL support */

(function() {
    'use strict';
    
    // Default configuration (can be overridden)
    window.TinyVerticalVideo = window.TinyVerticalVideo || {};
    const config = Object.assign({
        enableVideoToggle: true, // Show/hide avatar circle
        avatarImage: "", // Custom URL or empty for no image
        avatarColor: "#FF6B35",
        autoplayMuted: true,
        loopVideo: true,
        videoWidth: 275, // Increased default width
        overlayButtons: [], // Array of {text: "", url: "", letter: "A"}
        widgetStyle: "floating", // "fixed" or "floating"
        floatingPosition: "bottom-right" // "bottom-right" or "bottom-left"
    }, window.TinyVerticalVideo.config || {});
    
    // Calculate height based on 9:16 ratio
    const videoHeight = Math.round(config.videoWidth * (16/9));
    const avatarSize = config.videoWidth < 150 ? "50px" : "60px";
    
    // Calculate responsive button font size
    const getButtonFontSize = () => {
        if (config.videoWidth < 275) {
            // Scale down font size for smaller widgets
            const scale = config.videoWidth / 275;
            return Math.max(11, Math.round(13 * scale));
        }
        return 13; // Default font size
    };
    
    const getButtonPadding = () => {
        if (config.videoWidth < 275) {
            return "6px 12px";
        }
        return "8px 15px";
    };
    
    const getButtonCircleSize = () => {
        if (config.videoWidth < 275) {
            const scale = config.videoWidth / 275;
            return Math.max(20, Math.round(24 * scale));
        }
        return 24;
    };
    
    const getFloatingPosition = () => {
        if (config.floatingPosition === 'bottom-left') {
            return 'bottom: 30px !important; left: 30px !important;';
        } else {
            return 'bottom: 30px !important; right: 30px !important;';
        }
    };
    
    const getAvatarPosition = () => {
        if (config.widgetStyle === 'floating') {
            if (config.floatingPosition === 'bottom-left') {
                // Video is on bottom-left, avatar attaches to bottom-left corner
                return `bottom: 30px !important; left: ${30 - 30}px !important; right: auto !important;`;
            } else {
                // Video is on bottom-right, avatar attaches to bottom-right corner  
                return `bottom: 30px !important; right: ${30 - 30}px !important; left: auto !important;`;
            }
        } else {
            // Fixed positioning - default bottom right
            return 'bottom: 30px !important; right: 30px !important; left: auto !important;';
        }
    };
    
    // Inject CSS styles
    function injectStyles() {
        if (document.getElementById('tiny-vertical-video-styles')) return;
        
        const buttonFontSize = getButtonFontSize();
        const buttonPadding = getButtonPadding();
        const buttonCircleSize = getButtonCircleSize();
        
        const css = `
/* TinyVerticalVideo Widget CSS - Final Enhanced */
.vertical-video.vertical-video {
    position: ${config.widgetStyle === 'fixed' ? 'relative' : 'fixed'} !important;
    width: ${config.videoWidth}px !important;
    height: ${videoHeight}px !important;
    border-radius: 25px !important;
    overflow: hidden !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
    margin: ${config.widgetStyle === 'fixed' ? '20px auto' : '0'} !important;
    border: none !important;
    background: #000 !important;
    padding: 0 !important;
    ${config.widgetStyle === 'floating' ? getFloatingPosition() : ''}
    z-index: ${config.widgetStyle === 'floating' ? '998' : 'auto'} !important;
}

.vertical-video video,
.vertical-video iframe,
.vertical-video .vjs-tech,
.vertical-video .vjs-poster {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    border-radius: 25px !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
}

.vertical-video .hosted-video-thumbnail {
    height: 100% !important;
}

.vertical-video .video-js,
.vertical-video .vjs-default-skin {
    width: 100% !important;
    height: 100% !important;
    border-radius: 25px !important;
    border: none !important;
    background: #000 !important;
    padding: 0 !important;
    margin: 0 !important;
}

.vertical-video > div,
.vertical-video .vjs-tech {
    padding: 0 !important;
    margin: 0 !important;
}

.vertical-video .vjs-control-bar {
    background: rgba(0, 0, 0, 0.7) !important;
    border-radius: 0 0 25px 25px !important;
    border: none !important;
    margin: 0 !important;
}

.tvv-play-button {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    z-index: 100 !important;
    transition: all 0.3s ease !important;
    pointer-events: auto !important;
}

.tvv-play-button:hover {
    transform: translate(-50%, -50%) scale(1.1) !important;
}

.tvv-play-button .play-icon {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)) !important;
}

.tvv-play-button.hidden {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

/* Responsive Overlay Buttons */
.tvv-overlay-buttons {
    position: absolute !important;
    bottom: 15px !important;
    left: 15px !important;
    right: 15px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    z-index: 101 !important;
    pointer-events: none !important;
}

.tvv-overlay-button {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    background: rgba(0, 0, 0, 0.8) !important;
    border: 2px solid transparent !important;
    border-radius: 25px !important;
    padding: ${buttonPadding} !important;
    color: white !important;
    text-decoration: none !important;
    font-size: ${buttonFontSize}px !important;
    font-weight: 500 !important;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px) !important;
    pointer-events: auto !important;
}

.tvv-overlay-button:hover {
    border-color: ${config.avatarColor} !important;
    background: rgba(0, 0, 0, 0.9) !important;
    transform: translateY(-2px) !important;
}

.tvv-overlay-button-circle {
    width: ${buttonCircleSize}px !important;
    height: ${buttonCircleSize}px !important;
    border-radius: 50% !important;
    background: ${config.avatarColor} !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: ${Math.round(buttonCircleSize * 0.5)}px !important;
    font-weight: bold !important;
    color: white !important;
    flex-shrink: 0 !important;
}

.vertical-video video::-webkit-media-controls {
    display: none !important;
}

.vertical-video video::-webkit-media-controls-enclosure {
    display: none !important;
}

.tvv-float-cta {
    position: fixed !important;
    width: ${avatarSize} !important;
    height: ${avatarSize} !important;
    border-radius: 50% !important;
    background: ${config.avatarColor} !important;
    border: 3px solid ${config.avatarColor} !important;
    cursor: pointer !important;
    z-index: 999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 5px 20px rgba(255, 107, 53, 0.4) !important;
    transition: all 0.3s ease !important;
    overflow: hidden !important;
    pointer-events: auto !important;
    ${getAvatarPosition()}
}

.tvv-float-cta:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.6) !important;
}

.tvv-float-cta img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 50% !important;
}

.vertical-video.hidden {
    opacity: 0 !important;
    transform: scale(0.8) !important;
    pointer-events: none !important;
    transition: all 0.3s ease !important;
}

.vertical-video.visible {
    opacity: 1 !important;
    transform: scale(1) !important;
    pointer-events: auto !important;
    transition: all 0.3s ease !important;
}

.tvv-float-cta.video-hidden::after {
    content: "▶" !important;
    position: absolute !important;
    color: white !important;
    font-size: 18px !important;
    font-weight: bold !important;
    z-index: 10002 !important;
}

.tvv-float-cta.video-visible::after {
    content: "✕" !important;
    position: absolute !important;
    color: white !important;
    font-size: 16px !important;
    font-weight: bold !important;
    z-index: 10002 !important;
}

@media (max-width: 768px) {
    .vertical-video {
        width: ${Math.round(config.videoWidth * 0.8)}px !important;
        height: ${Math.round(videoHeight * 0.8)}px !important;
        margin: 10px auto !important;
    }
    
    .tvv-overlay-button {
        font-size: ${Math.max(10, buttonFontSize - 1)}px !important;
        padding: 6px 12px !important;
    }
    
    .tvv-overlay-button-circle {
        width: ${Math.max(18, buttonCircleSize - 4)}px !important;
        height: ${Math.max(18, buttonCircleSize - 4)}px !important;
        font-size: ${Math.max(8, Math.round(buttonCircleSize * 0.4))}px !important;
    }
    
    .tvv-float-cta {
        width: 50px !important;
        height: 50px !important;
        bottom: 20px !important;
        right: 20px !important;
    }
    
    .tvv-float-cta.video-hidden::after {
        font-size: 14px !important;
    }
    
    .tvv-float-cta.video-visible::after {
        font-size: 12px !important;
    }
}
`;
        
        const style = document.createElement('style');
        style.id = 'tiny-vertical-video-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // Initialize the TinyVerticalVideo widget
    function initTinyVerticalVideo() {
        const verticalVideo = document.querySelector('.vertical-video');
        
        if (!verticalVideo) {
            console.log('TinyVerticalVideo: No element with .vertical-video class found');
            return;
        }
        
        console.log('TinyVerticalVideo: Initializing...');
        
        verticalVideo.classList.add('visible');
        setupVideoPlayback(verticalVideo);
        addOverlayButtons(verticalVideo);
        
        if (config.enableVideoToggle) {
            addFloatingCTA(verticalVideo);
        }
        
        console.log('TinyVerticalVideo: Initialized successfully');
    }
    
    // Setup video playback with clean play button
    function setupVideoPlayback(videoContainer) {
        const videoElement = videoContainer.querySelector('video');
        
        if (!videoElement) {
            console.log('No video element found in container');
            return;
        }
        
        const existingOverlay = videoContainer.querySelector('.tvv-text-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        videoElement.muted = config.autoplayMuted;
        videoElement.autoplay = config.autoplayMuted;
        videoElement.loop = config.loopVideo;
        videoElement.controls = false;
        
        const playButton = document.createElement('div');
        playButton.className = 'tvv-play-button';
        playButton.innerHTML = `
            <div class="play-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.9)"/>
                    <polygon points="10,8 16,12 10,16" fill="#333"/>
                </svg>
            </div>
        `;
        
        playButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            playButton.style.display = 'none';
            playButton.style.visibility = 'hidden';
            playButton.style.opacity = '0';
            playButton.classList.add('hidden');
            
            videoElement.currentTime = 0;
            videoElement.muted = false;
            videoElement.play().then(() => {
                console.log('TinyVerticalVideo: Video started with audio');
            }).catch(err => {
                console.log('TinyVerticalVideo: Video play error:', err);
            });
        });
        
        videoElement.addEventListener('pause', () => {
            if (videoElement.muted) {
                playButton.style.display = 'flex';
                playButton.style.visibility = 'visible';
                playButton.style.opacity = '1';
                playButton.classList.remove('hidden');
            }
        });
        
        videoElement.addEventListener('ended', () => {
            if (videoElement.muted) {
                playButton.style.display = 'flex';
                playButton.style.visibility = 'visible';
                playButton.style.opacity = '1';
                playButton.classList.remove('hidden');
            }
        });
        
        if (videoElement.muted) {
            playButton.style.display = 'flex';
        }
        
        videoContainer.appendChild(playButton);
    }
    
    // Add overlay buttons
    function addOverlayButtons(videoContainer) {
        if (!config.overlayButtons || config.overlayButtons.length === 0) {
            return;
        }
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'tvv-overlay-buttons';
        
        config.overlayButtons.forEach((button, index) => {
            if (index >= 3) return; // Max 3 buttons
            
            const buttonElement = document.createElement('a');
            buttonElement.className = 'tvv-overlay-button';
            buttonElement.href = button.url || '#';
            buttonElement.target = button.url ? '_blank' : '_self';
            
            buttonElement.innerHTML = `
                <div class="tvv-overlay-button-circle">${button.letter || String.fromCharCode(65 + index)}</div>
                <span>${button.text || `Button ${index + 1}`}</span>
            `;
            
            buttonElement.addEventListener('click', function(e) {
                if (!button.url || button.url === '#') {
                    e.preventDefault();
                }
            });
            
            buttonsContainer.appendChild(buttonElement);
        });
        
        videoContainer.appendChild(buttonsContainer);
    }
    
    // Add floating CTA button
    function addFloatingCTA(videoElement) {
        if (document.querySelector('.tvv-float-cta')) {
            return;
        }
        
        const floatCTA = document.createElement('div');
        floatCTA.className = 'tvv-float-cta video-visible';
        
        if (config.avatarImage && config.avatarImage.trim() !== '') {
            floatCTA.innerHTML = `<img src="${config.avatarImage}" alt="Avatar">`;
        }
        
        let videoVisible = true;
        floatCTA.addEventListener('click', function() {
            videoVisible = !videoVisible;
            
            if (videoVisible) {
                videoElement.classList.remove('hidden');
                videoElement.classList.add('visible');
                floatCTA.classList.remove('video-hidden');
                floatCTA.classList.add('video-visible');
            } else {
                videoElement.classList.remove('visible');
                videoElement.classList.add('hidden');
                floatCTA.classList.remove('video-visible');
                floatCTA.classList.add('video-hidden');
            }
        });
        
        document.body.appendChild(floatCTA);
    }
    
    // Initialize
    injectStyles();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTinyVerticalVideo);
    } else {
        initTinyVerticalVideo();
    }
    
    setTimeout(initTinyVerticalVideo, 1000);
    
})();

