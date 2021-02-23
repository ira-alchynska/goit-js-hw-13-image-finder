import PixabayService from './js/apiService';
import hitsTemplate from './templates/templates.hbs';
import { onOpenModal } from './js/modal';
import showNotification from './js/notification';
import refs from './js/refs';
import './styles.css';

const pixabayService = new PixabayService();

refs.searchForm.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', onOpenModal);

function onSearch(e) {
  e.preventDefault();

  pixabayService.query = e.currentTarget.elements.query.value;

  if (pixabayService.query === '') {
    showNotification();
  }

  pixabayService.resetPage();
  clearHits();

  pixabayService.fetchHits().then(hits => {
    appendHitsMarkup(hits);
    pixabayService.incrementPage();
  });
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', hitsTemplate(hits));
}

function clearHits() {
  refs.gallery.innerHTML = '';
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayService.query !== '') {
      pixabayService.fetchHits().then(hits => {
        appendHitsMarkup(hits);
        pixabayService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.scroll);
