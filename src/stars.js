// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  createStars();
});

function createStars() {
  // Check if star-background already exists to avoid duplicates
  if (document.querySelector('.star-background')) {
    return;
  }

  const star_background = document.createElement('div');
  star_background.className = 'star-background';
  star_background.style.position = 'fixed';
  star_background.style.top = '0';
  star_background.style.left = '0';
  star_background.style.width = '100%';
  star_background.style.height = '100%';
  star_background.style.zIndex = '-1';
  star_background.style.pointerEvents = 'none';
  document.body.prepend(star_background);

  const numStars = 200;
  const stars = [];

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 5;

    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);

    Object.assign(star.style, {
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: 'white',
      borderRadius: '50%',
      opacity: '0',
      transition: 'opacity 0.3s ease',
    });

    star_background.appendChild(star);
    stars.push(star);
  }

  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    stars.forEach((star) => {
      star.classList.add('visible');
      star.style.opacity = '0.3';
    });

    setTimeout(() => {
      stars.forEach((star) => {
        star.classList.add('animate');
        // Apply animation directly if needed
        star.style.animation = `twinkle var(--duration) infinite var(--delay)`;
      });
    }, 300);
  });

  console.log('Stars created successfully');
}
