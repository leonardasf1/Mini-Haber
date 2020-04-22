import {Auth} from '../auth/auth'
import {App} from '../app'
import {Rest} from '../fetch'
import {Comment} from '../comments/comments'
import {Article} from './articleForm.js'

let articles

export class Articles {

    static renderArticles() {
      Rest.getLastArticles()
      .then(response => rend(response))
    }

    static setCategories() {
      let ul = ""
      for (let [key, value] of Object.entries(categories)) {
        ul += `<li><a value="${key}">${value}</a></li>`
      }
      byId('sidedrawer-categories').innerHTML = ul
      document.querySelectorAll('#sidedrawer-categories a')
      .forEach(i => i.addEventListener('click', setCategArticles))
    }

    static page(article) {
      return `
    <div id="page-article">
      <div class="page-article__title"><h3>${article.title}</h3></div>
      <div class="page-article__icon"><img src="${article.img}" alt=""></div>
      <div class="page-article__text">${article.text}</div>
      <div class="page-article__categ"><span style="float: right">${categories[article.categ]}</span></div>
      <div class="page-article__author">
        <span>${article.email.split("@")[0]}</span>
        <span>${new Date(article.date).toLocaleDateString()}</span>
        ${sessionStorage.email == article.email ?
          '<span id="btn_Article_Update">&#9998; Править</span>' : ''}
      </div>
      <h4>Комментарии</h4>
      <div id="pageComments"></div>
    </div>
    `
    }
}
function rend(response) {
    articles = App.render(response, byId('list'), toCard)
    if (response && !response.error) {
      document.querySelectorAll('.list-article')
      .forEach(i => i.addEventListener('click', toPage, true))
    }
}

function setCategArticles(e) {
    Rest.getArticlesByCateg(e)
    .then(response => rend(response))
    mui.overlay('off')
}

function byId(id) { return document.getElementById(id) }

export const categories = {
  "1": "Алгоритмы и структуры данных",
  "2": "Базы данных",
  "3": "Компьютерные сети",
  "4": "Веб",
  "5": "Обработка естественного языка",
  "6": "Мобильные приложения",
  "7": "Машинное обучение",
  "8": "Компьютерное зрение",
  "9": "Распределенные системы"
}

function toCard(article) {
    return `
    <div class="list-article">
      <div class="list-article__icon"><img src="${article.img}" alt=""></div>
      <div class="list-article__title"><h3>
        <a value="${article.id}">${article.title}</a></h3></div>
      <div class="list-article__text">${article.text}</div>
      <div><span style="float: right">${categories[article.categ]}</span></div>
    </div>
    `
}

function toPage(e) {
    let article = articles.find(
      i => i.id == e.currentTarget
      .querySelector('a')
      .getAttribute('value')
    )
    byId('list').innerHTML = Articles.page(article)
    window.scroll(0, 0)
    Comment.getLast(article.id)
    if (sessionStorage.email == article.email) {
      Article.initUpdateForm(article)
    }
}
