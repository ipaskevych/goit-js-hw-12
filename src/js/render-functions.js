import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import "pure-css-loader/dist/css-loader.css";

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more'); // Ищем нашу будущую кнопку

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Добавляем разметку в конец контейнера, не стирая старое
export function createGallery(images) {
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes</b><span>${likes}</span></p>
        <p class="info-item"><b>Views</b><span>${views}</span></p>
        <p class="info-item"><b>Comments</b><span>${comments}</span></p>
        <p class="info-item"><b>Downloads</b><span>${downloads}</span></p>
      </div>
    </li>
  `
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  if (galleryContainer) galleryContainer.innerHTML = '';
}

export function showLoader() {
  if (loader) loader.classList.add('is-active');
}

export function hideLoader() {
  if (loader) loader.classList.remove('is-active');
}

// Новые функции управления кнопкой Load More через класс hidden
export function showLoadMoreButton() {
  if (loadMoreBtn) loadMoreBtn.classList.remove('hidden');
}

export function hideLoadMoreButton() {
  if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
}