import initialState from './initialState'
import { ADD_LIST, REMOVE_LIST } from './constants'

export default {
  namespaced: true,
  state: {},
  mutations: {
    [ADD_LIST](state, data) {
      state.lists.push(data);
    },
    [REMOVE_LIST](state, data) {
      const index = state.lists.findIndex(item => item.id == data)
      state.lists.splice(index, 1)
    },
    addCardToList(state, data) {
      const index = state.lists.findIndex(list => list.id == data.list_id)
      state.lists[index].cards.push(data)
    },
    saveCard(state, data) {
      const list_index = state.lists.findIndex((item) => item.id == data.list_id);
      const card_index = state.lists[list_index].cards.findIndex((item) => item.id == data.id);
      state.lists[list_index].cards.splice(card_index, 1, data);
    },
    removeCardFromList(state, data) {
      const list_index = state.lists.findIndex((item) => item.id == data.list_id);
      const card_index = state.lists[list_index].cards.findIndex((item) => item.id == data.card_id);
      state.lists[list_index].cards.splice(card_index, 1);
    },
    removeLabelfromCard(state, data) {
      const list_index = state.lists.findIndex((item) => item.id == this.list_id);
      const card_index = state.lists[list_index].cards.findIndex((item) => item.id == this.id);
      state.lists[list_index].cards[card_index].labels = data.labels;
    }
  },
  actions: {
    async save ({ state, commit }, data) {
      return user.update(data)
    }
  }
}
