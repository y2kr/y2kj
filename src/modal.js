document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('.gallery-image');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.querySelector('.close');

  const style = document.createElement('style');
  style.textContent = `
    .gallery-image {
      position: relative;
    }
    .gallery-image.loading {
      min-height: 100px;
      background-color: rgba(255, 255, 255, 0.1);
    }
    .gallery-image.error {
      border: 1px solid #ff6b6b;
    }
    .loading-indicator {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
    }
  `;
  document.head.appendChild(style);

  if (images.length > 0 && modal && modalImg && closeBtn) {
    images.forEach((img) => {
      img.classList.add('loading');

      const imgLoader = new Image();

      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'loading-indicator';
      loadingIndicator.textContent = 'Loading...';
      img.parentNode.style.position = 'relative';
      img.parentNode.appendChild(loadingIndicator);

      imgLoader.onload = function () {
        img.classList.remove('loading');
        if (loadingIndicator.parentNode) {
          loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
      };

      imgLoader.onerror = function () {
        console.error(`Failed to load image: ${img.src}`);
        img.classList.remove('loading');
        img.classList.add('error');

        setTimeout(() => {
          const cacheBuster = `?cb=${new Date().getTime()}`;
          const newSrc = img.src.split('?')[0] + cacheBuster;
          img.src = newSrc;
          imgLoader.src = newSrc;
        }, 500);

        if (loadingIndicator.parentNode) {
          loadingIndicator.textContent = 'Retrying...';
        }
      };

      imgLoader.src = img.src;

      img.addEventListener('click', function () {
        if (
          !img.classList.contains('loading') &&
          !img.classList.contains('error')
        ) {
          modal.style.display = 'flex';
          modalImg.src = this.src;
          modalImg.style.width = '';
          modalImg.style.height = '';
        }
      });
    });

    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
      }
    });

    console.log('Enhanced modal functionality initialized successfully');
  } else {
    console.log('Modal elements not found on this page');
  }
});
