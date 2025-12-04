let lastTime = 0;
const particleInterval = 50;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    
    const currentTime = Date.now();
    if (currentTime - lastTime < particleInterval) return;
    lastTime = currentTime;

    const particle = document.createElement('div');
    particle.className = 'trail';
    
    const size = 15 + Math.random() * 10;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    const sizeOffset = size / 2;
    const offsetX = (Math.random() - 0.5) * 20; 
    const offsetY = (Math.random() - 0.5) * 20;

    particle.style.left = (e.clientX - sizeOffset + offsetX) + 'px';
    particle.style.top = (e.clientY - sizeOffset + offsetY) + 'px';
    
    const rotation = Math.random() * 360;
    particle.style.setProperty('--rotation', `${rotation}deg`);
    
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1500);
});
