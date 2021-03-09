import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import VueTouch from 'vue-touch'
import Lightbox from 'vue-image-lightbox'

Vue.use(VueLazyLoad)
Vue.use(VueTouch, { name: 'v-touch' })
Vue.component('vue-gallery', Lightbox)