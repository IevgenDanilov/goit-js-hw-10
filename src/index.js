import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import {fetchCountries} from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

// створення об'єкту посилань
const refs = {
  searchBox: document.querySelector ('#search-box'),
  countryList: document.querySelector ('.country-list'),
  countryInfo: document.querySelector ('.country-info'),
  body: document.body,
};

// Оголошення функції очищення вмісту сторінки
function clearPage () {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

// Оголошення функції рендеру
function renderCountriesList (countries) {
  // Очищення попередніх результатів
  clearPage ();

  // Рендерування відповідно до заданих умов
  switch (true) {
    case countries.length > 10:
      return Notiflix.Notify.info (
        'Too many matches found. Please enter a more specific name.'
      );

    case countries.length === 1:
      // Деструктуризація даних об'єкту країна
      const {name, capital, population, flag, languages} = countries[0];

      // Створення списку мов країни
      let languagesList = languages.map (language => {
        return ` ${language.name}`;
      });

      let countryMarkup = `<p><img class="flag-picture" src="${flag}" alt="flag of country" height=40px><b style = "font-size:50px;"> ${name}</b></p>
      <p><b>capital</b>: ${capital}</p>
      <p><b>population</b>: ${population}</p>
      <p><b>languages</b>: ${languagesList} </p>`;
      refs.countryInfo.insertAdjacentHTML("beforeend", countryMarkup);

      break;

    case countries.length > 1 && countries.length < 10:
      let countriesMarkup = countries
        .map (country => {
          return `<li>
      <p><img class="flag-picture" src="${country.flag}" alt="flag of country" height=20px> ${country.name}</p>
        </li>`;
        })
        .join ('');

      refs.countryList.insertAdjacentHTML("beforeend", countriesMarkup);

      break;

    default:
      clearPage ();
  }
}

// Встановлюємо слухача на вхідні дані пошукового блоку
refs.searchBox.addEventListener (
  'input',
  debounce (countriesInputHandler, DEBOUNCE_DELAY)
);

function countriesInputHandler () {
  let country = refs.searchBox.value.trim ();

  // Якщо інпут пустий, то очищуємо вміст сторінки
  if (refs.searchBox.value === '') {
    clearPage ();
  } else {
    // Якщо введено дані, то робимо запит на сервер
    fetchCountries (country)
      .then (countries => renderCountriesList (countries))
      .catch (error => {
        clearPage ();
        Notiflix.Notify.failure ('Oops, there is no country with that name');
      });
  }
}
