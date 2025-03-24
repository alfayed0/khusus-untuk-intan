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
            
            // Random position
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = Math.random() * 100 + 'vh';
            
            // Random size
            const size = Math.random() * 15 + 10;
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';
            
            // Random animation duration
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            
            // Random delay
            heart.style.animationDelay = Math.random() * 2 + 's';
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // Handle envelope click
    envelope.addEventListener('click', function() {
        envelope.classList.add('open');
        document.querySelector('.front').classList.add('open'); // Add open class to front element
        card.classList.add('show');
        instructions.style.display = 'none';
        
        // Start playing music when envelope is opened
        backgroundMusic.play();
        
        // Add typing effect to the letter
        const paragraphs = document.querySelectorAll('.letter-body p:not(.signature)');
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
                    }
                }, 20);
            }, index * 1000);
        });
    });
    
    // Handle music toggle
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Create confetti effect when signature is visible
    function checkSignatureVisibility() {
        const signature = document.querySelector('.signature');
        const rect = signature.getBoundingClientRect();
        
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            createConfetti();
            window.removeEventListener('scroll', checkSignatureVisibility);
        }
    }
    
    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.opacity = Math.random() + 0.5;
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    function getRandomColor() {
        const colors = ['#ff80ab', '#ff4081', '#f48fb1', '#f06292', '#ec407a', '#e91e63'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Add CSS for confetti animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(720deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    createHearts();
    card.addEventListener('scroll', checkSignatureVisibility);
});