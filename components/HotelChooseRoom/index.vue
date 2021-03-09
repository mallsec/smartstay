<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
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
                                            <!-- <template v-if='event.tickets.length > 0'>
                                                <f-a  class='mb-hide' icon="long-arrow-alt-right" />
                                                <button  class='mb-hide' @click="toNextSlide()" :class="{ 'active' : slide === 'extras' }">Admission & Extras</button>
                                            </template> -->
                                        </div>
                                        <span class="mb-show" style="color: white;">{{slideToText}}</span>
                                        <div class="modal--header-right">
                                        <button :class='{"disable": !isCheckoutValid}' :disabled="!isCheckoutValid" @click='toNextSlide()'>
                                            <span class="mb-hide">Payment information</span>
																					<svg data-name="Layer 1" viewBox="0 0 31.6 22.1"><g fill="#ffffff"><path d="M31.3 10.3a1.1 1.1 0 0 1 0 1.6l-10 9.9a1.1 1.1 0 0 1-1.5 0 1.1 1.1 0 0 1 0-1.6l8-8H1a1.1 1.1 0 1 1 .2-2.2h26.5l-8-8a1.1 1.1 0 0 1 0-1.6 1.1 1.1 0 0 1 1.6 0z"/></g></svg>

																				</button>
                                        </div>
                                    </template>


                                    <template v-else-if='slide === "checkout"'>
                                        <div class="modal--header-right">
                                            <span class="close-arrow mb-show">
                                              <svg data-name="Layer 1" viewBox="0 0 31.6 22.1"><g fill="$ffffff"><path d="M10.3.3a1.1 1.1 0 0 1 1.5 0 1.1 1.1 0 0 1 0 1.6l-8 8.1h26.6a1.1 1.1 0 1 1 .2 2.2H3.8l8 8a1.1 1.1 0 0 1 0 1.6 1.1 1.1 0 0 1-1.6 0l-9.9-10a1.1 1.1 0 0 1 0-1.5z"/></g></svg>
                                            </span>
                                            <button class='mb-hide'  @click="slide = 'rooms'" :class="{ 'active' : slide === 'rooms' }">Choose Room</button>
                                        </div>
                                    </template>


                                    <!-- <template v-if='slide === "confirm"'>
                                        <div></div>
                                        <div v-if='slide === "confirm"' class="modal--header-right">
                                        <a target="_blank" :href='event.backToClientUrl'>
                                            <span>Go to event</span>
                                            <svg  viewBox="0 0 44.236 44.236"><g fill="#989898"><path d="M22.118 44.236C9.922 44.236 0 34.314 0 22.118S9.922 0 22.118 0s22.118 9.922 22.118 22.118-9.922 22.118-22.118 22.118zm0-42.736C10.75 1.5 1.5 10.749 1.5 22.118c0 11.368 9.25 20.618 20.618 20.618 11.37 0 20.618-9.25 20.618-20.618 0-11.369-9.248-20.618-20.618-20.618z"/><path d="M19.341 29.884a.75.75 0 0 1-.53-1.281l6.796-6.804-6.796-6.803a.75.75 0 1 1 1.061-1.061l7.325 7.333a.75.75 0 0 1 0 1.061l-7.325 7.333a.742.742 0 0 1-.531.222z"/></g></svg>
                                        </a>
                                        </div>
                                    </template> -->
                                </div>
                                <div class="modal--body" :style='(slide === "confirm" || slide === "checkout") && pageWidth > 600 ? "height: calc(100% - 44px)" : ""'>
                                    <div class="modal--row modal--body-top" v-if='!isCheckout'>
                                        <div class="modal--body-info">
                                            <h2 class="modal--body-title mb-hide">
                                                <img src="../../assets/img/icons8-bed.svg" alt="">
                                                {{ hotelDetailData.name }}
                                            </h2>
                                            <span class="modal--body-item modal--body-item_selected" @click='checkOverflow()'>
                                                {{ toShortFormat(check_in) }} - {{ toShortFormat(check_out) }}
                                                <HotelDatePicker
                                                    @checkInChanged='changeStartDate'
                                                    @checkOutChanged='changeEndDate'
                                                    @showDatepicker='checkOverflow(true)'
                                                    @hideDatepicker='checkOverflow()'
                                                    format="DD/MM/YYYY"
                                                    :startingDateValue='new Date(check_in)'
                                                    :endingDateValue='new Date(check_out)'
                                                    :enableCheckout='true'
                                                />
                                            </span>
                                            <span @click.self='showDropdown = !showDropdown' class="modal--body-item guests">{{guests}} Guest{{guests > 1 ? 's' : ''}}
                                                <div class="dropdown" v-if='showDropdown'>
                                                <span v-for='(val, i) in maxGuests' :key="i" @click='changeGuests(val)'>{{val}} Guest{{val > 1 ? 's' : ''}}</span>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <transition name="slide-fade">
                                      <Rooms
                                        v-if="load && ((availableRates&&availableRates.length > 0) || (availableRatesExpress.room_data && availableRatesExpress.room_data.length > 0))"
                                        :rooms='availableRates'
                                        :express_rooms = 'availableRatesExpress.room_data'
                                        :express_policy = 'availableRatesExpress.policy_data'
                                        v-show='slide === "rooms"' />
                                      <div v-if="!load" class="flex justify-center align-center" style="min-height: 200px;">
                                        <Loader v-if='!load' :load='!load' :hide_text="true"/>
                                      </div>
                                    </transition>
                                    <transition name="slide-fade">
                                      <Checkout
                                        @tryAgain='slide = "checkout"'
                                        :slide='slide'
                                        :room="selectedItem"
                                        :express_policy = 'availableRatesExpress.policy_data'
                                        :ppn_bundle="availableRatesExpress.room_data[0].ppn_book_bundle"
                                        :check_in="check_in"
                                        :check_out="check_out"
                                        :check_in_time="check_in_time"
                                        :check_out_time="check_out_time"
                                        @confirm='slide = "confirm"'
                                        v-if='isCheckout'/>
                                    </transition>
                                </div>
                                <div class="modal--row modal--footer" v-if='!isCheckout'>
                                    <p class="text-error" v-if='showError'>Amount of rooms should be greater than 0</p>
                                    <div class="mb-hide">
                                        <h5>Save {{ pageHotelInfo.room_data?pageHotelInfo.room_data.room_0.saving_percentage:'' }}% at this official hotel.</h5>
                                        <p>Book soon! Rates go up or the hotel sells out closer to the event date.</p>
                                    </div>
                                    <button v-if='(slide === "room") || slide === "extras"' class="sm\:h-11 checkout-button border-black-20 bg-primary text-white mb-hide" @click='toNextSlide()'>
                                        Secure Checkout
                                        <svg viewBox="0 0 32 32" version="1.1" width="20px" height="20px">
                                        <g id="surface1">
                                            <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z "/>
                                        </g>
                                        </svg>
                                    </button>
                                    <button class="sm\:h-11 checkout-button border-black-20 bg-primary text-white mb-hide" :class='{"disable": !isCheckoutValid}' :disabled="!isCheckoutValid" v-else @click='toNextSlide()'>
                                        Continue
                                    </button>
                                </div>
                            </div>
                            <div class="sticky-buttons mb-show">
                              <template v-if='slide === "rooms" || slide === "extras"'>
                                <button v-if='(slide === "room") || slide === "extras"' class="bg-primary   text-white checkout-button" @click='toNextSlide()'>
                                  Secure Checkout
                                  <svg viewBox="0 0 32 32" version="1.1" width="20px" height="20px">
                                    <g id="surface1">
                                      <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z "/>
                                    </g>
                                  </svg>
                                </button>
                                <button class="text-white checkout-button" v-else :class='{"disable": !isCheckoutValid}' :disabled="!isCheckoutValid" @click='toNextSlide()'>
                                  Continue
                                </button>
                              </template>
                              <button v-else-if='slide==="checkout"' :class='{"disable": chooseRoom.isDisabled}' :disabled='chooseRoom.isDisabled'  class="bg-primary text-white " @click='$emit("checkout")'>Complete Booking <f-a icon='spinner' v-if='chooseRoom.isDisabled' class='fa-spin'/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Loader from '@/components/Loader'
