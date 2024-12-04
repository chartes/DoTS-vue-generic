import {createStore} from 'vuex';

export default createStore({
    state: {
        resourceId: undefined,
        currentItem: {}
    },
    mutations: {
        setResourceId(state, id) {
            state.resourceId = id;
        },
        setCurrentItem(state, item) {
            state.currentItem = item;
        }
    },
});