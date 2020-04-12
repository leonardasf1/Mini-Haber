import {Auth} from '../auth/auth'
import {App} from '../app'
import {Rest} from '../fetch'
import {isValid} from '../valid'

let articleId;

export class Comment {

	static getLast(id) {
		articleId = id
		Rest.getCommentsByArticle(id)
    .then(response => {
    	if (response == null) {
    		byId('pageComments')
    		.innerHTML = '<div class="mui-container-fluid">Комментариев пока нет</div>'
    	} else renderList(response)})
    .then(() => {
        if (sessionStorage.timer < Date.now()) Auth.logout()
    else if (sessionStorage.idToken) { Comment.renderForm() }
    })
	}
  static setSideComments() {
  	Rest.getCommentsByDate()
    .then(response => {
    	// let arr
    	function template(comment) {
	    	return `
	    	<li><a value="${comment.articleId}">
			    ${comment.text.substr(0,30)}...</a></li>`
			}
    	App.render(response, byId('sidedrawer-comments'), template)
    	if (response && !response.error) {
	    	document.querySelectorAll('#sidedrawer-comments a')
	    	.forEach(i => i.addEventListener('click', {}))
	  	}
  	})
  }
	static renderForm() {
		byId('page-article')
    .insertAdjacentHTML('beforeend', commentForm)
    byId('comment-form')
    .addEventListener('submit', handleForm)
    // byId('comment-text-input')
    // .addEventListener('input', () => {
    //   byId('comment-submit')
    //   .disabled = !isValid(byId('comment-text-input').value)
    // })
  }

}

function byId(id) { return document.getElementById(id) }

function renderList(response) {
	// let comments
	App.render(response, byId('pageComments'), template)
}

function template(comment) {
	return `
	<li>
		<div class="mui--divider-bottom">${comment.text}</div>
		${comment.email.split("@")[0]}
		${new Date(comment.date).toLocaleDateString()}
	</li>`
}

const commentForm = `
<form class="mui-form" id="comment-form">
  <div class="mui-textfield mui-textfield--float-label">
    <textarea id="comment-text-input" minlength="9" maxlength="256"></textarea>
    <label for="comment-text-input">Оставить комментарий</label>
  	<div class="error" id="error"></div>
  </div>
  <button
   id="comment-submit"
   type="submit"
   class="mui-btn mui-btn--raised mui-btn--primary"
   > Отправить</button>
</form>
`

function handleForm(e) {
	e.preventDefault()
  let email = sessionStorage.email
  let text = byId('comment-text-input').value.trim()
  let date = new Date().toJSON()
  byId('comment-text-input').addEventListener('focus', () => {
  	byId('error').innerText = ''
  })
  if (isValid(text, 'comment')) {
    const comment = { email, text, date, articleId }
    byId('comment-submit').disabled = true
    Rest.new(comment, 'comments')
    .then(response => {
    	comment.id = response.name
    	byId('comment-text-input').value = 'Комментарий отправлен'
    	getMyNewComment(comment)
    })
  }
}

// function create(comment) {
//   return fetch(`https://podcast-questions-ap.firebaseio.com/comments.json?auth=${sessionStorage.idToken}`, {
//     method: 'POST',
//     body: JSON.stringify(comment),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
// }

function getMyNewComment(comment) {
	byId('pageComments')
  .insertAdjacentHTML('beforeend', template(comment))
}