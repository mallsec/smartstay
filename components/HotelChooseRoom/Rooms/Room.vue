<template>
  <div class="modal--room" :class='{"border-primary": (room.quantity && room.quantity !== "0")}'>
    <div class="modal--room-details">
      <div class="modal--room-image">
				<div class="percent_off mb-show">
					<div class="percent_off_content">33
						<div class="percent_off_label">
							<div class="percent_off_label_item">%</div>
							<div class="percent_off_label_item">OFF</div>
						</div>
					</div>
				</div>
        <img src="http://q-xx.bstatic.com/xdata/images/hotel/max500/34664567.jpg?k=562585f98079c7a8338370b7cc17358ebd2f75135bc23d847492e59de1cd70d6&amp;o=" alt="">
      </div>
      <div class="modal--room-info">
        <h3>
          {{room.title}}
          <!-- , {{room.bedding?room.bedding.length+' bed': ''}} {{(room.bedding && room.bedding.length > 1) ? 's' : ''}}  -->
          <span class="text-sm" style='display: block'></span>
<!--          <p v-if='isMinimalRate' class="discount mb-show">-->
<!--            Save {{ isMinimalRate }}% or ${{ exchange(room.charges.charges.hotel.transaction_values.taxes_and_fees.total) }} per night-->
<!--          </p>-->
        </h3>

				<div class="price_col rate">
					<span class="modal--room-price">
						{{ room.charges.charges.hotel.transaction_values.symbol }}{{ exchange(room.charges.charges.hotel.transaction_values.price.total) }}
					</span>
						<select @change='changeData("quantity")' v-model='room.quantity' ref='quantity'>
							<option value="0">0</option>
							<option
									v-for="(i, index) in room.rooms_available"
									:key="index"
									:value="i">
								{{i}}
							</option>
						</select>
					<p v-if='isMinimalRate' class="discount mb-hide">
						Save {{isMinimalRate}}% or ${{ exchange(room.charges.charges.hotel.transaction_values.taxes_and_fees.total) }} per night
					</p>
				</div>

				<div class="price_col_divider"></div>

        <ul>
          <li>
              <svg  viewBox="0 0 50 50" version="1.1" width="24px" height="24px">
                <path d="M 25 7 C 15.941406 7 7.339844 10.472656 0.78125 16.773438 L 0.0625 17.464844 L 5.59375 23.230469 L 6.320313 22.539063 C 11.378906 17.679688 18.015625 15 25 15 C 31.984375 15 38.621094 17.679688 43.683594 22.539063 L 44.40625 23.230469 L 49.941406 17.464844 L 49.21875 16.769531 C 42.660156 10.46875 34.058594 7 25 7 Z M 25 19 C 19.046875 19 13.394531 21.28125 9.085938 25.421875 L 8.363281 26.113281 L 13.921875 31.90625 L 14.644531 31.210938 C 17.464844 28.496094 21.144531 27 25 27 C 28.855469 27 32.535156 28.496094 35.355469 31.210938 L 36.078125 31.90625 L 41.636719 26.113281 L 40.917969 25.421875 C 36.605469 21.28125 30.953125 19 25 19 Z M 25 31 C 22.15625 31 19.453125 32.089844 17.390625 34.074219 L 16.671875 34.765625 L 25 43.441406 L 33.328125 34.765625 L 32.609375 34.074219 C 30.546875 32.089844 27.84375 31 25 31 Z "/>
              </svg>
              Free Wifi
          </li>
          <li v-if="room.amenities.free_breakfast == 1">
             <svg  viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
              <path d="M 11 2 C 11 3.277344 10.78125 3.28125 10.28125 3.78125 C 9.78125 4.28125 9 5.277344 9 7 L 11 7 C 11 5.722656 11.21875 5.71875 11.71875 5.21875 C 12.21875 4.71875 13 3.722656 13 2 Z M 14.6875 3 C 14.6875 5.398438 13 5.398438 13 7 L 15 7 C 15 5.5 16.6875 5.699219 16.6875 3 Z M 5 8 L 5 14 C 5 16.199219 6.800781 18 9 18 L 15 18 C 16.902344 18 18.472656 16.660156 18.875 14.875 C 20.664063 14.476563 22 12.910156 22 11 L 22 10 C 22 9.476563 21.816406 8.941406 21.4375 8.5625 C 21.058594 8.183594 20.523438 8 20 8 Z M 19 10 L 20 10 L 20 11 C 20 11.808594 19.613281 12.429688 19 12.75 Z M 2 19 C 2 20.699219 3.300781 22 5 22 L 19 22 C 20.699219 22 22 20.699219 22 19 Z "/>
            </svg>
             Free Breakfest
          </li>
          <li v-if="room.amenities.mobile_exclusive == 1">
            <svg  viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
              <path  d="M 20.175781 4.367188 C 19.902344 3.550781 19.140625 3 18.277344 3 L 5.722656 3 C 4.859375 3 4.097656 3.550781 3.824219 4.367188 L 2 9.839844 L 2 20 C 2 20.550781 2.449219 21 3 21 L 5 21 C 5.550781 21 6 20.550781 6 20 L 6 18 L 18 18 L 18 20 C 18 20.550781 18.449219 21 19 21 L 21 21 C 21.550781 21 22 20.550781 22 20 L 22 9.839844 Z M 5.5 15 C 4.671875 15 4 14.328125 4 13.5 C 4 12.671875 4.671875 12 5.5 12 C 6.328125 12 7 12.671875 7 13.5 C 7 14.328125 6.328125 15 5.5 15 Z M 18.5 15 C 17.671875 15 17 14.328125 17 13.5 C 17 12.671875 17.671875 12 18.5 12 C 19.328125 12 20 12.671875 20 13.5 C 20 14.328125 19.328125 15 18.5 15 Z M 4.054688 10 L 5.722656 5 L 18.28125 5 L 19.945313 10 Z "/>
            </svg>

          </li>
          <li v-if="room.amenities.mobile_exclusive == 1">
            <svg data-v-aa3c727c="" aria-hidden="true" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16">
              <path data-v-aa3c727c="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path>
            </svg>
            Mobile Exclusive
          </li>
          <li v-if="room.amenities.all_inclusive == 1">
            <svg data-v-aa3c727c="" aria-hidden="true" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16">
              <path data-v-aa3c727c="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path>
            </svg>
            All Inclusive
          </li>
          <li v-if="room.occupancy_limit">
            <svg data-v-aa3c727c="" aria-hidden="true" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16">
              <path data-v-aa3c727c="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path>
            </svg>
            Sleeps {{ 2 * beds }}
          </li>
        </ul>

				<div class="modal--room-quantity mobile_mod">
					<div class="rate mb-hide">
						<div>
            <span class="modal--room-price">
              {{ room.charges.charges.hotel.transaction_values.symbol }}{{ exchange(room.charges.charges.hotel.transaction_values.price.total) }}
            </span>
							<select @change='changeData("quantity")' v-model='room.quantity' ref='quantity'>
								<option value="0">0</option>
								<option
										v-for="(i, index) in room.rooms_available"
										:key="index"
										:value="i">
									{{i}}
								</option>
							</select>
						</div>
						<p v-if='isMinimalRate' class="discount mb-hide">
							Save {{isMinimalRate}}% or ${{ exchange(room.charges.charges.hotel.transaction_values.taxes_and_fees.total) }} per night
						</p>
					</div>
					<div class="policy">
						View Policy
						<div class="policy-popup">
							<ul v-if="room.policies && Object.values(room.policies).length > 0">
								<li v-for="(item, index) in Object.values(room.policies)" :key="index">
									<p>{{ Object.keys(room.policies)[index] }}</p>
									<p>{{ item.description }}</p>
								</li>
							</ul>
						</div>
					</div>
				</div>

      </div>
      <div class="modal--room-quantity desktop_mod">
        <div class="rate mb-hide">
          <div>
            <span class="modal--room-price">
              {{ room.charges.charges.hotel.transaction_values.symbol }}{{ exchange(room.charges.charges.hotel.transaction_values.price.total) }}
            </span>
            <select @change='changeData("quantity")' v-model='room.quantity' ref='quantity'>
              <option value="0">0</option>
              <option
                v-for="(i, index) in room.rooms_available"
                :key="index"
                :value="i">
                  {{i}}
              </option>
            </select>
          </div>
          <p v-if='isMinimalRate' class="discount mb-hide">
            Save {{isMinimalRate}}% or ${{ exchange(room.charges.charges.hotel.transaction_values.taxes_and_fees.total) }} per night
          </p>
        </div>
        <div class="policy">
          View Policy
          <div class="policy-popup">
            <ul v-if="room.policies && Object.values(room.policies).length > 0">
              <li v-for="(item, index) in Object.values(room.policies)" :key="index">
                <p>{{ Object.keys(room.policies)[index] }}</p>
                <p>{{ item.description }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getSymbolFromCurrency from 'currency-symbol-map'
import { mapState, mapGetters } from 'vuex'
export default {
  props: ['index', 'room'],
  name: 'Room',
  computed: {
    beds () {
      if(this.room.bedding && this.room.bedding.length > 0 && this.room.bedding[0].count) {
        return parseInt(this.room.bedding[0].count);
      }
      return 1;
    },
    isMinimalRate () {
      return this.exchange((this.room.charges.charges.hotel.transaction_values.taxes_and_fees.total) / this.exchange(this.room.charges.charges.hotel.transaction_values.total) / 100)
    },
    // nights () {
    //   return Math.round((new Date(this.room.checkout_date) - new Date(this.room.checkin_date)) / 1000 / 60 / 60 / 24)
    // },
    // amenitiesCount () {
    //   return +this.room.in_room_wifi + +this.room.breakfast_included + +this.room.free_parking + +this.room.accessible + +this.room.ocean_view + +this.room.shuttle_included + +this.room.extra_sofa_bed + +this.room.non_smoking
    // }
  },
  mounted() {
    // this.room.quantity = 1;
  },
  methods: {
    exchange (val) {
      return parseInt(val);
    },
    changeData (field) {
      let value = this.room[field]
      console.log({
        field,
        plan_code: this.room.plan_code,
        value
      })
      this.$store.commit('hotel/changeAvailableRatesData', {
        field,
        plan_code: this.room.plan_code,
        value
      })
      this.$forceUpdate();
    },
    totalPrice(price, currency) {
      return `${getSymbolFromCurrency(currency)}${price.toString().slice(0, -2)}`
    }
  }
}
</script>

<style lang="scss" scoped>
li svg{
  fill: #63c61a;
  width: 13px;
  height: 13px;
}

.old-price {
  text-decoration: line-through;
  color: #D9D9D9;
}

.discount {
  width: 100%;
  text-align: right;
  font-size: 11pt;
  font-weight: 400;
  margin-top: 6px;
  color: #e40000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal--room-quantity {
  justify-content: flex-end;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-end;
  div.rate {
    display: flex;
    flex-direction: column;
    div {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      .modal--room-price {
        display: flex;
      }
    }
  }
}

li.no-icon {
  padding-left: 28px;
}

span.text-sm {
  font-size: 0.7em;
}

.text-info {
  width: 100%;
  font-size: 14px;
  color: rgba(0,0,0,0.7);
  padding-left: 10px;
}

.text-error {
  padding-left: 10px;
}

.full-width li {
  width: 100%!important;
}

h3 .discount {
  text-align: left;
  margin-top: 0;
}

.modal--room-image img {
  width: 220px;
  height: 150px
}

.policy {
  position: relative;
	margin-top: 10px;
  color: #408AE4;
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

  .discount {
    font-size: 15px;
  }

  .modal--room-quantity {
    flex-wrap: nowrap;
  }
  .modal--room-quantity .modal--room-price{
    display: inline-flex;
  }

  .modal--room-price {
    font-size: 18px;
  }

  .modal--room-image {
    width: 100%;
  }

  .policy-popup {
    width: calc(100vw - 80px)!important;
  }

}
</style>
