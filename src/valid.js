import {Auth, openModalLogin} from './auth/auth'

export function isValid(value, form) {
	if (
		value.includes('<') ||
		value.includes('>') ||
		value.includes("'")) {
		innerError('Некорректные символы')
		return false
	}
	if (form == 'article-text' &&
		(value.length < 300 || value.length > 2560)) {
		innerError('Мало или слишком много текста')
  	return false
	}
	else if ((form == 'comment' || form == 'article') &&
		(value.length < 9 || value.length > 256)) {
		innerError('Мало или слишком много символов')
		return false
	}
	else if (form == 'comment' || form == 'article') {
		if (sessionStorage.timer < Date.now() ) {
			innerError('<a id="a_login">Войдите</a> чтобы продолжить')
			byId('a_login')
			.addEventListener('click', function(e) {
				openModalLogin()
			})
			Auth.logout();
			return false
		}	else return true
	}
	else return true
}

function byId(id) { return document.getElementById(id) }

function innerError(answer) {
	byId('error').innerHTML = `${answer}! &emsp;`
}
export function validAuth(e) {
  if (!e.target.value && e.target.name != 'tel') {
    errorHandler(e.target, 'Заполните поле')
  } else if (e.target.name == 'password_2') {
    if (e.target.value != byId('pas').value) {
      errorHandler(e.target, 'Пароль не совпадает')
    }
  } else if (
		e.target.value.includes('<') ||
		e.target.value.includes('>') ||
		e.target.value.includes('=') ||
		e.target.value.includes("'")) {
  	errorHandler(e.target, 'Некорректные символы')
  } else if (e.target.name == 'tel' &&
  	e.target.value.length > 18) {
  	errorHandler(e.target, 'Ограничение 18 символов')
  	//для международных вызовов на коммутаторах ограничение 18
  } else if (
  	e.target.name != 'tel' &&
  	(e.target.value.length < 9 ||
  	e.target.value.length > 29)) {
  	errorHandler(e.target, 'Ограничение 9-29 символов')
  }
}
export function isValidAuth(value, form) {
	if (
		value.includes('<') ||
		value.includes('>') ||
		value.includes('=') ||
		value.includes("'")) { return false
	} else if (form != 'tel' &&
		(value.length < 9 || value.length > 25)) {
		return false
	} else if (form == 'tel' && value.length > 18) {
		return false
	} else return true
}
function errorHandler(item, text) {
  item.previousElementSibling.innerText = text
  item.addEventListener('change', () => {
    item.previousElementSibling.innerText = ''
  })
}
