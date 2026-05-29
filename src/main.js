import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions.js';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 15; // Кількість зображень на сторінці

if (searchForm) {
  searchForm.addEventListener('submit', handleSearch);
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', handleLoadMore);
}

// 1. Перший пошук (сабміт форми)
async function handleSearch(event) {
  event.preventDefault();
  
  const form = event.currentTarget;
  const userInput = form.elements['search-text'].value.trim();

  if (userInput === '') {
    iziToast.warning({
      title: 'Caution',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  query = userInput;
  page = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    // Розраховуємо загальну кількість сторінок
    const totalPages = Math.ceil(data.totalHits / perPage);

    // Перевіряємо кінець колекції вже на першій сторінці
    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
    form.reset();
  }
}

// 2. Пагінація (клік на Load more)
async function handleLoadMore() {
  page += 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    // Логіка плавного прокручування сторінки
    const galleryItem = document.querySelector('.gallery-item');
    if (galleryItem) {
      // Отримуємо висоту однієї картки
      const cardHeight = galleryItem.getBoundingClientRect().height;
      
      // Прокручуємо сторінку на дві висоти картки з плавним ефектом (smooth)
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    const totalPages = Math.ceil(data.totalHits / perPage);

    // Перевіряємо, чи дійшов користувач до кінця колекції на наступних сторінках
    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}