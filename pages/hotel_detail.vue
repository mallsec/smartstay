<template>

<div class="hotel_detail">
  <section
      v-if="true"
      class="hotel_detail_hero_section bg-cover bg-center topSection">
      <!-- <div style="padding-bottom: 15vw"></div> -->
      <div class="hotel_detail_hero_section_in">
        <v-carousel v-if="true" hide-controls hide-delimiters class="carousel" height="190">
            <v-carousel-item :key="i" v-for="i in 5">
                <v-layout row wrap>
                    <v-flex lg3 md4 sm6 xs12 v-for="j in 4" :key="j">
                        <img src="@/assets/img/top_slide.jpg" alt="">
                    </v-flex>
                </v-layout>
            </v-carousel-item>
        </v-carousel>
      </div>
  </section>
  <section class="hotel_detail_choose">
    <div class="container">
      <div class="hotel_detail_choose_in">
        <h1 class="hotel_detail_choose_title">W Miami</h1>

        <div class="hotel_detail_choose_control_wrap">
          <span class="choose_room_btn v1_mod">Choose room</span>
        </div>
      </div>
    </div>
  </section>
  <section class="hotel_detail_info">
    <div class="hotel_detail_info_row">
      <div class="container">
        <div class="hotel_detail_info_item">
          <div class="hotel_detail_info_item_header">
            <h3 class="hotel_detail_info_item_title">Save 20% on member rate</h3>
            <span class="hotel_detail_info_item_subtitle">Comparable websites:</span>
          </div>

          <div class="hotel_detail_info_item_sites">
            <div class="site_item">
              <span class="site_item_price">$119</span>
              <div class="site_item_logo_wrap">
                <img class="site_item_logo" src="@/assets/img/hotel_item/expedia.png" alt="">
              </div>
              </div>
              <div class="site_item">
                <span class="site_item_price">$139</span>
                <div class="site_item_logo_wrap">
                  <img class="site_item_logo" src="@/assets/img/hotel_item/hotels.png" alt="">
                  </div>
                </div>
                <div class="site_item">
                  <span class="site_item_price">$129</span>
                  <div class="site_item_logo_wrap">
                    <img class="site_item_logo" src="@/assets/img/hotel_item/booking.png" alt="">
                  </div>
                  </div>
                  <div class="site_item">
                    <span class="site_item_price">$149</span>
                    <div class="site_item_logo_wrap">
                      <img class="site_item_logo" src="@/assets/img/hotel_item/agoda.png" alt="">
                  </div>
                    </div>
                  </div>

                  <p class="hotel_detail_info_descr">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ... read more.
                  </p>
                </div>

                <div class="hotel_detail_info_item">
                  <div class="hotel_detail_info_map">

                  </div>
                </div>
              </div>
            </div>

            <div class="hotel_detail_info_row column_mod">
              <div class="container">
                <div class="hotel_detail_info_item">
                  <div class="hotel_detail_info_item_header">
                    <h3 class="hotel_detail_info_item_title">Amenities</h3>
                    <span class="hotel_detail_info_item_subtitle">What to expect at this property.</span>
                  </div>
                  <div class="hotel_detail_amenities">
                    <div class="hotel_amenity">
                      <div class="hotel_amenity_icon_wrap">
                        <IconRooms></IconRooms>
                      </div>
                      <span class="hotel_amenity_text">201 rooms</span>
                    </div>
                    <div class="hotel_amenity">
                      <div class="hotel_amenity_icon_wrap">
                        <IconParking></IconParking>
                      </div>
                      <span class="hotel_amenity_text">Complimentary Parking</span>
                    </div>
                    <div class="hotel_amenity">
                      <div class="hotel_amenity_icon_wrap">
                        <IconWiFi></IconWiFi>
                      </div>
                      <span class="hotel_amenity_text">Free Wifi Internet</span>
                    </div>
                    <div class="hotel_amenity" v-for="item of new Array(10)" :key="item">
                      <div class="hotel_amenity_icon_wrap">
                        <IconBreakfast></IconBreakfast>
                      </div>
                      <span class="hotel_amenity_text">Breakfest included</span>
                    </div>
                  </div>
                </div>

                <div class="hotel_detail_info_item v1_mod">
                  <div class="hotel_detail_info_item_header">
                    <h3 class="hotel_detail_info_item_title">Reviews</h3>
                    <span class="hotel_detail_info_item_subtitle">67 Travelers say Excellent!</span>
                  </div>
                  <div class="hotel_detail_citates">
                    <easy-slider v-if='true' :auto='false' width='100%' :control-btn='false'>
                      <easy-slider-item v-for="item in new Array(3)" :key="item">
                        <div class="citate_item">
                          <p class="citate_item_text">“Stayed overnight while traveling by air through Tampa. The Hotel obviously is very convenient to the airport as the lobby is open to.”</p>
                          <span class="citate_item_author">Laura, Solo Traveler. 5/9/19</span>
                        </div>
                      </easy-slider-item>
                    </easy-slider>
                  </div>
                </div>

								<div class="banner mb-show">
									<div class="banner_img_wrap v_1_mod">
										<img(class="banner_img" src='~/assets/img/town_1.png' alt='img'>
									</div>
									<div class="banner_img_wrap v_2_mod">
										<img(class="banner_img" src='~/assets/img/town_2.png' alt='img'>
									</div>
									<div class="banner_content">
										<div class="banner_title">Why just these hotels?</div>
										<div class="banner_text mb-hide">
											Learn why booking here will change everything.
										</div>
										<div class="banner_text mb-show">
											Learn how to save time and money.
										</div>
										<a class="banner_btn mb-hide" href="#">Tell me</a>
									</div>
								</div>
              </div>
            </div>

            <div class="hotel_detail_info_row">
              <div class="container">
                <div class="hotel_detail_info_item">
                  <div class="hotel_detail_info_item_header">
                    <h3 class="hotel_detail_info_item_title">Restaurants </h3>
                    <span class="hotel_detail_info_item_subtitle">Where to eat neaby</span>
                    <div class="hotel_detail_info_item_logo_wrap">
                      <img class="hotel_detail_info_item_logo" src="@/assets/img/logo_zomato.png" alt="">
                    </div>
                  </div>
                  <div class="hotel_detail_restaurants_slider_wrap">
                    <easy-slider v-if='true' :auto='false' width='100%' :control-btn='false'>
                      <easy-slider-item v-for="item in new Array(3)" :key="item">
                        <div class="hotel_detail_restaurants">
                          <div class="restaurant_item" v-for="item in [1, 2, 3, 4]" :key="item">
                            <div class="restaurant_item_in">
                              <div class="restaurant_item_img_wrap">
                                <img class="restaurant_item_img" src="@/assets/img/slide.jpg" alt="img slide">
                                    </div>
                                <div class="restaurant_item_descr_wrap">
                                  <h3 class="restaurant_item_descr_title">
                                    Komodo
                                  </h3>
                                  <div class="restaurant_item_descr_subtitle">
                                    Asian
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      </easy-slider-item>
                    </easy-slider>
                  </div>

                </div>

                <div class="hotel_detail_info_item v1_mod mb-hide">
                  <div class="hotel_detail_info_item_header">
                    <h3 class="hotel_detail_info_item_title">What’s around</h3>
                  </div>
                  <div class="hotel_detail_around_objects">
                    <ul class="around_object_list">
                      <li class="around_object_list_title">Things to do</li>
                      <li class="around_object_item">
                        <div class="around_object_item_name">1. South Beach</div>
                        <div class="around_object_item_dist_wrap">
                          <span class="around_object_item_dist">17m</span>
                          <span class="around_object_item_dist">43m</span>
                        </div>
                      </li>
                      <li class="around_object_item">
                        <div class="around_object_item_name">2. South Beach</div>
                        <div class="around_object_item_dist_wrap">
                          <span class="around_object_item_dist">17m</span>
                          <span class="around_object_item_dist">43m</span>
                        </div>
                      </li>
                    </ul>
                    <ul class="around_object_list">
                      <li class="around_object_list_title">Transit</li>
                      <li class="around_object_item">
                        <div class="around_object_item_name">1. South Beach</div>
                        <div class="around_object_item_dist_wrap">
                          <span class="around_object_item_dist">17m</span>
                          <span class="around_object_item_dist">43m</span>
                        </div>
                      </li>
                      <li class="around_object_item">
                        <div class="around_object_item_name">2. South Beach</div>
                        <div class="around_object_item_dist_wrap">
                          <span class="around_object_item_dist">17m</span>
                          <span class="around_object_item_dist">43m</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
  </section>
</div>
</template>

<script>
import Vue from 'vue'
import {
  mapState,
  mapGetters
} from 'vuex'
import Loader from '@/components/Loader'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCoOdN9fa1Pg5DYYNyWAWGH4BpCTyZhwuc',
    libraries: 'places, directions'
  }
})

import HotelChooseRoom from "@/components/HotelChooseRoom"
import AppVideo from "@/components/Video.vue"
import _ from 'lodash'

import IconRooms from "@/components/icons/IconRooms.vue"
import IconParking from "@/components/icons/IconParking.vue"
import IconWiFi from "@/components/icons/IconWiFi.vue"
import IconBreakfast from "@/components/icons/IconBreakfast.vue"


export default {
  components: {
    IconRooms,
    IconParking,
    IconWiFi,
    IconBreakfast
  },

}
</script>

<style lang="scss" scoped>
// .hotel_detail_citates {
//   .slider {
//     min-height: 160px !important;
//     height: auto !important;

//     .indicators {
//         left: 0 !important;
//     }
//   }
// }
</style>
