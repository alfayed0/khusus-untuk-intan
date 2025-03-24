document.addEventListener('DOMContentLoaded', function() {
    const envelope = document.getElementById('envelope');
    const card = document.getElementById('card');
    const instructions = document.getElementById('instructions');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const heartsContainer = document.querySelector('.hearts-container');
    
    // Create floating hearts
    function createHearts() {
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = Math.random() * 100 + 'vh';
            
            const size = Math.random() * 15 + 10;
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';
            
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // Auto scroll function
    function autoScroll(element, duration) {
        const start = element.scrollTop;
        const end = element.scrollHeight - element.clientHeight;
        const change = end - start;
        const startTime = performance.now();
        
        function animateScroll(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function for smooth scrolling
            const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            
            element.scrollTop = start + change * easeInOutQuad(progress);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                createConfetti();
            }
        }
        
        requestAnimationFrame(animateScroll);
    }
    
    // Handle envelope click with auto scroll
    envelope.addEventListener('click', function() {
        envelope.classList.add('open');
        document.querySelector('.front').classList.add('open');
        card.classList.add('show');
        instructions.style.display = 'none';
        
        // Start playing music
        backgroundMusic.play().catch(error => {
            console.log("Audio playback failed:", error);
        });
        
        // Add typing effect with auto scroll
        const paragraphs = document.querySelectorAll('.letter-body p:not(.signature)');
        let totalDelay = 0;
        
        paragraphs.forEach((paragraph, index) => {
            const text = paragraph.textContent;
            paragraph.textContent = '';
            
            setTimeout(() => {
                let i = 0;
                const typing = setInterval(() => {
                    if (i < text.length) {
                        paragraph.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typing);
                        
                        // Start auto scroll after last paragraph is typed
                        if (index === paragraphs.length - 1) {
                            setTimeout(() => {
                                autoScroll(card, 15000); // 15 seconds to scroll through the entire letter
                            }, 1000);
                        }
                    }
                }, 20);
            }, totalDelay);
            
            totalDelay += text.length * 20 + 500;
        });
    });
    
    // Rest of your existing code remains the same...
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.log("Audio playback failed:", error);
            });
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    function createConfetti() {
        // ... existing confetti code ...
    }
    
    function getRandomColor() {
        const colors = ['#ff80ab', '#ff4081', '#f48fb1', '#f06292', '#ec407a', '#e91e63'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Initialize
    createHearts();
});
