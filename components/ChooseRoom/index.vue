<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div @click.self="closeModal()" class="flex justify-center sm:items-center max-h-full sm:px-container md:px-container sm:py-container">
          <div class="w-200 max-w-full sm:rounded bg-white sm:bg-alternate -translate-y transition-transform-slow modal-box" :class="slide">
            <div class="modal--header">


              <template v-if='!isCheckout'>
                <div class="modal--header-left">
                  <span @click="closeModal()"  class="close-arrow mb-show">
                    <svg data-name="Layer 1" viewBox="0 0 31.6 22.1"><g fill="$ffffff"><path d="M10.3.3a1.1 1.1 0 0 1 1.5 0 1.1 1.1 0 0 1 0 1.6l-8 8.1h26.6a1.1 1.1 0 1 1 .2 2.2H3.8l8 8a1.1 1.1 0 0 1 0 1.6 1.1 1.1 0 0 1-1.6 0l-9.9-10a1.1 1.1 0 0 1 0-1.5z"/></g></svg>
                  </span>
                  <button class='mb-hide'  @click="slide = 'rooms'" :class="{ 'active' : slide === 'rooms' }">Choose Room</button>
                  <template v-if='event.tickets.length > 0'>
                    <f-a  class='mb-hide' icon="long-arrow-alt-right" />
                    <button  class='mb-hide' @click="toNextSlide()" :class="{ 'active' : slide === 'extras' }">Admission & Extras</button>
                  </template>
                </div>
                <span class="mb-show" style="color: white;">{{slideToText}}</span>
                <div class="modal--header-right">
                  <button  @click='toNextSlide()'>
                    <span class="mb-hide">Payment information</span>
                    <svg data-name="Layer 1" viewBox="0 0 31.6 22.1"><g fill="#ffffff"><path d="M31.3 10.3a1.1 1.1 0 0 1 0 1.6l-10 9.9a1.1 1.1 0 0 1-1.5 0 1.1 1.1 0 0 1 0-1.6l8-8H1a1.1 1.1 0 1 1 .2-2.2h26.5l-8-8a1.1 1.1 0 0 1 0-1.6 1.1 1.1 0 0 1 1.6 0z"/></g></svg>
                  </button>
                </div>
              </template>


              <template v-else-if='slide === "checkout"'>
                <div class="modal--header-right">
                  <button @click="slide = 'rooms'">
                    <span style='top: 1px;margin-left: 20px'>Choose Room</span>
                  </button>
                </div>
              </template>


              <template v-if='slide === "confirm"'>
                <div></div>
                <div v-if='slide === "confirm"' class="modal--header-right">
                  <a target="_blank" :href='event.backToClientUrl'>
                    <span>Go to event</span>
                    <svg  viewBox="0 0 44.236 44.236"><g fill="#989898"><path d="M22.118 44.236C9.922 44.236 0 34.314 0 22.118S9.922 0 22.118 0s22.118 9.922 22.118 22.118-9.922 22.118-22.118 22.118zm0-42.736C10.75 1.5 1.5 10.749 1.5 22.118c0 11.368 9.25 20.618 20.618 20.618 11.37 0 20.618-9.25 20.618-20.618 0-11.369-9.248-20.618-20.618-20.618z"/><path d="M19.341 29.884a.75.75 0 0 1-.53-1.281l6.796-6.804-6.796-6.803a.75.75 0 1 1 1.061-1.061l7.325 7.333a.75.75 0 0 1 0 1.061l-7.325 7.333a.742.742 0 0 1-.531.222z"/></g></svg>
                  </a>
                </div>
              </template>


            </div>
            <div class="modal--body" :style='(slide === "confirm" || slide === "checkout") && pageWidth > 600 ? "height: calc(100% - 44px)" : ""'>
              <div class="modal--row modal--body-top sm:bg-alternate sm-after:bg-alternate" v-if='!isCheckout' style="border-bottom: 1px solid rgba(255, 255, 255, 0.2); margin-left: -10px; margin-right: -10px;">
                <div class="modal--body-info">
                  <h2 class="modal--body-title  mb-hide">
                    <img src="../../assets/img/icons8-bed.svg" alt="">
                    {{ hotel.name }}
                  </h2>
                  <span class="modal--body-item modal--body-item_selected" @click='checkOverflow()'>
                    {{ chooseRoom.start | moment("DD MMM")}} - {{ chooseRoom.end | moment("DD MMM") }}
                    <HotelDatePicker
                    @checkInChanged='changeStartDate'
                    @checkOutChanged='changeEndDate'
                    @showDatepicker='checkOverflow(true)'
                    @hideDatepicker='checkOverflow()'
                    format="DD/MM/YYYY"
                    :startingDateValue='chooseRoom.start'
                    :endingDateValue='chooseRoom.end'
                    :startDate='chooseRoom.minDay'
                    :endDate='chooseRoom.maxDay'
                    />
                  </span>
                  <span @click.self='showDropdown = !showDropdown' class="modal--body-item guests">{{chooseRoom.guests}} Guest{{chooseRoom.guests > 1 ? 's' : ''}}
                    <div class="dropdown" v-if='showDropdown'>
                      <span v-for='val in maxGuests' :key="val" @click='changeGuests(val)'>{{val}} Guest{{val > 1 ? 's' : ''}}</span>
                    </div>
                  </span>
                </div>
                <div class="modal--body-logo mb-hide" >
                  <img :src="`${event.branding.aws_url}${event.branding.dark_logo}`" style='vertiacl-align:middle;max-height: 22px;width: auto' alt="">
                </div>
              </div>
              <transition name="slide-fade">
                <Rooms :minRate='minRate' :discount='discount' :strangeRate='strangeRate' :hotel='hotel' v-show='slide === "rooms"' />
              </transition>
              <transition name="slide-fade">
                <Extras
                 :banner='event.home'
                 @showBanner='showBanner = true'
                 v-show='slide === "extras"'/>
              </transition>
              <transition name="slide-fade">
                <Checkout
                  @tryAgain='slide = "checkout"'
                  :slide='slide'
                  :hotel='hotel'
                  :event='event'
                  :discount='discount'
                  @confirm='slide = "confirm"'
                  v-if='isCheckout'/>
              </transition>
            </div>
            <div class="modal--row modal--footer" v-if='!isCheckout' style="min-height: 87px;">
              <p class="text-error" v-if='showError'>Amount of rooms should be greater than 0</p>
              <div>
                <div style="display: flex; flex-direction: column; justify-content: center;">
                  <h5 v-if="isFiniteNumber(discount)">Save {{discount}}% at this official hotel.</h5>
                </div>
              </div>
              <button v-if='(slide === "room" && event.tickets.length === 0) || slide === "extras"' class="sm\:h-11 checkout-button border-black-20 bg-primary text-white mb-hide" @click='toNextSlide()'>
                Secure Checkout
                <svg viewBox="0 0 32 32" version="1.1" width="20px" height="20px">
                  <g id="surface1">
                    <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z "/>
                  </g>
                </svg>
              </button>
              <button class="sm\:h-11 checkout-button border-black-20 bg-primary text-white mb-hide" v-else @click='toNextSlide()'>
                Continue
              </button>
            </div>
          </div>
          <div class="sticky-buttons mb-show">
            <template v-if='slide === "rooms" || slide === "extras"'>
              <button v-if='(slide === "rooms" && event.tickets.length === 0) || slide === "extras"' class="bg-primary   text-white checkout-button" @click='toNextSlide()'>
                Secure Checkout
                <svg viewBox="0 0 32 32" version="1.1" width="20px" height="20px">
                  <g id="surface1">
                    <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z "/>
                  </g>
                </svg>
              </button>
              <button class="bg-primary text-white checkout-button  " v-else @click='toNextSlide()'>
                Continue
              </button>
            </template>
            <button v-else-if='slide==="checkout"'  :class='{"disable": chooseRoom.isDisabled}' :disabled='chooseRoom.isDisabled'  class="bg-primary text-white " @click='$emit("checkout")'>Complete Booking <f-a icon='spinner' v-if='chooseRoom.isDisabled' class='fa-spin'/></button>
          </div>
        </div>
      </div>
      <Slider
       :image='event.home.backgroundImage'
       v-if='showBanner'
       @close='showBanner = false' />
    </div>
  </transition>
