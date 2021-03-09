<template>
  <div>
    <header v-if='event' class="city_header header_bg_mod city-title text-white" ref='eventTitle'>
      <div class="city_header_in" :class="getDirections ? 'max-with-none head-container' : ''">
        <div class="city_header_col" :class="getDirections ? 'pl-0' : ''">
          <img ref='mainBgImg' :src="`${event.branding.aws_url}${event.branding.light_logo}`"
               :height="event.branding.logo_height" :width="event.branding.logo_width" alt="">
          <h2>Hotels for {{event.city}}, {{eventStart | moment("MMMM DD")}}-{{eventEnd | moment("DD")}}</h2>
          <p>Book your experience at these hotels for {{event.name}}.</p>
          <span class="date-button btn_filter">
            {{ start | moment("DD MMM")}} - {{ end | moment("DD MMM") }}
            <HotelDatePicker
                @checkInChanged='changeStartDate'
                @checkOutChanged='changeEndDate'
                format="DD/MM/YYYY"
                :startingDateValue='typeof start === "string" ? getCorrectDate("startDate") :  start'
                :endingDateValue='typeof end === "string" ? getCorrectDate("endDate") :  end'
                :startDate='minDay'
                :enableCheckout='true'
                :endDate='maxDay'
            />
          </span>
          <span @click.self='showDropdown = !showDropdown' class="btn_filter guests">{{guests}} Guest{{guests > 1 ? 's'
            : ''}}
            <div class="dropdown" v-if='showDropdown && maxGuests > 1'>
              <span v-for='val in maxGuests' :key="val" @click='guests = val;showDropdown = false'>{{val}} Guest{{val >
                1 ? 's' : ''}}</span>
            </div>
          </span>
          <span @click.self='showDropdownSortBy = !showDropdownSortBy' class="btn_filter guests">Filter
            <div class="dropdown" v-if='showDropdownSortBy'>
              <span class="dropdown_item" v-for='val in ["Distance", "Cheapest", "Best Rated"]' :key="val"
                    @click='sort_by = val;showDropdownSortBy = false'>{{val}}</span>
            </div>
          </span>
        </div>
        <div class="city_header_col map_mod">
          <div class="map city_mod" data-id="map" v-if='event && !getDirections'>
            <a v-on:click="handleGetMapDirections()"
               class="map_btn">
              View Map
            </a>
            <gmap-map
                :center='{lat: Number(event.venues[0].location.lat), lng: Number(event.venues[0].location.lng)}'
                :zoom="11"
                :draggable="true"
                ref='map'
                style='height: 100%;width:100%'
                :options='{scrollwheel: false, fullscreenControl: false, mapTypeControl: false}'>
            </gmap-map>
          </div>
        </div>
      </div>
    </header>
    <section class="city_main_section id_mod">
      <div class="map" data-id="map" v-if='event && getDirections' :class="getDirections ? 'full-screen-map' : ''"
           :style='!getDirections ? `max-height: ${hotelListHeight}px` : ``'>
        <gmap-map
            :center='mapCenter'
            :zoom="11"
            :draggable="true"
            ref='map'
            style='height: 100%;width:100%'
            :options='{scrollwheel: false, fullscreenControl: false, mapTypeControl: false}'>
          <gmap-marker
              :key="i"
              v-if="getDirections"
              @mouseover="toggleInfoWindow(marker, i)"
              @mouseout="setMarketColorEnabled(marker)"
              v-for="(marker, i) in markers"
              :position="marker.position"
              :clickable="true"
              :title='marker.rate'
              :label="marker.label"
              :zIndex='i+1'
              :draggable="false"
              :icon='marker.icon'
              @click='handleClickMarker(marker)'>
          </gmap-marker>
          <gmap-info-window
              :options="infoOptions"
              :position="infoWindowPos"
              :opened="infoWinOpen"
              @closeclick="infoWinOpen=false"
          >
            <div v-html="infoContent"></div>
          </gmap-info-window>
        </gmap-map>
        <div class="flex-no-shrink btn-overlay" v-if="getDirections">
          <h2 class="text-heading-sm leading-tight">
          </h2>
          <div class="mt-3 -mb-3">
            <div class="mb-3 flex items-center">
              <div class="mr-3 flex justify-center items-center w-7 flex-no-shrink h-6 text-xl">
              </div>
              <div>
                <a v-on:click="hideMapDirections()"
                   class="hover:opacity-80 transition-opacity hide-map">
                  Hide map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main class="flex flex-col city_content" :class="getDirections ? 'no-padding' : ''">
        <div class="hotel_list id_mod" v-if="!getDirections">
          <ul>
            <li
                class="hotel_item flex text-white"
                v-for="(hotel, index) in filteredAvaliableHotels"
                :key="`avaliable-${index}`">
              <div class="hotel_block flex">
                <div class="hotel_image" @click='openNewTab(`/hotel/${hotel.id}/?${queryString}`)'>
                  <div class="percent_off mb-hide" v-if="hotel.discount && isFinite(hotel.discount)">
                    <div class="percent_off_content">
                      {{hotel.discount}}
                      <div class="percent_off_label">
                        <div class="percent_off_label_item">
                          %
                        </div>
                        <div class="percent_off_label_item">
                          OFF
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--                                     <div class="stars">
                                                          {{hotel.stars}}
                                                          <svg  viewBox="0 0 48 48" width="15px" height="15px">
                                                              <path fill='#fff' d="M10.2,48.6c-0.2,0-0.4-0.1-0.6-0.2c-0.3-0.2-0.5-0.7-0.4-1.1l4.4-16.4L0.4,20.2C0,20-0.1,19.5,0,19.1 c0.1-0.4,0.5-0.7,0.9-0.7l17-0.9l6.1-15.9C24.2,1.3,24.6,1,25,1c0.4,0,0.8,0.3,0.9,0.6l6.1,15.9l17,0.9c0.4,0,0.8,0.3,0.9,0.7 c0.1,0.4,0,0.8-0.3,1.1L36.4,30.9l4.4,16.4c0.1,0.4,0,0.8-0.4,1.1c-0.3,0.2-0.8,0.3-1.1,0L25,39.2l-14.3,9.2 C10.5,48.6,10.4,48.6,10.2,48.6z"/>
                                                          </svg>
                                                      </div> -->
                  <img v-if='hotel.photo' :src="hotel.photo.thumbnail_photo" alt="">
                  <a class="hotel_booking mb-show" v-if='hotel.breakfast && Number(hotel.breakfast) === 0'
                     target="_blank" :href="`/hotel/${hotel.id}/?${queryString}&guests=${guests}`">Free breakfast</a>
                </div>
                <div class="flex justify-between info">
                  <div class="hotel_info_col">
                    <p class="name mb-show">
                      <a :href="`/hotel/${hotel.id}/?${queryString}&guests=${guests}`" target="_blank">
                        {{ hotel.name }}
                      </a>
                    </p>
                    <h3 class="hotel_name mb-hide">
                      <a :href="`/hotel/${hotel.id}/?${queryString}&guests=${guests}`" target="_blank">
                        {{ hotel.name }}
                      </a>
                    </h3>
                    <p class="hotel_discount" v-if="hotel.discount && isFinite(hotel.discount)"> Save
                      {{hotel.discount}}% or ${{exchange(Math.max(hotel.expedia_sug_rate, hotel.booking_com_sug_rate) -
                      hotel.rate)}} per night</p>
                    <hotel-stats-list :hotel="hotel" :event="event"></hotel-stats-list>
                  </div>
                  <div class="hotel_info_col prices_mod">
                    <div class="hotel_prices">
                      <span class="hotel_price">
                        ${{exchange(hotel.rate)}}
                      </span>
                      <span class="hotel_price old_mod"
                            v-if="hotel.expedia_sug_rate !== '' || hotel.booking_com_sug_rate !== ''">
                        ${{exchange(Math.max(hotel.expedia_sug_rate, hotel.booking_com_sug_rate))}}
                      </span>
                      <span class="hotel_price info_mod">nightly</span>
                    </div>
                    <a class="hotel_amenities btn-amenities btn f-b-btn"
                       v-if='hotel.breakfast && Number(hotel.breakfast) === 0'
                       target='_blank' :href="`/hotel/${hotel.id}/?${queryString}&guests=${guests}`">Free breakfast</a>
                    <div class="hotel_rates pull-down" v-if="hotel.hotelsapi_vendors">
                      <div class="hotel_rate" v-for="(vendor, vindex) in hotel.hotelsapi_vendors.slice(0,2)"
                           :key="vindex">
                        <span class="hotel_rate_val">{{Object.keys(vendor)[0]}}</span>
                        <span class="hotel_rate_val decor_mod"></span>
                        <span class="hotel_rate_val">{{Object.values(vendor)[0]}}</span>
                      </div>
                    </div>
                    <div class="hotel_price pull-down loading" v-if="hotel.hotelsapi_vendors_loading">
                      Loading<span>.</span><span>.</span><span>.</span>
                    </div>
                    <div class="hotel_price info_mod pull-down" style="display: block!important;"
                         v-if="!hotel.hotelsapi_vendors_loading && hotel.hotelsapi_vendors && hotel.hotelsapi_vendors.length === 0">
                         No Match!
                    </div>
                    <div class="hotel_compare_prices" v-if="!hotel.hotelsapi_vendors && !hotel.hotelsapi_vendors_loading">
                      <a @click="comparePrices(hotel, index, 'avaliableHotels')" class="hotel_compare">Compare
                        Rate</a>
                    </div>

                    <a target='_blank' :href="`/hotel/${hotel.id}/?${queryString}&guests=${guests}`"
                       class="hotel_booking mb-hide">Book now</a>
                  </div>
                </div>
              </div>
            </li>

            <!-- PRICELINE HOTELS -->
            <li
                class="hotel_item flex text-white"
                v-for="(hotel, index) in pricelineHotels"
                :key="`avaliable-priceline-${index}`">
              <div class="hotel_block flex">
                <div class="hotel_image" @click='setHotelInfo(hotel)'>
                  <div class="percent_off mb-hide"
                       v-if="hotel.saving_percentage && hotel.saving_percentage > 0">
                    <div class="percent_off_content">
                      {{ hotel.saving_percentage }}
                      <div class="percent_off_label">
                        <div class="percent_off_label_item">
                          %
                        </div>
                        <div class="percent_off_label_item">
                          OFF
                        </div>
                      </div>
                    </div>
                  </div>


                  <img v-if='hotel.thumbnail && hotel.thumbnail_hq'
                       :src="getThumb(hotel.thumbnail_hq.three_hundred_square)" alt="">
                </div>

                <div class="flex justify-between info">
                  <div class="hotel_info_col">
                    <div class="percent_off mb-show prsnt-btn"
                         v-if="hotel.saving_percentage && hotel.saving_percentage > 0">
                      <div class="percent_off_content">
                        {{ hotel.saving_percentage }}
                        <div class="percent_off_label">
                          <div class="percent_off_label_item">
                            %
                          </div>
                          <div class="percent_off_label_item">
                            OFF
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="name mb-show">
                      <a @click="setHotelInfo(hotel)">
                        {{ hotel.name }}
                      </a>
                    </p>
                    <div class="hotel_rates mb-show">
                      <div class="hotel_rate mb-show">
                        <span class="hotel_rate_val">Save ${{
                          _exchange(hotel.room_data.room_0.benchmark_price_details['display_price'] -
                          hotel.room_data.room_0.price_details['display_price']) }}</span>
                      </div>
                    </div>
                    <h3 class="hotel_name mb-hide">
                      <a @click="setHotelInfo(hotel)">{{ hotel.name }}</a>
                    </h3>
                    <p class="hotel_discount"> Save ${{
                      _exchange(hotel.room_data.room_0.benchmark_price_details['display_price'] -
                      hotel.room_data.room_0.price_details['display_price']) }} per night</p>
                    <hotel-stats-list :hotel="hotel" :event="event"></hotel-stats-list>
                  </div>
                  <div class="hotel_info_col prices_mod">
                    <div class="hotel_prices">
                      <span class="hotel_price old_mod">
                        {{ hotel.room_data.room_0.price_details.display_symbol }}{{
                        _exchange(hotel.room_data.room_0.benchmark_price_details['display_price']) }}
                      </span>
                      <span class="hotel_price">
                        {{ hotel.room_data.room_0.price_details.display_symbol }}{{
                        _exchange(hotel.room_data.room_0.price_details['display_price']) }}
                      </span>
                      <span class="hotel_price info_mod">nightly</span>
                    </div>
                    <a class="hotel_amenities btn-amenities btn f-b-btn"
                       v-if='checkAmenity(hotel, 5)' target='_blank'
                       :href="`/hotel/${hotel.id}/?${queryString}&guests=${guests}`">Free breakfast</a>
                    <div class="hotel_rates pull-down" v-if="hotel.hotelsapi_vendors">
                      <div class="hotel_rate" v-for="(vendor, index) in hotel.hotelsapi_vendors.slice(0,2)" :key="index">
                        <span class="hotel_rate_val">{{Object.keys(vendor)[0]}}</span>
                        <span class="hotel_rate_val decor_mod"></span>
                        <span class="hotel_rate_val">{{Object.values(vendor)[0]}}</span>
                      </div>
                    </div>
                    <div class="hotel_price pull-down loading" v-if="hotel.hotelsapi_vendors_loading">
                      Loading<span>.</span><span>.</span><span>.</span>
                    </div>
                    <div class="hotel_price info_mod pull-down" style="display: block!important;"
                         v-if="!hotel.hotelsapi_vendors_loading && hotel.hotelsapi_vendors && hotel.hotelsapi_vendors.length === 0">
                      No rates found
                    </div>
                    <div class="hotel_compare_prices" v-if="!hotel.hotelsapi_vendors && !hotel.hotelsapi_vendors_loading">
                      <a @click="comparePrices(hotel, index, 'pricelineHotels')" class="hotel_compare">Compare
                        prices</a>
                    </div>
                    <a target='_blank' @click="setHotelInfo(hotel)"
                       class="hotel_booking mb-hide">Book now</a>
                  </div>
                </div>
              </div>

            </li>
          </ul>
        </div>
        <div class="banner">
          <div class="banner_img_wrap v_1_mod">
            <img class="banner_img" src='~/assets/img/town_1.png' alt='img'>
          </div>
          <div class="banner_img_wrap v_2_mod">
            <img class="banner_img" src='~/assets/img/town_2.png' alt='img'>
          </div>
          <div class="banner_content">
            <div class="banner_title">Why just these hotels?</div>
            <div class="banner_text mb-hide">
              Smart rates are un-published and reserved for fans & members.

            </div>
            <div class="banner_text mb-show">
              Learn how to save time and money.
            </div>
            <a class="banner_btn mb-hide" href="https://www.smartstay.com/">More hotels</a>
          </div>
        </div>
      </main>
    </section>

    <loader :load='!isLoaded || !updatedData' v-if='!isLoaded || !updatedData'/>
    <style>
      @media (max-width: 800px) {
        .f-b-btn {
          min-width: 100px;
          position: relative;
          top: -44px;
        }

        .prsnt-btn {
          position: absolute;
          top: -43px;
        }
      }

      .vue-map .gm-style .gm-style-iw.gm-style-iw-c {
        padding: 10px !important;
        border-radius: 0 !important;
      }

      .vue-map .gm-style .gm-style-iw.gm-style-iw-c .gm-style-iw-d {
        overflow: hidden !important;
      }

      .vue-map .gm-style button[title="Close"] {
        display: none !important;
      }

      .vue-map .gm-style .gm-style-iw-t::after {
        top: -1px;
      }

      .v-info-modal .icon {
        width: 16px;
        margin-right: 10px;
        height: 16px;
        display: inline-block;
        text-align: center;
      }
    </style>
  </div>
