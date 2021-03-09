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
        <img src='//assets-cdn.rezserver.com/media/responsive_hotel/rate_fallback.jpg' alt="">
      </div>
      <div class="modal--room-info">
        <h3>
          {{ room.title }}
          <!-- , {{room.bedding_data?room.bedding_data.length*room.occupancy_limit+' bed': ''}}{{(room.bedding_data && room.bedding_data.length > 1) ? 's' : ''}}  -->
          <span class="text-sm" style='display: block'></span>
<!--          <p v-if='room.saving_percentage' class="discount mb-show">-->
<!--            Save {{ room.saving_percentage }}% or ${{ exchange(room.benchmark_price - room.price_details.display_price) }} per night-->
<!--          </p>-->
        </h3>

				<div class="price_col rate">
					<div>
            <span class="modal--room-price">
              {{ room.price_details.display_symbol }}{{ exchange(room.price_details.display_price) }}
            </span>
						<select @change='changeData("quantity")' v-model='room.quantity' ref='quantity'>
							<option value="0">0</option>
							<option
									v-for="(i, index) in 1"
									:key="index"
									:value="i">
								{{i}}
							</option>
						</select>
					</div>
					<p v-if='room.saving_percentage' class="discount mb-hide">
						Save {{room.saving_percentage}}% or ${{ exchange(room.benchmark_price - room.price_details.display_price) }} per night
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
          <li v-if="room.occupancy_limit">
            <svg data-v-aa3c727c="" aria-hidden="true" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16">
              <path data-v-aa3c727c="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path>
            </svg>
            Sleeps {{ 2 * beds }}
          </li>
          <li v-if="room.occupancy_limit">
            <svg data-v-aa3c727c="" aria-hidden="true" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-check fa-w-16">
              <path data-v-aa3c727c="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path>
            </svg>
            Member rate
          </li>
        </ul>

				<div class="modal--room-quantity mobile_mod">
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
      </div>
      <div class="modal--room-quantity desktop_mod">
        <div class="mb-hide rate">
          <div>
            <span class="modal--room-price">
              <span class="old-price">${{exchange(room.benchmark_price)}}</span>
              {{ room.price_details.display_symbol }}{{ exchange(room.price_details.display_price) }}
            </span>
            <select @change='changeData("quantity")' v-model='room.quantity' ref='quantity'>
              <option value="0">0</option>
              <option
                v-for="(i, index) in 1"
                :key="index"
                :value="i">
                  {{i}}
              </option>
            </select>
          </div>
          <p v-if='room.saving_percentage' class="discount mb-hide">
            Save {{room.saving_percentage}}% or ${{ exchange(room.benchmark_price - room.price_details.display_price) }} per night
          </p>
        </div>
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
    </div>
  </div>
</template>

<script>
import getSymbolFromCurrency from 'currency-symbol-map'
import { mapState, mapGetters } from 'vuex'
export default {
  props: ['index', 'room', 'express_policy'],
  name: 'Room',
  computed: {
    beds () {
      if(this.room.bedding_data && this.room.bedding_data.length > 0 && this.room.bedding_data[0].bed_count) {
        return parseInt(this.room.bedding_data[0].bed_count);
      }
      return 1;
    },
  },
  mounted() {
    console.log(this.room);
    // this.room.quantity = 1;
  },
  methods: {
    exchange (val) {
      return parseInt(val);
    },
    changeData (field) {
      let value = this.room[field]
      this.$store.commit('hotel/changeAvailableRatesExpress', {
        field,
        rate_plan: this.room.rate_plan,
        value
      });
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
	margin-top: 8px;
  color: #1f8bec;
  cursor: pointer;
  .policy-popup {
    display:none;
    position: absolute;
    top: 26px;
    right: 0px;
    padding: 10px;
    width: 750px;
    background: white;
    box-shadow: 0 5px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19) !important;
    border-radius: 5px;
    border-top-right-radius: 0px;
    max-height: 400px;
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

  .modal--room-image {
    width: 100%;
  }

  .discount {
    font-size: 13px;
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

  .policy-popup {
    width: calc(100vw - 80px)!important;
  }

}
</style>