</template>
<script>
import axios from 'axios'
import HotelDatePicker from 'vue-hotel-datepicker'
import Extras from './Extras'
import Slider from '../ModalPicture'
import Rooms from './Rooms'
import Checkout from './Checkout'
export default {
  data() {
    return {
      slide: 'rooms',
      showBanner: false,
      showError: false,
      showDropdown: false,
      pageWidth: 0
    }
  },
  props: {
    'minRate': [Number, String],
    'strangeRate': [Number, String],
    'hotel': {
      type: Object,
      required: true,
      default: {}
    },
    'discount': [Number, String],
    'event': {
      type: Object,
      required: true,
      default: {}
    }
  },
  methods: {
    isFiniteNumber(value) {
      return typeof Number.isFinite === 'function'
        ? Number.isFinite(value)
        : (() => {
          // 1. If Type(number) is not Number, return false.
          if (typeof value !== 'number') {
            return false
          }
          // 2. If number is NaN, +∞, or −∞, return false.
          if (value !== value || value === Infinity || value === -Infinity) {
            return false
          }
          // 3. Otherwise, return true.
          return true
        })()
    },
    checkOverflow (overflow) {
      if (window.screen.width < 769) {
        if (overflow) {
          document.querySelectorAll('.modal-box')[0].classList.add('overflow-hidden')
        } else {
          document.querySelectorAll('.modal-box')[0].classList.remove('overflow-hidden')
        }
      }
    },
    changeGuests (value) {
      this.$store.commit('changeGuests', value)
      this.showDropdown = false
    },
    changeStartDate (start) {
      this.$store.commit('changeDate', {
        field: 'start',
        date: start
      })

    },
    changeEndDate (end) {
      this.$store.commit('changeDate', {
        field: 'end',
        date: end
      })
      var makeQuery = function(obj) {
        var str = []
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
            }
        }
        return str.join("&")
      }
      if (end !== null) {
        this.slide = 'rooms'
        let newDateQuery = this.$route.query
        newDateQuery.checkin = `${this.chooseRoom.start.getFullYear()}${this.chooseRoom.start.getMonth() + 1}${this.chooseRoom.start.getDate()}`
        newDateQuery.checkout = `${end.getFullYear()}${end.getMonth() + 1}${end.getDate()}`
        let queryString = makeQuery(newDateQuery)
        axios.get(`https://api.smartstay.com/v2/hotel/${this.$route.params.id}/?${queryString}`).then(resp => {
          let rooms = resp.data[0].rooms
          rooms.sort((a, b) => parseFloat(a.total_price) - parseFloat(b.total_price))
          rooms.forEach((room, index) => {
            room.quantity = index === 0 ? 1 : '0'
            room.first_name = ''
            room.last_name = ''
            room.email = ''
          })
          this.$store.commit('changeAvaliableRooms', rooms)
          if (resp.data[0].rooms.length === 0) {
            alert('Sorry, the dates requested are not available. Our rates are for festivals or event days only, we recommend booking other dates directly with the hotel.')
          }
        })
      }
    },
    closeModal(event) {
      this.$store.commit('resetChooseRoom')
      this.$emit('close')
    },
    toNextSlide (toExtra) {
      if (this.slide === 'extras') {
        this.slide = 'checkout'
        return true
      }
      this.showError = false
      let isEmpty = false
      let quantity = 0
      this.$store.state.chooseRoom.rooms.forEach((room, index) => {
        let roomQuan = Number(room.quantity)
        quantity += roomQuan
      })
      if (this.chooseRoom.end === null) {
        let end = new Date(this.chooseRoom.start)
        end.setDate(end.getDate() + 1)
        this.$store.commit('changeDate', {
          field: 'end',
          date: end
        })
      }
      if (quantity === 0) {
        this.showError = true
      }
      if (!isEmpty && quantity !== 0) {
        if (this.event.tickets.length > 0) {
          this.slide = 'extras'
        } else {
          this.slide = 'checkout'
        }
      }
    }
  },
  components: {
    Slider,
    HotelDatePicker,
    Extras,
    Checkout,
    Rooms
  },
  created () {
    window.onresize = () => {
      this.pageWidth = document.body.clientWidth
    }
    let rooms = this.hotel.rooms
    rooms.forEach((room, index) => {
      room.quantity = index === 0 ? 1 : '0'
      room.first_name = ''
      room.last_name = ''
      room.email = ''
      room.first_name_error = false
      room.last_name_error = false
      room.email_error = false
    })
    let extras = this.event.tickets
    extras.forEach(extra => {
      extra.quantity = 0
    })
    let maxRate = Math.max(this.hotel.booking_com_sug_rate, this.hotel.expedia_sug_rate)
    let minRate = null
    rooms.forEach(room => {
      if (room.rate / 100 < minRate || minRate === null) {
        minRate = room.rate / 100
      }
    })
    let start = new Date(this.hotel.rooms[0].checkin_date)
    start.setMinutes(start.getMinutes() + start.getTimezoneOffset())
    let end = new Date(this.hotel.rooms[0].checkout_date)
    end.setMinutes(end.getMinutes() + end.getTimezoneOffset())
    let minDay = new Date(this.hotel.rooms[0].checkin_date)
    let maxDay = new Date(this.hotel.rooms[0].checkout_date)
    minDay.setDate(minDay.getDate() - 15)
    maxDay.setDate(maxDay.getDate() + 15)
    this.date = [new Date(this.hotel.rooms[0].checkin_date), new Date(this.hotel.rooms[0].checkout_date)]
    this.$store.commit('setChooseRoom', {
      rooms,
      extras,
      guests: this.$route.query.guests || 1,
      start,
      end,
      isDisabled: false,
      minDay,
      maxDay
    })
  },
  computed: {
    slideToText () {
      if (this.slide === 'rooms') {
        return 'Choose room'
      } else if (this.slide === 'extras') {
        return 'Choose admission'
      }
      return ''
    },
    isCheckout () {
      return this.slide === "checkout" || this.slide === "confirm"
    },
    chooseRoom () {
      return this.$store.state.chooseRoom
    },
    maxGuests () {
      let capacity = []
      let rooms = this.chooseRoom.rooms
      rooms.forEach(room => capacity.push(room.capacity))
      return Math.max(...capacity)
    }
  }
}
</script>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;

  @media (max-width: 600px) {
    height: 100vh;
  }

  &::-webkit-scrollbar{
    width: 0;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding-left: 10px;
    background-image: url('../../assets/img/select-icon.png');
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: 100% center;

		@media (max-width: 768px) {
			background-image: url('../../assets/img/select-icon-white.png');
		}
  }

  .datepicker__inner {
    padding: 0;
  }

  input {
    overflow: hidden;

    &.border-error {
      border: 1px solid #cc0000!important;
    }
  }

  .text-error {
    color: #cc0000;
  }

  .datepicker__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 134px;
    height: 28px;
    background: none;

    .datepicker__clear-button {
      display: none;
    }
    .datepicker__dummy-wrapper {
      opacity: 0;
    }
    .datepicker__dummy-input {
      cursor: pointer;
    }
  }

}

