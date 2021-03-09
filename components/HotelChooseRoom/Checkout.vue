<template>
  <div id="checkout_1" class="checkout" :class="{'confirm-page': slide === 'confirm'}">
    <div class="user-info" v-show='slide === "checkout" && !confirm'>
      <form @submit.prevent>
      <header class="w-100">
        <h3 class="modal--body-title">
         Who's checking in?
        </h3>
        <p>The main guest must be 21 years of age or older.</p>
      </header>
        <div class="form-input">
          <input
           @change='checkError("first_name")'
           type="text"
           :class="{'error': paymentInfo.first_name.error}"
           v-model="paymentInfo.first_name.value"
           placeholder="First name">
          <p class="text-error">{{paymentInfo.first_name.error}}</p>
        </div>
        <div class="form-input">
          <input
           @change='checkError("last_name")'
           type="text"
           :class="{'error': paymentInfo.last_name.error}"
           v-model="paymentInfo.last_name.value"
           placeholder="Last name">
          <p class="text-error">{{paymentInfo.last_name.error}}</p>
        </div>
        <div class="form-input email">
          <input
           @change='checkError("email")'
           type="text"
           :class="{'error': paymentInfo.email.error}"
           v-model="paymentInfo.email.value"
           placeholder="Email">
          <p class="text-error">{{paymentInfo.email.error}}</p>
        </div>
        <div class="separator"></div>
      <header class="w-100">
        <div class="modal--body-title-row">
          <h3 class="modal--body-title">
            <svg viewBox="0 0 32 32" version="1.1" width="23px" height="35px">
              <g id="surface1">
                <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z "/>
              </g>
            </svg>
           Secure payment
          </h3>
        </div>
        <p>Information is secured with the highest encryption.</p>
      </header>
        <div class="payment-details show-mb">
        <div class="policy">
          View Policy
          <div class="policy-popup">
            <ul v-if="express_policy && express_policy.length > 0">
              <li v-for="(item, index) in express_policy" :key="index">
                <p>{{ item.title }}</p>
                <p>{{ item.paragraph_data[0] }}</p>
              </li>
            </ul>
          </div>
          <div class="detail detail-title">
            {{ hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.name }}
          </div>
          </div>
          <div class="detail">Check-in <span>{{ check_in | moment("ddd, MMM DD")}} {{ check_in_time }}</span></div>
          <div class="detail">Check-out<span>{{ check_out | moment("ddd, MMM DD") }} {{ check_out_time }}</span></div>
          <div class="detail">Nights<span>{{ countNights(check_in, check_out) }}</span></div>
          <div class="detail">Rooms<span>{{ roomSum }}</span></div>
          <div class="detail">Rate<div><span class="percent-off">{{hotelInfo.room_data?hotelInfo.room_data.room_0.saving_percentage:''}}% OFF</span><span>${{ exchange(totalSum) }}</span></div></div>
          <div class="detail">Taxes & Fees<div><span>${{exchange(extrasSum)}}</span></div></div>
          <div class="detail total">You pay<span>${{exchange((totalSum*countNights(check_in, check_out))+extrasSum)}}</span></div>
          <div class="payment-methods__list hide-mb">
            <img src="../../assets/img/icon-visa.png" alt="">
            <img src="../../assets/img/icon-master.png" alt="">
            <img src="../../assets/img/icon-american.png" alt="">
            <img src="../../assets/img/icon-discover.png" alt="">
          </div>
        </div>
        <div class="form-input">
          <input
           @change='checkError("guest_name_first")'
           type="text"
           :class="{'error': paymentInfo.guest_name_first.error}"
           v-model="paymentInfo.guest_name_first.value"
           placeholder="First name">
          <p class="text-error">{{paymentInfo.guest_name_first.error}}</p>
        </div>
        <div class="form-input">
          <input
           @change='checkError("guest_name_last")'
           type="text"
           :class="{'error': paymentInfo.guest_name_last.error}"
           v-model="paymentInfo.guest_name_last.value"
           placeholder="Last name">
          <p class="text-error">{{paymentInfo.guest_name_last.error}}</p>
        </div>
        <div class="form-input email">
            <small class="text-muted"><span class="cc-brand"></span></small>
            <input id="cc-number" v-model="cardForm.number" type="tel" class="input-lg form-control cc-number" autocomplete="cc-number" placeholder="Credit card number (Debit card not accepted)" required>
            <p class="text-error"></p>
        </div>
        <div class="form-input">
            <input id="cc-exp"  v-model="cardForm.exp" type="tel" class="input-lg form-control cc-exp" autocomplete="cc-exp" placeholder="Exp" required>
        </div>
        <div class="form-input">
            <input id="cc-cvc" v-model="cardForm.cvc"  type="tel" class="input-lg form-control cc-cvc" autocomplete="off" placeholder="CVC" required>
            <h2 class="validation"></h2>
        </div>
        <div class="form-input billing_address" style="width: 100%;">
          <input
           @change='checkError("billing_address")'
           type="text"
           :class="{'error': paymentInfo.billing_address.error}"
           v-model="paymentInfo.billing_address.value"
           placeholder="First line of card holder's address">
          <p class="text-error">{{paymentInfo.billing_address.error}}</p>
        </div>
        <div class="form-input">
          <input id="cc-postal" v-model="cardForm.postal" type="tel" class="input-lg form-control" autocomplete="off" placeholder="Postal Code" required>
        </div>
        <div class="form-input">
          <input
           @change='checkError("phone")'
           type="text"
           :class="{'error': paymentInfo.phone.error}"
           placeholder="Phone"
           v-model="paymentInfo.phone.value">
          <p class="text-error">{{paymentInfo.phone.error}}</p>
        </div>
      </form>
      <p class="agree-input">
        <v-checkbox style='top: 2px' v-model='paymentInfo.terms.value'>
          <template v-slot:label>
            <div style="padding-left: 33px; left: -31px; fontSize: 13px;">
              I agree to the
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a href='http://help.smartstay.com/en/articles/3617463-need-to-cancel' v-on="on" @click.stop target='_blank'>Cancelation Policy</a>
                </template>
                Open in new window
              </v-tooltip>, and
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a href='http://help.smartstay.com/en/articles/3617504-our-terms' v-on="on" @click.stop target='_blank'>Terms</a>
                </template>
                Open in new window
              </v-tooltip>.
              {{paymentInfo.terms.error}}
            </div>
          </template>
        </v-checkbox>
      </p>
      <button class='mb-hide bg-primary border-black-20 text-white complete' type="submit" :class='{"disable": chooseRoom.isDisabled}' :disabled='chooseRoom.isDisabled' @click='checkout'>Complete Booking <f-a icon='spinner' v-if='chooseRoom.isDisabled' class='fa-spin'/></button>
    </div>
    <div class="confirm" v-show="confirm">
      <div class="result" v-if='confirmed' >
        <h2><f-a icon="check" /> Your confirmed.</h2>
        <p class="fz-m">Please check your email for your receipt and vouchers.</p>
      </div>
      <div class="result bad" v-else>
        <h2>
          <f-a icon='times' />
        Oops, declined.
        </h2>
        <p class="fz-m">Please check your payment details and try again.</p>
        <!-- <p>{{this.globalError | CapitalizeCase}}</p> -->
      </div>
      <div class="hotel">
        <div class="row">
          <div>
            <p>Your hotel</p>
            <p class="fz-b">{{ hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.name }}</p>
          </div>
          <div class="text-right" v-if='confirmed'>
            <p>Confirmation</p>
            <!-- <p class="fz-b">{{bookingCode}}</p> -->
          </div>
        </div>
        <!-- <p class="info">
          <span><f-a icon='map-marker'/> {{hotel.location.address}} </span>
          <span><f-a icon='phone'/> {{hotel.phone}} </span>
        </p> -->
      </div>
      <div class="date">
        <!-- <p class="fw-m">Check-in at {{hotel.checkin_time.slice(0, 5)}}, Check-out at {{hotel.checkout_time.slice(0, 5)}}</p> -->
        <p>If you require an early checkin or late checkout we recommend contacting your hotel directly.</p>
      </div>
      <div class="cancelation" v-if='confirmed'>
        <p class="fw-m">Free cancelation until 10 days before the event.</p>
        <p>Our general policy offers free cancelation for all hotel bookings unless it is mentioned in the rate “non-refundable”.</p>
      </div>
      <p class="flex btn-group">
        <a target="_blank" v-if='confirmed' href='https://help.priverentals.com/modify-or-cancel-reservation' class="bg-primary text-white btn">Modify</a>
        <a  v-else href='' @click.prevent='$emit("tryAgain")' class="bg-primary text-white btn">Retry</a>
        <a target="_blank" href='https://help.priverentals.com' class="btn btn-transparent">Support</a>
      </p>
    </div>
    <div class="payment-details hide-mb" >
      <div class="detail detail-title">{{ hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.name }}</div>
      <div class="detail">
        <div class="policy">
          View Policy
          <div class="policy-popup">
            <!-- <p>
              {{ room.details_summary.text }}
            </p> -->
            <ul v-if="express_policy && express_policy.length > 0">
              <li v-for="(item, index) in express_policy" :key="index">
                <p>{{ item.title }}</p>
                <p>{{ item.paragraph_data[0] }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detail">Check-in <span>{{ check_in | moment("ddd, MMM DD")}} {{ check_in_time }}</span></div>
      <div class="detail">Check-out<span>{{ check_out | moment("ddd, MMM DD") }} {{ check_out_time }}</span></div>
      <div class="detail">Nights<span>{{ countNights(check_in, check_out) }}</span></div>
      <div class="detail">Rooms<span>{{ roomSum }}</span></div>
      <div class="detail">Rate<div><span class="percent-off">{{hotelInfo.room_data?hotelInfo.room_data.room_0.saving_percentage:''}}% OFF</span><span>${{ exchange(totalSum) }}</span></div></div>
      <div class="detail">Taxes & Fees<div><span>${{exchange(extrasSum)}}</span></div></div>
      <div class="detail total">You pay<div><span>${{exchange((totalSum*countNights(check_in, check_out))+extrasSum)}}</span></div></div>

      <div class="payment-methods__list hide-mb">
        <img src="../../assets/img/icon-visa.png" alt="">
        <img src="../../assets/img/icon-master.png" alt="">
        <img src="../../assets/img/icon-american.png" alt="">
        <img src="../../assets/img/icon-discover.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import getSymbolFromCurrency from 'currency-symbol-map'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
import {mask} from 'vue-the-mask'
import {Checkbox, Radio} from 'vue-checkbox-radio';
import { parse } from 'babylon';
export default {
  name: 'Checkout',
  directives: {
    mask
  },
  props: ['room', 'ppn_bundle', 'check_in', 'check_out', 'check_in_time', 'check_out_time', 'slide', 'express_policy'],
  data () {
    return {
      style: {
        base: {
          fontFamily: 'Avenir, sans-serif',
          fontSize: '16px'
        }
      },
      confirmed: true,
      showPromocode: false,
      globalError: '',
      bookingCode: '',
      cardForm: {
        name: null,
        number: null,
        exp: null,
        cvc: null,
        postal: null
      },
      paymentInfo: {
        first_name: {
          value: '',
          error: ''
        },
        last_name: {
          value: '',
          error: ''
        },
        guest_name_first: {
          value: '',
          error: '',
        },
        guest_name_last: {
          value: '',
          error: '',
        },
        email: {
          value: '',
          error: ''
        },
        phone: {
          value: '',
          error: ''
        },
        terms: {
          value: false,
          error: ''
        },
        billing_address: {
          value: '',
          error: ''
        }
      },
      confirm: false,
      roomSelected: {},
    }
  },
  mounted () {
    console.log('this.hotelInfo.room_data:', this.hotelInfo.room_data)
    $('.cc-number').payment('formatCardNumber');
    $('.cc-exp').payment('formatCardExpiry');
    $('.cc-cvc').payment('formatCardCVC');
  },
  methods: {
    prevStep () {
      this.$emit('prevStep');
    },
    closeModal () {
      this.$emit('close');
    },
    countNights (from, to) {
      var date1 = new Date(from);
      var date2 = new Date(to);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      return numberOfNights
    },
    checkError (field) {
      if (this.paymentInfo[field].error !== '') {
        if (this.paymentInfo[field].value) {
          this.paymentInfo[field].error = ''
        }
      }
    },
    exchange (val) {
      // problem with filters
      return fx.convert(val, {from: 'USD', to: this.$store.state.currency}).toFixed(2)
    },
    checkout () {

      let error = false
      for (let field in this.paymentInfo) {
        if (!this.paymentInfo[field].value) {
          this.paymentInfo[field].error = 'Field is required'
          error = true
        } else {
          this.paymentInfo[field].error = ''
        }
      }
      if (error) {
        return false
      }
      if (!this.cardForm.number || !this.cardForm.postal || !this.cardForm.exp || !this.cardForm.cvc)
        return;
      let _cardType = $.payment.cardType(this.cardForm.number);
      var cardType = ''
      console.log('_cardType.toUpperCase():', _cardType.toUpperCase())
      switch (_cardType.toUpperCase()) {
        case 'VISA':
          cardType = 'VI'
          break
        case 'AMERICAN EXPRESS':
          cardType = 'AX'
          break
        case 'AMEX EXPRESS':
          cardType = 'AX'
          break
        case 'AMEX':
          cardType = 'AX'
          break
        case 'DISCOVER':
          cardType = 'DS'
          break
        case 'MASTERCARD':
          cardType = 'MC'
          break
        default:
          cardType = 'AX'
          break
      }
      console.log('cardType:', cardType)
      let data = {
        first_name: this.paymentInfo.first_name.value,
        last_name: this.paymentInfo.last_name.value,
        guest_name_last: this.paymentInfo.guest_name_last.value,
        guest_name_first: this.paymentInfo.guest_name_first.value,
        email: this.paymentInfo.email.value,
        initials: this.paymentInfo.first_name.value.charAt(0).toUpperCase()+this.paymentInfo.last_name.value.charAt(0).toUpperCase(),
        phone_number: this.paymentInfo.phone.value,
        card_type: cardType,
        card_number: this.cardForm.number.replace(/\s/g, ''),
        expires: this.cardForm.exp.replace('/', '').replace(/\s/g, ''),
        cvc_code: this.cardForm.cvc,
        // address_line_one: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.address.address_line_one,
        // city: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.address.city_name,
        // state_code: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.address.state_code,
        // country_code: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.address.country_code,
        address_line_one: this.paymentInfo.billing_address.value,
        postal_code: this.cardForm.postal,
        ppn_bundle: this.ppn_bundle,
        check_in: new Date(this.check_in).toISOString().slice(0,10), //return YYYY-MM-DD
        check_out: new Date(this.check_out).toISOString().slice(0,10),
        check_in_time: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.check_in_time,
        check_out_time: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.check_out_time,
        hotel_id: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.id,
        hotel_name: this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0.name,
        user_email: this.$store.state.account.authUser.email,
        user_id: this.$store.state.account.authUser.pk,
        total_charge: this.totalSum * this.countNights(this.check_in, this.check_out) + this.extrasSum,
        description: this.description,
      };

      console.log('getExpressBook data:', data)

      this.$store.dispatch('hotel/getExpressBook', { data } )
        .then(res => {
          console.log(res);
          if (res['getHotelExpress.Book'] && res['getHotelExpress.Book'].error) {
            this.confirmed = false
          }
          this.confirm = true;
        }).catch(err => {
          console.log(err);
          this.confirm = true;
        });
    }
  },
  filters: {
    CapitalizeCase (str) {
      if (!str) {
        return ''
      }
      return `${str[0].toUpperCase()}${str.slice(1)}`
    }
  },
  created () {
    this.$parent.$on('checkout', this.checkout)
  },
  computed: {
    ...mapState('hotel', ['hotelDetail']),
    ...mapState('hotel', ['availableRates']),
    ...mapState('hotel', ['availableRatesExpress']),
    ...mapState('hotel', ['hotelInfo']),
    branding () {
      return this.$store.state.branding
    },
    chooseRoom () {
      return this.$store.state.chooseRoom
    },
    guest () {
      return `${this.paymentInfo.first_name.value} ${this.paymentInfo.last_name.value}`
    },
    firstChoosedRoom () {
      return this.chooseRoom.rooms.filter(room => Number(room.quantity) > 0)[0]
    },
    quantity () {
      return this.chooseRoom.rooms.reduce((sum, room) => {
        return sum + Number(room.quantity)
      }, 0)
    },
    currencySymbol () {
      return getSymbolFromCurrency(this.chooseRoom.rooms[0].currency)
    },
    extrasSum () {
      let feeSum = this.availableRates.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + (item.charges.charges.hotel.transaction_values.taxes_and_fees.total * Number(item.quantity))
        }
        return sum
      }, 0)
      let expressFeeSum = this.availableRatesExpress.room_data.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + (item.price_details.display_taxes * Number(item.quantity))
        }
        return sum
      }, 0)
      return feeSum + expressFeeSum;
    },
    nights () {
      return Math.round((this.chooseRoom.end - this.chooseRoom.start) / 1000 / 60 / 60 / 24)
    },
    roomSum () {
      let roomSum = this.availableRates.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + Number(item.quantity)
        }
        return sum
      }, 0)
      let expressRoomSum = this.availableRatesExpress.room_data.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + Number(item.quantity)
        }
        return sum
      }, 0)
      return roomSum + expressRoomSum
    },
    description () {
      let i = 1;
      let roomSum = this.availableRates.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          i++;
          return sum + `Room ${i} - ${Number(item.quantity)} ${item.title} | `
        }
        return sum
      }, '');
      let expressRoomSum = this.availableRatesExpress.room_data.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          i++;
          return sum + `Room ${i} - ${Number(item.quantity)} ${item.title} | `
        }
        return sum
      }, '');
      return roomSum + expressRoomSum + `, ${this.hotelInfo.name}, Other: ${new Date(this.check_in).toISOString().slice(0,10)}-${new Date(this.check_out).toISOString().slice(0,10)}`
    },
    totalSum () {
      let totalSum = this.availableRates.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + (item.charges.charges.hotel.transaction_values.price.total * Number(item.quantity))
        }
        return sum
      }, 0)
      let expressTotalSum = this.availableRatesExpress.room_data.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + (item.price_details.display_price * Number(item.quantity))
        }
        return sum
      }, 0)
      return totalSum + expressTotalSum
    }
  },
  components: {
    Checkbox,
    Radio
  }
}
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

