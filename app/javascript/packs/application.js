import "bootstrap";
import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks'
import App from '../app.vue'
import TextareaAutosize from 'vue-textarea-autosize'

Vue.use(TextareaAutosize)

Vue.use(TurbolinksAdapter)

window.store = {}

document.addEventListener('turbolinks:load', () => {
  var element = document.querySelector("#boards")
  if (element != undefined ) {
    window.store.lists = JSON.parse(element.dataset.lists)
    window.store.labels = JSON.parse(element.dataset.labels)
    Vue.prototype.$eventBus = new Vue()
    const app = new Vue({
      el: element,
      data: window.store,
      template: "<App :original_lists='lists' />",
      components: { App }
    })
  }
});
