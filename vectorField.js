const canvas = document.getElementById('vector-field');
const ctx = canvas.getContext('2d');
let time = 0;

// Create particles
const particles = [];
const numParticles = 5000;
let particlesToAdd = numParticles;

function addParticles() {
    const particlesPerFrame = Math.ceil(particlesToAdd / 60); // Spread over approximately 1 second (60 frames)
    for (let i = 0; i < particlesPerFrame && particlesToAdd > 0; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: 0
        });
        particlesToAdd--;
    }
}

// A new noise function using a combination of sine and cosine with different frequencies
function newNoise(x, y, z) {
    return Math.sin(x * 0.03 + z * 0.02) * Math.cos(y * 0.03 - z * 0.02) + Math.sin(y * 0.01 + x * 0.01);
}

function drawVectorField() {
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    addParticles(); // Add particles gradually

    // Remove and add multiple particles per frame
    const particlesToRemove = 100; // Number of particles to remove and add per frame
    for (let i = 0; i < particlesToRemove; i++) {
        if (particles.length > 0) {
            particles.splice(Math.floor(Math.random() * particles.length), 1);
        }
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0
        });
    }

    // Update and draw particles
    particles.forEach(particle => {
        const angle = newNoise(particle.x, particle.y, time) * Math.PI * 2;
        const influence = 0.7; // Scale down the influence of the field
        particle.vx = influence * Math.cos(angle);
        particle.vy = influence * Math.sin(angle);

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    });

    time += 0.2; // Adjust the speed of the animation
    requestAnimationFrame(drawVectorField);
}

function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize to set the correct size
drawVectorField(); 