import {App} from '../app'
import {Auth} from '../auth/auth'
import {Rest} from '../fetch'
import {Articles, categories} from '../articles/articles'
import {isValid} from '../valid'

export class Article {

  static initForm() {
    byId('button_article')
    .addEventListener('click', openForm)
  }

  static initUpdateForm(article) {
    byId('btn_Article_Update')
    .addEventListener('click', () => {
      openUpdateForm(article)
    })
  }

}

const formHTML = `
<div class="article-form">
<form class="mui-form" id="form">
  <div class="mui-textfield mui-textfield--float-label">
    <input
    type="text"
    id="article-title-input"
    required
    minlength="9"
    maxlength="90"
    value="">
    <label for="article-title-input">Заголовок</label>
  </div>

  <div class="mui-textfield mui-textfield--float-label">
    <textarea
    type="text"
    id="article-text-input"
    required
    minlength="300"
    maxlength="2560"
    rows="11"></textarea>
    <label for="article-text-input">Текст публикации</label>
  </div>

  <div class="mui-textfield mui-textfield--float-label">
    <input
    type="text"
    id="article-img-input"
    maxlength="99"
    value="">
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
</div>
`
function setInput() {
  const arr = ['categ', 'text', 'title', 'img']
  arr.map(function(i) {
    if (i == 'text') {
      byId(`article-${i}-input`)
      .innerHTML = `${localStorage.getItem(i)?localStorage.getItem(i):""}`
    } else {
      byId(`article-${i}-input`)
      .value = `${localStorage.getItem(i)?localStorage.getItem(i):""}`
    }
    byId(`article-${i}-input`)
    .addEventListener('blur', (e) => {
      localStorage.setItem(i, e.target.value)
    })
  })
}

function byId(id) { return document.getElementById(id) }

function openForm() {
  byId('list').innerHTML = formHTML
  setCategories()
  setInput()
  byId('form')
  .addEventListener('submit', (e) => {
    e.preventDefault()
    handleForm()
  })
}

function openUpdateForm(article) {
  const article_update = article
  localStorage.setItem(`categ`, article_update.categ)
  localStorage.setItem(`title`, article_update.title)
  localStorage.setItem(`text`, article_update.text.replace(/<br>/g, "\n"))
  localStorage.setItem(`img`, article_update.img)

  byId('list').innerHTML = formHTML
  setCategories()
  setInput()
  byId('form')
  .addEventListener('submit', (e) => {
    e.preventDefault()
    handleForm(article_update)
  })
}

function setCategories() {
  let html
  for (let [key, value] of Object.entries(categories)) {
    html += `<option value="${key}">${value}</option>`
  }
  byId('article-categ-input').innerHTML = html
}

function handleForm(article_update = false) {

  let email = sessionStorage.email
  let text = byId('article-text-input').value
  let date = new Date().toJSON()
  let title = byId('article-title-input').value
  let categ = byId('article-categ-input').value
  let img = byId('article-img-input').value

  const arr = ['text', 'title', 'img']
  arr.map(function(i) {
    byId(`article-${i}-input`)
    .addEventListener('focus', (e) => {
    byId('error').innerText = ''})
  })

  if (isValid(text, 'article-text') &&
      isValid(title, 'article') &&
      isValid(img, 'article')) {
    byId('submit').disabled = true
    text = text.replace(/\n/g, "<br>")

    const article = { email, text, date, title, categ, img }

    if (article_update) {
      Rest.update(article, 'articles', article_update.id)
      .then(postPub(article))
    }
    else Rest.new(article, 'articles')
      .then(postPub(article))
  }
}

function postPub(article) {
    byId('list').innerHTML = Articles.page(article)
    localStorage.clear()
}
