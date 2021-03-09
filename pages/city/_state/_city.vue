<template>
  <div>
    <header class="city_header city-title text-white">
      <div class="city_header_in" :class="getDirections ? 'max-with-none head-container' : ''">
        <div class="city_header_col" :class="getDirections ? 'pl-0' : ''">

          <h2>{{ Object.keys(cityInfo).length> 0?cityInfo.city:'' }}, {{ Object.keys(cityInfo).length> 0 ?
            (($route.query.country_code === 'US') ? cityInfo.state_code : titleCase(state)) : '' }}</h2>
          <p>Member only hotel rates with up to 60% off.</p>
          <div class="city_header_btns">
            <span @click="handleDatePickerOpened" class="date-button btn_filter sort_date_mod"
                  v-bind:style="{ zIndex: isDatePickerOpened ? 100 : 99 }">
              {{ start | moment("DD MMM")}} - {{ end | moment("DD MMM") }}
              <HotelDatePicker
                v-if="minDay && maxDay"
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
            <span class="btn_filter guests sort_guest_mod" v-bind:style="{ zIndex: showDropdown ? 100 : 99 }"
                  @click.self='showDropdown = !showDropdown'>{{guests}} Guest{{guests > 1 ? 's' : ''}}
              <div class="dropdown" v-if='showDropdown && maxGuests > 1'>
                <span class="dropdown_item" v-for='val in maxGuests' :key="val"
                      @click='guests = val;showDropdown = false'>{{val}} Guest{{val > 1 ? 's' : ''}}</span>
                <span class="dropdown_item" @click='guests = "5+";showDropdown = false'>5+ Guests</span>
              </div>
            </span>
            <span class="btn_filter filter sort_filter_mod" v-bind:style="{ zIndex: fitlerOptionFlag ? 100 : 99 }"
                  @click="fitlerOptionFlag = !fitlerOptionFlag">Filter</span>
            <span class="btn_filter guests sort_deal_mod" v-bind:style="{ zIndex: showDropdownSortBy ? 100 : 99 }"
                  @click.self='showDropdownSortBy = !showDropdownSortBy'> {{sort_by}}
              <div class="dropdown" v-if='showDropdownSortBy'>
                <span class="dropdown_item" v-for='val in ["Best Deal", "Cheapest", "Best Rated"]' :key="val"
                      @click='sort_by = val;showDropdownSortBy = false'>{{val}}</span>
              </div>
            </span>
            <div class="filter_option" v-if="fitlerOptionFlag">
              <span class="filter_option_close_btn" @click="fitlerOptionFlag = !fitlerOptionFlag">
                Close
              </span>
              <div class="filter_option_in">
                <div class=" filter_option_item">
                  <div class="filter_option_item_col title_mod">
                    Price
                  </div>
                  <div class="filter_option_item_col control_mod">

                    <div class="filter_option_range_block">
                      <span class="filter_option_slider_val min_mod">{{'$'+price[0]}}</span>
                      <v-range-slider
                        v-model="price"
                        :max="1000"
                        :min="1"
                        :step="1"
                        class="filter_option_slider_wrap"
                      ></v-range-slider>
                      <span class="filter_option_slider_val max_mod">{{'$'+price[1]}}</span>
                    </div>
                  </div>
                </div>
                <div class="filter_option_item">
                  <div class="filter_option_item_col title_mod">
                    Ammenities
                  </div>
                  <div class="filter_option_item_col control_mod">
                    <div class="filter_option_checkboxes_block">
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.free_breakfast" label="Free Breakfast"
                                    color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/img/icons/breakfest.svg" alt="">
                      </div>
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.swimming" label="Swimming Pool"
                                    color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/icons/water-aerobics.svg" alt="">
                      </div>
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.free_parking" label="Free Parking"
                                    color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/icons/parking.svg" alt="">
                      </div>
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.pets" label="Pets Allowed"
                                    color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/icons/paw.svg" alt="">
                      </div>
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.non_smoking" label="Non Smoking"
                                    color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/img/icons/no-smoking.svg" alt="">
                      </div>
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.free_airport"
                                    label="Free Airport Shuttle" color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/icons/bus-front-12.svg" alt="">
                      </div>
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.fitness_center" label="Fitness Center"
                                    color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/icons/dumbbell.svg" alt="">
                      </div>
                      <div class="check_input_wrap">
                        <v-checkbox class="filter_icon" v-model="filter_options.business_center" label="Business Center"
                                    color="primary"></v-checkbox>
                        <img class="check_icon" src="@/assets/icons/apartment.svg" alt="">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="filter_option_item">
                  <div class="filter_option_item_col title_mod">
                    Brands
                  </div>
                  <div class="filter_option_item_col control_mod">
                    <div class="filter_option_search_block">
                      <div class="filter_option_search_icon_wrap">
                        <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11">
                          <title>zoom</title>
                          <g>
                            <line x1="10.5" y1="10.5" x2="7.33" y2="7.33" fill="none" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                            <circle cx="4.5" cy="4.5" r="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                          </g>
                        </svg>
                      </div>
                      <v-text-field
                        v-model="searchTxt"
                        label="Search Hotel"
                        style="width:100%"
                        class="filter_option_search_wrap"
                        placeholder="Search hotel name or brand">
                      </v-text-field>
                    </div>
                  </div>
                </div>

                <div class="filter_option_item">
                  <div class="filter_option_item_col title_mod">
                    Rating
                  </div>
                  <div class="filter_option_item_col control_mod">
                    <div class="filter_option_in_col stars_mod">
                      <star-rating @rating-selected="rating = $event" :rating="rating"
                                   v-bind:star-size="30"></star-rating>
                    </div>
                    <div class="filter_option_in_col btn_mod">
                      <span class="filter_option_apply_btn" @click="fitlerOptionFlag = !fitlerOptionFlag">Apply
                        Filter</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
        <div class="city_header_col map_mod">
          <div class="map city_mod" data-id="map" v-if="!getDirections">
            <a v-on:click="handleGetMapDirections()"
               class="map_btn">
              View Map
            </a>
            <gmap-map
              :center='{lat: Number((filteredHotelList[0] && filteredHotelList[0].geo)?filteredHotelList[0].geo.latitude:cityInfo.latitude), lng: Number((filteredHotelList[0] && filteredHotelList[0].geo)?filteredHotelList[0].geo.longitude:cityInfo.longitude)}'
              :zoom="11"
              :draggable="true"
              ref='map'
              style='height: 100%;width:100%'
              :options='{scrollwheel: false, fullscreenControl: false, mapTypeControl: false}'>
              <gmap-marker
                :key="i"
                v-if="getDirections"
                @mouseover="toggleInfoWindow(marker, i)"
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
            </gmap-map>
            <div class="mt-10 flex-no-shrink overflow-hidden overlay" v-if="!getDirections">

              <div class="-mr-4 -mb-2 flex flex-wrap text-xs">
                <div class="mr-4 mb-2 flex" style="width: min-content;">
                </div>
                <!-- <div class="mr-4 mb-2 flex">
                   <div class="mr-1 justify-center items-center w-4 flex-no-shrink h-4">
                            <f-a icon="phone" />
                        </div> -->
                <!-- <div> -->
                <!-- {{ hotel.phone }} -->
                <!-- </div>
            </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<img class="city_header_bg" ref='mainBgImg' src="@/assets/img/kiev.jpg" />-->
    </header>
    <section class="city_main_section">
      <div class="map city_mod full-screen-map" data-id="map" v-if="getDirections">
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
        <div class="mt-10 flex-no-shrink overflow-hidden overlay" v-if="!getDirections">

          <div class="-mr-4 -mb-2 flex flex-wrap text-xs">
            <div class="mr-4 mb-2 flex" style="width: min-content;">
            </div>
            <!-- <div class="mr-4 mb-2 flex">
               <div class="mr-1 justify-center items-center w-4 flex-no-shrink h-4">
                        <f-a icon="phone" />
                    </div> -->
            <!-- <div> -->
            <!-- {{ hotel.phone }} -->
            <!-- </div>
        </div> -->
          </div>
        </div>
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
        <div class="hotel_list" v-if="!getDirections">
          <ul v-if="filteredHotelList && filteredHotelList.length > 0">
            <li class="hotel_item"
                v-for="(hotel, index) in filteredHotelList"
                :key="`avaliable-${index}-${hotel.id}`">
              <div class="hotel_block flex">
                <div class="hotel_image" @click='setHotelInfo(hotel)'>
                  <div class="percent_off mb-hide"
                       v-if="hotel.saving_percentage && hotel.saving_percentage >= 0">
                    <div class="percent_off_content">
                      {{ hotel.saving_percentage }}
                      <div class="percent_off_label">
                        <div class="percent_off_label_item">%
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

                <div class="hotel_detail_choose_in mobile_mod"
                     v-if="(hotel.saving_percentage && hotel.saving_percentage > 0) || hotel.room_data.room_0.saving_percentage !== 0">
                  <div class="percent_off v1_mod mb-show">
                    <div class="percent_off_content">
                      {{hotel.saving_percentage || hotel.room_data.room_0.saving_percentage}}
                      <div class="percent_off_label">
                        <div class="percent_off_label_item">%</div>
                        <div class="percent_off_label_item">OFF</div>
                      </div>
                    </div>
                  </div>
                  <a class="hotel_amenities btn-amenities btn" v-if='checkAmenity(hotel, 5)' target='_blank'
                     :href="`/hotel/${hotel.id}/?${queryString}&guests=${guests}`">Free breakfast</a>
                </div>

                <div class="flex justify-between info">
                  <div class="hotel_info_col">
                    <p class="name mb-show">
                      <a @click="setHotelInfo(hotel)">{{ hotel.name }}</a>
                    </p>
                    <div class="hotel_rates mb-show">
                      <div class="hotel_rate mb-show">
                        <span class="hotel_rate_val">Save $26</span>
                      </div>

                    </div>
                    <h3 class="hotel_name mb-hide">
                      <a @click="setHotelInfo(hotel)">{{ hotel.name }}</a>
                    </h3>
                    <div class="hotel_discount"
                         v-if="exchange(hotel.room_data.room_0.benchmark_price_details['display_price'] - hotel.room_data.room_0.price_details['display_price']) !== 0">
                      Save ${{ exchange(hotel.room_data.room_0.benchmark_price_details['display_price'] -
                      hotel.room_data.room_0.price_details['display_price']) }} per night
                    </div>

                    <ul class="hotel_stats_list">
                      <li class="hotel_stats_item" v-if="hotel.star_rating">
                        <span class="icon flex-no-shrink text-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><title>
                            shape star</title>
                            <g class="nc-icon-wrapper" fill="#111111">
                              <polygon
                                points="8 0.867 10.318 5.563 15.5 6.316 11.75 9.971 12.635 15.133 8 12.696 3.365 15.133 4.25 9.971 0.5 6.316 5.682 5.563 8 0.867"
                                fill="none" :stroke="isMobile() ? '#eaeaea' : '#111111'" stroke-linecap="round"
                                stroke-linejoin="round" data-cap="butt"/>
                            </g>
                          </svg>
                        </span>
                        {{parseInt(hotel.star_rating)}} Stars
                      </li>
                      <li class="hotel_stats_item" v-if="hotel.review_rating_desc">
                        <span class="icon-trip icon flex-no-shrink text-xl">
                          <svg id="lay_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.01 16">
                            <title>good2</title>
                            <path
                              d="M3.5,16H.5a.5.5,0,0,1-.5-.5v-8A.5.5,0,0,1,.5,7h3a.5.5,0,0,1,.5.5v8A.5.5,0,0,1,3.5,16ZM1,15H3V8H1Zm13.84-1L16,9a2.5,2.5,0,0,0-1.9-3A1.72,1.72,0,0,0,13.51,6H10V2.5A2.5,2.5,0,0,0,7.5,0,.5.5,0,0,0,7,.34l-2,6A.5.5,0,0,0,6,6.66L7.85,1A1.5,1.5,0,0,1,9,2.5v4a.5.5,0,0,0,.5.5h4a2.63,2.63,0,0,1,.33,0A1.5,1.5,0,0,1,15,8.83l-1.11,5A1.51,1.51,0,0,1,12.4,15H5.5a.5.5,0,0,0,0,1h6.9A2.48,2.48,0,0,0,14.84,14Z"/>
                          </svg>
                        </span>
                        {{ hotel.review_rating_desc }}
                      </li>
                      <li class="hotel_stats_item" v-for="amenity in getAmenities(hotel)" :key="amenity.id">
                        <span class="icon-trip icon flex-no-shrink text-xl">
                          <IconBreakfast :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 5">
                          </IconBreakfast>

                          <IconFitness :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 9">
                          </IconFitness>

                          <IconRestaurant :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 14">
                          </IconRestaurant>

                          <IconBusinessCenter :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 2">
                          </IconBusinessCenter>

                          <IconParking :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 10">
                          </IconParking>

                          <IconPetsAllowed :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 13">
                          </IconPetsAllowed>

                          <IconSwimmingPool :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 15">
                          </IconSwimmingPool>

                          <IconAirportShuttle :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 1">
                          </IconAirportShuttle>

                          <IconWiFi :color="isMobile() ? '#eaeaea' : '#111111'" v-if="amenity.id === 7">
                          </IconWiFi>
                        </span>
                        {{ amenity.name }}
                      </li>
                    </ul>

                  </div>
                  <div class="hotel_info_col prices_mod">
                    <div class="hotel_prices">
                      <span class="hotel_price old_mod">
                        {{ hotel.room_data.room_0.price_details.display_symbol }}{{
                        exchange(hotel.room_data.room_0.benchmark_price_details['display_price']) }}
                      </span>
                      <span class="hotel_price">
                        {{ hotel.room_data.room_0.price_details.display_symbol }}{{
                        exchange(hotel.room_data.room_0.price_details['display_price']) }}
                      </span>
                      <span class="hotel_price info_mod">per night</span>
                    </div>
                    <div class="hotel_rates pull-down" v-if="hotel.hotelsapi_vendors && hotel.hotelsapi_vendors.length > 0">
                      <div class="hotel_rate" v-for="(vendor, index) in hotel.hotelsapi_vendors.slice(0,2)" :key="index">
                        <span class="hotel_rate_val">{{Object.keys(vendor)[0]}}</span>
                        <span class="hotel_rate_val decor_mod"></span>
                        <span class="hotel_rate_val">{{Object.values(vendor)[0]}}</span>
                      </div>
                    </div>
                    <div class="hotel_price pull-down loading"
                         v-if="(hotel.force_loading && !hotel.hotelsapi_vendors) || hotel.hotelsapi_vendors_loading">
                      Loading<span>.</span><span>.</span><span>.</span>
                    </div>
                    <div class="hotel_price info_mod pull-down" style="display: block!important;"
                         v-if="!hotel.hotelsapi_vendors_loading && hotel.hotelsapi_vendors && hotel.hotelsapi_vendors.length === 0">
                         No Match!
                    </div>
                    <div class="hotel_compare_prices"
                         v-if="!hotel.force_loading && !hotel.hotelsapi_vendors && !hotel.hotelsapi_vendors_loading">
                      <a @click="comparePrices(hotel, index)" class="hotel_compare">Compare Rate</a>
                    </div>
                    <a target='_blank'
                       @click="setHotelInfo(hotel)"
                       class="hotel_booking v2_mod mb-hide">Book now</a>
                  </div>
                </div>
              </div>
            </li>
            <li class="hotel flex text-white justify-center" v-if="isLoadingList">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </li>
          </ul>

          <div v-else class="no-data">No Data</div>
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
              SmartStay has exclusive rates to some of the best hotels.
            </div>
            <div class="banner_text mb-show">
              Learn how to save time and money.
            </div>
            <a class="banner_btn mb-hide" href="https://help.smartstay.com">Learn more</a>
          </div>
        </div>
      </main>
    </section>

    <loader :load='!isLoaded' v-if='!isLoaded'/>
    <div class="popup_bg" v-if="fitlerOptionFlag || isDatePickerOpened || showDropdown || showDropdownSortBy"></div>
    <!-- <div class="popup_bg guest_mod" v-if='showDropdown && maxGuests > 1'></div> -->
    <style>
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
  import {mapState} from 'vuex'
  import Loader from '@/components/Loader';
  import HotelDatePicker from 'vue-hotel-datepicker'
  import Vue from 'vue'
  import StarRating from 'vue-star-rating'
  import _ from 'lodash'
  import {Checkbox} from 'vue-checkbox-radio';
  import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'

  import IconRooms from "@/components/icons/IconRooms.vue"
  import IconParking from "@/components/icons/IconParking.vue"
  import IconWiFi from "@/components/icons/IconWiFi.vue"
  import IconBreakfast from "@/components/icons/IconBreakfast.vue"
  import IconFitness from "@/components/icons/IconFitness.vue"
  import IconRestaurant from "@/components/icons/IconRestaurant.vue"
  import IconStar from "@/components/icons/IconStar.vue"
  import IconBusinessCenter from "@/components/icons/IconBusinessCenter.vue"
  import IconPetsAllowed from "@/components/icons/IconPetsAllowed.vue"
  import IconSwimmingPool from "@/components/icons/IconSwimmingPool.vue"
  import IconAirportShuttle from "@/components/icons/IconAirportShuttle.vue"
  import HotelsapiHelpers from "@/components/Hotelsapi.vue"

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyCoOdN9fa1Pg5DYYNyWAWGH4BpCTyZhwuc',
      libraries: 'places, directions'
    }
  })

  export default {
    head() {
      return {
        title: `${Boolean(this.cityInfo.city) ? this.cityInfo.city + ' |' : ''} SmartStay.com`,
        meta: [{
          hid: 'description',
          name: 'description',
          content: this.cityInfo.city || ''
        }]
      }
    },
    data() {
      return {
        mapCenter: {
          lat: 0,
          lng: 0
        },
        isLoaded: false,
        showDropdown: false,
        showDropdownSortBy: false,
        city_name: this.$route.params.city || "",
        state: this.$route.params.state || "",
        start: null,
        end: null,
        minDay: null,
        maxDay: null,
        guests: this.$route.query.guests || 1,
        maxGuests: 5,
        queryString: '',
        markers: [],
        searchTxt: '',
        filteredHotelList: [],
        fitlerOptionFlag: false,
        rating: 0,
        price: [10, 400],
        vendors: [],
        oldStart: null,
        oldEnd: null,
        old_filter_options: null,
        filter_options: {
          free_breakfast: false,
          swimming: false,
          free_parking: false,
          pets: false,
          non_smoking: false,
          free_airport: false,
          fitness_center: false,
          business_center: false,
        },
        sort_by: 'Best Deal',
        old_sort_by: null,
        getDirections: false,
        bottom: false,
        quantity: 3, // hotels loaded per request
        page: 0,
        isLoadingList: false,
        filterIntervalId: null,
        isDatePickerOpened: false,
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
        comparePricesPromiseIndex: 0,
        comparePricesPromises: [],
      }
    },

    components: {
      IconRooms,
      IconParking,
      IconWiFi,
      IconBreakfast,
      IconFitness,
      IconRestaurant,
      IconStar,
      IconBusinessCenter,
      IconSwimmingPool,
      IconPetsAllowed,
      IconAirportShuttle,
      Loader,
      HotelDatePicker,
      StarRating,
      Checkbox
    },

    computed: {
      ...mapState('city', ['hotelList']),
      ...mapState('city', ['cityInfo']),
      isAuthenticated() {
        return this.$store.state.account.isAuthenticated;
      },
    },
    mounted() {
      if (!this.isAuthenticated) {
        setTimeout(() => {
          this.$router.push('/hotels');
        }, 600);
        return;
      }
      let promises = [];
      let city_name = this.city_name;
      if (this.$route.query.checkin && this.$route.query.checkout) {
        this.start = new Date(this.$route.query.checkin)
        this.end = new Date(this.$route.query.checkout)
      } else {
        this.start = new Date();
        this.end = new Date();
        this.end.setDate(this.end.getDate() + 1);
        this.end = this.end
      }
      this.minDay = new Date(this.start)
      this.maxDay = new Date(this.end)
      this.minDay.setDate(this.minDay.getDate() - 15)
      this.maxDay.setDate(this.maxDay.getDate() + 15)

      promises.push(this.$store.dispatch('city/getCityInfo', {
        city_name: city_name,
        state: this.state,
        check_in: this.$formatDate(this.start.toString()),
        check_out: this.$formatDate(this.end.toString()),
        quantity: this.quantity,
        country_code: this.$route.query.country_code
      }));

      Promise.all(promises)
        .then((data) => {
          this.setMarkers();
        }).catch((error) => {
        console.log(error);
      }).finally(() => {
        if (this.hotelList.data && this.hotelList.data.rate_sorted_list) {
          this.rateSortedList = _.cloneDeep(this.hotelList.data.rate_sorted_list);
          this.filteredHotelList = this.rateSortedList.slice(0, 3);
          // Object.values(_.cloneDeep(this.hotelList.data['getHotelExpress.Results'].results.rate_data));
          var date_from = new Date(this.$formatDate(this.start.toString()));
          var date_to = new Date(this.$formatDate(this.end.toString()));
          const today = new Date()

          if (this.datesEqual(date_from, today)) {
            date_from = this.addDays(date_from, 1)

            if (this.datesEqual(date_from, date_to)) {
              date_to = this.addDays(date_to, 1)
            }
          }
        }
        this.isLoaded = true;
        // window.onscroll = (e) => {
        //     if (document.querySelectorAll('.city-title')[0].offsetHeight - 180 >= window.pageYOffset) {
        //         document.querySelectorAll('main.flex')[0].classList.remove('sticky-map')
        //     } else {
        //         document.querySelectorAll('main.flex')[0].classList.add('sticky-map')
        //     }
        // }
      })
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible()
      })
      this.quantity = 6
    },
    watch: {
      filteredHotelList: {
        handler(newFilteredHotelList, oldFilteredHotelList) {
          let isDatesChanged = this.isDatesChanged();
          let isSortByChanged = this.isSortByChanged();
          let isFiltrationChanged = this.isFiltrationChanged();
          if (isDatesChanged || isSortByChanged || isFiltrationChanged) {
            if (_.size(this.comparePricesPromises) > 0) {
              this.cancelPromises();
              for (let [index, hotel] of newFilteredHotelList.entries()) {
                hotel.force_loading = undefined;
                hotel.hotelsapi_vendors_loading = undefined;
                hotel.hotelsapi_vendors = undefined;
              }
            }
          }
          let isHotelsListChanged = this.isHotelsListChanged(newFilteredHotelList, oldFilteredHotelList);
          if (isDatesChanged || isSortByChanged || isFiltrationChanged || isHotelsListChanged) {
            for (let [index, hotel] of newFilteredHotelList.entries()) {
              hotel.force_loading = index < 10;
            }
            this.comparePricesForAllHotelsSynchronously();
          }
        },
        deep: true
      },
      searchTxt: {
        handler() {
          this.filterHotelList();
        },
        deep: true
      },
      rating: {
        handler() {
          this.filterHotelList();
        },
        deep: true
      },
      filter_options: {
        handler() {
          this.filterHotelList();
        },
        deep: true
      },
      guests: {
        handler() {
          let quary_string = `adults=${this.guests}`;
          this.updateData();
        },
        deep: true
      },
      price: {
        handler() {
          this.filterHotelList();
        },
        deep: true
      },
      sort_by: {
        handler() {
          this.filterHotelList();
        },
        deep: true
      },
      bottom(bottom) {
        if (bottom) {
          this.addHotels()
        }
      },
    },
    methods: {
      applyHotelChanges() {
        this.filteredHotelList = _.cloneDeep(this.filteredHotelList);
      },
      isHotelsListChanged(newFilteredHotelList, oldFilteredHotelList) {
        for (let [index, newHotel] of newFilteredHotelList.entries()) {
          try {
            if (oldFilteredHotelList[index].id !== newHotel.id) {
              return true
            }
          } catch (e) {
            return true
          }
        }
        return false;
      },
      isSortByChanged() {
        if (!this.old_sort_by) {
          this.old_sort_by = _.clone(this.sort_by);
        }
        let isSortByChanged = this.sort_by !== this.old_sort_by;
        this.old_sort_by = _.clone(this.sort_by);
        return isSortByChanged;
      },
      isFiltrationChanged() {
        if (!this.old_filter_options) {
          this.old_filter_options = _.cloneDeep(this.filter_options);
        }
        let isFiltrationChanged = false;
        for (let property of ['free_breakfast', 'swimming', 'free_parking', 'pets',
          'non_smoking', 'free_airport', 'fitness_center', 'business_center']) {
          isFiltrationChanged = this.filter_options[property] !== this.old_filter_options[property];
          if (isFiltrationChanged) {
            break;
          }
        }
        this.old_filter_options = _.cloneDeep(this.filter_options);
        return isFiltrationChanged;
      },
      isDatesChanged() {
        if (!this.oldStart && !this.oldEnd) {
          this.saveDatePickerDates();
        }
        let isDatesChanged = this.start && this.end && (this.start !== this.oldStart || this.end !== this.oldEnd);
        this.saveDatePickerDates();
        return isDatesChanged;
      },
      saveDatePickerDates() {
        this.oldStart = this.start;
        this.oldEnd = this.end;
      },
      titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
      },
      getHotelInfoURL(hotel) {
        return `/city/hotel/${hotel.id}/?${this.queryString}&guests=${this.guests}&check_in=${this.start && this.start.toString()}&check_out=${this.end && this.end.toString()}&city_name=${this.city_name}&hotel_name=${hotel.name}`
      },
      setHotelInfo(hotel) {
        this.openNewTab(this.getHotelInfoURL(hotel), '_blank');
        this.$store.commit('hotel/setHotelInfo', hotel);
      },
      handleClickMarker(marker) {
        this.$store.commit('hotel/setHotelInfo', marker.hotel);
        return this.openNewTab(marker.url)
      },
      datesEqual(date1, date2) {
        return date1.getDate() == date2.getDate() &&
          date1.getMonth() == date2.getMonth() &&
          date1.getFullYear() == date2.getFullYear()
      },
      addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
      },
      toggleInfoWindow: function (marker, idx) {
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
      },
      getInfoWindowContent(marker) {
        let color = this.isMobile() ? '#eaeaea' : '#111111';
        let percentSave = '';
        if (marker.hotel && marker.hotel.room_data.room_0.saving_percentage !== 0) {
          percentSave = `<div class="percent_off mb-hide">
                          <div class="percent_off_content">
                            ${marker.hotel.room_data.room_0.saving_percentage}
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
        let stats = '<ul class="v-info-modal hotel_stats_list" style="padding-left: 0;">';
        if (marker.hotel && marker.hotel.star_rating) {
          stats += `<li class="hotel_stats_item_map">
                      <span class="icon flex-no-shrink text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><title>
                          shape star</title>
                          <g class="nc-icon-wrapper" fill="#111111">
                            <polygon
                              points="8 0.867 10.318 5.563 15.5 6.316 11.75 9.971 12.635 15.133 8 12.696 3.365 15.133 4.25 9.971 0.5 6.316 5.682 5.563 8 0.867"
                              fill="none" stroke="${color}" stroke-linecap="round"
                              stroke-linejoin="round" data-cap="butt"/>
                          </g>
                        </svg>
                      </span>
                      ${parseInt(marker.hotel.star_rating)} Stars
                    </li>`
        }
        if (marker.hotel && marker.hotel.review_rating_desc) {
          stats += `<li class="hotel_stats_item_map">
                      <span class="icon-trip icon flex-no-shrink text-xl">
                        <svg id="lay_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.01 16">
                          <title>good2</title>
                          <path
                            d="M3.5,16H.5a.5.5,0,0,1-.5-.5v-8A.5.5,0,0,1,.5,7h3a.5.5,0,0,1,.5.5v8A.5.5,0,0,1,3.5,16ZM1,15H3V8H1Zm13.84-1L16,9a2.5,2.5,0,0,0-1.9-3A1.72,1.72,0,0,0,13.51,6H10V2.5A2.5,2.5,0,0,0,7.5,0,.5.5,0,0,0,7,.34l-2,6A.5.5,0,0,0,6,6.66L7.85,1A1.5,1.5,0,0,1,9,2.5v4a.5.5,0,0,0,.5.5h4a2.63,2.63,0,0,1,.33,0A1.5,1.5,0,0,1,15,8.83l-1.11,5A1.51,1.51,0,0,1,12.4,15H5.5a.5.5,0,0,0,0,1h6.9A2.48,2.48,0,0,0,14.84,14Z"/>
                        </svg>
                      </span>
                      ${marker.hotel.review_rating_desc}
                    </li>`
        }
        if (marker.hotel) {
          for (let amenity of this.getAmenities(marker.hotel)) {
            let icon = '';
            if (amenity.id === 5) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><title>soup</title><g class="nc-icon-wrapper" fill="${color}"><path d="M6.325,15.5h4.35a7.5,7.5,0,0,0,4.825-7H1.5A7.5,7.5,0,0,0,6.325,15.5Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> <line x1="8.5" y1="0.5" x2="8.5" y2="4.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <line x1="4.5" y1="1.5" x2="4.5" y2="5.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <line x1="12.5" y1="1.5" x2="12.5" y2="5.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/></g></svg>`;
            } else if (amenity.id === 9) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><title>dumbbell</title><g class="nc-icon-wrapper" fill="${color}"><line data-cap="butt" data-color="color-2" x1="16" y1="27" x2="32" y2="27" fill="none" stroke="${color}" stroke-miterlimit="10" stroke-width="2" stroke-linecap="round"/> <line data-cap="butt" data-color="color-2" x1="16" y1="21" x2="32" y2="21" fill="none" stroke="${color}" stroke-miterlimit="10" stroke-width="2" stroke-linecap="round"/> <path d="M13,41h0a3,3,0,0,1-3-3V10a3,3,0,0,1,3-3h0a3,3,0,0,1,3,3V38A3,3,0,0,1,13,41Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/> <line data-color="color-2" x1="5" y1="15" x2="5" y2="33" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/> <line data-color="color-2" x1="5" y1="24" x2="2" y2="24" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/> <path d="M32,38V10a3,3,0,0,1,3-3h0a3,3,0,0,1,3,3V38a3,3,0,0,1-3,3h0A3,3,0,0,1,32,38Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/> <line data-color="color-2" x1="43" y1="33" x2="43" y2="15" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/> <line data-color="color-2" x1="46" y1="24" x2="43" y2="24" fill="none" stroke="#111111" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/></g></svg>`;
            } else if (amenity.id === 14) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><title>soup</title><g class="nc-icon-wrapper" fill="${color}"><path d="M6.325,15.5h4.35a7.5,7.5,0,0,0,4.825-7H1.5A7.5,7.5,0,0,0,6.325,15.5Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> <line x1="8.5" y1="0.5" x2="8.5" y2="4.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <line x1="4.5" y1="1.5" x2="4.5" y2="5.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <line x1="12.5" y1="1.5" x2="12.5" y2="5.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/></g></svg>`;
            } else if (amenity.id === 2) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><title>apartment</title><g class="nc-icon-wrapper" fill="${color}"><line x1="15" y1="15" x2="15" y2="17" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="21" y1="15" x2="21" y2="17" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="27" y1="15" x2="27" y2="17" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="33" y1="15" x2="33" y2="17" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="15" y1="23" x2="15" y2="25" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="21" y1="23" x2="21" y2="25" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="27" y1="23" x2="27" y2="25" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="33" y1="23" x2="33" y2="25" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/><line x1="8" y1="32" x2="40" y2="32" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/><polygon points="20 38 28 38 28 46 40 46 40 8 24 3 8 8 8 46 20 46 20 38" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/></g></svg>`;
            } else if (amenity.id === 10) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><title>parking</title><g class="nc-icon-wrapper" fill="${color}"><rect x="1" y="1" width="30" height="30" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" stroke-linejoin="round"/> <line x1="11" y1="8" x2="11" y2="24" fill="none" stroke="${color}" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" data-color="color-2" stroke-linejoin="round"/> <path d="M11,8h5.5A4.5,4.5,0,0,1,21,12.5h0A4.5,4.5,0,0,1,16.5,17H11" fill="none" stroke="${color}" stroke-miterlimit="10" stroke-width="2" data-cap="butt" data-color="color-2" stroke-linecap="round"/></g></svg>`;
            } else if (amenity.id === 13) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><title>paw</title><g class="nc-icon-wrapper" fill="${color}"><path d="M10.976,8.391A3.513,3.513,0,0,0,8,6.667,3.513,3.513,0,0,0,5.024,8.391l-.015.026-1.2,2.263a2.92,2.92,0,0,0,.409,3.339,2.367,2.367,0,0,0,2.726.615,2.426,2.426,0,0,1,2.106,0,2.368,2.368,0,0,0,2.726-.615,2.92,2.92,0,0,0,.409-3.339Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> <path d="M5.367,5.331A1.889,1.889,0,0,0,6.991,3.164h0A1.9,1.9,0,0,0,5.22,1.174,1.91,1.91,0,0,0,3.666,3.339,1.934,1.934,0,0,0,5.367,5.331Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <path d="M3.005,6.667A1.47,1.47,0,0,0,1.327,5.491,1.458,1.458,0,0,0,.6,7.407,1.459,1.459,0,0,0,2.279,8.583,1.456,1.456,0,0,0,3.005,6.667Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <path d="M10.633,5.331A1.889,1.889,0,0,1,9.009,3.164h0a1.9,1.9,0,0,1,1.771-1.99,1.91,1.91,0,0,1,1.554,2.165A1.934,1.934,0,0,1,10.633,5.331Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <path d="M13,6.667a1.47,1.47,0,0,1,1.678-1.176A1.458,1.458,0,0,1,15.4,7.407a1.459,1.459,0,0,1-1.679,1.176A1.456,1.456,0,0,1,13,6.667Z" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/></g></svg>`;
            } else if (amenity.id === 15) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><title>water aerobics</title><g class="nc-icon-wrapper" fill="${color}"><g> <path d="M.5,15.5a4.862,4.862,0,0,0,3.75-1.75,4.893,4.893,0,0,0,6.893.607,4.834,4.834,0,0,0,.607-.607A4.839,4.839,0,0,0,15.5,15.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> <path d="M.5,12.5a4.862,4.862,0,0,0,3.75-1.75,4.893,4.893,0,0,0,6.893.607,4.834,4.834,0,0,0,.607-.607A4.839,4.839,0,0,0,15.5,12.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/> </g> <circle cx="8" cy="2" r="1.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> <g> <circle cx="8" cy="2" r="1.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> <polyline points="14.5 1.5 10.5 5.5 5.5 5.5 1.5 1.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> <line x1="5.5" y1="5.5" x2="5.5" y2="9.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> <line x1="10.5" y1="5.5" x2="10.5" y2="9.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/> </g></g></svg>`;
            } else if (amenity.id === 1) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><title>bus front 12</title><g class="nc-icon-wrapper" fill="${color}"><polyline fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="4.5,13.5 4.5,15.5 1.5,15.5 1.5,13.5 " data-cap="butt" data-color="color-2"/> <polyline fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="14.5,13.5 14.5,15.5 11.5,15.5 11.5,13.5 " data-cap="butt" data-color="color-2"/> <path fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M14.5,13.5h-13v-12 c0-0.552,0.448-1,1-1h11c0.552,0,1,0.448,1,1V13.5z" data-cap="butt"/> <line fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="1.5" y1="8.5" x2="14.5" y2="8.5" data-cap="butt"/> <circle fill="${color}" cx="4" cy="11" r="1" data-cap="butt" data-stroke="none"/> <circle fill="${color}" cx="12" cy="11" r="1" data-cap="butt" data-stroke="none"/> <path fill="${color}" d="M1,9h1V5H1C0.448,5,0,5.448,0,6v2C0,8.552,0.448,9,1,9z" data-cap="butt" data-stroke="none"/> <path fill="${color}" d="M15,9h-1V5h1c0.552,0,1,0.448,1,1v2C16,8.552,15.552,9,15,9z" data-cap="butt" data-stroke="none"/></g></svg>`;
            } else if (amenity.id === 7) {
              icon += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><title>wifi</title><g class="nc-icon-wrapper" fill="${color}"><path d="M8.8,6.5A4.412,4.412,0,0,0,3.2,6.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" data-color="color-2"/><path d="M6,9a1,1,0,1,0,1,1A1,1,0,0,0,6,9Z" fill="${color}" data-cap="butt" data-stroke="none"/><path d="M11.472,3.5A8.486,8.486,0,0,0,.528,3.5" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
            }
            if (icon !== '') {
              stats += `<li class="hotel_stats_item_map">
                          <span class="icon-trip icon flex-no-shrink text-xl">
                            ${icon}
                          </span>
                          ${amenity.name}
                        </li>`
            }

          }
        }
        stats += '</ul>';
        return `<a href="${marker.url}" target="_blank" class="card" style="max-width:246px;">
                    <div class="card-image">
                      <figure class="image is-4by3">
                        ${percentSave}
                        <img style="max-width:246px;min-height:163px" src="${marker.hotel_thumb}" alt="Placeholder image">
                      </figure>
                    </div>
                    <div class="card-content" style="max-width: 246px;font-family: 'proxima-nova', Helvetica, Arial, sans-serif;">
                      <div class="media">
                        <div class="media-content">
                          <b><h3 class="hotel_name mb-hide">${marker.name}</p></b>
                        </div>
                      </div>
                      ${stats}
                      <div class="hotel_prices" style="text-align: right">
                        <span class="hotel_price_map old_mod">
                          ${marker.hotel.room_data ? marker.hotel.room_data.room_0.price_details.display_symbol : ''} ${marker.hotel.room_data ? this.exchange(marker.hotel.room_data.room_0.benchmark_price_details['display_price']) : ''}
                        </span>
                        <span class="hotel_price_map">
                          ${marker.hotel.room_data ? marker.hotel.room_data.room_0.price_details.display_symbol : ''} ${marker.hotel.room_data ? this.exchange(marker.hotel.room_data.room_0.price_details['display_price']) : ''}
                        </span>
                        <span class="hotel_price_map info_mod">per night</span>
                      </div>
                    </div>
                  </a>`
      },
      bottomVisible() {
        if (!this.getDirections) {
          const scrollY = window.scrollY
          const visible = document.documentElement.clientHeight
          const pageHeight = document.documentElement.scrollHeight - 427
          const bottomOfPage = visible + scrollY >= pageHeight
          return bottomOfPage || pageHeight < visible
        }
        return false
      },
      addHotels() {
        if (!this.rateSortedList || !this.filteredHotelList) {
          return
        }
        this.filteredHotelList = this.filteredHotelList.concat(this.rateSortedList.slice(this.filteredHotelList.length, (this.filteredHotelList.length - 1) + this.quantity))
        if (this.filteredHotelList.length < this.rateSortedList.length) {
          this.isLoadingList = true;
          this.quantity = 12;
          var self = this;
          setTimeout(function () {
            self.addHotels()
          }, 1500)
        } else {
          this.isLoadingList = false;
        }
      },
      updateData() {
        this.isLoaded = false;
        let promises = [];
        let city_name = this.city_name;
        promises.push(this.$store.dispatch('city/getCityInfo', {
          city_name: city_name,
          state: this.state,
          check_in: this.$formatDate(this.start.toString()),
          check_out: this.$formatDate(this.end.toString()),
          quantity: this.quantity,
          country_code: this.$route.query.country_code
        }));

        Promise.all(promises)
          .then((data) => {
            this.setMarkers();
          }).catch((error) => {
          console.log(error);
        }).finally(() => {
          if (this.hotelList.data && this.hotelList.data.rate_sorted_list) {
            this.rateSortedList = _.cloneDeep(this.hotelList.data.rate_sorted_list);
            this.filteredHotelList = this.rateSortedList.slice(0, 3) // Object.values(_.cloneDeep(this.hotelList.data['getHotelExpress.Results'].results.rate_data));
            var date_from = new Date(this.$formatDate(this.start.toString()));
            var date_to = new Date(this.$formatDate(this.end.toString()));
            const today = new Date()

            if (this.datesEqual(date_from, today)) {
              date_from = this.addDays(date_from, 1)

              if (this.datesEqual(date_from, date_to)) {
                date_to = this.addDays(date_to, 1)
              }
            }
          }
          this.isLoaded = true;
          // window.onscroll = (e) => {
          //     if (document.querySelectorAll('.city-title')[0].offsetHeight - 180 >= window.pageYOffset) {
          //         document.querySelectorAll('main.flex')[0].classList.remove('sticky-map')
          //     } else {
          //         document.querySelectorAll('main.flex')[0].classList.add('sticky-map')
          //     }
          // }
        })
      },
      openNewTab(url) {
        window.open(url)
      },
      getThumb(val) {
        return 'http://' + val;
      },
      changeStartDate(date) {
        this.start = date
        this.isDatePickerOpened = false
      },
      changeEndDate(date) {
        this.end = date
        this.isDatePickerOpened = true
        if (date !== null) {
          this.updateData()
        }
      },
      handleDatePickerOpened(e) {
        this.isDatePickerOpened = !this.isDatePickerOpened
      },
      exchange(val) {
        return parseInt(val);
      },
      getHotelByIndex(index) {
        return this.filteredHotelList[index]
      },
      comparePrices(hotel, index, comparePricesPromiseIndex) {
        let promise;
        if (comparePricesPromiseIndex !== undefined) {
          promise = this.comparePricesPromises[comparePricesPromiseIndex];
          if (promise.canceled) {
            hotel.hotelsapi_vendors_loading = false;
            return
          }
        }
        hotel.hotelsapi_vendors_loading = true;
        this.applyHotelChanges();
        return this.$store.dispatch('hotel/getHotelsapiInfo', {
          check_in: this.$formatDateRaw(this.start),
          check_out: this.$formatDateRaw(this.end),
          hotel_name: hotel.name,
          city_name: this.$store.state.city.cityInfo.city,
          pax: this.$store.state.chooseRoom.guests || this.$route.query.guests,
          currency: this.$store.state.currency,
        }).then((data) => {
          hotel.hotelsapi_vendors_loading = false;
          if (promise && promise.canceled) {return}
          HotelsapiHelpers.applyHotelsapi(index, data, this.getHotelByIndex, this.applyHotelChanges)
        }).catch((data) => {
          hotel.hotelsapi_vendors_loading = false;
          if (promise && promise.canceled) {return}
          HotelsapiHelpers.catchErrorHotelsapi(index, this.getHotelByIndex, this.applyHotelChanges)
        });
      },
      cancelPromises() {
        let promise = this.comparePricesPromises[this.comparePricesPromiseIndex];
        promise.canceled = true;
        this.comparePricesPromiseIndex++;
      },
      comparePricesForAllHotelsSynchronously() {
        if (this.comparePricesPromises.length - 1 < this.comparePricesPromiseIndex) {
          this.comparePricesPromises.push({canceled: false, obj: null});
        }
        this.filteredHotelList.forEach((hotel, index) => {
          if (hotel.hotelsapi_vendors_loading || hotel.hotelsapi_vendors || index >= 10) {
            return;
          }
          let promise = this.comparePricesPromises[this.comparePricesPromiseIndex];
          promise.obj = promise.obj ? promise.obj.finally(
            this.comparePrices.bind(this, hotel, index, this.comparePricesPromiseIndex)
          ) : this.comparePrices(hotel, index, this.comparePricesPromiseIndex);
        });
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
      handleGetMapDirections() {
        this.getDirections = true
      },
      hideMapDirections() {
        this.getDirections = false
      },
      getCorrectDate(field) {
        let date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        // date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        if (field === 'startDate') {
          this.start = date
        } else if (field === 'endDate') {
          date.setDate(date.getDate() + 1)
          this.end = date
        }
        return date
      },
      checkAmenity(hotel, id) {
        let services = Object.values(hotel.amenity_data);
        return services.some(item => {
          return item.id == id
        });
      },
      _getUnique(arr, comp) {
        const unique = arr
          .map(e => e[comp])

          // store the keys of the unique objects
          .map((e, i, final) => final.indexOf(e) === i && i)

          // eliminate the dead keys & store unique objects
          .filter(e => arr[e]).map(e => arr[e]);

        return unique;
      },
      filterHotelList(new_entries = []) {
        let filteredHotelList = [];
        filteredHotelList = this.rateSortedList
        filteredHotelList = filteredHotelList.filter(item => {
          return item.name.toLowerCase().includes(this.searchTxt.toLowerCase())
        });
        filteredHotelList = filteredHotelList.filter(item => {
          if (this.rating == 5)
            return item.star_rating >= 5;
          else if (this.rating == 0)
            return item.star_rating >= this.rating;
          else
            return item.star_rating >= this.rating && item.star_rating < this.rating + 1;
        });
        if (this.filter_options.free_breakfast)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 5)
          })
        if (this.filter_options.swimming)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 15)
          })
        if (this.filter_options.free_parking)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 10)
          })
        if (this.filter_options.pets)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 13)
          })
        if (this.filter_options.non_smoking)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 12)
          })
        if (this.filter_options.free_airport)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 1)
          })
        if (this.filter_options.fitness_center)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 9)
          })
        if (this.filter_options.business_center)
          filteredHotelList = filteredHotelList.filter(item => {
            let values = Object.values(item.amenity_data);
            return values.some(element => element.id == 2)
          })
        filteredHotelList = filteredHotelList.filter(item => {
          return item.room_data.room_0.price_details['display_price'] >= this.price[0] && item.room_data.room_0.price_details['display_price'] <= this.price[1]
        })
        if (this.sort_by === 'Best Deal') {
          filteredHotelList = filteredHotelList.sort((a, b) => {
            return a.room_data.room_0.price_details['display_price'] - b.room_data.room_0.price_details['display_price']
          })
          var four_star_hotels = filteredHotelList.filter(item => {
            return item.star_rating === 4
          })
          filteredHotelList = filteredHotelList.filter(item => {
            return item.star_rating !== 4
          })
          filteredHotelList.unshift(...four_star_hotels)
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
        }
        if (this.sort_by === 'Best Rated') {
          filteredHotelList = filteredHotelList.sort((a, b) => {
            return b.star_rating - a.star_rating
          })
        }
        this.filteredHotelList = filteredHotelList.slice(0, 4);
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
          destination: marker.location,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            // this.directionsDisplay.setDirections(response)
          }
        })
      },
      formatAmenitiesForMap(item) {
        var str = '';
        this.getAmenities(item).forEach((amenity) => {
          str += `${amenity.name}, `
        })
        return str.slice(0, -1);
      },
      setStarsIcons(star_rating) {
        var stars = ``
        for (var i = 0; i < star_rating; i++) {
          stars += `<svg style="width:15px;" viewBox="0 0 16 15.3"><path d="M12.6 15.3l-.2-.1L8 12.9l-4.4 2.3h-.5c-.2-.1-.2-.3-.2-.5l.8-4.9L.2 6.3C0 6.2 0 6 0 5.8c.1-.2.2-.3.4-.3l4.9-.7L7.5.3c.2-.3.7-.3.9 0l2.2 4.5 4.9.7c.2 0 .3.2.4.3s0 .4-.1.5l-3.6 3.5.8 4.9c0 .2 0 .4-.2.5l-.2.1zM8 11.8l.2.1 3.7 2-.7-4.2.1-.4 3-2.9-4.2-.6c-.2 0-.3-.1-.4-.3L8 1.6 6.1 5.4c0 .2-.2.3-.3.3l-4.2.6 3 2.9c.1.1.2.3.1.4L4 13.9l3.7-2 .3-.1z"/></svg>`
        }
        return stars
      },
      setMarkers() {
        this.markers = [];
        if (!this.hotelList.data || !this.hotelList.data.rate_sorted_list)
          return;
        let hotel_list = this.hotelList.data.rate_sorted_list;
        let circleRadius = 100;
        let color_alternate_2 = '#1e1e1e';
        hotel_list.forEach((item, index) => {
          if (index === 0) {
            this.mapCenter = {
              lat: Number(item.geo.latitude),
              lng: Number(item.geo.longitude)
            };
          }

          this.markers.push({
            position: {
              lat: Number(item.geo.latitude),
              lng: Number(item.geo.longitude)
            },
            location: `${item.address.address_line_one} ${item.address.city_name} ${item.address.country_code}`,
            url: `/city/hotel/${item.id}/?${this.queryString}&guests=${this.guests}&check_in=${this.start && this.start.toString()}&check_out=${this.end && this.end.toString()}&city_name=${this.city_name}&hotel_name=${item.name}`,
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
              text: `$${this.exchange(item.room_data.room_0.price_details['display_price'])}`,
              color: 'white',
              fontSize: '11pt'
            },
            labelContent: `<div class='arrow'></div><div class='inner'>$${this.exchange(item.room_data.room_0.price_details['display_price'])}</div>`,
            labelClass: 'labels',
            id: item.id,
            disabled: false,
            name: item.name,
            hotel: item,
            star_rating: this.setStarsIcons(item.star_rating),
            address: item.address.address_line_one,
            amenities: this.formatAmenitiesForMap(item),
            hotel_thumb: this.getThumb(item.thumbnail_hq.three_hundred_square),
          })
        });
      },
      isMobile: function () {
        var check = false;
        (function (a) {
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/vars/index.scss';

  @import '@/assets/scss/mixins/index.scss';

  main {
    overflow: hidden !important;

    .map {
      @include bp($bp) {
        display: block !important;
        width: 519 / 540 * 100vw;
        max-width: 100%;
        height: 210 / 540 * 100vw;
      }
    }

    .map_btn {
      z-index: 10;

      position: absolute;
      right: 14px;
      bottom: 9px;

      display: inline-flex;
      height: 28px;
      padding: 5px 13px;
      align-items: center;
      justify-content: center;

      font-size: 13px;
      font-weight: 600;
      line-height: 1.05;
      color: $white;

      border-radius: 3px;
      background-color: $blue_1;

      @include bp($bp) {
        right: 9px;
      }
    }
  }

  .vue-star-rating-rating-text {
    display: none;
  }

  .filter-option {
    z-index: 101;

    position: absolute;
    top: calc(100% + 10px);

    margin: 0;
    width: 100%;
    max-width: 686px;
    padding: 1rem;

    border: 1px solid rgba($black, .5);
    border-radius: 4px;
    background: white;

    @include bp($point_2) {
      top: calc(100% + 8px);

      min-width: calc(100vw - 56px);
    }

    @include bp($bp) {
      top: calc(100% + 8px);

      margin: 0 auto;
      min-width: 97%;
    }

    input {
      margin: 10px;
      min-width: 150px;
      height: 40px;
      padding: 3px 12px 0;
      flex: 1;

      border: 1px solid #dae0e4;
      border-radius: 4px;
      outline: none;
    }

    div.column {
      width: 100%;
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }

  .btn-overlay {
    z-index: 999;

    position: absolute;
    top: 0;
    right: 0;
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

  .info {
    background-color: white !important;

    @include bp($bp) {
      background-color: transparent !important;
    }
  }

  .discount-row {
    padding: 10px;

    font-size: 16px;
    font-weight: 500;
  }

  .mb-show {
    display: none !important;
  }

  .distance, .trip, .amenities {
    font-size: 10pt;
    font-weight: 400;
    color: #252525;
  }

  .guests {
    margin-left: 9px;
    display: inline-flex;
    padding: 7px 9px 7px;

    font-size: 15px;
    font-weight: 600;
    line-height: 1;

    cursor: pointer;
    user-select: none;

    border: 1px solid #dae0e4;
    border-radius: 4px;

    @include bp($bp) {
      margin-right: 6px;
      margin-left: 0;
    }
  }

  .filter {
    z-index: 101;

    margin-top: 10px;
    margin-left: 10px;
    display: inline-flex;
    padding: 7px 16px 7px;

    font-size: 14px;
    font-weight: 600;
    line-height: 1;

    cursor: pointer;
    user-select: none;

    border: 1px solid #dae0e4;
    border-radius: 4px;

    @include bp($bp) {
      margin-top: 0;
      margin-right: 6px;
      margin-left: 0;
    }
  ;
  }

  .no-padding {
    padding: initial !important;
  }

  main {
    //z-index: 2;
    position: relative;

    margin: -236px auto 0;
    width: 100%;
    max-width: 950px;

    /*[data-id='map'] {*/
    /*    display: none;*/
    /*  width: 25%;*/
    /*  height: calc(100vh - 250px);*/
    /*  .marker {*/
    /*    cursor: pointer!important;*/
    /*  }*/
    /*}*/

    @include bp($bp) {
      margin: 0 auto;
      max-width: 100%;
    }

    /*&.sticky-map {*/
    /*    @media (min-width: 992px) {*/
    /*        .hotel-list {*/
    /*            margin-left: 25%;*/
    /*        }*/
    /*    }*/

    /*    [data-id='map'] {*/
    /*        width:  calc((100% - 300px) / 4);*/
    /*        height: calc(100vh - 270px);*/
    /*        position: fixed;*/
    /*        top: 0;*/
    /*        left: 150px;*/
    /*    }*/
    /*}*/

    ul {
      padding: 0;

      list-style-type: none;

      &::-webkit-scrollbar {
        width: 0;
      }

      .expedia {
        padding: 15px 22px;

        border-bottom: 1px solid rgba(0, 0, 0, .15);

        div {
          margin-bottom: 0;

          font-size: 12pt;
          font-weight: 500;
        }

        p {
          font-size: 14px;
          font-weight: 400;
        }
      }

      .hotel {
        padding: 35px 30px;

        border-bottom: 1px solid rgba(0, 0, 0, .15);

        &.hotel-expedia:last-child, &:last-child {
          border-bottom: none;
        }

        &.hotel-expedia {
          cursor: pointer;

          border-bottom: 1px solid rgba(255, 255, 255, 1);
          background: #f7f7f7;

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

          .address {
            margin-bottom: 0;

            font-size: 1rem;
          }
        }

        /*&:not(.hotel-expedia) .image {*/
        /*    min-height: 50px;*/

        /*    @media (min-width: 992px) {*/
        /*        height: 165px;*/
        /*    }*/
        /*}*/

        .image {
          width: 230px;
          height: 170px;

          cursor: pointer;

          .stars {
            z-index: 1;

            position: absolute;
            right: 0;
            bottom: 0;

            padding: 5px 5px 0;

            color: #fff;

            text-align: center;

            background: rgba(0, 0, 0, .7);

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
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          color: #000;

          text-align: right;

          .rate {
            font-size: 19pt;
            line-height: 20pt;
            color: #171717;

            .old {
              color: #c5c5c5;

              text-decoration: line-through;
            }
          }

          p {
            font-size: 10pt;
            font-weight: 400;
            color: #b4b4b4;
          }

          .rates {
            font-size: 10pt;
            font-weight: 400;
            color: #171717;
          }

          .btn {
            display: inline-block;
            width: 168px;
            height: 37px;

            font-size: 11pt;
            font-weight: 500;
            line-height: 40px;
            color: #fff;

            text-align: center;

            border-radius: 4px;
          }

          .btn-amenities {
            margin: 6px 0;
            width: auto;
            height: 29px;
            padding: 0 10px;

            font-size: 10pt;
            font-size: 12px;
            font-weight: 500;
            line-height: 30px;
          }
        }

        .address {
          font-size: 1rem;
          font-weight: 400;
          color: #252525;
        }
      }
    }

    .amenitie-list {
      i {
        padding-right: .5rem;
      }
    }

    .full-screen-map {
      width: 100% !important;
      min-height: 50rem;
    }
  }

  .city_content {
    position: relative;

    margin: 0 auto 0px;
    width: 100%;
    max-width: 950px;

    @include bp($bp) {
      margin: 0 auto;
      max-width: 100%;
    }
  }

  .city-title {
    min-height: 172px;
    padding: 28px 28px 20px;

    //overflow: hidden;

    border-bottom: 0 solid rgba(0, 0, 0, .15);
    background-repeat: no-repeat;
    background-size: cover;

    @include bp($bp, min) {
      // overflow: hidden;
    }

    @include bp($bp) {
      max-width: 100%;
      min-height: auto;
      padding: 63px 10px 250px;
      // overflow: hidden;
    }

    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      display: block;
      width: 100%;
      height: 100%;
    }

    h2 {
      margin-bottom: 7px;

      font-size: 32px;
      font-weight: 300;
      line-height: 1;

      letter-spacing: -.7px;
    }

    p {
      //margin-bottom: 9px;

      font-size: 14px;
      font-weight: 400;

      letter-spacing: -.3px;
    }

    .date-button {
      margin-top: 10px;
      display: inline-block;
      padding: 4px 10px 4px;

      font-size: 15px;
      font-weight: 600;
      line-height: 1;
      line-height: 20px;
      color: #fff;

      cursor: pointer;
      user-select: none;
      text-align: center;

      border: 1px solid #dae0e4;
      border-radius: 4px;

      @include bp($bp) {
        margin-top: 0;
        margin-right: 6px;
      }
    }
  }

  /*@media (max-width: 1350px) {*/
  /*    main {*/
  /*        padding: 0px 100px;*/

  /*        &.sticky-map {*/
  /*            [data-id='map'] {*/
  /*                left: 100px;*/
  /*            }*/
  /*        }*/
  /*    }*/
  /*}*/

  @media (max-width: 1200px) {
    main {
      /*padding: 0px 30px;*/

      /*&.sticky-map {*/
      /*    [data-id='map'] {*/
      /*        left: 30px;*/
      /*        width: calc((100% - 60px) / 4);*/
      /*    }*/
      /*}*/

      ul {
        .hotel {
          .prices {
            .rate {
              font-size: 21pt;
              font-weight: 800;
            }

            p, .rates {
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
    .city-title {
      padding-bottom: 2px;
    }

    main {
      /*margin-bottom: 0;*/
      /*position: static;*/
      /*height: auto;*/
      /*padding: 0;*/

      /*[data-id='map'] {*/
      /*    display: none;*/
      /*}*/

      .hotel-list {
        width: 100%;

        .hotel {
          .image {
            width: 270px;
          }
        }
      }
    }

    .city-title {
      h2 {
        font-size: 30px;
        font-weight: 300;
      }

      p {
        font-size: 15px;
      }
    }
  }

  @media (max-width: 768px) {
    main {
      /*margin-bottom: 0;*/
      /*position: static;*/
      /*height: auto;*/
      /*padding: 0;*/

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

            img {
              max-height: 250px;
            }
          }

          .image, .info {
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
  }

  .text-primary {
    font-size: .9rem;
    font-weight: 500;
    color: #ec3323 !important;
  }

  .hover\\:text-primary:hover {
    color: #ec3323 !important;
  }

  .focus\\:text-primary:focus {
    color: #ec3323 !important;
  }

  .border-primary {
    border-color: #06d394 !important;
  }

  .hover\\:border-primary:hover {
    border-color: #06d394 !important;
  }

  .focus\\:border-primary:focus {
    border-color: #06d394 !important;
  }

  .bg-primary {
    background-color: #06d394 !important;
  }

  .bg-alternative_2 {
    background-color: #121212 !important;
  }

  .hover\\:bg-primary:hover {
    background-color: #06d394 !important;
  }

  .focus\\:bg-primary:focus {
    background-color: #06d394 !important;
  }

  .text-alternate {
    color: #1e1e1e !important;
  }

  .hover\\:text-alternate:hover {
    color: #1e1e1e !important;
  }

  .focus\\:text-alternate:focus {
    color: #1e1e1e !important;
  }

  .border-alternate {
    border-color: #1e1e1e !important;
  }

  .hover\\:border-alternate:hover {
    border-color: #1e1e1e !important;
  }

  .focus\\:border-alternate:focus {
    border-color: #1e1e1e !important;
  }

  .bg-alternate {
    background-color: #1e1e1e !important;
  }

  .hover\\:bg-alternate:hover {
    background-color: #1e1e1e !important;
  }

  .focus\\:bg-alternate:focus {
    background-color: #1e1e1e !important;
  }

  @media (max-width: 768px) {
    .mb-hide {
      display: none !important;
    }

    .mb-show {
      display: block !important;
    }

    .city-title {
      padding-top: 0;

      h2 {
        margin-bottom: 8px;

        font-size: 34px;
        font-weight: 300;
        line-height: 1.05;

        letter-spacing: -.68px;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .name.mb-show {
      width: 100%;

      @include bp($bp) {
        margin: 0 0 2px;

        font-size: 20px;
        font-weight: 400;
        line-height: 1;
        color: $white;

        letter-spacing: -.64px;
      }
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

            p, .rates {
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
            padding-left: 26px;
            flex-wrap: wrap;
          }

          .image {
            .btn {
              position: absolute;
              right: 11px;
              bottom: 50px;

              width: auto;
              height: 29px;
              padding: 0 11px;

              font-size: 12px;
              font-weight: 400;
              line-height: 30px;

              border-radius: 5px;
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

  body {
    .vue-star-rating-rating-text {
      display: none;
    }

    .v-input--selection-controls {
      margin: 0;

      .v-input__slot {
        margin: 0 !important;
      }
    }

    .v-text-field__slot {
      label {
        z-index: 1;
      }
    }
  }

</style>
<style lang="scss">

  main {
    .datepicker {
      z-index: 15;
      top: 42px !important;
    }

    .datepicker--inner {
      padding: 5px 30px 20px !important;
    }

    .datepicker__dummy-wrapper {
      opacity: 0;
    }

    .datepicker--open {
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, .5);
      background-color: #fff;
      overflow: hidden;
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

      .hotel_rates {
        &.mb-show {
          display: flex !important;
        }
      }
    }
  }

  .labels {
    margin-top: -3px;
    padding: 5px;
    position: absolute;
    visibility: visible;
    z-index: 1030;
  }

  .labels.active .inner {
    background: cyan;
  }

  .labels.hover .inner {
    background-color: yellow;
  }


  .labels .arrow {
    border-top-color: #000000;
    border-right-color: rgba(0, 0, 0, 0);
    border-bottom-color: rgba(0, 0, 0, 0);
    border-left-color: rgba(0, 0, 0, 0);
    border-width: 5px 5px 0;
    bottom: 0;
    left: 50%;
    margin-left: -5px;
    border-style: solid;
    height: 0;
    position: absolute;
    width: 0;
  }

  .labels .inner {
    background-color: #000000;
    border-radius: 4px;
    color: #FFFFFF;
    max-width: 200px;
    padding: 3px 8px;
    text-align: center;
    text-decoration: none;
  }


  .labels.active .arrow {

    border-top-color: #00ffff;
    border-right-color: rgba(0, 255, 255, 0);
    border-bottom-color: rgba(0, 255, 255, 0);
    border-left-color: rgba(0, 255, 255, 0);

  }

  .labels.hover .arrow {
    border-top-color: #ffff00;
    border-right-color: rgba(255, 255, 0, 0);
    border-bottom-color: rgba(255, 255, 0, 0);
    border-left-color: rgba(255, 255, 0, 0);
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
</style>
