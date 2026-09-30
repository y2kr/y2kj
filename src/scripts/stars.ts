const background = document.querySelector<HTMLElement>('.star-background');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (background && !background.childElementCount) {
  const stars = document.createDocumentFragment();

  for (let index = 0; index < 160; index += 1) {
    const star = document.createElement('i');
    const size = Math.random() * 2 + 1;
    star.style.cssText = `
      --x:${Math.random() * 100}%;
      --y:${Math.random() * 100}%;
      --size:${size}px;
      --duration:${Math.random() * 4 + 3}s;
      --delay:${Math.random() * 5}s;
    `;
    if (reduceMotion) star.classList.add('still');
    stars.append(star);
  }

  background.append(stars);
}