</template>

<script>
  import AppVideo from "@/components/Video.vue"
  import axios from 'axios'
  import Loader from '@/components/Loader'
  import HotelDatePicker from 'vue-hotel-datepicker'
  import Vue from 'vue'
  import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
  import IconPlay from "@/components/icons/IconPlay.vue"
  import _ from "lodash";
  import HotelsapiHelpers from "@/components/Hotelsapi.vue"
  import HotelStatsList from "@/components/HotelDetail/HotelStatsList"

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyCoOdN9fa1Pg5DYYNyWAWGH4BpCTyZhwuc',
      libraries: 'places, directions'
    }
  });

  export default {
    data() {
      return {
        mapCenter: {
          lat: 0,
          lng: 0
        },
        updatedData: true,
        guests: 1,
        showDropdown: false,
        markers: [],
        hotelListHeight: 0,
        isLoaded: false,
        directionsDisplay: null,
        discount: null,
        url: null,
        event: null,
        avaliableHotels: null,
        queryString: null,
        start: null,
        end: null,
        oldStart: null,
        oldEnd: null,
        isDatesChanged: false,
        eventStart: null,
        eventEnd: null,
        minDay: null,
        maxGuests: null,
        maxDay: null,
        queryObj: null,
        expediaHotels: null,
        comparePricesPromise: {
          pricelineHotels: null,
          avaliableHotels: null,
        },
        pricelineHotels: null,
        showDropdownSortBy: false,
        sort_by: 'Distance',
        old_sort_by: 'Distance',
        getDirections: false,
        // google info window for map
        infoContent: '',
        infoWindowPos: {
          lat: 0,
          lng: 0
        },
        infoWinOpen: false,
        currentMidx: null,
        //optional: offset infowindow so it visually sits nicely on top of our marker
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          },
          disableAutoPan: false,
        },
        comparePricesPromiseIndex: {
          pricelineHotels: 0,
          avaliableHotels: 0,
        },
        comparePricesPromises: {
          pricelineHotels: [],
          avaliableHotels: [],
        },
      }
    },
    computed: {
      currency() {
        return this.$store.state.currency
      },
      filteredAvaliableHotels() {
        if (!this.avaliableHotels) {
          return []
        }
        return this.avaliableHotels.filter(hotel => {
          return hotel.rooms.filter(room => {
            return room.capacity >= this.guests
          }).length > 0
        })
      }
    },
    async beforeMount() {
      this.loadAndFillContent();
    },
    methods: {
      async loadAndFillContent(_start, _end) {
        this.updatedData = false;
        let festival_url = `${process.env.baseUrl}festival/`
        let event = await axios.get(`${festival_url}?client=${this.$route.params.id}`)
        this.$store.commit('setBranding', event.data.branding)
        let queryObj = {
          checkin: (_start || event.data.startDate).replace(/-/g, ''),
          checkout: (_end || event.data.endDate).replace(/-/g, ''),
          contentDetails: 'all',
          freeCancel: true,
          locKeyword: event.data.city,
          locale: 'en_USD',
          rateDetails: 'medium',
          room1: '1,0',
          totalStrikeRate: true,
          unavailableHotels: false,
          unknownHotels: false,
          client: this.$route.params.id,
          include_directions: true,
          currency: 'USD',
        }
        var makeQuery = function (obj) {
          var str = [];
          for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
              str.push((p) + "=" + (obj[p]));
            }
          }
          return str.join("&");
        }
        console.log('event.data:', event.data)
        let start = new Date(event.data.startDate)
        let end = new Date(event.data.endDate)
        start.setMinutes(start.getMinutes() + start.getTimezoneOffset())
        end.setMinutes(end.getMinutes() + end.getTimezoneOffset())
        let eventStart = new Date(start.getTime())
        let eventEnd = new Date(end.getTime())
        end.setDate(end.getDate())
        let minDay = new Date(start)
        let maxDay = new Date(end)
        minDay.setDate(minDay.getDate() - 15)
        maxDay.setDate(maxDay.getDate() + 15)
        let maxDiscount = null
        let maxGuests = 1;
        let queryString = makeQuery(queryObj)
        let hotel_url = `${process.env.baseUrl}hotel/` // https://api.findor.com/v2/hotel/
        axios.get(`${hotel_url}?${queryString}`).then(hotels => {
          console.log('hotels:', hotels)
          var pricelineHotels = [];
          var _hotels = [];
          hotels.data.forEach(hotel => {
            console.log(Object.keys(hotel).some(function (h) {
              return ~h.indexOf("rate_")
            }))
            if (!Object.keys(hotel).some(function (h) {
              return ~h.indexOf("rate_")
            })) {
              hotel.amenities = []
              if (!hotel['photo'] && hotel.photos && hotel.photos.length > 0) {
                hotel['photo'] = hotel.photos.filter(photo => photo.category === 'OUTSIDE')[0]
              }
              let nights = 1
              hotel.rate = null
              if (hotel.rooms && hotel.rooms[0]) {
                nights = Math.round((new Date(hotel.rooms[0].checkout_date) - new Date(hotel.rooms[0].checkin_date)) / 1000 / 60 / 60 / 24)
              }
              hotel.uberPrices = {
                min: '',
                max: ''
              }
              if (hotel.uber_estimate) {
                let min = []
                let max = []
                let prices = hotel.uber_estimate.prices
                prices.forEach((price) => {
                  min.push(price.low_estimate)
                  max.push(price.high_estimate)
                })
                hotel.uberPrices.min = Math.min.apply(Math, min)
                hotel.uberPrices.max = Math.max.apply(Math, max)
              }
              // discount
              let maxRate = Math.max(hotel.booking_com_sug_rate, hotel.expedia_sug_rate)
              if (hotel.rooms)
                hotel.rooms.forEach(room => {
                  // Min rate
                  if (hotel.rate === null || room.rate / 100 < hotel.rate) {
                    hotel.rate = room.rate / 100 / nights
                  }
                })
              let discount = Math.ceil((maxRate - hotel.rate) / (maxRate / 100))
              hotel.discount = discount === 100 ? 0 : discount
              _hotels.push(hotel)
            } else {
              var key = Object.keys(hotel)[0]
              hotel[key].uberPrices = {
                min: '',
                max: ''
              }
              if (hotel[key].uber_estimate) {
                let min = []
                let max = []
                let prices = hotel[key].uber_estimate.prices
                prices.forEach((price) => {
                  min.push(price.low_estimate)
                  max.push(price.high_estimate)
                })
                hotel[key].uberPrices.min = Math.min.apply(Math, min)
                hotel[key].uberPrices.max = Math.max.apply(Math, max)
              }
              pricelineHotels.push(hotel[key])
            }
          })
          let avaliableHotels = _hotels.filter(hotel => hotel.rooms && hotel.rooms.length).sort((a, b) => a.rate - b.rate)
          avaliableHotels.forEach(hotel => {
            if (!maxDiscount || maxDiscount < hotel.discount) {
              maxDiscount = hotel.discount
            }
            hotel.rooms.forEach(room => {
              if (room.capacity > maxGuests) {
                maxGuests = room.capacity
              }
            })
          })
          this.discount = maxDiscount,
            this.url = `${event.data.branding.aws_url}${event.data.branding.dark_logo}`,
            this.event = event.data,
            this.avaliableHotels = avaliableHotels
          this.queryString = queryString
          if (!_start && !_end) {
            this.start = start
            this.end = end
            this.eventStart = eventStart
            this.eventEnd = eventEnd
            this.minDay = minDay
            this.maxGuests = maxGuests
            this.maxDay = maxDay

          }
          this.queryObj = queryObj
          this.expediaHotels = _hotels.filter(hotel => hotel.rooms && !hotel.rooms.length).sort((a, b) => a.expedia_sug_rate - b.expedia_sug_rate)
          this.pricelineHotels = pricelineHotels
          this.queryString = this.queryString + `&main_currency=${this.currency}`
          let color_primary = this.event.branding.main_color
          this.$store.commit('setMainColor', color_primary)
          let color_alternate = this.event.branding.alternate_color
          let color_alternate_2 = this.event.branding.alternate_color_2
          let styleTag = document.createElement('style')
          styleTag.innerHTML = `
                .city_main_section.id_mod::before { background-color: ${color_alternate}!important; }
                @media screen and (max-width: 768px) { .hotel_list.id_mod { background-color: ${color_alternate}!important; } }
                .hotel_booking { background-color: ${color_primary}!important; }
                .city_header.header_bg_mod { background-color: ${color_alternate}!important; }
                .text-primary { color: ${color_primary}!important; font-size:0.9rem;font-weight:500; }
                .hover\\:text-primary:hover { color: ${color_primary}!important; }
                .focus\\:text-primary:focus { color: ${color_primary}!important; }
                .border-primary { border-color: ${color_primary}!important; }
                .hover\\:border-primary:hover { border-color: ${color_primary}!important; }
                .focus\\:border-primary:focus { border-color: ${color_primary}!important; }
                .bg-primary { background-color: ${color_primary}!important; }
                .bg-alternative_2 { background-color: ${color_alternate_2}!important; }
                .hover\\:bg-primary:hover { background-color: ${color_primary}!important; }
                .focus\\:bg-primary:focus { background-color: ${color_primary}!important; }
                .text-alternate { color: ${color_alternate}!important; }
                .hover\\:text-alternate:hover { color: ${color_alternate}!important; }
                .focus\\:text-alternate:focus { color: ${color_alternate}!important; }
                .border-alternate { border-color: ${color_alternate}!important; }
                .hover\\:border-alternate:hover { border-color: ${color_alternate}!important; }
                .focus\\:border-alternate:focus { border-color: ${color_alternate}!important; }
                .bg-alternate { background-color: ${color_alternate}!important; }
                @media screen and (max-width: 768px) {
                    .sm\\:bg-alternate { background-color: ${color_alternate}!important; }
                    .sm-after\\:bg-alternate:after { background-color: ${color_alternate}!important; }
                }
                .hover\\:bg-alternate:hover { background-color: ${color_alternate}!important; }
                .focus\\:bg-alternate:focus { background-color: ${color_alternate}!important; }
            `
          document.querySelectorAll('head')[0].appendChild(styleTag)
          if (this.event.branding.background_image) {
            let mainBgImage = new Image()
            mainBgImage.onload = () => {
              this.$refs.eventTitle.style.backgroundImage = `url(${mainBgImage.src})`
              this.isLoaded = true
            }
            mainBgImage.src = `${this.event.branding.aws_url}${this.event.branding.background_image}`
          } else {
            this.isLoaded = true
          }
          // ToDo
          // fix it here and in hotel template
          // Problem: dont see DOM
          let googleInt = setInterval(() => {
            if (this.$refs && this.$refs.map && this.$refs.map.$mapObject) {
              clearInterval(googleInt)
              this.hotelListHeight = document.querySelectorAll('.hotel_list')[0].offsetHeight
              this.setMarkers()
              return true
            }
          }, 200)
          this.updatedData = true;
        })
      },
      setHotelInfo(hotel) {
        this.$store.commit('hotel/setHotelInfo', hotel);
        this.openNewTab(`/smart-hotel/${hotel.id}/?client=${this.$route.params.id}&guests=${this.guests}&check_in=${this.start && this.start.toString()}&check_out=${this.end && this.end.toString()}&city_name=${hotel.city.name}&hotel_name=${hotel.name}`, '_blank');
      },
      filterHotelList() {
        console.log('sort_by:', this.sort_by);
        var filteredHotelList = this.pricelineHotels;
        if (this.sort_by === 'Distance') {
          filteredHotelList = filteredHotelList.sort((a, b) => {
            return a.uber_estimate.prices[0].distance - b.uber_estimate.prices[0].distance
          })
          console.log('filteredHotelList:', filteredHotelList)
        }
        if (this.sort_by === 'Cheapest') {
          filteredHotelList = filteredHotelList.sort((a, b) => {
            if (a.room_data.room_0.price_details['display_price'] > b.room_data.room_0.price_details['display_price']) {
              return 1;
            }
            if (a.room_data.room_0.price_details['display_price'] < b.room_data.room_0.price_details['display_price']) {
              return -1;
            }
            return 0
          })
          console.log('filteredHotelList:', filteredHotelList)
        }
        if (this.sort_by === 'Best Rated') {
          filteredHotelList = filteredHotelList.sort((a, b) => {
            return b.star_rating - a.star_rating
          })
          console.log('filteredHotelList:', filteredHotelList)
        }
        this.pricelineHotels = filteredHotelList;
      },
      getThumb(val) {
        return 'http://' + val;
      },
      _exchange(val) {
        return parseInt(val);
      },
      checkAmenity(hotel, id) {
        let services = Object.values(hotel.amenity_data);
        return services.some(item => {
          return item.id == id
        });
      },
      handleClickMarker(marker) {
        this.$store.commit('hotel/setHotelInfo', marker.hotel);
        return this.openNewTab(marker.url)
      },
      setMarketColorEnabled: function (marker) {
        this.setMarkers(false);
        marker.icon = {...marker.icon, fillColor: '#2799AE'};
      },
      setMarketColorDisabled: function (marker) {
        marker.icon = {...marker.icon, fillColor: '#266773'};
      },
      toggleInfoWindow: function (marker, idx) {
        if (!marker.disabled) {
          this.setMarketColorDisabled(marker)
        }

        this.infoWindowPos = marker.position;
        this.infoContent = this.getInfoWindowContent(marker);


        //check if its the same marker that was selected if yes toggle
        if (this.currentMidx == idx) {
          this.infoWinOpen = !this.infoWinOpen;
        }
        //if different marker set infowindow to open and reset current marker index
        else {
          this.infoWinOpen = true;
          this.currentMidx = idx;
        }
        if (marker.disabled) {
          this.infoWinOpen = false;
        }
      },
      getInfoWindowContent(marker) {
        if (!marker.star_rating) {
          console.log('marker:', marker)
        }
        let percentSave = '';
        if (marker.hotel && marker.hotel.saving_percentage && marker.hotel.saving_percentage > 0) {
          percentSave = `<div class="percent_off mb-hide">
                    <div class="percent_off_content">
                      ${marker.hotel.saving_percentage}
                      <div class="percent_off_label">
                        <div class="percent_off_label_item">
                          %
                        </div>
                        <div class="percent_off_label_item">
                          OFF
                        </div>
                      </div>
                    </div>
                  </div>`
        }
        let stats = '';
        if (marker.hotel && marker.hotel.uber_estimate && marker.hotel.uber_estimate.prices.length && marker.hotel.uber_estimate.prices[0]) {
          stats += `<ul class="v-info-modal hotel_stats_list" style="padding-left: 0;">`;
          stats += `<li class="hotel_stats_item_map">
                      <span class="icon flex-no-shrink text-xl">
                        <svg viewBox="0 0 16 15.3">
                          <path
                            d="M12.6 15.3l-.2-.1L8 12.9l-4.4 2.3h-.5c-.2-.1-.2-.3-.2-.5l.8-4.9L.2 6.3C0 6.2 0 6 0 5.8c.1-.2.2-.3.4-.3l4.9-.7L7.5.3c.2-.3.7-.3.9 0l2.2 4.5 4.9.7c.2 0 .3.2.4.3s0 .4-.1.5l-3.6 3.5.8 4.9c0 .2 0 .4-.2.5l-.2.1zM8 11.8l.2.1 3.7 2-.7-4.2.1-.4 3-2.9-4.2-.6c-.2 0-.3-.1-.4-.3L8 1.6 6.1 5.4c0 .2-.2.3-.3.3l-4.2.6 3 2.9c.1.1.2.3.1.4L4 13.9l3.7-2 .3-.1z"/>
                        </svg>
                      </span>
                      Smart Rate
                    </li>`;
          if (marker.hotel.uber_estimate && marker.hotel.uber_estimate.prices.length && marker.hotel.uber_estimate.prices[0]) {
            let distance = (marker.hotel.uber_estimate.prices[0].distance * (this.currency === 'CAD' ? 1.6 : 1)).toFixed(2);
            stats += `<li class="hotel_stats_item_map">
                      <span class="icon flex-no-shrink text-xl">
                        <svg id="lay_1" viewBox="0 0 16 16">
                          <path
                            d="M8 16l-.3-.1C7.4 15.7 2 10.7 2 6c0-3.3 2.7-6 6-6s6 2.7 6 6c0 4.7-5.4 9.7-5.7 9.9L8 16zM8 1a5 5 0 0 0-5 5c0 3.6 3.8 7.7 5 8.8 1.2-1.2 5-5.2 5-8.8a5 5 0 0 0-5-5z"
                            class="st0"/>
                          <path
                            d="M8 9C6.3 9 5 7.7 5 6s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                            class="st0"/>
                        </svg>
                      </span>
                      ${distance} ${this.currency === 'CAD' ? 'km' : 'miles'} to ${this.event.name}
                    </li>`
          }
          if (marker.hotel.uber_estimate && marker.hotel.uber_estimate.prices.length && marker.hotel.uber_estimate.prices[0]) {
            let uberPrice = `${this.exchange(marker.hotel.uberPrices.min)} - ${this.exchange(marker.hotel.uberPrices.max)}`;
            stats += `<li class="hotel_stats_item_map">
                        <span class="icon flex-no-shrink text-xl">
                          <svg id="lay_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
                            <title>car</title>
                            <path
                              d="M16,7.42a.47.47,0,0,0,0-.08L14.2,2a1.5,1.5,0,0,0-1.42-1H3.22A1.5,1.5,0,0,0,1.8,2L0,7.34a.47.47,0,0,0,0,.08A.47.47,0,0,0,0,7.5v7a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V13h6v1.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-7A.47.47,0,0,0,16,7.42ZM1,12V8H15v4ZM2.75,2.34A.5.5,0,0,1,3.22,2h9.56a.5.5,0,0,1,.47.34L14.81,7H1.19ZM4,14H1V13H4Zm8,0V13h3v1ZM4,10A1,1,0,1,1,3,9,1,1,0,0,1,4,10Zm10,0a1,1,0,1,1-1-1A1,1,0,0,1,14,10Z"
                              style=""/>
                          </svg>
                        </span>
                        ${uberPrice} UBER Ride
                      </li>`
          }
          if (marker.hotel.stars) {
            stats += `<li class="hotel_stats_item_map">
                        <span class="icon flex-no-shrink text-xl">
                          <svg viewBox="0 0 16 15.3">
                            <path
                              d="M12.6 15.3l-.2-.1L8 12.9l-4.4 2.3h-.5c-.2-.1-.2-.3-.2-.5l.8-4.9L.2 6.3C0 6.2 0 6 0 5.8c.1-.2.2-.3.4-.3l4.9-.7L7.5.3c.2-.3.7-.3.9 0l2.2 4.5 4.9.7c.2 0 .3.2.4.3s0 .4-.1.5l-3.6 3.5.8 4.9c0 .2 0 .4-.2.5l-.2.1zM8 11.8l.2.1 3.7 2-.7-4.2.1-.4 3-2.9-4.2-.6c-.2 0-.3-.1-.4-.3L8 1.6 6.1 5.4c0 .2-.2.3-.3.3l-4.2.6 3 2.9c.1.1.2.3.1.4L4 13.9l3.7-2 .3-.1z"/>
                          </svg>
                        </span>
                        ${parseInt(marker.hotel.stars)} Stars
                      </li>`
          }
          if (marker.hotel.tripadvisor_url) {
            stats += `<li class="hotel_stats_item_map">
                        <span class="icon-trip icon flex-no-shrink text-xl">
                          <svg id="lay_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg"
                               viewBox="0 0 16.01 16"><title>good2</title>
                            <path
                              d="M3.5,16H.5a.5.5,0,0,1-.5-.5v-8A.5.5,0,0,1,.5,7h3a.5.5,0,0,1,.5.5v8A.5.5,0,0,1,3.5,16ZM1,15H3V8H1Zm13.84-1L16,9a2.5,2.5,0,0,0-1.9-3A1.72,1.72,0,0,0,13.51,6H10V2.5A2.5,2.5,0,0,0,7.5,0,.5.5,0,0,0,7,.34l-2,6A.5.5,0,0,0,6,6.66L7.85,1A1.5,1.5,0,0,1,9,2.5v4a.5.5,0,0,0,.5.5h4a2.63,2.63,0,0,1,.33,0A1.5,1.5,0,0,1,15,8.83l-1.11,5A1.51,1.51,0,0,1,12.4,15H5.5a.5.5,0,0,0,0,1h6.9A2.48,2.48,0,0,0,14.84,14Z"/>
                          </svg>
                        </span>
                        ${marker.hotel.tripadvisor_review_keyword}
                      </li>`
          }
          stats += `</ul>`
        }
        return `<a class="card" href="${marker.url}" target="_blank" style="max-width:246px;">
                    <div class="card-image">
                      <figure class="image is-4by3">
                        ${percentSave}
                        <img style="max-width:246px;min-height:163px" src="${marker.hotel_thumb}" alt="Placeholder image">
                      </figure>
                    </div>
                    <div class="card-content" style="max-width: 246px;font-family: 'proxima-nova', Helvetica, Arial, sans-serif;">
                      <div class="media">
                        <div class="media-content">
                          <b><p class="hotel_name mb-hide">${marker.name}</p></b>
                        </div>
                      </div>
                      ${stats}
                      <div class="hotel_prices" style="text-align: right">

                        <span class="hotel_price_map">
                          ${marker.hotel.room_data ? marker.hotel.room_data.room_0.price_details.display_symbol : ''} ${marker.hotel.room_data ? this.exchange(marker.hotel.room_data.room_0.price_details['display_price']) : ''}
                        </span>
                        <span class="hotel_price_map old_mod">
                          ${marker.hotel.room_data ? marker.hotel.room_data.room_0.price_details.display_symbol : ''} ${marker.hotel.room_data ? this.exchange(marker.hotel.room_data.room_0.benchmark_price_details['display_price']) : ''}
                        </span>
                        <span class="hotel_price_map info_mod">per night</span>
                      </div>
                    </div>
                  </a>`;
      },
      getHotelInfoURL(hotel) {
        return `/smart-hotel/${hotel.id}/?client=${this.$route.params.id}&guests=${this.guests}&check_in=${this.start && this.start.toString()}&check_out=${this.end && this.end.toString()}&city_name=${hotel.city.name}&hotel_name=${hotel.name}`
      },
      makeQuery(obj) {
        var str = [];
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            str.push((p) + "=" + (obj[p]));
          }
        }
        return str.join("&");
      },
      changeStartDate(date) {
        this.start = date
      },
      changeEndDate(date) {
        this.end = date;
        if (date !== null) {
          this.isDatesChanged = true;
          this.loadAndFillContent(this.$formatDateRaw(this.start), this.$formatDateRaw(this.end))
        }
      },
      getCorrectDate(field) {
        let date = new Date(this.event[field])
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        if (field === 'startDate') {
          this.start = date
        } else if (field === 'endDate') {
          date.setDate(date.getDate() + 1)
          this.end = date
        }
        return date
      },
      exchange(val) {
        if (!fx) {
          return val
        }
        // problem with filters
        return parseInt(fx.convert(val, {from: 'USD', to: this.currency}))
      },
      openNewTab(url) {
        window.open(url)
      },
      handleGetMapDirections() {
        this.getDirections = true
        this.setMarkers()
      },
      hideMapDirections() {
        this.getDirections = false
        this.setMarkers()
      },
      setMarkers(centerMap) {
        if (centerMap === undefined) {
          centerMap = true;
        }
        let color_primary = this.event.branding.main_color;
        let color_alternate_2 = this.event.branding.alternate_color_2;
        this.markers = [];
        let circleRadius = (Math.max(this.event.branding.logo_width, this.event.branding.logo_height) / 4) + 10;
        this.markers.push({
          position: {
            lat: Number(this.event.venues[0].location.lat),
            lng: Number(this.event.venues[0].location.lng)
          },
          location: `${this.event.location.address} ${this.event.location.city} ${this.event.location.state}`,
          url: '',
          icon: {
            url: `data:image/svg+xml;utf-8, \
                                <svg class='marker' xmlns="http://www.w3.org/2000/svg"> \
                                    <circle r='${circleRadius / 3}' cx='${circleRadius / 2}' cy='${circleRadius / 2}' fill="${color_alternate_2}"></circle> \
                                </svg>`,
            size: new google.maps.Size(circleRadius, circleRadius),
            scaledSize: new google.maps.Size(circleRadius, circleRadius),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(circleRadius / 2, (circleRadius / 2) + 10)
          },
          zIndex: 1,
          label: {
            text: ' '
          },
          id: null,
          disabled: true
        });
        this.markers.push({
          position: {
            lat: Number(this.event.venues[0].location.lat),
            lng: Number(this.event.venues[0].location.lng)
          },
          location: `${this.event.location.address} ${this.event.location.city} ${this.event.location.state}`,
          url: '',
          icon: {
            url: `${this.event.branding.aws_url}${this.event.branding.light_logo}`,
            size: new google.maps.Size(this.event.branding.logo_width / 2, this.event.branding.logo_height / 2),
            scaledSize: new google.maps.Size(this.event.branding.logo_width / 2, this.event.branding.logo_height / 2),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(this.event.branding.logo_width / 4, this.event.branding.logo_height * 0.5)
          },
          zIndex: 2,
          label: {
            text: ' '
          },
          id: null,
          disabled: true
        });
        if (this.getDirections) {
          this.expediaHotels.forEach(hotel => {
            this.markers.push({
              position: {
                lat: hotel.location.latitude_longitude[0],
                lng: hotel.location.latitude_longitude[1]
              },
              location: `${hotel.location.address} ${hotel.location.city} ${hotel.location.state}`,
              url: hotel.expedia_url,
              zIndex: 2,
              icon: {
                path: 'M22-48h-44v32h16l6 5 6-5h16z',
                fillColor: '#2799AE',
                borderRadius: '3px',
                padding: '1px 1px 1px',
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                labelOrigin: new google.maps.Point(0, -32),
                anchor: new google.maps.Point(0, 0),
              },
              label: {
                fontFamily: 'Avenir',
                text: `$${this.exchange(hotel.rate ? hotel.rate : hotel.expedia_sug_rate)}`,
                color: 'white',
                fontSize: '11pt'
              },
              id: hotel.id,
              disabled: true,
              hotel: hotel,
              name: hotel.name,
              star_rating: this.setStarsIcons(hotel.stars),
              address: hotel.location.address,
              amenities: this.formatAmenitiesForInternalHotel(hotel),
              hotel_thumb: hotel.photo ? hotel.photo.thumbnail_photo : ''
            })
          });
          this.avaliableHotels.forEach(hotel => {
            this.markers.push({
              position: {
                lat: hotel.location.latitude_longitude[0],
                lng: hotel.location.latitude_longitude[1]
              },
              location: `${hotel.location.address} ${hotel.location.city} ${hotel.location.state}`,
              url: hotel.expedia_url,
              icon: {
                path: 'M22-48h-44v32h16l6 5 6-5h16z',
                fillColor: '#2799AE',
                borderRadius: '3px',
                padding: '1px 1px 1px',
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                labelOrigin: new google.maps.Point(0, -32),
                anchor: new google.maps.Point(0, 0),
              },
              label: {
                fontFamily: 'Avenir',
                text: `$${this.exchange(hotel.rate ? hotel.rate : hotel.expedia_sug_rate)}`,
                color: 'white',
                fontSize: '11pt'
              },
              zIndex: 2,
              id: hotel.id,
              disabled: false,
              hotel: hotel,
              name: hotel.name,
              star_rating: this.setStarsIcons(hotel.stars),
              address: hotel.location.address,
              amenities: this.formatAmenitiesForInternalHotel(hotel),
              hotel_thumb: hotel.photo ? hotel.photo.thumbnail_photo : ''
            })
          });
          this.pricelineHotels.forEach(hotel => {
            this.markers.push({
              position: {
                lat: Number(hotel.geo.latitude),
                lng: Number(hotel.geo.longitude)
              },
              location: `${hotel.address.address_line_one} ${hotel.address.city_name} ${hotel.address.country_code}`,
              url: `/smart-hotel/${hotel.id}/?client=${this.$route.params.id}&guests=${this.guests}&check_in=${this.start && this.start.toString()}&check_out=${this.end && this.end.toString()}&city_name=${hotel.city.name}&hotel_name=${hotel.name}`,
              icon: {
                path: 'M22-48h-44v32h16l6 5 6-5h16z',
                fillColor: '#2799AE',
                borderRadius: '3px',
                padding: '1px 1px 1px',
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                labelOrigin: new google.maps.Point(0, -32),
                anchor: new google.maps.Point(0, 0),
              },
              zIndex: 1,
              label: {
                fontFamily: 'Avenir',
                text: `$${this.exchange(hotel.room_data.room_0.price_details['display_price'])}`,
                color: 'white',
                fontSize: '11pt'
              },
              labelContent: `<div class='arrow'></div><div class='inner'>$${this.exchange(hotel.room_data.room_0.price_details['display_price'])}</div>`,
              labelClass: 'labels',
              id: hotel.id,
              disabled: false,
              name: hotel.name,
              hotel: hotel,
              star_rating: this.setStarsIcons(hotel.star_rating),
              address: hotel.address.address_line_one,
              amenities: this.formatAmenitiesForMap(hotel),
              hotel_thumb: hotel.thumbnail_hq ? this.getThumb(hotel.thumbnail_hq.three_hundred_square) : ''
            })
          })
        }
        if (centerMap) {
          this.markers.forEach((mark, index) => {
            if (index === 0) {
              this.mapCenter = {
                lat: Number(mark.position.lat),
                lng: Number(mark.position.lng)
              };
            }
          })
        }
      },
      formatAmenitiesForMap(item) {
        var str = '';
        this.getAmenities(item).forEach((amenity) => {
          str += `${amenity.name}, `
        })
        return str.slice(0, -1);
      },
      formatAmenitiesForInternalHotel(hotel) {
        var str = '';
        if (hotel.amenities) {
          hotel.amenities.forEach((amenity) => {
            str += `${amenity.name}, `
          })
        }
        return str.slice(0, -1);
      },
      setStarsIcons(star_rating) {
        var stars = ``
        for (var i = 0; i < star_rating; i++) {
          stars += `<svg style="width:15px;" viewBox="0 0 16 15.3"><path d="M12.6 15.3l-.2-.1L8 12.9l-4.4 2.3h-.5c-.2-.1-.2-.3-.2-.5l.8-4.9L.2 6.3C0 6.2 0 6 0 5.8c.1-.2.2-.3.4-.3l4.9-.7L7.5.3c.2-.3.7-.3.9 0l2.2 4.5 4.9.7c.2 0 .3.2.4.3s0 .4-.1.5l-3.6 3.5.8 4.9c0 .2 0 .4-.2.5l-.2.1zM8 11.8l.2.1 3.7 2-.7-4.2.1-.4 3-2.9-4.2-.6c-.2 0-.3-.1-.4-.3L8 1.6 6.1 5.4c0 .2-.2.3-.3.3l-4.2.6 3 2.9c.1.1.2.3.1.4L4 13.9l3.7-2 .3-.1z"/></svg>`
        }
        return stars
      },
      getHotelByIndex(hotelsAttrName, index) {
        return this[hotelsAttrName][index]
      },
      applyHotelChanges(hotelsAttrName) {
        this[hotelsAttrName] = _.cloneDeep(this[hotelsAttrName]);
      },
      comparePrices(hotel, index, hotelsAttrName, comparePricesPromiseIndex) {
        let applyHotelChanges = this.applyHotelChanges.bind(this, hotelsAttrName);
        if (comparePricesPromiseIndex !== undefined) {
          let promise = this.comparePricesPromises[hotelsAttrName][comparePricesPromiseIndex];
          if (promise.canceled) {
            return
          }
        }
        let getHotelByIndex = this.getHotelByIndex.bind(this, hotelsAttrName);
        hotel.hotelsapi_vendors_loading = true;
        return this.$store.dispatch('hotel/getHotelsapiInfo', {
          check_in: this.$formatDate(this.start.toString()),
          check_out: this.$formatDate(this.end.toString()),
          hotel_name: hotel.name,
          city_name: this.event.city,
          pax: 1,
          currency: this.$store.state.currency,
        }).then((data) => {
          HotelsapiHelpers.applyHotelsapi(index, data, getHotelByIndex, applyHotelChanges)
        }).catch((data, args) => {
          HotelsapiHelpers.catchErrorHotelsapi(index, getHotelByIndex, applyHotelChanges)
        });
      },
      cancelPromises(hotelsAttrName) {
        let promise = this.comparePricesPromises[hotelsAttrName][this.comparePricesPromiseIndex[hotelsAttrName]];
        promise.canceled = true;
        this.comparePricesPromiseIndex[hotelsAttrName]++;
      },
      comparePricesForAllHotelsSynchronously(hotelsAttrName) {
        if (this.isDatesChanged) {
          this.isDatesChanged = false;
        }
        if (this.comparePricesPromises[hotelsAttrName].length - 1 < this.comparePricesPromiseIndex[hotelsAttrName]) {
          this.comparePricesPromises[hotelsAttrName].push({canceled: false, obj: null});
        }
        this[hotelsAttrName].forEach((hotel, index) => {
          if (hotel.hotelsapi_vendors_loading || hotel.hotelsapi_vendors || index >= 10) {
            return;
          }
          hotel.hotelsapi_vendors_loading = true;
          let promise = this.comparePricesPromises[hotelsAttrName][this.comparePricesPromiseIndex[hotelsAttrName]];
          promise.obj = promise.obj ? promise.obj.finally(
            this.comparePrices.bind(this, hotel, index, hotelsAttrName, this.comparePricesPromiseIndex[hotelsAttrName])
          ) : this.comparePrices(hotel, index, hotelsAttrName, this.comparePricesPromiseIndex[hotelsAttrName]);
        });
      },
      isSortByChanged() {
        if (!this.old_sort_by) {
          this.old_sort_by = this.sort_by;
        }
        let isSortByChanged = this.old_sort_by !== this.sort_by;
        this.old_sort_by = this.sort_by;
        return isSortByChanged
      },
      watchHotels(newAvaliableHotels, oldAvaliableHotels, hotelsAttrName) {
        let isSortByChanged = this.isSortByChanged();
        if (this.isDatesChanged || isSortByChanged) {
          if (_.size(this.comparePricesPromises[hotelsAttrName]) > 0) {
            this.cancelPromises(hotelsAttrName);
          }
          for (let hotel of this[hotelsAttrName]) {
            hotel.hotelsapi_vendors_loading = undefined;
            hotel.hotelsapi_vendors = undefined;
          }
        }
        let newHotels = _.map(newAvaliableHotels, 'name');
        let oldHotels = _.map(oldAvaliableHotels, 'name');
        if (this.isDatesChanged || isSortByChanged || _.size(_.difference(newHotels, oldHotels)) > 0) {
          this.comparePricesForAllHotelsSynchronously(hotelsAttrName);
        }
      },
      saveDatePickerDates() {
        this.oldStart = this.start;
        this.oldEnd = this.end;
      },
      getAmenities(hotel) {
        var amenities = Object.values(hotel.amenity_data)
        amenities.forEach(function (amenity, index) {
          switch (amenity.id) {
            case 10: // free parking
              amenity.rank = 1
              break
            case 1: // Airport shuttle
              amenity.rank = 2
              break
            case 9: // Fitness center
              amenity.rank = 3
              break
            case 15: // Swimming pool
              amenity.rank = 4
              break
            case 2: // Business center
              amenity.rank = 5
              break
            case 14: // Restaurant
              amenity.rank = 6
              break
            case 13: // Pets allowed
              amenity.rank = 7
              break
            case 7: // Free Internet Access
              amenity.rank = 8
              break
            case 12: // Non smoking
              amenity.rank = 8
              break
            default:
              amenity.rank = 8
              break
          }
        })
        var filtered = amenities.filter(function (value, index, arr) {
          return value.id !== 5;
        });
        filtered.sort(function (a, b) {
          return a.rank - b.rank;
        });
        if (hotel.review_rating_desc.length !== 0) {
          filtered = filtered.slice(0, 2)
        } else {
          filtered = filtered.slice(0, 3)
        }
        return filtered
      },
      drawDirection(marker) {
        let directionsService = new google.maps.DirectionsService()
        if (this.directionsDisplay === null) {
          this.directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            preserveViewport: true
          })
          this.directionsDisplay.setOptions({
            markerOptions: {
              icon: ``
            }
          })
          this.directionsDisplay.setMap(this.$refs.map.$mapObject)
        }
        directionsService.route({
          origin: marker.location,
          destination: `${this.event.location.address} ${this.event.location.city} ${this.event.location.state}`,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            this.directionsDisplay.setDirections(response)
          }
        })
      }
    },
    components: {
      HotelStatsList,
      AppVideo,
      Loader,
      HotelDatePicker,
      IconPlay
    },
    watch: {
      pricelineHotels: {
        handler(newPricelineHotels, oldPricelineHotels) {
          this.watchHotels(newPricelineHotels, oldPricelineHotels, 'pricelineHotels');
        },
        deep: true
      },
      avaliableHotels: {
        handler(newAvaliableHotels, oldAvaliableHotels) {
          this.watchHotels(newAvaliableHotels, oldAvaliableHotels, 'avaliableHotels');
        },
        deep: true
      },
      'currency'() {
        if (this.$refs.map) {
          this.setMarkers()
        }
      },
      sort_by: {
        handler() {
          this.filterHotelList();
        },
        deep: true
      },
    },
    head() {
      return {
        title: `${this.event ? this.event.name + ' | ' : ''}  SmartStay.com`,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'Book lower hotel rates for all your favorite events. All in packages with bundle discounts.'
          }
        ]
      }
    }
  }
