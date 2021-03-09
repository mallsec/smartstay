import axios from 'axios';

const state = {
  hotelList: [],
  cityInfo: {},
  cityList: []
}

const mutations = {
  setHotelList(state, hotelList) {
    state.hotelList = hotelList;
  },
  setCityInfo(state, cityInfo) {
    state.cityInfo = cityInfo;
  },
  setCityList(state, cityList) {
    state.cityList = cityList
  },

  initHotelList(state) {
    state.hotelList = [];
  },
  initCityInfo(state) {
    state.cityInfo = {};
  },
  initCityList(state) {
    state.cityList = []
  }
}

const getters = {
  basedurl(state, getters, root) {
    return process.env.baseUrl;
  },
  getJWTToken(state, getters, root) {
    const payload = {
      token: root.account.jwt
    };
    return new Promise((resolve, reject) => {
      axios.post(process.env.refreshJWT, payload)
        .then((response) => {
          resolve(response.data.token)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    });
    return;
  }
}

const actions = {
  getHotelList: function ({commit, getters}, {city_id, city_name, check_in, check_out, quary_string = '', quantity = '', page = ''}) {
    commit('initHotelList');
    return new Promise((resolve, reject) => {
      const url = getters.basedurl + `hotellist?city_name=${city_name}&city_id=${city_id}&check_in=${check_in}&check_out=${check_out}&quary_string=${quary_string}&quantity=${quantity}&page=${page}`;
      getters.getJWTToken
        .then((token) => {
          commit('updateToken', token, {root: true});
          axios.get(url, {headers: {Authorization: `JWT ${token}`}})
            .then(({data}) => {
              commit('setHotelList', data);
              resolve(data);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            })
        })
        .catch((error) => {
          commit('logout', null, {root: true})
        });
    })
  },

  getCityInfo: function ({commit, getters, dispatch}, {city_name, state, country_code, check_in, check_out, quary_string = '', quantity = '', page = ''}) {
    commit('initCityInfo');
    return new Promise((resolve, reject) => {
      if (country_code === 'US') {
        axios.get(getters.basedurl + `cityInfo?city_name=${city_name}&state=${state}`)
          .then(({data}) => {
            dispatch('getHotelList', {
              city_id: data.cityid_ppn,
              city_name: city_name,
              check_in: check_in,
              check_out: check_out,
              quary_string: quary_string,
              quantity: quantity,
              page: page
            }).then(data1 => {
              resolve(data);
            }).catch(err1 => {
              reject(err1);
            });
            commit('setCityInfo', data);
          }).catch((error) => {
          console.log(error);
          reject(error);
        })
      } else {
        axios.get(getters.basedurl + `cityInfo?city_name=${city_name}&country=${state}`)
          .then(({data}) => {
            dispatch('getHotelList', {
              city_id: data.cityid_ppn,
              city_name: city_name,
              check_in: check_in,
              check_out: check_out,
              quary_string: quary_string,
              quantity: quantity,
              page: page
            }).then(data1 => {
              resolve(data);
            }).catch(err1 => {
              reject(err1);
            });
            commit('setCityInfo', data);
          }).catch((error) => {
          console.log(error);
          reject(error);
        })
      }
    })
  },

  getCityList: function ({commit, getters, dispatch}, {}) {
    commit('initCityList');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + 'cityList')
        .then(({data}) => {
          commit('setCityList', data);
          resolve(data);
        }).catch((error) => {
        reject(error);
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
