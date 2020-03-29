export default(store, payload) => {
  store.state.lists = JSON.parse(payload.lists)
  store.state.labels = JSON.parse(payload.labels)
}
