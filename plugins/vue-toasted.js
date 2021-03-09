import Vue from 'vue'
import VueToasted from 'vue-toasted'

Vue.use(VueToasted, {
    iconPack : 'material',
    duration: 5000
});

let options = {
  type : 'error',
  icon : 'error_outline',
}

Vue.toasted.register('traveler_error',
  (payload) => {

    if (!payload.message) {
      return "Oops.. Something went wrong.."
    }

    return "Oops.. " + payload.message;
  },
  options
)
