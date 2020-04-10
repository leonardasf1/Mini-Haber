export const loginHTML = `
  <form class="form" id="login-form">
    <div class="form__group">
      <h3>Вход</h3>
      <div class="row">
        <div class="mui-textfield mui-textfield--float-label">
          <span class="error"></span>
    		  <input type="email" id="email" required>
    		  <label for="email">Введите почту</label>
    		</div>
        <div class="mui-textfield mui-textfield--float-label">
          <span class="error"></span>
          <input type="password" required id="password">
      		<label for="password">Введите пароль</label>
        </div>
      </div>
    </div>
    <div class="form__group">
      <button type="submit" class="mui-btn--primary">Войти</button>
    </div>
    <br /><p>Ещё нет аккаунта? <a id="a_signup">Зарегистрируйтесь</a></p>
  </form>
  `

export const signupHTML = `
<form class="form" id="signup-form">
  <div class="form__group">
  	<h3>Регистрация</h3>
    <div class="row">
      <div class="mui-textfield mui-textfield--float-label">
        <span class="error"></span>
        <input type="text" required name="name" value="" id="name">
    		<label for="name">Имя</label>
      </div>
      <div class="mui-textfield mui-textfield--float-label">
        <span class="error"></span>
        <input type="email" required name="email" value="" id="signEmail">
    		<label for="email">Электронный адрес</label>
      </div>
      <div class="mui-textfield mui-textfield--float-label">
        <span class="error"></span>
        <input type="password" required name="password" id="pas">
    		<label for="password">Придумайте пароль</label>
      </div>
      <div class="mui-textfield mui-textfield--float-label">
        <span class="error"></span>
        <input type="password" required name="password_2" id="pas2">
    		<label for="password_2">Повторите пароль</label>
      </div>
      <div class="mui-textfield mui-textfield--float-label">
        <span class="error"></span>
        <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="tel" id="tel">
    		<label for="tel">Номер мобильного телефона</label>
      </div>
    </div>
  </div>
  <div class="form__comment">
    <button type="submit" id="do_signup">Зарегистрироваться</button>
    <div>Уже есть аккаунт? <a id="a_login">Войти</a></div>
    Нажимая кнопку «Зарегистрироваться»:
    <div>
      <input name="agreement" type="checkbox" required checked>
      Я принимаю 
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Условия использования</a> 
      и даю своё согласие на обработку моей персональной информации на условиях, определенных 
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.
    </div>
  </div>
</form>
`