</script>
<style lang="scss">
  @import '@/assets/scss/vars/index.scss';

  @import '@/assets/scss/mixins/index.scss';

  main {
    .map {
      @include bp($bp) {
        display: block !important;
        width: 514 / 540 * 100vw;
        max-width: 100%;
        height: 210 / 540 * 100vw;
      }
    }

    .datepicker {
      z-index: 15;
    }

    .datepicker__dummy-wrapper {
      opacity: 0;
    }

    .datepicker__clear-button {
      display: none;
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

    .datepicker__month-button--prev {
      left: -260px;
    }

    @media (max-width: 768px) {
      .datepicker--open {
        z-index: 1000;
      }

      .datepicker__inner, .datepicker__header, .datepicker__inner > * {
        position: static;
      }
    }
  }

</style>

<style lang="scss" scoped>
  @import '@/assets/scss/vars/index.scss';
  @import '@/assets/scss/mixins/index.scss';


  main {
    overflow: hidden !important;

    .map_btn {
      z-index: 10;

      position: absolute;
      right: 15px;
      bottom: 15px;

      display: inline-flex;
      height: 28px;
      padding: 5px 13px;
      align-items: center;
      justify-content: center;

      font-size: 13px;
      font-weight: 400;
      color: $white;

      border-radius: 3px;
      background-color: $blue_1;

      @include bp($bp) {
        right: 15px;
      }
    }
  }

  .discount-row {
    font-size: 16px;
    font-weight: 500;
    padding: 10px;
  }

  .mb-show {
    display: none !important;

    @include bp($bp) {
      display: block !important;
    }
  }

  .hotel_rates.mb-show {
    @include bp($bp) {
      display: flex !important;
      flex-wrap: wrap;
    }
  }

  .hotel_check_rate {
    display: flex;
    justify-content: flex-end;
  }

  .hotel_check_rate_link {
    color: #f35000;
    font-size: 14px;
    font-weight: 400;
  }

  .hotel_check_rate_link:hover {
    text-decoration: underline
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .city_header & {
      display: none;
    }

  }

  .btn-overlay {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
  }

  .hide-map {
    position: absolute;
    right: 28px;
    bottom: -28px;
    display: inline-flex;
    height: 28px;
    width: 90px;
    padding: 5px 10px;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.05;
    color: $white;
    border-radius: 3px;
    background-color: $blue_1;
  }

  .city-title {
    min-height: 192px;
    padding: 37px 17px 24px;

    border-bottom: 1px solid rgba(0, 0, 0, .15);
    background-repeat: no-repeat;
    background-size: cover;

    img {
      display: block;
      margin-bottom: 5px;
      // position: absolute;
      // top: 0px;
      // left: 0px;
      // bottom: 0px;
      // right: 0px;
      // height: 100%;
      // width: 100%;
    }

    h2 {
      font-size: 23px;
      line-height: 25px;
      margin-bottom: 5px;
      font-weight: 300;

      @include bp($bp) {
        margin-bottom: 8px;
        font-size: 26px;
        font-weight: 300;
        line-height: 1.05;
        letter-spacing: -.68px;
      }
    }

    p {
      font-weight: 400;
    }

    .date-button {
      cursor: pointer;
      color: #fff;
      font-size: 15px;
      padding: 4px 10px 4px;
      line-height: 1;
      border-radius: 4px;
      border: 1px solid #dae0e4;
      user-select: none;
      display: inline-block;
      font-weight: 400;
      margin-top: 10px;
      text-align: center;
      line-height: 20px;
    }

    @include bp($bp) {
      min-height: auto;
      padding: 8px 10px 2px;
    }
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
    color: darkgrey !important;
    font-size: 13px !important;
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

  .guests {
    font-size: 15px;
    padding: 7px 9px 7px;
    line-height: 1;
    border-radius: 4px;
    border: 1px solid #dae0e4;
    user-select: none;
    display: inline-block;
    cursor: pointer;
    font-weight: 400;
    margin-left: 9px;

    // .dropdown {
    //     position: absolute;
    //     width: 90px;
    //     background-color: #fff;
    //     border: 1px solid #dae0e4;
    //     border-radius: 4px;
    //     z-index: 999;
    //     top: 30px;
    //     left: 0;

    //     span {
    //         display: block;
    //         text-align: center;
    //         padding: 7px 9px 5px;
    //         border-bottom: 1px solid #dae0e4;
    //         cursor: pointer;
    //         color: #333;
    //         &:hover {
    //         background-color: #0033cc;
    //         color: #ffffff;
    //         }
    //     }
    // }
  }

  .info {
    background-color: transparent !important;
    border-color: transparent !important;
  }

  .no-padding {
    padding: initial !important;
  }

  main {
    position: relative;

    margin: 0 auto;
    width: 100%;
    max-width: 950px;

    &.sticky-map {
      // @media (min-width: 992px) {
      //     .hotel-list {
      //         margin-left: 25%;
      //     }
      // }

      // [data-id='map'] {
      //     width:  calc((100% - 300px) / 4);
      //     height: calc(100vh - 270px);
      //     position: fixed;
      //     top: 0;
      //     left: 150px;
      // }
    }

    .full-screen-map {
      width: 100% !important;
      min-height: 50rem !important;
      margin: 0 !important;
    }

    .hotel-list {
      // width: 75%;
      // height: 100%;
      // box-shadow: 0px 0px 5px rgba(0, 0, 0, .2);
      // background: #fff;
    }

    ul {
      list-style-type: none;
      padding: 0;


      &::-webkit-scrollbar {
        width: 0;
      }

      .expedia {
        padding: 15px 22px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);

        div {
          font-size: 12pt;
          font-weight: 500;
          margin-bottom: 0px;
        }

        p {
          font-weight: 400;
          font-size: 14px;
        }
      }

      .hotel {
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        padding: 40px 40px 30px;

        &.hotel-expedia:last-child,
        &:last-child {
          border-bottom: none;
        }

        &.hotel-expedia {
          border-bottom: 1px solid rgba(255, 255, 255, 1);
          background: #f7f7f7;
          cursor: pointer;

          .name {
            font-size: 15pt;
            margin-bottom: 0;
          }

          .image {
            width: 150px;
          }

          .info {
            width: calc(100% - 160px);
          }

          .prices {
            justify-content: flex-end;

            div {
              font-size: 14pt;
            }
          }

          .amenities, .info {
            .icon {
              height: 16px;
            }
          }

          .distance, .trip, .amenities {
            margin-bottom: 0px;
            font-size: 10pt;
          }
        }

        .info {
          width: calc(100% - 250px);
          padding-left: 24px;

          .icon {
            width: 30px;
            height: 18px;
            display: inline-block;
            text-align: center;

            &.icon-trip {
              height: 14px;
            }

            img {
              max-height: 100%;
            }
          }
        }

        &:not(.hotel-expedia) .image {
          min-height: 50px;

          @media (min-width: 992px) {
            height: 165px;
          }
        }

        .image {
          width: 250px;
          cursor: pointer;

          .stars {
            position: absolute;
            bottom: 0px;
            padding: 5px 5px 0;
            right: 0;
            background: rgba(0, 0, 0, 0.7);
            color: #ffffff;
            text-align: center;
            z-index: 1;

            @media (max-width: 991px) {
              bottom: 8px;
            }
          }

          img {
            width: 100%;
            height: auto;

            @media (min-width: 992px) {
              height: 100%;
            }
          }
        }

        .prices {
          color: #000;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .rate {
            font-size: 19pt;
            color: #171717;
            line-height: 20pt;

            .old {
              text-decoration: line-through;
              color: #c5c5c5;
            }
          }

          p {
            color: #b4b4b4;
            font-size: 10pt;
            font-weight: 400;
          }

          .rates {
            color: #171717;
            font-size: 10pt;
            font-weight: 400;
          }

          .btn {
            color: #ffffff;
            font-size: 11pt;
            font-weight: 500;
            text-align: center;
            display: inline-block;
            border-radius: 4px;
            height: 37px;
            width: 168px;
            line-height: 40px;
          }


          .btn-amenities {
            margin: 6px 0;
            font-size: 10pt;
            height: 29px;
            width: auto;
            padding: 0 10px;
            line-height: 30px;
            font-weight: 500;
            font-size: 12px;
          }
        }

        .discount {
          font-size: 11pt;
          font-weight: 400;
          color: #e40000;
          margin-bottom: 3px;
        }

        .name {
          font-size: 17pt;
          margin-bottom: 4px;
          font-weight: 600;
          line-height: 18pt;
          color: #2b2b2b;
        }

        .distance, .trip, .amenities {
          font-size: 10pt;
          font-weight: 400;
          color: #252525;
        }
      }
    }

    .marker {
      cursor: pointer !important;
    }

    // [data-id='map'] {
    //     width: 25%;
    //     height: calc(100vh - 250px);

    // }
    @include bp($bp) {
      max-width: 100%;
      margin: 0 auto;
    }
  }

  .event-title {
    padding: 60px 28px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    padding-bottom: 211px;
    background-repeat: no-repeat;
    background-size: cover;

    img {
      display: inline-block;
    }

    h2 {
      font-size: 26px;
      line-height: 31px;
      margin-top: 10px;
      margin-bottom: 2px;
      font-weight: 600;
    }

    p {
      font-size: 15px;
      font-weight: 400;
    }

    .date-button {
      cursor: pointer;
      color: #fff;
      font-size: 15px;
      padding: 4px 10px 2px;
      line-height: 1;
      border-radius: 4px;
      border: 1px solid #dae0e4;
      user-select: none;
      display: inline-block;
      font-weight: 400;
      margin-top: 10px;
      text-align: center;
      line-height: 20px;
    }
  }


  // @media (max-width: 1350px) {
  //     main {
  //         padding: 0px 100px;

  //         &.sticky-map {
  //             [data-id='map'] {
  //                 left: 100px;
  //             }
  //         }
  //     }
  // }

  @media (max-width: 1200px) {
    main {
      // padding: 0px 30px;

      &.sticky-map {
        [data-id='map'] {
          left: 30px;
          width: calc((100% - 60px) / 4);
        }
      }

      ul {
        .hotel {
          .prices {
            .rate {
              font-size: 21pt;
              font-weight: 800;
            }

            p,
            .rates {
              font-size: 10pt;
            }

            .btn {
              width: 150px;

              &.btn-amenities {
                width: auto;
              }
            }
          }

          .name {
            font-size: 18pt;
          }
        }
      }
    }

  }

  @media (max-width: 991px) {
    .event-title {
      padding-bottom: 20px;
    }

    main {
      margin-bottom: 0;
      position: static;
      height: auto;
      padding: 0;

      [data-id='map'] {
        // display: none;
      }

      .hotel-list {
        width: 100%;

        .hotel {
          .image {
            width: 270px;
          }
        }
      }
    }
    .event-title {
      h2 {
        font-size: 22px;
        font-weight: 500;
      }

      p {
        font-size: 14px;
      }
    }
  }

  @media (max-width: 768px) {
    main {
      margin-bottom: 0;
      position: static;
      height: auto;
      padding: 0;

      .hotel-list {
        width: 100%;
        box-shadow: none;

        .hotel:not(.hotel-expedia) {
          flex-direction: column;
        }

        .hotel.hotel-expedia {
          .info {
            padding-left: 20px;
          }
        }

        .hotel {
          .image {
            margin-bottom: 10px;
          }

          .image,
          .info {
            width: 100%;
            padding: 0;
          }

          .prices {
            .rate {
              font-size: 30pt;
            }

            .rates {
              font-size: 12pt;
            }

            .btn {
              width: 200px;

              .btn-amenities {
                width: auto;
              }
            }
          }

          .name {
            font-size: 24pt;
          }
        }
      }
    }

    .name.mb-show {
      display: block !important;
      width: 100%;

      margin: 0 0 3px;

      font-size: 20px;
      font-weight: 400;
      line-height: 1;
      color: $white;

      letter-spacing: -.64px;

    }
  }

  @media (max-width: 768px) {
    .mb-hide {
      display: none !important;
    }

    .mb-show {
      display: block !important;
    }

    .event-title {
      padding-top: 21px;

      h2 {
        font-size: 14pt;
      }

      img {
        height: 29px;
        width: auto;
      }
    }

    .name.mb-show {
      width: 100%;
    }

    main {
      ul {
        .hotel {
          padding: 20px;
        }

        .hotel:not(.hotel-expedia) {
          flex-wrap: wrap;

          .info > div {
            width: 50%;
          }

          .prices {
            justify-content: flex-end;

            .rate {
              font-size: 20pt;
            }

            p,
            .rates {
              font-size: 10pt;
            }

            .btn {
              width: 150px;

              .btn-amenities {
                width: auto;
              }
            }
          }

          .name {
            font-size: 18pt;
          }

          .info {
            width: 100%;
            padding-left: 0;
            flex-wrap: wrap;
          }

          .image {
            .btn {
              position: absolute;
              border-radius: 5px;
              bottom: 50px;
              right: 11px;
              height: 29px;
              width: auto;
              padding: 0 11px;
              line-height: 30px;
              font-size: 12px;
              font-weight: 400;
            }
          }
        }

        .hotel.hotel-expedia {
          .info {
            flex-direction: column;

            .prices {
              text-align: left;

              div {
                font-size: 11pt;

              }
            }
          }

          .name {
            font-size: 15pt;
          }
        }
      }
    }
  }

  .max-with-none {
    max-width: none !important;
  }

  .head-container {
    width: 1380px !important;
    max-width: 100% !important;
    padding-left: 7px;
    padding-right: 7px;
    margin: 0 auto;
  }

  .pl-0 {
    padding-left: 0 !important;
  }
</style>
