import "bootstrap";
import Vue from 'vue/dist/vue.esm'
import TurbolinksAdapter from 'vue-turbolinks'
import App from './app.vue'
import TextareaAutosize from 'vue-textarea-autosize'
import store from './store'
import initializeState from './store/initializeAppStore'

Vue.use(TextareaAutosize)
Vue.use(TurbolinksAdapter)

export const instantiateTrelloBoardApp = (element_id, payload) => {
  initializeState(store, payload)
  Vue.prototype.$eventBus = new Vue()

  const app = new Vue({
    el: element_id,
    store,
    render: h => h(App)
  })
}
