import { createStore } from 'vuex'

export default createStore({
  state: {
    resourceId: undefined,
    currentItem: {},
    TOC: [],
    arianeDocument: undefined
  },
  mutations: {
    setResourceId (state, id) {
      state.resourceId = id
    },
    setCurrentItem (state, item) {
      state.currentItem = item
    },
    setTOC (state, toc) {
      state.TOC = toc
    },
    setArianeDocument (state, list) {
      // Remove all items from the array
      state.arianeDocument = []
      // Fill the array with the items from the payload array
      state.arianeDocument = list
    }
  }
})
