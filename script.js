document.addEventListener('DOMContentLoaded', () => {
    const balloonContainer = document.getElementById('balloon-container');
    const balloonsLeftSpan = document.getElementById('balloons-left');
    const gameOverlay = document.getElementById('game-overlay');
    const mainContent = document.getElementById('main-content');

    let balloonsPopped = 0;
    const totalBalloons = 5;
    const colors = ['#e57373', '#64b5f6', '#81c784', '#fff176', '#ba68c8'];

    // --- Balloon Game Logic ---
    function createBalloons() {
        for (let i = 0; i < totalBalloons; i++) {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');

            const left = Math.random() * 80 + 10;
            const top = Math.random() * 60 + 20;

            balloon.style.left = `${left}%`;
            balloon.style.top = `${top}%`;

            const color = colors[i % colors.length];
            balloon.style.backgroundColor = color;

            balloon.style.animationDelay = `${Math.random() * 2}s`;

            balloon.addEventListener('click', () => popBalloon(balloon));

            balloonContainer.appendChild(balloon);
        }
    }

    function popBalloon(balloon) {
        if (balloon.classList.contains('popped')) return;

        balloon.classList.add('popped');
        balloonsPopped++;
        balloonsLeftSpan.textContent = totalBalloons - balloonsPopped;

        setTimeout(() => {
            balloon.remove();
        }, 300);

        if (balloonsPopped === totalBalloons) {
            revealWebsite();
        }
    }

    function revealWebsite() {
        setTimeout(() => {
            gameOverlay.classList.add('fade-out');
            mainContent.classList.remove('hidden');
            startConfetti(); // Trigger confetti
            observeElements(); // Start scroll animations
        }, 500);
    }

    createBalloons();

    // --- Scroll Animation Logic ---
    function observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // --- Simple Confetti Logic ---
    function startConfetti() {
        const canvas = document.getElementById('confetti');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 150;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 5 + 5,
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 5 - 2
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let activeParticles = 0;

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                if (p.y < canvas.height) {
                    activeParticles++;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (activeParticles > 0) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clean up
            }
        }

        animate();
    }
});
