import {Articles} from './articles/articles'
import {Article} from './articles/articleForm'
import {Auth} from './auth/auth'
import {Comment} from './comments/comments'
import {validAuth} from './valid'
import './style.css'
import './auth/style.css'
import './articles/style.css'

window.addEventListener('load', function() {
    Articles.renderArticles()
    Auth.init()
    Articles.setCategories()
    Comment.setSideComments()
    Article.initForm()
})

export class App {

  static createModal(template, className) {
      mui.overlay('off')
      const modal = document.createElement('div')
      modal.classList.add(className)
      modal.innerHTML = template
      mui.overlay('on', modal)
      document.querySelectorAll('.form__group input').forEach(function(i) {
        i.addEventListener('blur', validAuth)
      })
  }

  static handleError(response, where) {
      if (response.error == "Auth token is expired") {
          Auth.logout()
      } else { where.innerHTML = `<p class="error">${response.error}</p>` }
  }

  static render(response, where, template) {
      if (response && response.error) {
          App.handleError(response, where)
      } else {
      let arr = response ? Object.keys(response)
      .map(key => ({ ...response[key], id: key })) : []

      where.innerHTML = arr.map(template).join('')
      return arr
      }
  }

}

jQuery(function($) {
  var $bodyEl = $('body'),
      $sidedrawerEl = $('#sidedrawer');
  // ==========================================================================
  // Toggle Sidedrawer
  // ==========================================================================
  function showSidedrawer() {
    // show overlay
    var options = {
      onclose: function() {
        $sidedrawerEl
          .removeClass('active')
          .appendTo(document.body);
      }
    };

    var $overlayEl = $(mui.overlay('on', options));

    // show element
    $sidedrawerEl.appendTo($overlayEl);
    setTimeout(function() {
      $sidedrawerEl.addClass('active');
    }, 20);
  }


  function hideSidedrawer() {
    $bodyEl.toggleClass('hide-sidedrawer');
  }
  $('.js-show-sidedrawer').on('click', showSidedrawer);
  $('.js-hide-sidedrawer').on('click', hideSidedrawer);
  // ==========================================================================
  // Animate menu
  // ==========================================================================
  var $titleEls = $('strong', $sidedrawerEl);

  $titleEls
    .next()
    .hide();

  $titleEls.on('click', function() {
    $(this).next().slideToggle(200);
  });
});