import { instantiateTrelloBoardApp } from '../trello_board_app/main.js'

const AVAILABLE_VUE_APPS = {
  trelloBoardApp: 'trelloBoarApp',
  labelsApp: 'labelsApp',
  motorbikeApp: 'motorbikeApp'
}

document.addEventListener('turbolinks:load', () => {
  Object.values(AVAILABLE_VUE_APPS).forEach((item) => {
    const vueAppId = `#${item}`
    const element = document.querySelector(vueAppId)

    if (element) {
      const initialState = JSON.parse(element.dataset.initialstate)

      switch(element.id) {
        case AVAILABLE_VUE_APPS.trelloBoardApp:
          instantiateTrelloBoardApp(vueAppId, initialState);
          break;
        case AVAILABLE_VUE_APPS.labelsApp:
          console.log(AVAILABLE_VUE_APPS.labelsApp);
          break;
        case AVAILABLE_VUE_APPS.motorbikeApp:
          console.log(AVAILABLE_VUE_APPS.motorbikeApp)
        default:
          return
      }
    }
  });
});
