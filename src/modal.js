// Get all gallery images
const images = document.querySelectorAll('.gallery-image');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close');

// Add click event to all images
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
