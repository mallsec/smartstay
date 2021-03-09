<template>
  <div id="checkout_2" class="checkout" :class="{'confirm-page': slide === 'confirm'}">
    <div class="user-info" v-show='slide === "checkout"'>
      <header>
        <h3 class="modal--body-title">
          <svg viewBox="0 0 32 32" version="1.1" width="27px" height="27px">
            <g id="surface1">
              <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z "/>
            </g>
          </svg>
         Secure payment
        </h3>
        <p>We use the highest encryption for your hotel booking safety.</p>
      </header>
      <form @submit.prevent>
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
        <div class="form-input">
          <input
           @change='checkError("address")'
           type="text"
           :class="{'error': paymentInfo.address.error}"
           placeholder="Address"
           v-model="paymentInfo.address.value">
          <p class="text-error">{{paymentInfo.address.error}}</p>
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

        <div class="payment-details show-mb">
          <div class="detail">Check-in <span>{{ chooseRoom.start | moment("ddd, MMM DD")}}</span></div>
          <div class="detail">Check-out<span>{{ chooseRoom.end | moment("ddd, MMM DD") }}</span></div>
          <div class="detail">Room type<span>{{firstChoosedRoom.type}}</span></div>
          <div class="detail">Number of rooms<span>{{quantity}}</span></div>
          <div class="detail">Room ({{nights}} night)<span> <span v-if="isFiniteNumber(discount)" class="discount">{{discount}}% Off</span> {{currencySymbol}}{{exchange((firstChoosedRoom.total_price - firstChoosedRoom.taxes_and_fees) / 100)}}</span></div>
          <div class="detail" v-if='extrasSum > 0'>Admission & Extras<span><span v-if='chooseRoom.extras[0].discount && isFiniteNumber(chooseRoom.extras[0].discount)' class="discount">{{parseInt(chooseRoom.extras[0].discount)}}% Off</span> {{currencySymbol}}{{exchange(extrasSum)}}</span></div>
          <div class="detail">Taxes & Fees<span>{{currencySymbol}}{{exchange(firstChoosedRoom.taxes_and_fees / 100)}}</span></div>
          <div class="detail total">You pay<span>{{$store.state.currency}} ${{exchange(totalSum)}}</span></div>
          <div class="payment-methods__list hide-mb" v-if='slide === "checkout"'>
            <img src="../../assets/img/icon-visa.png" alt="">
            <img src="../../assets/img/icon-master.png" alt="">
            <img src="../../assets/img/icon-american.png" alt="">
            <img src="../../assets/img/icon-discover.png" alt="">
          </div>
        </div>

        <div class="card-info">
          <header>
            <h3 class="modal--body-title">
              <img style='top: 0' src="../../assets/img/icons/card.png" alt="">
              Add payment method
            </h3>
            <p>Please enter your credit card below. You will be asked a present a valid credit card with identification at checkin. </p>
          </header>
          <div class="payment-methods__list show-mb" v-if='slide === "checkout"'>
            <img src="../../assets/img/icon-visa.png" alt="">
            <img src="../../assets/img/icon-master.png" alt="">
            <img src="../../assets/img/icon-american.png" alt="">
            <img src="../../assets/img/icon-discover.png" alt="">
          </div>
          <div class="form-group">
              <div id="card-element" class="form-input card-number">
              </div>
              <p class="text-error">{{paymentInfo.card_number.error}}</p>
          </div>
        </div>
      </form>
      <p class="agree-input">
        <checkbox style='top: 2px' v-model='paymentInfo.terms.value'>
          I agree to the
          <a href='http://help.priverentals.com/modify-or-cancel-reservation/cancelation-policies' target='_blank'>cancelation policy</a>,
          <a href='http://help.priverentals.com/something-else/our-terms' target="_blank">terms of use</a>.
          <p class="text-error">{{paymentInfo.terms.error}}</p>
        </checkbox>
      </p>
      <button class='hide-mb bg-primary border-black-20 text-white' :class='{"disable": chooseRoom.isDisabled}' :disabled='chooseRoom.isDisabled' @click='checkout'>Complete Booking <f-a icon='spinner' v-if='chooseRoom.isDisabled' class='fa-spin'/></button>
    </div>
    <div class="confirm" v-show='slide !== "checkout"'>
      <div class="result" v-if='confirmed' >
        <h2><f-a icon="check" /> Your confirmed.</h2>
        <p class="fz-m">Please check your email for your receipt and vouchers.</p>
        <p>Please check your email for your receipt and vouchers.</p>
      </div>
      <div class="result bad" v-else>
        <h2>
          <f-a icon='times' />
        Oops, declined.
        </h2>
        <p class="fz-m">Please check your payment details and try again.</p>
        <p>{{this.globalError | CapitalizeCase}}</p>
      </div>
      <div class="hotel">
        <div class="row">
          <div>
            <p>Your hotel</p>
            <p class="fz-b">{{hotel.name}}</p>
          </div>
          <div class="text-right" v-if='confirmed'>
            <p>Confirmation</p>
            <p class="fz-b">{{bookingCode}}</p>
          </div>
        </div>
        <p class="info">
          <span><f-a icon='map-marker'/> {{hotel.location.address}} </span>
          <span><f-a icon='phone'/> {{hotel.phone}} </span>
        </p>
      </div>
      <div class="date">
        <p class="fw-m">Check-in at {{hotel.checkin_time.slice(0, 5)}}, Check-out at {{hotel.checkout_time.slice(0, 5)}}</p>
        <p>If you require an early checkin or late checkout we recommend contacting your hotel directly.</p>
      </div>
      <div class="cancelation" v-if='confirmed'>
        <p class="fw-m">Non-Refundable Discounted Rate</p>
        <p>Our general policy is that all member and fans hotel bookings are non-refundable unless it is mentioned in the rate "Refundable”.</p>
      </div>
      <p class="flex btn-group">
        <a target="_blank" v-if='confirmed' href='http://help.smartstay.com/en/articles/3617445-cancel-my-reservation' class="bg-primary text-white btn">Modify</a>
        <a  v-else href='' @click.prevent='$emit("tryAgain")' class="bg-primary text-white btn">Retry</a>
        <a target="_blank" href='http://http://help.smartstay.com/' class="bg-primary text-white btn">Support</a>
      </p>
    </div>
    <div class="payment-details hide-mb" >
      <img :src="`${event.branding.aws_url}${event.branding.dark_logo}`"
      style='
        max-width: 90%;
        vertiacl-align:middle;
        max-height: 45px;
        width: auto;
        margin: 0 auto 20px;' alt="">
      <div class="detail">Guest info <span>{{guest}}</span></div>
      <div class="detail">Check-in <span>{{ chooseRoom.start | moment("ddd, MMM DD")}}</span></div>
      <div class="detail">Check-out<span>{{ chooseRoom.end | moment("ddd, MMM DD") }}</span></div>
      <div class="detail">Room type<span>{{firstChoosedRoom.type}}</span></div>
      <div class="detail">Number of rooms<span>{{quantity}}</span></div>
      <div class="detail">Room ({{nights}} night)<span> <span class="discount" v-if="isFiniteNumber(discount)">{{discount}}% Off</span> {{currencySymbol}}{{exchange((firstChoosedRoom.total_price - firstChoosedRoom.taxes_and_fees) / 100)}}</span></div>
      <div class="detail" v-if='extrasSum > 0'>Admission & Extras<span><span v-if='chooseRoom.extras[0].discount' class="discount">{{parseInt(chooseRoom.extras[0].discount)}}% Off</span> {{currencySymbol}}{{exchange(extrasSum)}}</span></div>
      <div class="detail">Taxes & Fees<span>{{currencySymbol}}{{exchange(firstChoosedRoom.taxes_and_fees / 100)}}</span></div>
      <div class="detail total">You pay<span>{{$store.state.currency}} ${{exchange(totalSum)}}</span></div>

      <div class="payment-methods__list hide-mb" v-if='slide === "checkout"'>
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
import axios from 'axios'
import {mask} from 'vue-the-mask'
import {Checkbox, Radio} from 'vue-checkbox-radio';
import { parse } from 'babylon';
export default {
  name: 'Checkout',
  directives: {
    mask
  },
  props: ['slide', 'hotel', 'discount', 'event'],
  data () {
    return {
      stripe: Stripe('pk_live_DApUVkTbC4mTstIZv1K7DA5i'),
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
      cardForm: null,
      paymentInfo: {
        first_name: {
          value: '',
          error: ''
        },
        last_name: {
          value: '',
          error: ''
        },
        email: {
          value: '',
          error: ''
        },
        address: {
          value: '',
          error: ''
        },
        phone: {
          value: '',
          error: ''
        },
        card_number: {
          value: '+',
          error: ''
        },
        terms: {
          value: false,
          error: ''
        }
      }
    }
  },
  mounted () {
    this.cardForm = this.stripe.elements().create('card', {style: this.style})
    this.cardForm.mount('#card-element')
    this.cardForm.addEventListener('change', (event) => {
      if (event.error) {
        this.paymentInfo.card_number.error = event.error.message;
      } else {
        this.paymentInfo.card_number.error = '';
      }
    })
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

      this.$store.commit('setDisabled', true)
      this.stripe.createToken(this.cardForm, {
          "name": this.guest
      }).then(resp => {
        if (resp.error) {
          this.$store.commit('setDisabled', false)
          this.confirmed = false
          this.$emit('confirm')
          this.globalError = resp.error.message
          return false
        }
        let tickets = this.chooseRoom.extras.filter(extra => extra.quantity > 0)
        tickets.forEach(ticket => ticket.stripe_token = resp.token.id)
        this.globalError = ''
        axios({
          method: 'post',
          url: 'https://api.smartstay.com/v3/booking/',
          headers: {
            'Short-Name': this.$route.query.client
          },
          data: {
            "currency": this.$route.query.main_currency || 'USD',
            "email": this.paymentInfo.email.value,
            "name": this.guest,
            "phone": this.paymentInfo.phone.value,
            "room_key": this.firstChoosedRoom.key,
            "stripe_token": resp.token.id,
            "lang": "en",
            total: this.exchange(this.totalSum),
            tickets
          }
        }).then(resp => {
          this.$emit('confirm')
          this.$store.commit('setDisabled', false)
          this.confirmed = true
          this.bookingCode = resp.data.booking_code
        }).catch(err => {
          console.log(err.response)
          this.$store.commit('setDisabled', false)
          this.$emit('confirm')
          this.confirmed = false
          if (err.response.status === 403) {
            if (err.response.data.detail.indexOf('ERROR') >= 0) {
              this.globalError = err.response.data.detail.slice(err.response.data.detail.indexOf('ERROR') + 6, -1)
            } else {
              this.globalError = err.response.data.detail
            }
          } else if (err.response.status === 400) {
            for (let error in err.response.data.errors) {
              this.globalError += err.response.data.errors[error][0]
            }
          }
        })
      })
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
      return this.chooseRoom.extras.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + ((item.price - (item.price / 100 * item.discount)).toFixed(2) * Number(item.quantity))
        }
        return sum
      }, 0)
    },
    nights () {
      return Math.round((this.chooseRoom.end - this.chooseRoom.start) / 1000 / 60 / 60 / 24)
    },
    roomSum () {
      return this.chooseRoom.rooms.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + (item.total_price / 100 * Number(item.quantity))
        }
        return sum
      }, 0)
    },
    totalSum () {
      const roomSum = this.chooseRoom.rooms.reduce((sum, item) => {
        if (Number(item.quantity) > 0) {
          return sum + (item.total_price / 100 * Number(item.quantity))
        }
        return sum
      }, 0)
      return roomSum + this.extrasSum
    }
  },
  watch: {
    slide () {
      this.cardForm = this.stripe.elements().create('card', {style: this.style})
      this.cardForm.mount('#card-element')
      this.cardForm.addEventListener('change', (event) => {
        if (event.error) {
          this.paymentInfo.card_number.error = event.error.message;
        } else {
          this.paymentInfo.card_number.error = '';
        }
      })
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
.checkout {
  display: flex;
}

.text-error {
  font-size: 11px;
}

input {
  outline: none;
}

button {
  font-size: 15px;
  color: #ffffff;
  background: #63c61a;
  border-radius: 3px;
  padding: 10px 20px;
  border: 1px solid rgba(0,0,0,.2);
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
    color: #797979;
    font-size: 13px;
  }
}

.user-info {
  width: calc(100% / 3 * 2);
  padding-right: 50px;
}

form {
  margin-top: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
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
      padding: 10px 12px 8px;
      border: 1px solid #ddd;
      font-size: 16px;
      color: #676767;

      &.error {
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

    @media (min-width: 600px) {
      border-top: 1px solid #dedede;
    }

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
        border-color: #cc0000;
      }
    }
  }
}

.agree-input {
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.checkbox-component {
  font-size: 15px;
  color: #828282;
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
      }
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
  font-family: Avenir;
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
      font-size: 16px;
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
    border: 1px solid #dedede;
    border-radius: 0.3125rem;
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
    margin-right: 15px;
    margin-top: 5px;
    width: 180px;
    padding: 9px 40px 7px;
    display: inline-block;
    text-align: center;
  }

  .btn-transparent:hover {
    background: #f0f0f0;
  }
}

.show-mb {
  display: none;
}
@media (max-width: 600px) {
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
				justify-content: flex-start;

				& > * {
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
	}
	.confirm-page .payment-details {
		order: 3;
	}
}

@media (max-width: 768px) {
	div.user-info header p {
		color: #fee;
	}

	div.detail {
		color: #dbdbdb;
	}

	div.detail span,
	div.detail.total span,
	.payment-details .detail span {
		color: #fff;
	}


	label.v-label.theme--light div,
	label.v-label.theme--light div a {
		color: #fff;
	}

	i.v-icon.material-icons.theme--light,
	i.v-icon.material-icons.theme--light.accent--text {
		color: #fff;
	}
}
</style>
