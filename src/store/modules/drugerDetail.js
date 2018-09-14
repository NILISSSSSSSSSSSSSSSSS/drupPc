const druger = {
    state: {
        drugerCardId: ''
    },
    mutations: {
        setDrugerCardId(state, id) {
            state.drugerCardId = id;
        }
    },
    getters: {
        drugerCardId: (state) => state.drugerCardId
    }
};

export default druger;