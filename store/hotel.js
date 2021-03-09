import axios from 'axios';
import {Promise} from "q";

const state = {
  hotelDetail: {},
  hotelPhoto: {},
  availableRates: [],
  hotelsapiInfo: {},
  hotelInfo: {},
  availableRatesExpress: [],
  zomatoRestaurants: {},
  nearbyThingsToDo: [],
  nearbyTransit: [],
}

const mutations = {
  setHotelDetail(state, hotelDetail) {
    state.hotelDetail = hotelDetail;
  },
  setHotelPhoto(state, hotelPhoto) {
    state.hotelPhoto = hotelPhoto;
  },
  setAvailableRates(state, availableRates) {
    if (availableRates &&
      availableRates['getHotelRates.Availability'] &&
      availableRates['getHotelRates.Availability'].results &&
      availableRates['getHotelRates.Availability'].results.status == "Success" &&
      availableRates['getHotelRates.Availability'].results.hotels.length > 0)
      state.availableRates = availableRates['getHotelRates.Availability'].results.hotels[0].rates;
  },
  changeAvailableRates(state, availableRates) {
    state.availableRates = availableRates;
  },
  changeAvailableRatesData(state, data) {
    state.availableRates = state.availableRates.map(room => {
      if (room.plan_code === data.plan_code) {
        room[data.field] = data.value
      }
      return room
    })
  },
  setHotelsapiInfo(state, hotelsapiInfo) {
    state.hotelsapiInfo = hotelsapiInfo;
  },
  setHotelInfo(state, hotelInfo) {
    state.hotelInfo = hotelInfo;
  },
  setAvailableRatesExpress(state, availableRatesExpress) {
    if (availableRatesExpress &&
      availableRatesExpress['getHotelExpress.MultiContract'] &&
      availableRatesExpress['getHotelExpress.MultiContract'].results &&
      availableRatesExpress['getHotelExpress.MultiContract'].results.status == 'Success')
      state.availableRatesExpress = availableRatesExpress['getHotelExpress.MultiContract'].results;
  },
  // changeAvailableRatesExpress ( state, availableRatesExpress ) {
  //     state.availableRatesExpress = availableRatesExpress;
  // },
  changeAvailableRatesExpress(state, data) {
    state.availableRatesExpress.room_data = state.availableRatesExpress.room_data.map(room => {
      if (room.rate_plan === data.rate_plan) {
        room[data.field] = data.value
      }
      return room
    })
  },
  setZomatoRestaurants(state, zomatoRestaurants) {
    state.zomatoRestaurants = zomatoRestaurants;
  },
  setPlacesNearby(state, result) {
    state.nearbyThingsToDo = result.nearby_things_to_do.results;
    state.nearbyTransit = result.nearby_transit.results;
  },

  initHotelDetail(state) {
    state.hotelDetail = {};
  },
  initHotelPhoto(state) {
    state.hotelPhoto = {};
  },
  initAvailableRates(state) {
    state.availableRates = [];
  },
  initHotelsapiInfo(state) {
    state.hotelsapiInfo = {};
  },
  initAvailableRatesExpress(state) {
    state.availableRatesExpress = {}
  },
  initZomatoRestaurants(state) {
    state.zomatoRestaurants = []
  },
  initPlacesNearby(state) {
    state.nearbyThingsToDo = []
    state.nearbyTransit = []
  },
}

const getters = {
  basedurl(state, getters, root) {
    return process.env.baseUrl; //"https://api.traveler.co.com/v2/";
    // return "http://192.168.0.74:8000/v2/";
  }
}

