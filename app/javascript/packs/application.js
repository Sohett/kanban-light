import "bootstrap";
import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks'
import TrelloBoardApp from '../trello_board/trello_board_app.vue'
import TextareaAutosize from 'vue-textarea-autosize'
import store from '../trello_board/store'

Vue.use(TextareaAutosize)
Vue.use(TurbolinksAdapter)

Vue.prototype.$eventBus = new Vue()

Vue.component('trelloboardapp', TrelloBoardApp)

document.addEventListener('turbolinks:load', () => {  
  const app = new Vue({
    el: '[data-behavior="vue"]',
    store
  })
});
