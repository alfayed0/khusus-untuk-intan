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
        backgroundMusic.play().catch(error => {
            console.log("Audio playback failed: ", error);
        });
        
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
        
        // Show comment section after letter is opened
        setTimeout(() => {
            const commentSection = document.createElement('div');
            commentSection.className = 'comment-section';
            commentSection.innerHTML = `
                <h2>Tinggalkan Pesan untuk Intan</h2>
                
                <!-- Login Form -->
                <div id="login-form" class="login-container">
                    <input type="text" id="username" placeholder="Username">
                    <input type="password" id="password" placeholder="Password">
                    <button id="login-btn">Login</button>
                    <p class="login-message"></p>
                </div>
                
                <!-- Comment Form (Hidden until login) -->
                <div id="comment-form" class="comment-form hidden">
                    <textarea id="comment-text" placeholder="Tulis pesan kamu di sini..."></textarea>
                    <button id="submit-comment">Kirim Pesan</button>
                    <button id="logout-btn">Logout</button>
                </div>
                
                <!-- Comments Display -->
                <div class="comments-container">
                    <h3>Pesan-pesan untuk Intan</h3>
                    <div id="comments-list"></div>
                </div>
            `;
            
            document.querySelector('.container').appendChild(commentSection);
            
            // Initialize comment system
            initCommentSystem();
        }, paragraphs.length * 1000 + 2000);
    });
    
    // Handle music toggle
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.log("Audio playback failed: ", error);
            });
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
        
        /* Comment Section Styling */
        .comment-section {
            max-width: 90%;
            margin: 50px auto;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .comment-section h2 {
            color: #ff4081;
            text-align: center;
            font-family: 'Dancing Script', cursive;
            font-size: 2rem;
            margin-bottom: 20px;
        }
        
        .login-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .login-container input {
            padding: 10px;
            border: 1px solid #ffb6c1;
            border-radius: 5px;
            font-family: 'Poppins', sans-serif;
        }
        
        .login-container input:focus {
            outline: none;
            border-color: #ff4081;
        }
        
        #login-btn, #submit-comment, #logout-btn {
            background-color: #ff80ab;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            transition: background-color 0.3s;
        }
        
        #login-btn:hover, #submit-comment:hover, #logout-btn:hover {
            background-color: #ff4081;
        }
        
        .login-message {
            color: #ff4081;
            font-size: 0.9rem;
            text-align: center;
            margin-top: 5px;
        }
        
        .comment-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .comment-form textarea {
            padding: 10px;
            border: 1px solid #ffb6c1;
            border-radius: 5px;
            height: 100px;
            resize: vertical;
            font-family: 'Poppins', sans-serif;
        }
        
        .comment-form textarea:focus {
            outline: none;
            border-color: #ff4081;
        }
        
        .comments-container {
            margin-top: 30px;
        }
        
        .comments-container h3 {
            color: #ff4081;
            font-family: 'Dancing Script', cursive;
            font-size: 1.5rem;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .comment {
            background-color: #fff5f8;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .comment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .comment-author {
            font-weight: bold;
            color: #ff4081;
        }
        
        .comment-date {
            font-size: 0.8rem;
            color: #888;
        }
        
        .comment-content {
            color: #555;
            line-height: 1.4;
        }
        
        .hidden {
            display: none;
        }
        
        #logout-btn {
            background-color: #f48fb1;
        }
        
        .no-comments {
            text-align: center;
            color: #888;
            font-style: italic;
        }
        
        @media (max-width: 768px) {
            .comment-section {
                max-width: 95%;
                padding: 15px;
            }
            
            .comment-section h2 {
                font-size: 1.5rem;
            }
            
            .comments-container h3 {
                font-size: 1.2rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    createHearts();
    card.addEventListener('scroll', checkSignatureVisibility);
    
    // Comment System
    function initCommentSystem() {
        const loginForm = document.getElementById('login-form');
        const commentForm = document.getElementById('comment-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const loginMessage = document.querySelector('.login-message');
        const commentText = document.getElementById('comment-text');
        const submitComment = document.getElementById('submit-comment');
        const commentsList = document.getElementById('comments-list');
        
        // Simple user credentials (in a real app, this would be server-side)
        const users = [
            { username: 'user1', password: 'password1' },
            { username: 'user2', password: 'password2' },
            { username: 'intan', password: 'intan123' },
            { username: 'alfayed', password: 'alfayed123' }
        ];
        
        // Comments storage
        let comments = [];
        
        // Check if user is already logged in (from localStorage)
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            loginForm.classList.add('hidden');
            commentForm.classList.remove('hidden');
        }
        
        // Handle login
        loginBtn.addEventListener('click', function() {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            if (!username || !password) {
                loginMessage.textContent = 'Silakan isi username dan password';
                return;
            }
            
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', username);
                loginForm.classList.add('hidden');
                commentForm.classList.remove('hidden');
                loginMessage.textContent = '';
                usernameInput.value = '';
                passwordInput.value = '';
            } else {
                loginMessage.textContent = 'Username atau password salah';
            }
        });
        
        // Handle logout
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            commentForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
        
        // Handle comment submission
        submitComment.addEventListener('click', function() {
            const commentContent = commentText.value.trim();
            const username = localStorage.getItem('currentUser');
            
            if (!commentContent) {
                return;
            }
            
            if (!username) {
                commentForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                return;
            }
            
            const newComment = {
                author: username,
                content: commentContent,
                date: new Date().toLocaleString()
            };
            
            // In a real app, this would be sent to a server
            comments.push(newComment);
            localStorage.setItem('comments', JSON.stringify(comments));
            
            displayComments();
            commentText.value = '';
            
            // Add a little heart animation when comment is posted
            createHeartBurst();
        });
        
        // Display comments
        function displayComments() {
            // Load comments from localStorage
            const savedComments = localStorage.getItem('comments');
            if (savedComments) {
                comments = JSON.parse(savedComments);
            }
            
            commentsList.innerHTML = '';
            
            if (comments.length === 0) {
                commentsList.innerHTML = '<p class="no-comments">Belum ada pesan. Jadilah yang pertama!</p>';
                return;
            }
            
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                `;
                
                commentsList.appendChild(commentElement);
            });
        }
        
        // Create heart burst animation when comment is posted
        function createHeartBurst() {
            for (let i = 0; i < 10; i++) {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                
                // Position near the comment button
                const rect = submitComment.getBoundingClientRect();
                heart.style.left = (rect.left + rect.width/2) + 'px';
                heart.style.top = (rect.top + window.scrollY) + 'px';
                
                // Random size
                const size = Math.random() * 15 + 10;
                heart.style.width = size + 'px';
                heart.style.height = size + 'px';
                
                // Random animation
                heart.style.anim
