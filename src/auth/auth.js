import {loginHTML, signupHTML} from './html'
import {App} from '../app'
import {Rest} from '../fetch'
import {Comment} from '../comments/comments'
import {isValidAuth} from '../valid'

function byId(id) { return document.getElementById(id) }

export class Auth {

  static init() {
    byId('button_login').addEventListener('click', openModalLogin)
    byId('button_signup').addEventListener('click', openModalSignup)
    if (sessionStorage.timer < Date.now()) Auth.logout()
    else if (sessionStorage.idToken) setBtnSession()
  }

  static logout() {
    sessionStorage.clear()
    byId('button_login').style.display = 'inline'
    byId('button_logout').style.display = 'none'
    byId('button_article').style.display = 'none'
  }

}

export function openModalLogin() {
  App.createModal(loginHTML, 'block__content')

  byId('login-form')
  .addEventListener('submit', loginFormHandler)

	byId('a_signup')
	.addEventListener('click', function(e) {
		openModalSignup()
	})
}

function openModalSignup() {
  App.createModal(signupHTML, 'block__content')

  byId('signup-form')
  .addEventListener('submit', signupFormHandler)

	byId('a_login')
	.addEventListener('click', function(e) {
		openModalLogin()
	})
}

function loginFormHandler(event) {
  event.preventDefault()
  let email = byId('email')
  let password = byId('password')

  if (isValidAuth(email.value, 'email') &&
      isValidAuth(password.value, 'password')) {

    const btn = event.target.querySelector('button')
    btn.disabled = true

    Rest.auth(email.value, password.value, 'signInWithPassword')
    .then(data => {
    	btn.disabled = false
    	if (data.error) {
      	if (data.error.message == 'EMAIL_NOT_FOUND') {
      		errorHandler(email, 'Такого аккаунта нет')
      	} else if (data.error.message == 'INVALID_PASSWORD') {
      		errorHandler(password, 'Неверный пароль')
      	} else { errorHandler(email, data.error.message) }
      } else if (data.registered) {
      	sessionStorage.setItem("idToken", data.idToken)
      	sessionStorage.setItem("email", data.email)
        sessionStorage.setItem("timer", Date.now() + data.expiresIn * 1000)
        mui.overlay('off')
        if (byId('page-article') && !byId('comment-form')) Comment.renderForm()
        setBtnSession()
      }
    })
  }
}

function setBtnSession() {
  byId('button_login').style.display = 'none'
  byId('button_signup').style.display = 'none'
  document.querySelector('#button_logout > strong').innerHTML = `
    Выйти <span style="float: right; color: #3196f3">${sessionStorage.email.split("@")[0]}</span>`
  byId('button_logout').style.display = 'inline'
  byId('button_logout').addEventListener('click', Auth.logout)
  byId('button_article').style.display = 'inline'
}

function errorHandler(item, text) {
  item.previousElementSibling.innerText = text
  item.addEventListener('change', () => {
    item.previousElementSibling.innerText = ''
  })
}

function signupFormHandler(e) {
  e.preventDefault()
  let email = byId('signEmail').value
  let pas = byId('pas').value
  let pas2 = byId('pas2').value
  let tel = byId('tel').value
  let name = byId('name').value
  if (isValidAuth(email, 'email') &&
      isValidAuth(pas, 'pas') &&
      isValidAuth(pas2, 'pas2') &&
      isValidAuth(tel, 'tel') &&
      isValidAuth(name, 'name'))
  Rest.auth(
  	email,
  	pas,
    'signUp')
  .then(data => {
  	if (data.error) {
    	if (data.error.message == 'EMAIL_EXISTS') {
    		errorHandler(byId('signEmail'), 'Email уже используется!')
    	} else if (data.error.message == 'OPERATION_NOT_ALLOWED') {
    		errorHandler(byId('pas'), data.error.message)
    	} else { errorHandler(byId('signEmail'), data.error.message) }
    } else {
      mui.overlay('off')
      byId('button_signup').style.display = 'none'
    }
  })
}