<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="flex justify-center sm:items-center max-h-full sm:px-container md:px-container sm:py-container">
                    <div class="w-200 max-w-full sm:rounded bg-white -translate-y transition-transform-slow modal-box">
                        <v-stepper v-model="e1" style="height: 100%">
                            <v-stepper-header>
                                <v-stepper-step :complete="e1 > 1" step="1">Choose Room</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :complete="e1 > 2" step="2">Hotel Detail</v-stepper-step>
                                <v-divider></v-divider>
                                <v-stepper-step :complete="e1 > 3" step="3">Payment Information</v-stepper-step>
                            </v-stepper-header>
                            <v-stepper-items style="height: 100%">
                                <v-stepper-content step="1" style="height: 100%">
                                    <v-card
                                        class="card-layout"
                                        style="height: 100%"
                                        >
                                        <v-layout row wrap>
                                            <v-flex xs12 sm6 md6 lg6 style="flex-direction: column">
                                                <h2 class="hotel-name">
                                                    <img src="@/assets/img/icons8-bed.svg" alt="">
                                                    &nbsp;{{ hotelDetailData.name }}
                                                </h2>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap align-center style="margin: 20px 0px;">
                                            <span class="modal--body-item modal--body-item_selected border-alternate  bg-alternate" @click='checkOverflow()'>
                                                {{ check_in | moment("DD MMM")}} - {{ check_out | moment("DD MMM") }}
                                                <HotelDatePicker
                                                    @checkInChanged='changeStartDate'
                                                    @checkOutChanged='changeEndDate'
                                                    @showDatepicker='checkOverflow(true)'
                                                    @hideDatepicker='checkOverflow()'
                                                    format="DD/MM/YYYY"
                                                    :startingDateValue='new Date(check_in)'
                                                    :endingDateValue='new Date(check_out)'
                                                    :enableCheckout='true'
                                                    :startDate='minDay'
                                                    :endDate='maxDay'
                                                />
                                            </span>
                                            <span @click.self='showDropdown = !showDropdown' class="modal--body-item guests">{{guests}} Guest{{guests > 1 ? 's' : ''}}
                                                <div class="dropdown" v-if='showDropdown'>
                                                <span v-for='val in maxGuests' :key="val" @click='changeGuests(val)'>{{val}} Guest{{val > 1 ? 's' : ''}}</span>
                                                </div>
                                            </span>
                                            <span @click.self='showRoomDropdown = !showRoomDropdown' class="modal--body-item guests">{{rooms}} Room{{rooms > 1 ? 's' : ''}}
                                                <div class="dropdown" v-if='showRoomDropdown'>
                                                <span v-for='val in maxRoom' :key="val" @click='changeRooom(val)'>{{val}} room{{val > 1 ? 's' : ''}}</span>
                                                </div>
                                            </span>
                                            <v-btn color="success" @click="updateData()">Check Availability</v-btn>
                                        </v-layout>
                                        <v-layout class="hotel-list first">
                                            <v-flex v-if="hotelList && hotelList.length>0" class="hotel-list-flex">
                                                <v-layout v-for="(item, index) in hotelList[0].rates" :key="index" row wrap class="room-item">
                                                    <v-flex md9 lg9 sm9 class="param">
                                                        <v-layout align-center><h2>{{ item.title }} - {{ item.description }}</h2>&nbsp;<a @click="e1 = 2;selectedItem=item;">hotel detail</a></v-layout>
                                                        <v-layout row wrap><p>• {{ item.charges.charges.hotel.pre_paid==1?'Prepaid':'' }}</p></v-layout>
                                                        <v-layout row wrap><p v-if="item.charges.charges.property_fee && item.charges.charges.property_fee.pre_paid == 0">• No Prepaid : + {{item.charges.charges.property_fee.transaction_values.symbol}}{{ exchange(item.charges.charges.property_fee.transaction_values.total) }}</p></v-layout>
                                                    </v-flex>
                                                    <v-flex md1 lg1 sm1 justify-center align-center>
                                                        <h2 style="font-size: larger;">{{ item.charges.charges.hotel.transaction_values.symbol }} {{ exchange(item.charges.charges.hotel.transaction_values.price.total) }}</h2>
                                                    </v-flex>
                                                    <v-flex md2 lg2 sm2 justify-center align-center>
                                                        <v-btn class="bg-error" @click="e1 = 3;selectedItem=item;">Book Now</v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                            <v-flex v-else justify-center> No Data</v-flex>
                                        </v-layout>
                                        <v-divider></v-divider>
                                        <v-layout class="footer">
                                            <v-btn flat @click="closeModal()">Cancel</v-btn>
                                        </v-layout>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step="2">
                                    <v-card
                                        class="card-layout"
                                        >
                                        <v-layout row wrap>
                                            <v-flex xs12 sm6 md6 lg6 style="flex-direction: column">
                                                <h2 class="hotel-name">
                                                    <img src="@/assets/img/icons8-bed.svg" alt="">
                                                    &nbsp;{{ hotelDetailData.name }}
                                                </h2>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap align-center style="margin: 20px 0px;">
                                            <span class="modal--body-item modal--body-item_selected border-alternate  bg-alternate" @click='checkOverflow()'>
                                                {{ check_in | moment("DD MMM")}} - {{ check_out | moment("DD MMM") }}

                                            </span>
                                            <span class="modal--body-item guests">{{guests}} Guest{{guests > 1 ? 's' : ''}}

                                            </span>
                                            <span class="modal--body-item guests">{{rooms}} Room{{rooms > 1 ? 's' : ''}}

                                            </span>
                                        </v-layout>
                                        <v-layout class="hotel-list second" v-if="selectedItem">
                                            <v-flex class="room-detail">
                                                <h2>{{ selectedItem.title }} - {{ selectedItem.description }}</h2>
                                                <div class="amenities">
                                                    <span v-if="selectedItem.amenities">
                                                        <svg data-v-aa3c727c="" aria-hidden="true" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16">
                                                            <path data-v-aa3c727c="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path>
                                                        </svg>
                                                        {{ selectedItem.amenities.mobile_exclusive == 1?'':'No ' }}Mobile Exclusive
                                                    </span>
                                                    <span v-if="selectedItem.amenities">
                                                        <svg viewBox="0 0 50 50" version="1.1" width="15px" height="15px" class="svg-inline--fa fa-check fa-w-16">
                                                            <path   d="M 25 7 C 15.941406 7 7.339844 10.472656 0.78125 16.773438 L 0.0625 17.464844 L 5.59375 23.230469 L 6.320313 22.539063 C 11.378906 17.679688 18.015625 15 25 15 C 31.984375 15 38.621094 17.679688 43.683594 22.539063 L 44.40625 23.230469 L 49.941406 17.464844 L 49.21875 16.769531 C 42.660156 10.46875 34.058594 7 25 7 Z M 25 19 C 19.046875 19 13.394531 21.28125 9.085938 25.421875 L 8.363281 26.113281 L 13.921875 31.90625 L 14.644531 31.210938 C 17.464844 28.496094 21.144531 27 25 27 C 28.855469 27 32.535156 28.496094 35.355469 31.210938 L 36.078125 31.90625 L 41.636719 26.113281 L 40.917969 25.421875 C 36.605469 21.28125 30.953125 19 25 19 Z M 25 31 C 22.15625 31 19.453125 32.089844 17.390625 34.074219 L 16.671875 34.765625 L 25 43.441406 L 33.328125 34.765625 L 32.609375 34.074219 C 30.546875 32.089844 27.84375 31 25 31 Z "/>
                                                        </svg>
                                                        {{ selectedItem.amenities.free_wifi == 1?'':'No ' }}Free Wifi
                                                    </span>
                                                    <span v-if="selectedItem.amenities">
                                                        <svg  viewBox="0 0 24 24" version="1.1" width="15px" height="15px" class="svg-inline--fa fa-check fa-w-16">
                                                            <path d="M 11 2 C 11 3.277344 10.78125 3.28125 10.28125 3.78125 C 9.78125 4.28125 9 5.277344 9 7 L 11 7 C 11 5.722656 11.21875 5.71875 11.71875 5.21875 C 12.21875 4.71875 13 3.722656 13 2 Z M 14.6875 3 C 14.6875 5.398438 13 5.398438 13 7 L 15 7 C 15 5.5 16.6875 5.699219 16.6875 3 Z M 5 8 L 5 14 C 5 16.199219 6.800781 18 9 18 L 15 18 C 16.902344 18 18.472656 16.660156 18.875 14.875 C 20.664063 14.476563 22 12.910156 22 11 L 22 10 C 22 9.476563 21.816406 8.941406 21.4375 8.5625 C 21.058594 8.183594 20.523438 8 20 8 Z M 19 10 L 20 10 L 20 11 C 20 11.808594 19.613281 12.429688 19 12.75 Z M 2 19 C 2 20.699219 3.300781 22 5 22 L 19 22 C 20.699219 22 22 20.699219 22 19 Z "/>
                                                        </svg>
                                                        {{ selectedItem.amenities.free_breakfast == 1?'':'No ' }}Free Breakfast
                                                    </span>
                                                    <span v-if="selectedItem.amenities">
                                                        <svg data-v-aa3c727c="" aria-hidden="true" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16">
                                                            <path data-v-aa3c727c="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path>
                                                        </svg>
                                                        {{ selectedItem.amenities.all_inclusive == 1?'':'No ' }}All Inclusive
                                                    </span>
                                                </div>
                                                <h3 v-if="polices && polices.length > 0" style="font-size: 18px;">Polices</h3>
                                                <ul v-if="polices && polices.length > 0">
                                                    <li v-for="(item, index) in polices" :key="index">
                                                        <p>{{ Object.keys(selectedItem.policies)[index] }}</p>
                                                        <p>{{ item.description }}</p>
                                                    </li>
                                                </ul>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout class="footer">
                                            <v-btn @click="e1 = 1" class="bg-error" flat>Back</v-btn>
                                            <v-btn @click="e1 = 3" class="primary" flat>Continue</v-btn>
                                            <v-btn flat @click="closeModal()">Cancel</v-btn>
                                        </v-layout>
                                    </v-card>
                                </v-stepper-content>

                                <v-stepper-content step="3">
                                    <v-card
                                        class="card-layout"
                                        >
                                        <Checkout
                                            v-if="selectedItem && selectedItem.charges"
                                            :room="selectedItem"
                                            :check_in="check_in"
                                            :check_out="check_out"
                                            :room_number="rooms"
                                            @prevStep="e1 = 1"
                                            @close="closeModal"
                                        />
                                    </v-card>
                                </v-stepper-content>
                            </v-stepper-items>
                        </v-stepper>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker'
