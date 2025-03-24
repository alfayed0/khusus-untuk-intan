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
    
    // Database functionality for comments and login
    const DB = {
        // Initialize the database
        init: function() {
            // Initialize users if not exists
            if (!localStorage.getItem('users')) {
                const defaultUsers = [
                    { username: 'user1', password: 'password1' },
                    { username: 'user2', password: 'password2' },
                    { username: 'intan', password: 'intan123' },
                    { username: 'alfayed', password: 'alfayed123' }
                ];
                localStorage.setItem('users', JSON.stringify(defaultUsers));
            }
            
            // Initialize comments if not exists
            if (!localStorage.getItem('comments')) {
                localStorage.setItem('comments', JSON.stringify([]));
            }
            
            // Create comment section
            this.createCommentSection();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Display existing comments
            this.displayComments();
            
            // Check if user is already logged in
            this.checkLoginStatus();
        },
        
        // Create comment section HTML
        createCommentSection: function() {
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
                    <p>Belum punya akun? <a href="#" id="register-link">Daftar di sini</a></p>
                </div>
                
                <!-- Register Form (Hidden by default) -->
                <div id="register-form" class="login-container hidden">
                    <input type="text" id="new-username" placeholder="Username Baru">
                    <input type="password" id="new-password" placeholder="Password Baru">
                    <input type="password" id="confirm-password" placeholder="Konfirmasi Password">
                    <button id="register-btn">Daftar</button>
                    <p class="register-message"></p>
                    <p>Sudah punya akun? <a href="#" id="login-link">Login di sini</a></p>
                </div>
                
                <!-- Comment Form (Hidden until login) -->
                <div id="comment-form" class="comment-form hidden">
                    <p>Logged in as: <span id="logged-user"></span></p>
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
            
            // Add comment section after the letter container
            document.querySelector('.container').after(commentSection);
            
            // Add CSS for comment section
            const commentStyle = document.createElement('style');
            commentStyle.textContent = `
                .comment-section {
                    max-width: 600px;
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
                
                .login-container, .comment-form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .login-container input, .comment-form textarea {
                    padding: 10px;
                    border: 1px solid #ffb6c1;
                    border-radius: 5px;
                    font-family: 'Poppins', sans-serif;
                }
                
                .login-container input:focus, .comment-form textarea:focus {
                    outline: none;
                    border-color: #ff4081;
                }
                
                #login-btn, #register-btn, #submit-comment, #logout-btn {
                    background-color: #ff80ab;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: 'Poppins', sans-serif;
                    transition: background-color 0.3s;
                }
                
                #login-btn:hover, #register-btn:hover, #submit-comment:hover, #logout-btn:hover {
                    background-color: #ff4081;
                }
                
                .login-message, .register-message {
                    color: #ff4081;
                    font-size: 0.9rem;
                    text-align: center;
                    margin-top: 5px;
                }
                
                .comment-form textarea {
                    height: 100px;
                    resize: vertical;
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
                
                a {
                    color: #ff4081;
                    text-decoration: none;
                }
                
                a:hover {
                    text-decoration: underline;
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
            document.head.appendChild(commentStyle);
        },
        
        // Setup event listeners for comment system
        setupEventListeners: function() {
            // Login form
            document.getElementById('login-btn').addEventListener('click', () => {
                this.login();
            });
            
            // Register link
            document.getElementById('register-link').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('register-form').classList.remove('hidden');
            });
            
            // Login link
            document.getElementById('login-link').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('register-form').classList.add('hidden');
                document.getElementById('login-form').classList.remove('hidden');
            });
            
            // Register form
            document.getElementById('register-btn').addEventListener('click', () => {
                this.register();
            });
            
            // Logout button
            document.getElementById('logout-btn').addEventListener('click', () => {
                this.logout();
            });
            
            // Submit comment
            document.getElementById('submit-comment').addEventListener('click', () => {
                this.addComment();
            });
        },
        
        // Check if user is already logged in
        checkLoginStatus: function() {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('register-form').classList.add('hidden');
                document.getElementById('comment-form').classList.remove('hidden');
                document.getElementById('logged-user').textContent = currentUser;
            }
        },
        
        // Login function
        login: function() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginMessage = document.querySelector('.login-message');
            
            if (!username || !password) {
                loginMessage.textContent = 'Silakan isi username dan password';
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', username);
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('comment-form').classList.remove('hidden');
                document.getElementById('logged-user').textContent = username;
                loginMessage.textContent = '';
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            } else {
                loginMessage.textContent = 'Username atau password salah';
            }
        },
        
        // Register function
        register: function() {
            const newUsername = document.getElementById('new-username').value.trim();
            const newPassword = document.getElementById('new-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const registerMessage = 
