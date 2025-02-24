document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('.gallery-image');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.querySelector('.close');

  if (images.length > 0 && modal && modalImg && closeBtn) {
    images.forEach((img) => {
      img.addEventListener('click', function () {
        modal.style.display = 'flex';
        modalImg.src = this.src;

        modalImg.style.width = '';
        modalImg.style.height = '';
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

    console.log('Modal functionality initialized successfully');
  } else {
    console.log('Modal elements not found on this page');
  }
});