a,
button {
  transition: 0.2s;
  outline: none;
}


.radio-component>input+label>.input-box {
  border-color: #ddd!important;
}

.radio-component>input+label>.input-box>.input-box-circle {
  background: #1f7ed5!important;
}

.agree-input .input-box{
  top: 2px;
}

.agree-input .checkbox-component>input+label>.input-box {
  border-color: #ddd;
  margin-right: 8px;
}
</style>


<style lang="scss" scoped>
a {
  color: #1976d2;
  text-decoration: underline;
}
.percent-off {
  background: #C81449;
  color: white!important;
  padding: 2px 5px;
  border-radius: 5px;
  margin-right: 5px;
}
.payment {
  input {
    width: 100%!important;
    text-align: left!important;
  }
}
.has-error input {
  border-width: 2px;
}
.validation.text-danger:after {
  content: 'Validation failed';
}
.validation.text-success:after {
  content: 'Validation passed';
}
.checkout {
  display: flex;
  padding-bottom: 15px;
}
.text-error {
  font-size: 11px;
}
input {
  outline: none;
}
button.complete {
  font-size: 15px;
  color: #ffffff;
  background: #63c61a;
  border-radius: 3px;
  padding: 10px 20px;
  margin: 0 auto;
  display: block;
  height: 44px;
  max-width: 16.25rem;
  width: 100%;
  &:hover {
    background-color: #6cff00;
  }
  &.disable,
  &.disable:hover {
    background: #ddd!important;
  }
}
header {
  margin-bottom: 15px;
  h3 {
    // font-size: 26px;
    // color: #343434;
    margin-bottom: 10px;
    padding-left: 0;
  }
  svg {
    vertical-align: top;
  }
  p{
    color: #6b6b6b;
    font-size: 13px;
  }
}
.user-info {
  width: calc(100% / 3 * 2);
  padding-right: 50px;
}
form {
  margin-top: 3px;
  margin-bottom: 15px;
  padding-bottom: 3px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &>.form-input {
    width: calc(50% - 10px);
    margin-bottom: 20px;
    &.email {
      width: 100%;
    }
    &>input,
    &>select {
      width: 100%;
      border-radius: 3px;
      padding: 8px 10px 10px;
      border: 1px solid #ddd;
      font-size: 15px;
      color: #212121;
      &.error {
        background-color: transparent!important;
        border-color: #cc0000;
      }
    }
  }
  &>select {
    width: 100%;
    height: 41px;
    margin-left: 0;
    background: transparent;
  }
  .card-info {
    padding-top: 15px;
    width: 100%;
    color: #797979;
    font-size: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // @media (min-width: 600px) {
    //   border-top: 1px solid #dedede;
    // }
    header {
        border-bottom: none;
    }
    .form-group {
      order: 3;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .expires,
      .cvv-code,
      .zip {
        width: calc(100% / 3);
        flex-direction: column;
        input {
          text-align: left;
          width: 90%;
        }
      }
      .zip {
        input {
          padding-left: 40px;
          // background: transparent url(~/assets/img/icons/usa.svg) 0 center no-repeat;
          background-size: auto 25px;
          &.cad {
            // background-image: url('~/assets/img/icons/canada.svg');
          }
        }
      }
    }
    .card-number {
      width: 100%;
      input {
        text-align: left;
        width: 100%;
        margin-left: 0;
      }
    }
    .expires {
      width: 50%;
      justify-content: flex-start;
    }
    .expires,
    .cvv-code {
      display: flex;
      // align-items: center;
      span {
        display: inline-block;
        padding-top: 9px;
      }
      .form-input {
        margin-left: 20px;
      }
      @media (max-width: 1024px) {
        width: 100%;
        margin-bottom: 10px;
        justify-content: space-between;
      }
    }
    input {
      text-align: center;
      padding: 10px 11px 8px;
      font-size: 16px;
      color: #676767;
      width: 70px;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #ddd;
      &.error {
        background-color: transparent!important;
        border-color: #cc0000;
      }
    }
  }
}
.agree-input {
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}
.checkbox-component {
  font-size: 15px;
  color: #828282;
  a{
    text-decoration: underline;
    color: #2a539b;
  }
}
.payment-details {
  width: calc(100% / 3);
  padding-left: 30px;
  color: #9b9b9b;
  border-left: 1px solid #eee;
  font-size: 13px;
  padding-top: 10px;
  @media (min-width: 600px) {
    display: flex;
    flex-direction: column;
  }
  .cancelation {
    margin-bottom: 20px;
    font-size: 10pt;
    svg {
      vertical-align: bottom;
    }
  }
  .detail {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    margin-bottom: 12px;
    &.total {
      padding-bottom: 0;
      span {
        @media (min-width: 991px) and (max-width: 1200px) {
          font-size: 18px;
        }
        @media (min-width: 600px) and (max-width: 991px) {
          font-size: 16px;
        }
        font-size: 24px;
        padding-bottom: 15px;
      }
    }
    &.detail-title {
      color: #343434;
      font-size: 24px;
      font-weight: 300;
    }
    &.each span {
      font-size: 16px;
    }
    &.total,
    &.each {
      border: none;
    }
    span {
      color: #5f5f5f;
      text-align: right;
      &.discount {
        color: #63c61a;
      }
    }
  }
}
.payment-methods__list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  img {
    max-height: 20px;
  }
}
.confirm {
  width: calc(100% / 3 * 2);
  font-weight: 300;
  padding-right: 34px;
  line-height: 1.6em;
  padding-top: 0px;
  padding-bottom: 19px;
  &>div {
    padding-bottom: 13px;
    padding-top: 12px;
    border-bottom: 1px solid #eee;
    &.hotel {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    &:last-of-type {
      border-bottom: none;
    }
  }
  .bad svg path {
    fill: red;
  }
  p:not(.btn-group) {
    color: #929091;
    font-size: 13px;
    // margin-bottom: 5px;
    &.fw-m {
      font-weight: 500;
    }
    &.fz-m {
      color: #000000;
      font-size: 13px;
    }
    &.fz-b {
      color: #000000;
      font-size: 24px;
      @media (max-width: 600px) {
        font-size: 18px;
      }
    }
  }
  .hotel {
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      p {
        margin-bottom: 6px;
      }
      .text-right {
        text-align: right;
      }
    }
    .info {
      color: #000000;
      span {
        margin-right: 15px;
      }
    }
  }
  h2 {
    font-size: 40px;
    margin-bottom: 20px;
    letter-spacing: -1.2px;
    color: #000;
    svg {
      margin-right: 14px;
      path{
        fill: #32cc7b;
      }
    }
  }
  .btn {
    border-radius: 0.3125rem;
    -webkit-transition: background-color 0.3s;
    margin-right: 15px;
    margin-top: 5px;
    width: 180px;
    padding: 9px 40px 7px;
    display: inline-block;
    text-align: center;
    color: #fff;
    text-decoration: none;
  }
  .btn-transparent:hover {
    background: #f0f0f0;
  }
}
.show-mb {
  display: none;
}
@media (max-width: 768px) {
  .footer1 {
    display: flex!important;
    justify-content: flex-end;
    margin-top: 20px;
  }
  .user-info,
  .confirm,
  .payment-details {
    width: 100%;
  }
  .confirm-page {
    .payment-details {
      display: block;
      margin-bottom: 60px;
    }
  }
  .payment-details {
    width: 100%;
    .detail.total {
      margin-bottom: 5px;
      border-bottom: 1px solid #eee;
    }
  }
  .confirm {
    padding-right: 0;
    h2 {
      font-size: 30px;
    }
    .hotel {
      .row {
        flex-direction: column;
        .text-right {
          text-align: left;
        }
      }
    }
  }
  .show-mb {
    display: block;
    &.payment-methods__list {
      display: flex;
      margin-bottom: 20px;
    }
  }
  form {
    margin-top: 0;
    .form-input {
      width: 48%;
    }
    .card-info {
      align-items: flex-start;
      .cancelation {
        order: 4;
        margin: 4px 0;
        font-size: 13px;
        svg {
          vertical-align: bottom;
          margin-right: 8px;
        }
      }
      .form-group {
        order: 3;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .expires,
        .cvv-code,
        .zip {
          width: calc(100% / 3);
          flex-direction: column;
          input {
            text-align: left;
            width: 90%;
          }
        }
      }
      .payment-methods__list {
        width: 100%;
        justify-content: flex-end;
        &>*{
          margin-right: 10px;
        }
      }
    }
  }
  .hide-mb {
    display: none;
  }
  .checkout {
    flex-direction: column;
  }
  .checkout .confirm {
    order: 1;
    padding-right: 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
  }
  .payment-methods__list {
    order: 3;
  }
  .checkout .user-info {
    padding-right: 0;
    order: 2;
  }
  .checkout .payment-details {
    border-left: none;
    padding-left: 0;
    padding-bottom: 16px;
    border-top: 1px solid #eee;
  }
  .confirm-page .payment-details {
    order: 3;
  }
  .modal-wrapper .modal--body-title {
    color: #343434;
  }
  .modal-wrapper .modal--body-title svg {
    fill: #000000;
  }
}
body .modal--body-title-row {
  display: flex;
  flex-wrap: wrap;
  h3, div.card-info {
    flex: 0 60%;
    box-sizing: border-box;
  }
}
.separator {
  display: block;
  width: 100%;
  border-bottom: 1px solid #ddd;
}
.w-100 {
  width: 100%;
}
header {
  margin-top: 10px;
}
.policy {
  position: relative;
  color: #1f8bec;
  cursor: pointer;
  .policy-popup {
    display:none;
    position: absolute;
    top: 20px;
    right: 0px;
    padding: 10px;
    width: 450px;
    background: white;
    box-shadow: 0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19) !important;
    border-radius: 10px;
    border-top-right-radius: 0px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 9;
    color: black;

    ul {
      li {
        color: black;
      }
    }
  }

  .policy-popup:before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    right: 0px;
    top: -30px;
    border: 15px solid;
    border-color: transparent rgba(0,0,0,0.2) rgba(0,0,0,0.2) transparent;
  }

  .policy-popup:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    right: 1px;
    top: -28px;
    border: 14px solid rgba(0,0,0,0.2);
    border-color: transparent #fff #fff transparent;
  }
}

.policy:hover, .policy-popup:hover{
  .policy-popup {
    display: block;
  }
}
@media (max-width: 600px) {
  h3 {
    font-size: 17px;
  }
  .policy-popup {
    width: calc(100vw - 80px)!important;
  }
}
</style>
<style lang="scss">
  body .modal-box.bg-white.checkout {
    background-color: #fff !important;
    .modal-wrapper .modal--header  {
      background-color: #fff !important;
    }
    .modal-wrapper .modal--header  {
      background-color: #fff !important;
    }
  }
</style>
