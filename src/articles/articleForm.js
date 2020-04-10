import {App} from '../app'
import {Auth} from '../auth/auth'
import {Rest} from '../fetch'
import {Articles, categories} from '../articles/articles'
import {isValid} from '../valid'

export class Article {

  static initForm() {
    byId('button_article').addEventListener('click', openForm)
  }

}

const formHTML = `
<form class="mui-form" id="form">
  <div class="mui-textfield mui-textfield--float-label">
    <input type="text" id="article-title-input" required maxlength="90">
    <label for="article-title-input">Заголовок</label>
  </div>
  <div class="mui-textfield mui-textfield--float-label">
    <textarea id="article-text-input" required minlength="300" rows="11"></textarea>
    <label for="article-text-input">Текст публикации</label>
  </div>
  <div class="mui-textfield mui-textfield--float-label">
    <input type="text" id="article-img-input" maxlength="99">
    <label for="article-img-input">Адрес картинки</label>
  </div>
  <div class="mui-select">
    <select id="article-categ-input">
    </select>
    <label>Выберите категорию</label>
  </div>
  <button
   id="submit"
   type="submit"
   class="mui-btn mui-btn--raised mui-btn--primary"
   > Опубликовать</button>
  <div class="error" id="error"></div>
</form>
`

function byId(id) { return document.getElementById(id) }

function openForm() {
  if (sessionStorage.timer < Date.now()) Auth.logout()
  else if (sessionStorage.idToken) {
    App.createModal(formHTML, 'article-form')
    setCategories()
    byId('form').addEventListener('submit', handleForm)
    // byId('article-text-input').addEventListener('input', () => {
    //   byId('submit').disabled = !isValid(byId('article-text-input').value)
    // })
  }
}

function setCategories() {
  let html
  for (let [key, value] of Object.entries(categories)) {
    html += `<option value="${key}">${value}</option>`
  }
  byId('article-categ-input').innerHTML = html
}

function handleForm(event) {
  event.preventDefault()
  let email = sessionStorage.email
  let text = byId('article-text-input').value.trim()
  let date = new Date().toJSON()
  let title = byId('article-title-input').value
  let categ = byId('article-categ-input').value
  let img = byId('article-img-input').value
  byId('article-text-input').addEventListener('focus', () => {
    byId('error').innerText = ''})
  byId('article-title-input').addEventListener('focus', () => {
    byId('error').innerText = ''})
  byId('article-img-input').addEventListener('focus', () => {
    byId('error').innerText = ''})

  if (isValid(text, 'article-text') &&
      isValid(title, 'article') &&
      isValid(img, 'article')) {
    const article = { email, text, date, title, categ, img }
    byId('submit').disabled = true
    Rest.new(article, 'articles').then(() => {
      mui.overlay('off')
    })
  }
}

// function create(article) {
//   return fetch(`https://podcast-questions-ap.firebaseio.com/articles.json?auth=${sessionStorage.idToken}`, {
//     method: 'POST',
//     body: JSON.stringify(article),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
  // .then(response => {
  //   article.id = response.name
  // })
// }