const actions = {
  getHotelDetail: function ({commit, getters}, {hotel_id, lat, lng}) {
    commit('initHotelDetail');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `hotelDetail?hotel_id=${hotel_id}&city_lat=${lat}&city_lng=${lng}&client=masterclass`)
        .then(({data}) => {
          commit('setHotelDetail', data);
          resolve(data);
        }).catch((error) => {
        console.log(error);
        reject(error);
      })
    })
  },
  getHotelPhoto: function ({commit, getters}, {hotel_id}) {
    commit('initHotelPhoto');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `hotelPhoto?hotel_id=${hotel_id}`)
        .then(({data}) => {
          commit('setHotelPhoto', data);
          resolve(data);
        }).catch((error) => {
        console.log(error);
        reject(error);
      })
    })
  },

  getAvailableRates: function ({commit, getters}, {hotel_id, check_in, check_out, rooms, guests}) {
    commit('initAvailableRates');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `availableRates?hotel_id=${hotel_id}&check_in=${check_in}&check_out=${check_out}&rooms=${rooms}&guests=${guests}`)
        // axios.get(getters.basedurl+`availableRates?hotel_id=700392636&check_in=2019-04-08&check_out=2019-04-10&rooms=${rooms}&guests=${guests}`)
        .then(({data}) => {
          commit('setAvailableRates', data);
          resolve(data);
        }).catch((error) => {
        reject(error);
      })
    })
  },

  getAvailableRatesExpress: function ({commit, getters}, {ppn_bundle}) {
    commit('initAvailableRatesExpress');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `expressAvailableRates?ppn_bundle=${ppn_bundle}`)
        // axios.get(getters.basedurl+`availableRates?hotel_id=700392636&check_in=2019-04-08&check_out=2019-04-10&rooms=${rooms}&guests=${guests}`)
        .then(({data}) => {
          commit('setAvailableRatesExpress', data);
          resolve(data);
        }).catch((error) => {
        reject(error);
      })
    })
  },

  getHotelsapiInfo: function ({commit, getters}, {check_in, check_out, hotel_name, city_name, pax, currency}) {
    commit('initHotelsapiInfo');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `hotelsapiInfo?check_in=${check_in}&check_out=${check_out}&hotel_name=${encodeURIComponent(hotel_name)}&city_name=${encodeURIComponent(city_name)}&pax=${pax}&currency=${currency}`)
        .then(({data}) => {
          commit('setHotelsapiInfo', data);
          resolve(data);
        }).catch((error) => {
        reject(error);
      });
    })
  },

  getExpressBook: function ({commit, getters}, {data}) {
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `expressBook?first_name=${data.first_name}&last_name=${data.last_name}&guest_name_first=${data.guest_name_first}&guest_name_last=${data.guest_name_last}&initials=${data.initials}&phone_number=${data.phone_number}&card_type=${data.card_type}&card_number=${data.card_number}&expires=${data.expires}&cvc_code=${data.cvc_code}&address_line_one=${data.address_line_one}&city=${data.city}&state_code=${data.state_code}&country_code=${data.country_code}&postal_code=${data.postal_code}&ppn_bundle=${data.ppn_bundle}&email=${data.email}&check_in=${data.check_in}&check_out=${data.check_out}&check_in_time=${data.check_in_time}&check_out_time=${data.check_out_time}&hotel_id=${data.hotel_id}&hotel_name=${data.hotel_name}&user_id=${data.user_id}&user_email=${data.user_email}&total_charge=${data.total_charge}&description=${data.description}`)
        .then(({data}) => {
          resolve(data);
        }).catch((error) => {
        reject(error);
      });
    })
  },

  getZomatoRestaurants: function ({commit, getters}, {lat, lng}) {
    commit('initZomatoRestaurants');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `zomatoRestaurants?lat=${lat}&lng=${lng}`).then(({data}) => {
        commit('setZomatoRestaurants', data)
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    })
  },

  getPlacesNearby: function ({commit, getters}, {lat, lng}) {
    commit('initPlacesNearby');
    return new Promise((resolve, reject) => {
      axios.get(getters.basedurl + `placesNearby?lat=${lat}&lng=${lng}`).then(({data}) => {
        console.log('data:', data)
        commit('setPlacesNearby', data)
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
