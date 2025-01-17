function createStars() {
  const star_background = document.createElement('div');
  star_background.className = 'star-background';
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
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
    });

    star_background.appendChild(star);
    stars.push(star);
  }

  requestAnimationFrame(() => {
    stars.forEach((star) => star.classList.add('visible'));

    setTimeout(() => {
      stars.forEach((star) => star.classList.add('animate'));
    }, 300);
  });
}

document.addEventListener('DOMContentLoaded', createStars);
