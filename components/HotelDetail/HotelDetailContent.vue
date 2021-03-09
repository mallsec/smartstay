<template>
  <div class="hotel_detail_info_item" v-if="hotelDetailData && !getDirections">
    <div class="hotel_detail_info_item_header mb-5">
      <h3 class="hotel_detail_info_item_title pt-6">
        {{ hotelInfo.room_data.room_0.price_details.display_symbol }}
        {{parseInt(hotelInfo.room_data.room_0.price_details['display_price'])}}/night
        <span style="color: #6FBAE5" v-if="!hotel.hotelsapi_vendors_loading && (hotel.saving_percentage || hotelInfo.room_data.room_0.saving_percentage) > 0">
          {{ hotel.saving_percentage || hotelInfo.room_data.room_0.saving_percentage }}% Off</span>
      </h3>
      <div class="hotel_detail_info_item_sites">
        <div class="hotel_rate" v-for="(vendor, index) in hotel.hotelsapi_vendors" :key="index">
          <span class="hotel_rate_val">{{Object.keys(vendor)[0]}}</span>
          <span class="hotel_rate_val decor_mod">...</span>
          <span class="hotel_rate_val">${{Object.values(vendor)[0]}}</span>
        </div>
        <div class="hotel_price info_mod loading" v-if="hotel.hotelsapi_vendors_loading">
          Loading<span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    </div>
    <p class="hotel_detail_info_descr">
      <read-more more-str="read more" :text='`"${hotelDetailData.hotel_description}"`' link="#"
                 :max-chars="300"></read-more>
    </p>
    <style>
      .hotel_detail_info_item_sites {
        margin-bottom: 0!important;
      }

      .hotel_rate {
        width: 30%;
        padding-right: 3.3%;
      }

      .hotel_rate_val {
        display: block !important;
        color: white !important;
      }

      @keyframes blink {
        0% {
          opacity: .2;
        }
        20% {
          opacity: 1;
        }
        100% {
          opacity: .2;
        }
      }

      .loading {
        color: white;
      }

      .loading span {
        animation-name: blink;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-fill-mode: both;
      }

      .loading span:nth-child(2) {
        animation-delay: .2s;
      }

      .loading span:nth-child(3) {
        animation-delay: .4s;
      }
    </style>
  </div>
</template>
<script>
  import HotelsapiHelpers from "@/components/Hotelsapi.vue"
  import _ from 'lodash';

  export default {
    props: ['hotelDetailData', 'hotelInfo', 'getDirections'],
    data() {
      return {
        hotel: {hotelsapi_vendors_loading: true}
      }
    },
    methods: {
      applyChanges() {
        this.hotel = _.clone(this.hotel);
      },
      comparePrices(hotel_name) {
        let start = new Date(this.$route.query.check_in);
        let end = new Date(this.$route.query.check_out);
        return this.$store.dispatch('hotel/getHotelsapiInfo', {
          check_in: this.$formatDateRaw(start),
          check_out: this.$formatDateRaw(end),
          hotel_name: hotel_name,
          city_name: this.$store.state.city.cityInfo.city,
          pax: this.$store.state.chooseRoom.guests || this.$route.query.guests,
          currency: this.$store.state.currency,
        }).then((data) => {
          HotelsapiHelpers.applyHotelsapi(null, data, null, this.applyChanges, this.hotel, this.hotelInfo.room_data.room_0.price_details['display_price']);
        }).catch(() => {
          this.hotel.hotelsapi_vendors_loading = false
        });
      }
    },
    mounted() {
      this.comparePrices(this.hotelInfo.name);
    }
  }
</script>
