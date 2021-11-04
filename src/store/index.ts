import { createStore, createLogger } from 'vuex'
// import UserModule from './user'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    // UserModule
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})