import HotelDatePicker from 'vue-hotel-datepicker'
import { Promise } from 'q';
import { mapState, mapGetters } from 'vuex'
import Checkout from './Checkout'
import Rooms from './Rooms'
import _ from 'lodash'
import IconLeftarrow from '@/components/icons/IconLeftArrow'

export default {
    props: ['hotelDetailData', 'dates', 'origin_guests'],
    components: {
        HotelDatePicker,
        Checkout,
        Rooms,
        Loader,
    },
    computed: {
        ...mapState('hotel', ['availableRates']),
        ...mapState('hotel', ['availableRatesExpress']),
        ...mapState('hotel', ['hotelInfo']),
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
        isCheckoutValid () {
          return (this.availableRates&&this.availableRates.length > 0) || (this.availableRatesExpress.room_data && this.availableRatesExpress.room_data.length > 0);
        }
    },
    data () {
      return {
        e1: 0,
        check_in: this.dates.start,
        check_out: this.dates.end,
        check_in_time: this.tConvert(this.hotelDetailData.check_in_time),
        check_out_time: this.tConvert(this.hotelDetailData.check_out_time),
        minDay: new Date(),
        maxDay: new Date(),
        showDropdown: false,
        guests: this.origin_guests,
        maxGuests: 2,
        showRoomDropdown: false,
        rooms: 1,
        selectedItem: {},
        polices: [],
        slide: 'rooms',
        showError: false,
        load: false,
        pageWidth: 0,
        pageHotelInfo: {}
      }
    },
    mounted () {
      this.pageHotelInfo = _.cloneDeep(this.hotelInfo);
      this.minDay.setDate((new Date(this.check_in)).getDate() - 15);
      this.maxDay.setDate( (new Date(this.check_out)).getDate() + 15);
      this.updateData();
    },
    created () {
      window.onresize = () => {
        this.pageWidth = document.body.clientWidth
      }
    },
    watch: {
        selectedItem: {
            handler (n) {
                if (this.selectedItem.policies)
                    this.polices = Object.values(this.selectedItem.policies)
            },
            deep: true
        }
    },
    methods: {
        tConvert (time) {
          // Check correct time format and split into components
          time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

          if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
          }
          return time.join ('').split(':')[0]+time[5]; // return adjusted time or original string
        },
        updateData () {
            let promises = [];
            promises.push(this.$store.dispatch('hotel/getAvailableRatesExpress', { ppn_bundle: this.pageHotelInfo.ppn_bundle }));
            promises.push(this.$store.dispatch('hotel/getAvailableRates',{ hotel_id: this.$route.params.id, check_in: this.formatDate(this.check_in), check_out: this.formatDate(this.check_out), rooms: this.rooms, guests: this.guests }) );
            Promise.all(promises)
                .then((values) => {

                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                  this.load = true;
                  let flag = false;
                  let rooms = this.availableRatesExpress.room_data || [];
                  rooms.forEach((room, index) => {
                    room.quantity = index === 0 ? 1 : '0'
                  });
                  this.$store.commit('hotel/changeAvailableRatesExpress', rooms);
                  if (rooms.length == 0)
                    flag = true;
                  rooms = this.availableRates || [];
                  rooms.forEach((room, index) => {
                    room.quantity = (flag && index === 0) ? 1 : '0'
                  });
                  this.$store.commit('hotel/changeAvailableRates', rooms);
                });
        },

        closeModal () {
            this.$emit('close');
        },

        toShortFormat (date) {
           var _date = new Date(date)
            var month_names =["Jan","Feb","Mar",
                              "Apr","May","Jun",
                              "Jul","Aug","Sep",
                              "Oct","Nov","Dec"];

            var day = _date.getDate();
            var month_index = _date.getMonth();

            return "" + day + " " + month_names[month_index];
        },


        toNextSlide (toExtra) {
            if (this.slide === 'extras') {
                this.slide = 'checkout'
                return true
            }
            this.showError = false
            let isEmpty = false
            let quantity = 0
            this.availableRatesExpress.room_data.forEach((room, index) => {
              let roomQuan = Number(room.quantity)
              quantity += roomQuan
            })
            this.availableRates.forEach((room, index) => {
              let roomQuan = Number(room.quantity)
              quantity += roomQuan
            })
            if (this.check_out === null) {
                let end = new Date(this.check_out)
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
                // if (this.event.tickets.length > 0) {
                //     this.slide = 'extras'
                // } else {
                this.slide = 'checkout'
                // }
            }
        },

        exchange (val) {
          return parseInt(val);
        },

        formatDate (data) {
            var d = new Date(data),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        },
        changeStartDate (start) {
            this.check_in = start;
        },
        changeEndDate (end) {
            this.check_out = end;
            this.updateData();
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
            this.guests = value;
            this.showDropdown = false
        },
        changeRooom (value) {
          this.rooms = value;
          this.showRoomDropdown = false;
        }
    }
}
</script>

<style lang="scss">
  body {
    .modal-wrapper .modal-box.bg-white.checkout {
      background: #fff;
    }
  }
  @media (min-width: 320px) and (max-width: 768px) {
    body .modal--footer {
      border-top: none !important;
    }
  }
  @media (min-width: 768px) {
    .modal--header-right .arrow-block {
      right: 55px;
    }
  }
  body .modal-wrapper .modal--header {
    border-bottom: 1px solid #ddd;
  }
</style>
