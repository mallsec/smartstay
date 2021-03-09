import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import city from './city';
import hotel from './hotel';

Vue.use(Vuex)
let vuexLocalStorage = null;

if (process.browser) {
  vuexLocalStorage = new VuexPersist({
    key: 'vuex',
    storage: window.sessionStorage,
    reducer: (state) => ({hotelList: state.hotelList}),
  })
}

// setup Axios for Django CSRF
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const store = () => new Vuex.Store({
  state: {
    account: {
      authUser: {},
      isAuthenticated: false,
      jwt: null,
      reservations: []
    },
    branding: null,
    chooseRoom: {
      rooms: [],
      extras: [],
      start: null,
      isDisabled: false,
      end: null
    },
    currency: 'USD',
    mainColor: null
  },
  mutations: {
    setAuthUser(state, {
      authUser,
      isAuthenticated
    }) {
      Vue.set(state.account, 'authUser', authUser);
      Vue.set(state.account, 'isAuthenticated', isAuthenticated);
    },
    setDisabled(state, val) {
      state.chooseRoom.isDisabled = val
    },
    setBranding(state, val) {
      state.branding = val
    },
    setMainColor(state, newColor) {
      state.mainColor = newColor
    },
    changeCurrency(state, currency) {
      state.currency = currency
    },
    resetChooseRoom(state) {
      state.chooseRoom = {
        rooms: [],
        extras: [],
        start: null,
        end: null
      }
    },
    setChooseRoom(state, chooseRoom) {
      state.chooseRoom = chooseRoom
    },
    changeDate(state, payload) {
      state.chooseRoom[payload.field] = payload.date
    },
    changeExtrasQuantity(state, data) {
      state.chooseRoom.extras = state.chooseRoom.extras.map(item => {
        if (item.id === data.id) {
          item.quantity = data.value
        }
        return item
      })
    },
    changeGuests(state, value) {
      state.chooseRoom.guests = value
      let rooms = [...state.chooseRoom.rooms]
      rooms.forEach(room => {
        if (room.capacity < value) {
          room.quantity = 0
        }
      })
      state.chooseRoom.rooms = rooms
    },
    changeRoomsData(state, data) {
      state.chooseRoom.rooms = state.chooseRoom.rooms.map(room => {
        if (room.id === data.id) {
          room[data.field] = data.value
        }
        return room
      })
    },
    changeAvaliableRooms(state, rooms) {
      state.chooseRoom.rooms = rooms
    },
    changeReservations(state, reservations) {
      state.account.reservations = reservations
    },
    updateToken(state, newToken) {
      state.account.jwt = newToken;
    },
    logout(state) {
      state.account.authUser = {};
      state.account.isAuthenticated = false;
      state.account.jwt = null;
    }
  },
  actions: {
    obtainToken(context, [username, password]) {
      const payload = {
        'username': username,
        'password': password
      }

      return new Promise((resolve, reject) => {
        axios.post(process.env.obtainJWT, payload)
          .then((response) => {

            this.commit('updateToken', response.data.token);

            const base = {
              baseURL: process.env.baseUrl,
              headers: {
                Authorization: `JWT ${response.data.token}`,
                'Content-Type': 'application/json'
              },
              xhrFields: {
                withCredentials: true
              }
            }
            const axiosInstance = axios.create(base)
            axiosInstance({
              url: "/users/",
              method: "get",
              params: {}
            })
              .then((response) => {
                this.commit("setAuthUser",
                  {authUser: response.data, isAuthenticated: true}
                );
              })
              .catch((error) => {
                console.log(error)
              })

            resolve(response);

          }, (error) => {
            reject(error);
          })
      })
    },
    refreshToken() {
      const payload = {
        token: this.state.account.jwt
      }

      return new Promise((resolve, reject) => {
        axios.post(process.env.refreshJWT, payload)
          .then((response) => {
            this.commit('updateToken', response.data.token)
            resolve(response)
          })
          .catch((error) => {
            console.log(error)
            this.commit('logout')
            reject(error)
          })
      })
    },
    inspectToken() {
      return new Promise((resolve, reject) => {
        const token = this.state.account.jwt
        if (token) {
          const decoded = jwt_decode(token)
          const exp = decoded.exp
          const orig_iat = decoded.orig_iat

          if (exp - (Date.now() / 1000) < 1800 && (Date.now() / 1000) - orig_iat < 628200) {
            this.dispatch('refreshToken')
              .catch((error) => {
                reject(error);
              })
          } else if (exp - (Date.now() / 1000) > 1800) {
            // do nothing, do not refresh
          } else {
            // prompt user to re-login, this else clause covers the condition where a token is expired as well
            this.commit('logout')
          }
        }
        resolve(token)
      })
    }
  },
  plugins: process.browser ? [vuexLocalStorage.plugin] : [],
  modules: {
    city,
    hotel
  }
})

export default store