import { Promise } from 'q';
import { mapState, mapGetters } from 'vuex'
import Checkout from './Checkout'

export default {
    props: ['hotelDetailData', 'dates', 'origin_guests'],
    components: {
        HotelDatePicker,
        Checkout
    },
    computed: {
        ...mapState('hotel', ['availableRates']),
    },
    data () {
        return {
            e1: 0,
            check_in: this.dates.start,
            check_out: this.dates.end,
            minDay: new Date(),
            maxDay: new Date(),
            showDropdown: false,
            guests: this.origin_guests,
            maxGuests: 12,
            showRoomDropdown: false,
            rooms: 3,
            maxRoom: 9,
            hotelList: [],
            selectedItem: {},
            polices: []
        }
    },
    mounted () {
        this.minDay.setDate((new Date(this.check_in)).getDate() - 15);
        this.maxDay.setDate( (new Date(this.check_out)).getDate() + 15);
        this.updateData();
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
        updateData () {
            let promises = [];
            promises.push(this.$store.dispatch('hotel/getAvailableRates',{ hotel_id: this.$route.params.id, check_in: this.formatDate(this.check_in), check_out: this.formatDate(this.check_out), rooms: this.rooms, guests: this.guests }) );
            Promise.all(promises)
                .then((values) => {

                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    if (this.availableRates &&
                        this.availableRates['getHotelRates.Availability'] &&
                        this.availableRates['getHotelRates.Availability'].results &&
                        this.availableRates['getHotelRates.Availability'].results.status == "Success")
                        this.hotelList = this.availableRates['getHotelRates.Availability'].results.hotels;
                });
        },

        closeModal () {
            this.$emit('close');
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

<style lang="scss" scoped>
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
    .modal-wrapper {
        position: absolute;
        width: 100%;
        top: 5%;
        bottom: 5%;
        -ms-overflow-style: none;
        overflow: auto;
        @media (min-width: 600px) {
            overflow: hidden;
            &>div {
                height: 100%;
                align-items: flex-start;
            }
        }
    }

    .modal-box {
        max-height: calc(100vh - 40px);
        max-width: 100vw;
        width: 885px;
        overflow: auto;
        margin-top: 20px;
        padding-bottom: 0px;
        position: relative;
        // height: 100%;
        .v-stepper {
            height: 100%;
        }
        @media (min-width: 600px) {
            overflow: hidden;
        }
    }

    .card-layout {
        min-height: 500px;
    }

    .hotel-name {
        font-size: 24px;
        padding-left: 12px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        img {
            width: 27px;
            height: 27px;

        }
    }

    .logo {
        max-height: 45px;
    }

    .modal--body-item.modal--body-item_selected {
        width: fit-content;
        height: fit-content;
    }

    .hotel-list {
        width: 100%;
        overflow: auto;
        .hotel-list-flex {
            flex-direction: column;
        }

        .room-detail {
            flex-direction: column;
            .amenities {
                padding: 0.5rem 0px;
                span {
                    color: #63c61a;
                    margin-left: 0.5rem;
                    svg {
                        fill: #63c61a;
                    }
                }

                span:first-child {
                    margin-left: 0px;
                }
            }
        }
    }

    .room-item {
        border-bottom: 1px solid #EAEAEA;
        max-height: 100px;
        a {
            border-bottom: 1px solid #8c8c8c;
            white-space: nowrap;
        }
    }

    h2 {
        font-size: 20px;
        color: #3c3c3c;
    }
}

@media (min-width: 769px) {
    .hotel-list {
        height: 310px;
    }
}

@media (max-width: 768px) {
    .modal-box {
        width: 100%;
        max-height: 100vh;
        top: 12px;
        padding-bottom: 80px;
        height: 100vh;
    }
}
</style>
<style lang="scss">
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

.param {
    flex-direction: column;
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

.success {
    background-color: #31A760!important;
}

.bg-error {
    background-color: #ec3323 !important;
    color: white!important;
}

.footer {
    position: absolute;
    bottom: 10px;
    width: calc( 100% - 30px );
    display: flex;
    justify-content: flex-end;
}

@media (min-width: 769px) {
    .v-stepper__items {
        height: calc(100% - 72px)!important;
        overflow: auto;
    }
}

 @media (max-width: 768px) {
    .v-stepper__items, .v-stepper__content, .v-stepper__wrapper, .card-layout {
        height: 100%;
    }

    .footer {
        bottom: 0px;
        width: 100%;
        position: initial;
    }

    .v-stepper__content {
        overflow: auto;
        height: calc(100vh - 100px);
        padding-top: 0px;
        margin-top: 24px;
    }

    .v-stepper__wrapper {
        height: fit-content;
    }

    .modal-mask {
        .modal-wrapper {
            top: 0px!important;
            bottom: 0px!important;
        }

        .modal-box {
            max-height: 100vh!important;
        }

        .hotel-list {
            height: calc(100% - 300px)!important;
        }

        .hotel-list.first {
            height: calc(100% - 350px)!important;
        }
    }
}
</style>
