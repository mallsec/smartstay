import Vue from 'vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'

import {
    faBus, faCar, faMapMarker,
    faPhone, faBed, faKey, faBan,
    faTrophy, faBicycle, faPaw, faTimes, faSpinner,
    faChevronCircleLeft, faPlay, faSearch, faLock, faWifi, faCheck, faCoffee, faLongArrowAltRight, faHandPointRight
} from '@fortawesome/fontawesome-free-solid'
import {
    faFacebookF, faTwitter, faLinkedinIn, faTripadvisor
} from '@fortawesome/fontawesome-free-brands'
fontawesome.library.add(
    faBus, faCar, faMapMarker,
    faPhone, faBed, faKey, faBan, faTimes, faSpinner,
    faTrophy, faBicycle, faPaw, faSearch, faLock, faWifi, faCheck, faCoffee, faHandPointRight, faLongArrowAltRight,
    faChevronCircleLeft, faPlay, faFacebookF, faTwitter, faLinkedinIn, faTripadvisor)
Vue.component('f-a', FontAwesomeIcon)