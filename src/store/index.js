import {createStore} from 'vuex';

export default createStore({
    state: {
        resourceId: undefined,
        currentItem: {},
        TOC: [],
    },
    mutations: {
        setResourceId(state, id) {
            state.resourceId = id;
        },
        setCurrentItem(state, item) {
            state.currentItem = item;
        },
        setTOC(state, toc) {
            state.TOC = toc;
        }
    },
});