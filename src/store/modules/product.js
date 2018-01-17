import shop from '@/service/api'
import * as types from '../types'

// export const types = {
// }

// initial state
const states = {
  all: [],
}

// getters
const getters = {
  allProducts: state => state.all,
}

// actions
const actions = {
  getAllProducts ({ commit }) {
    shop.getProducts((products) => {
      commit(types.RECEIVE_PRODUCTS, { products })
    })
  },
}

// mutations
const mutations = {
  [types.RECEIVE_PRODUCTS] (state, { products }) {
    state.all = products
  },

  [types.ADD_TO_CART] (state, { id }) {
    state.all.find(p => p.id === id).inventory--
  },
}

export default {
  state: states,
  getters,
  actions,
  mutations,
}