.modal-wrapper {
  // display: table-cell;
  position: absolute;
  width: 100%;
  top: 5%;
  bottom: 5%;
  -ms-overflow-style: none;
  overflow: auto;
  // vertical-align: middle;

  @media (min-width: 600px) {
    overflow: hidden;

    &>div {
      height: 100%;
      align-items: flex-start;
    }
  }
}
.modal-wrapper::-webkit-scrollbar
 { width: 0; }


.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.text-error {
  color: #cc0000!important;
  width: 100%;
}

.modal-default-button {
  float: right;
}

.modal-box {
  max-height: calc(100vh - 40px);
  max-width: 100vw;
  width: 885px;
  overflow: auto;
  margin-top: 20px;
  padding-bottom: 10px;
  position: relative;

  @media (min-width: 600px) {
    overflow: hidden;

    &.checkout {
      .modal--body {
        max-height: calc(90vh - 50px);
      }
    }
  }
 }

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transition: all, 5s ease;
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

// slide transition
.slide-fade-enter-active {
  transition: all .4s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.modal {
  &--header {
    padding: 12px 16px 9px 60px;
    border-bottom: 2px solid #eeeeee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    &.checkout {
      padding-left: 16px;

      .modal--header-left {
        svg {
          width: 23px;
          transform: rotate(180deg);
          height: auto;
          margin-left: 11px;

          path {
            fill: rgb(152, 152, 152);
          }
        }
      }
    }

     a, button {
	    font-size: 13px;
      color: #989898;
      display: block;
      white-space: nowrap;
      transition: all .22s ease;
      outline: none;
      &.active,
      &:active,
      &:hover {
        color: #5cb718;
      }
      &:focuse {
        text-decoration: underline;
      }
    }
    &-left {
      width: 16px;
      height: 16px;
      display: flex;
      svg {
        display: inline-block;
        vertical-align: middle;
        margin: 0 17px;
        path {
          fill: #dfdfdf;
        }
      }
    }
    &-right {
      button, a {
        svg {
          width: 15px;
          height: auto;
          margin-left: 11px;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  &--row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &--body {
    padding: 17px 47px;
    overflow: auto;

    @media (min-width: 600px) {
      max-height: calc(90vh - 150px);
    }

    &::-webkit-scrollbar{
      width: 0;
    }

    &-top {
      padding-bottom: 25px;
      &_border {
        border-bottom: 2px solid #eaeaea;
        margin-bottom: 20px;
      }
    }
    &-title {
      padding-right: 10px;
      font-size: 24px;
      color: #343434;
      margin-bottom: 6px;
      img {
        width: 27px;
        position: relative;
        top: 5px;
      }
    }
    &-subtitle {
      color: #b8b8b8;
      font-size: 20px;
      margin: 30px 0 22px;
    }
    &-item {
      font-size: 15px;
      color: #8c8c8c;
      padding: 7px 9px 5px;
      line-height: 1;
      border-radius: 4px;
      border: 1px solid #dae0e4;
      user-select: none;
      display: inline-block;
      font-weight: 400;
      margin-left: 9px;
      &_selected {
        color: #fff;
        background-color: #298de9;
        border-color: #1b73c1;
      }
    }
    &-group {
      width: 100%;
      border: 2px solid #efefef;
      border-radius: 5px;
      padding: 0;
      list-style: none;
      li {
        padding: 25px;
        &:not(:last-child) {
          border-bottom: 2px solid #efefef;
        }
      }
      h4 {
        color: #2c2c2c;
        font-size: 18px;
      }
      p {
        color: #808080;
        font-size: 13px;
      }
    }
    .lineupBtn {
      text-transform: uppercase;
      font-size: 13px;
      color: #298de9;
      &:hover {
        text-decoration: underline;
      }
    }
    select {
      width: 50px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #efefef;
      margin-left: 10px;
    }
    .price {
      font-size: 20px;
    }
  }
  &--footer {
    padding: 0px 45px;
    background: #fff;
    border-top: 2px solid #efefef;
    flex-wrap: wrap;
    justify-content: center;
    & > div {
      flex: 1;
      margin: 20px 20px 20px 0;
      min-width: 50%;
    }
    h5 {
      font-size: 18px;
      font-weight: normal;
      color: #21c640;
    }
    p {
      font-size: 13px;
      color: #898989;
    }
    button {
      background-color: #63c61a;
      color: white;
      padding: 11px 40px 10px;
      line-height: 1;
      border-radius: 4px;
      font-weight: 400;
      font-size: 16px;
      border: 1px solid rgba(0, 0, 0, .2);
      transition: all .22s ease;
      white-space: nowrap;
      height: 44px;
      max-width: 16.25rem;
      width: 100%;

      &:hover {
        background-color: #58af17;
      }
      svg {
        margin-left: 8px;
        vertical-align: middle;
        position: relative;
        top: -1px;
        path {
          fill: white;
        }
      }
    }
  }
  &--room {
    width: 100%;
    border: 2px solid #efefef;
    border-radius: 5px;
    padding: 0;
    list-style: none;
    &.active {
      border-color: #58af17;
    }
    &:not(:last-child) {
      margin-bottom: 1px;
    }
    &-details {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    }
    &-image {
      position: relative;
      img {
        width: 260px;
        height: 166px;
        display: block;
        object-fit: cover;
        max-width: none;
      }
      span {
        display: block;
        position: absolute;
        bottom: 0px;
        right: 2px;
        padding: 7px 13px;
        font-size: 15px;
        letter-spacing: -0.4px;
        background-color: rgba(0, 0, 0, .6);
        color: #fff;
      }
    }
    &-form {
      padding: 21px 23px 22px 23px;
      border-top: 1px solid #ececec;
      background-color: #fbfbfb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      input {
        flex: 1;
        min-width: 150px;
        margin: 10px;
        height: 40px;
        padding: 3px 12px 0;
        border: 1px solid #dae0e4;
        border-radius: 4px;
        outline: none;

        &:focus {
          border: 1px solid darken(#dae0e4, 20);
        }
      }
    }
    &-info {
      padding: 21px 10px 10px 21px;
      margin-right: auto;
      min-width: 300px;
      max-width: calc(100% - 130px);
      h3 {
        font-size: 20px;
        color: #3c3c3c;
        border-bottom: 1px solid #dae0e4;
        padding-bottom: 3px;
        margin-bottom: 8px;
      }
      ul {
        color: #63c61a;
        list-style: none;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        li {
          font-size: 13px;
          width: 50%;
          &:not(:last-child) {
            margin-bottom: 2px;
          }
          svg {
            margin-right: 10px;
          }
        }
      }
    }
    &-quantity {
      padding: 18px 21px 18px 10px;
      display: flex;
      align-items: center;
      select {
        width: 60px;
        height: 33px;
        background-color: #fff;
        border: 1px solid #dae0e4;
        border-radius: 4px;
        outline: none;
      }
    }
    &-price {
      font-size: 20px;
      color: #3c3c3c;
    }
  }
  @media screen and (max-width: 700px) {
    &--body {
      padding: 25px 20px;
    }
  }
}

.mb-show {
  display: none!important;
}

.guests .dropdown {
  position: absolute;
  width: 90px;
  background-color: #fff;
  border: 1px solid #dae0e4;
  border-radius: 4px;
  z-index: 999;
  top: 30px;
  left: 0;

  span {
    display: block;
    text-align: center;
    padding: 7px 9px 5px;
    border-bottom: 1px solid #dae0e4;
    cursor: pointer;
    color: #333;
    &:hover {
      background-color: #0033cc;
      color: #ffffff;
    }
  }
}

@media (max-width: 1024px) {
  .modal--room-details {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .modal--room-info ul li {
    width: 100%;
  }

  .modal-wrapper {
    top: 0;
    bottom: 0;
  }

  body {
    font-size: 16px;
  }

  .modal-mask {
    .datepicker__inner,
    .datepicker__header,
    .datepicker__inner>* {
      position: static;
    }
  }
  .close-arrow{
    position: relative;
    bottom: 5px;
    right: 10px;
    svg{
      width: 23px;
      height: auto;
      //transform: rotate(180deg);
      stroke-width: 0;
    }
  }

  .modal--header {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  }

  .mb-hide{
    display: none!important;
  }

  .mb-show{
    display: block!important;
  }

  body.focused-input .sticky-buttons button {
    display: none!important;
  }

  .sticky-buttons button {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, .2);
    background-color: #63c61a;
    color: white;
    padding: 6px 40px 10px;
    line-height: 1;
    font-weight: 400;
    height: 52px;
    font-size: 16px;
    transition: all .22s ease;
    white-space: nowrap;
    &:hover {
      background-color: #58af17;
    }

    svg {
      margin-left: 8px;
      vertical-align: bottom;
      path {
        fill: white;
      }
    }
  }

  .modal-box {
    width: 100%;
    max-height: 100vh;
    top: 12px;
    padding-bottom: 80px;
    height: 100vh;



    &.overflow-hidden {
      overflow: hidden!important;
      position: fixed;
      width: 100%;
    }

    &.confirm {
      padding-bottom: 0;
    }

    .modal--body-info {
      justify-content: space-between;
      width: 100%;
      display: flex;

      .guests .dropdown {
        top: 39px;
        width: 100%;

        span {
          width: 100%;
          line-height: 37px;
        }
      }

      span {
        width: 45%;
        text-align: center;
        height: 40px;
        line-height: 25px;
      }
    }

    .modal--room-form input {
      width: 100%;
      flex: auto;
    }

    .modal--room-details {
      align-items: flex-start;
      flex-wrap: wrap;

      .modal--room-image {
        order: 1;
        img{
          width: 100%;
          height: auto;
        }
      }

      .modal--room-info {
        order: 2;
        min-width: auto;
        width: calc(100% - 150px);
      }

      .modal--room-quantity {
        order: 3;
        width: 150px;
        justify-content: flex-end;
        padding: 16px 17px 18px 10px;
      }
    }
  }
}

body {
   @media (max-width: 768px) {
    .modal--row.modal--footer {
      display: none;
    }

    .modal-wrapper .modal--body {
      max-height: calc(100vh - 100px);
      min-height: calc(100vh - 100px);
    }

    .modal-wrapper .modal-box.checkout, .modal-wrapper .modal-box.confirm {
      background: #fff !important;

      .modal--header {
        border-bottom: 1px solid #ddd !important;
      }

      .modal--body-title {
        color: #343434;
      }
      .modal--body-title svg {
        fill: #000000;
      }

      .user-info header p {
        color: #797979;
      }

      .payment-details .detail {
        color: #9b9b9b;

        > span {
          color: #5f5f5f;
        }
      }

      .cancelation {
        margin-top: 10px;
        display: flex;
        align-items: center;

        > svg {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
