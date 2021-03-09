<template>
  <div>
    <Loader v-if='!isLoaded' :load='!isLoaded'/>

    <gallery :imgUrls="imgUrls" v-if="!getDirections"/>

    <div class="hotel_detail" v-if="hotelDetailData">

      <hotel-detail-header :hotelDetailData="hotelDetailData"
                           :hotelInfo="hotelInfo"
                           :exchange="exchange"
                           :openModal="openModal"/>

      <section class="hotel_detail_info">
        <div class="hotel_detail_info_row">
          <div class="container">

            <hotel-detail-content :hotelDetailData="hotelDetailData"
                                  :hotelInfo="hotelInfo"
                                  :getDirections="getDirections"/>

            <div class="hotel_detail_info_item" v-if="hotelDetailData && !getDirections">
              <div class="hotel_detail_info_map" v-if="hotelDetailData.geo">
                <div class="absolute pin" data-id="map1">
                  <gmap-map
                    ref='map1'
                    :center="{lat:hotelDetailData.geo.latitude, lng: hotelDetailData.geo.longitude }"
                    :zoom="11"
                    :draggable="false"
                    :options='{styles: styles, scrollwheel: false, fullscreenControl: false, mapTypeControl: false, gestureHandling: "none"}'
                    style="width: 100%; height: 100%">
                    <gmap-marker :position="getHotelPosition()"/>
                  </gmap-map>
                </div>
                <div class="hotel_detail_info_wrapper">
                  <div class="hotel_detail_info_label">
                    <div class="info_map_marker">
                      <f-a icon="map-marker"/>
                    </div>
                    <div>
                      {{ hotelDetailData.address.address_line_one }} {{ hotelDetailData.address.city_name }}, {{
                      hotelDetailData.address.country_name }} <br>
                      <a v-on:click="handleGetMapDirections()"
                         class="info_label_link">
                        Map Directions
                      </a>
                    </div>
                  </div>
                </div>

                <div class="mt-10 flex-no-shrink overflow-hidden">
                  <div class="-mr-4 -mb-2 flex flex-wrap text-xs">

                    <div class="mr-4 mb-2 flex">
                      <!--                                 <div class="mr-1 justify-center items-center w-4 flex-no-shrink h-4">
                                                          <f-a icon="phone" />
                                                      </div> -->
                      <div>
                        <!-- {{ hotel.phone }} -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="hotel_detail_info_item full-screen" v-if="hotelDetailData && getDirections">
            <div class="hotel_detail_info_map full-screen" v-if="hotelDetailData.geo">
              <div class="absolute pin" data-id="map">
                <gmap-map
                  ref='map'
                  :center="{lat:hotelDetailData.geo.latitude, lng: hotelDetailData.geo.longitude }"
                  :zoom="11"
                  :draggable="false"
                  :options='{scrollwheel: false, fullscreenControl: false, mapTypeControl: false, gestureHandling: "none"}'
                  style="width: 100%; height: 100%">
                  <gmap-marker :position="getHotelPosition()"/>
                </gmap-map>
              </div>

              <div class="flex-no-shrink btn-overlay" v-if="hotelDetailData && getDirections">
                <h2 class="text-heading-sm leading-tight">
                </h2>
                <div class="mt-3 -mb-3">
                  <div class="mb-3 flex items-center">
                    <div class="mr-3 flex justify-center items-center w-7 flex-no-shrink h-6 text-xl">
                    </div>
                    <div>
                      <a v-on:click="hideMapDirections()"
                         class="text-primary hover:opacity-80 transition-opacity hide-map">
                        Hide map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="hotel_detail_info_row column_mod">
          <div class="container">

            <hotel-amenities :hotelDetailData="hotelDetailData"/>

            <hotel-reviews :hotelDetailData="hotelDetailData"
                           :reviews="reviews"/>

          </div>
        </div>

        <div class="hotel_detail_info_row last_mod">
          <div class="container">

            <zomato-restaurants :zomatoRestaurantsList="zomatoRestaurantsList"
                                :setDirectionToRestaurant="setDirectionToRestaurant"/>

            <whats-around :hotelDetailData="hotelDetailData"
                          :nearbyThingsToDo="nearbyThingsToDo"
                          :nearbyTransit="nearbyTransit"/>
          </div>

          <banner/>

        </div>
      </section>
      <hotel-choose-room
        :hotelDetailData="hotelDetailData"
        :dates="{ start: check_in, end: check_out }"
        :origin_guests="this.$route.query.guests"
        v-if="showModal"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  import Loader from '@/components/Loader'
  import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
  import HotelChooseRoom from "@/components/HotelChooseRoom"
  import ZomatoRestaurants from "@/components/HotelDetail/ZomatoRestaurants"
  import Gallery from "@/components/HotelDetail/Gallery"
  import HotelDetailHeader from "@/components/HotelDetail/HotelDetailHeader"
  import HotelDetailContent from "@/components/HotelDetail/HotelDetailContent"
  import HotelAmenities from "@/components/HotelDetail/HotelAmenities"
  import HotelReviews from "@/components/HotelDetail/HotelReviews"
  import WhatsAround from "@/components/HotelDetail/WhatsAround"
  import Banner from "@/components/HotelDetail/Banner"
  import AppVideo from "@/components/Video.vue"

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyCoOdN9fa1Pg5DYYNyWAWGH4BpCTyZhwuc',
      libraries: 'places, directions'
    }
  })

  export default {
    components: {
      HotelChooseRoom,
      HotelDetailHeader,
      HotelDetailContent,
      HotelAmenities,
      HotelReviews,
      ZomatoRestaurants,
      WhatsAround,
      Banner,
      Loader,
      Gallery,
      AppVideo
    },
    data() {
      return {
        isLoaded: false,
        showModal: false,
        mapObject: null,
        mapObject1: null,
        directionMarkers: [],
        styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#787878"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#272727"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"0"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#000000"},{"visibility":"on"},{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#464646"},{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#464646"},{"lightness":"0"},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"0"},{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#464646"},{"lightness":"0"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#0f0f0f"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"34"},{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0f0f0f"},{"lightness":17}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]}],
        showGallery: null,
        rate: null,
        event: {},
        logo: '',
        reviews: [],
        hotelMainPhotos: [],
        hotelDetailData: null,
        amenity: [],
        check_in: this.$route.query.check_in,
        check_out: this.$route.query.check_out,
        hotelsapiData: {},
        best_price: "",
        directions: null,
        uber_estimate: null,
        getDirections: false,
        extendSlider: false,
        zomatoRestaurantsList: [],
        restaurant: null,
        directionsDisplay: null,
      }
    },
    computed: {
      ...mapState('hotel', ['hotelDetail']),
      ...mapState('hotel', ['hotelPhoto']),
      ...mapState('hotel', ['zomatoRestaurants']),
      ...mapState('hotel', ['nearbyTransit']),
      ...mapState('hotel', ['nearbyThingsToDo']),
      ...mapState('city', ['cityInfo']),
      ...mapState('hotel', ['hotelInfo']),
      imgUrls() {
        let urls = []
        let photos = this.hotelMainPhotos
        photos.forEach(photo => urls.push({
          thumb: photo,
          src: photo
        }))
        return urls
      },
      uberPrices() {
        var min = []
        var max = []
        if (this.uber_estimate === null) {
          return 0
        }
        let prices = this.uber_estimate.prices
        prices.forEach((price) => {
          min.push(price.low_estimate)
          max.push(price.high_estimate)
        })
        return {
          min: Math.min.apply(Math, min),
          max: Math.max.apply(Math, max)
        }
      },
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
      promises.push(this.$store.dispatch('hotel/getHotelDetail', {
        hotel_id: this.$route.params.id,
        lat: this.cityInfo.latitude,
        lng: this.cityInfo.longitude
      }));
      var date_from = new Date(this.$formatDate(this.check_in));
      var date_to = new Date(this.$formatDate(this.check_out));
      const today = new Date()

      if (this.datesEqual(date_from, today)) {
        date_from = this.addDays(date_from, 1)

        if (this.datesEqual(date_from, date_to)) {
          date_to = this.addDays(date_to, 1)
        }
      }

      Promise.all(promises).then((data) => {
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        this.isLoaded = true;
        if (this.hotelDetail.directions)
          this.directions = this.hotelDetail.directions
        if (this.hotelDetail.uber_estimate)
          this.uber_estimate = this.hotelDetail.uber_estimate
        if (this.hotelDetail.data) {
          this.hotelDetailData = this.hotelDetail.data['getHotelHotelDetails'].results.hotel_data.hotel_0;
          console.log(this.hotelDetail);
          this.amenity = Object.values(this.hotelDetailData.amenity_data);
          let arr = Object.values(this.hotelDetailData.photo_data);
          this.hotelMainPhotos = arr;
          if (this.hotelDetailData.review_data)
            this.reviews = Object.values(this.hotelDetailData.review_data);

          if (this.hotelDetailData.geo) {
            this.$store.dispatch('hotel/getZomatoRestaurants', {
              lat: this.hotelDetailData.geo.latitude, lng: this.hotelDetailData.geo.longitude
            }).then(() => {
              if (this.zomatoRestaurants) {
                console.log('this.zomatoRestaurants:', this.zomatoRestaurants)
                this.zomatoRestaurantsList = this.zomatoRestaurants.restaurants
              }
            })
            this.$store.dispatch('hotel/getPlacesNearby', {
              lat: this.hotelDetailData.geo.latitude, lng: this.hotelDetailData.geo.longitude
            })
          }
        }
        let styleTag = document.createElement('style')
        styleTag.innerHTML = `
                  .text-primary { color: #1f8aea!important; }
                  .hover:text-primary:hover { color: #1f8aea!important; }
                  .focus:text-primary:focus { color: #1f8aea!important; }
                  .border-primary { border-color: #1f8aea!important; }
                  .hover:border-primary:hover { border-color: #1f8aea!important; }
                  .focus:border-primary:focus { border-color: #1f8aea!important; }
                  .bg-primary { background-color: #1f8aea!important; }
                  .hover:bg-primary:hover { background-color: #1f8aea!important; }
                  .focus:bg-primary:focus { background-color: #1f8aea!important; }
                  .text-alternate { color: #1e1e1e!important; }
                  .hover:text-alternate:hover { color: #1e1e1e!important; }
                  .focus:text-alternate:focus { color: #1e1e1e!important; }
                  .border-alternate { border-color: #1e1e1e!important; }
                  .hover:border-alternate:hover { border-color: #1e1e1e!important; }
                  .focus:border-alternate:focus { border-color: #1e1e1e!important; }
                  .bg-alternate { background-color: #202020!important; }
                  .hover:bg-alternate:hover { background-color: #1e1e1e!important; }
                  .focus:bg-alternate:focus { background-color: #1e1e1e!important; }
              `
        document.querySelectorAll('head')[0].appendChild(styleTag)
        // Small fix for catching $mapObject without users actions
        let mapObjectInterval = setInterval(() => {
          if (this.getDirections === true && this.$refs.map && this.$refs.map.$mapObject !== undefined) {
            this.mapObject = this.$refs.map.$mapObject
            clearInterval(mapObjectInterval)
          }
        }, 50)
        let mapObjectInterval2 = setInterval(() => {
          if (this.getDirections === false && this.$refs.map1 && this.$refs.map1.$mapObject !== undefined) {
            this.mapObject1 = this.$refs.map1.$mapObject
            // Fix for creating overlay for direct
            let mapInner;
            var self = this;
            setTimeout(function () {
              if (self.$refs.map1) {
                mapInner = self.$refs.map1.$el.querySelectorAll('[tabindex="0"]>div:first-child')[0]
              }
              let overlay = document.createElement('div')
              overlay.classList.add('bg-alternate')
              overlay.style.opacity = 0.7
              overlay.style.width = '2000px'
              overlay.style.height = '2000px'
              overlay.style.position = 'absolute'
              overlay.style.top = '-500px'
              overlay.style.left = '-500px'
              if (mapInner) {
                mapInner.appendChild(overlay)
              }
            }, 700);
            clearInterval(mapObjectInterval2)
          }
        }, 50)

      })
    },
    methods: {
      mainPhoto(data) {
        return 'http:' + data;
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
      handleGetMapDirections() {
        this.getDirections = true
      },
      hideMapDirections() {
        this.getDirections = false
        this.directionsDisplay = null
      },
      getHotelMapLabel() {
        return {color: '#000000', fontWeight: 'bold', fontSize: '14px', text: this.hotelDetailData.name}
      },
      getHotelPosition() {
        return {
          full_name: this.hotelDetailData.name,
          lat: this.hotelDetailData.geo.latitude,
          lng: this.hotelDetailData.geo.longitude
        }
      },
      exchange(val) {
        // problem with filters
        if (!global.window || !global.window.fx) {
          return val
        }
        return parseInt(fx.convert(val, {from: 'USD', to: this.$store.state.currency}))
      },
      openModal() {
        this.showModal = true
        document.getElementsByTagName('body')[0].classList.add('overflow-hidden')
      },
      closeModal() {
        this.showModal = false
        document.getElementsByTagName('body')[0].classList.remove('overflow-hidden')
      },
      setDirectionToRestaurant(restaurant) {
        console.log('restaurant', restaurant)
        this.getDirections = true
        this.restaurant = restaurant
      },
      drawDirection() {
        let directionsService = new google.maps.DirectionsService()
        if (this.directionsDisplay) {
          this.directionsDisplay.setDirections({routes: [], trips: []});
        }
        this.directionMarkers.forEach(function (marker) {
          marker.setMap(null)
        })
        this.directionMarkers = []
        this.directionsDisplay = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
        })
        this.directionsDisplay.setOptions({
          markerOptions: {
            icon: ``
          }
        })
        this.directionsDisplay.setMap(this.mapObject)

        if (!this.restaurant) {
          return
        }

        directionsService.route({
          origin: `${this.hotelDetailData.address.address_line_one} ${this.hotelDetailData.address.city_name} ${this.hotelDetailData.address.state_name}`,
          destination: `${this.restaurant.location.address} ${this.restaurant.location.city} ${this.hotelDetailData.address.state_name}`,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            let _route = response.routes[0].legs[0];
            let pinB = new google.maps.Marker({
              position: _route.end_location,
              map: this.mapObject,
              icon: {
                url: require('@/assets/img/icons/dot.svg'),
                size: new google.maps.Size(30, 30),
                scaledSize: new google.maps.Size(30, 30),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 15),
              }
            })
            let pinA = new google.maps.Marker({
              position: _route.start_location,
              map: this.mapObject,
              icon: {
                url: require('@/assets/img/icons/dot.svg'),
                size: new google.maps.Size(50, 50),
                scaledSize: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(25, 45),
              }
            })
            this.directionMarkers.push(pinB, pinA)
            this.directionsDisplay.setDirections(response)
          }
          this.isLoaded = true
        })
        var element = this.$refs.map;
        var top = element.offsetTop;
        window.scrollTo(0, top);
      },
    },
    watch: {
      mapObject: {
        handler() {
          this.drawDirection()
        },
      },
      restaurant: {
        handler() {
          var self = this;
          setTimeout(function () {
            if (self.$refs.map && self.getDirections === true) {
              self.mapObject = self.$refs.map.$mapObject
              self.drawDirection()
            }
          }, 100)
        },
        deep: true,
      },
      getDirections: {
        handler(newValue, oldValue) {
          var self = this;
          setTimeout(function () {
            if (self.$refs.map && newValue === true) {
              self.mapObject = self.$refs.map.$mapObject
              self.drawDirection()
            } else {
              if (self.$refs.map1 && newValue === false) {
                var _self = self;
                var mapInner;
                setTimeout(function () {
                  if (_self.$refs.map1) {
                    mapInner = _self.$refs.map1.$el.querySelectorAll('[tabindex="0"]>div:first-child')[0]
                  }
                  let overlay = document.createElement('div')
                  overlay.classList.add('bg-alternate')
                  overlay.style.opacity = 0.7
                  overlay.style.width = '2000px'
                  overlay.style.height = '2000px'
                  overlay.style.position = 'absolute'
                  overlay.style.top = '-500px'
                  overlay.style.left = '-500px'
                  if (mapInner) {
                    mapInner.appendChild(overlay)
                  }
                }, 400);
              }
            }
          }, 100)
        }
      }
    },
    head() {
      return {
        title: `${this.hotelDetailData ? this.hotelDetailData.name + ' | ' : ''}  SmartStay`,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.hotelDetailData ? this.hotelDetailData.hotel_description : '',
          }
        ]
      }
    }
  }
</script>
<style lang="scss">

  @import url('vue-image-lightbox/dist/vue-image-lightbox.min.css');

  body .citate_item_text span {
    display: inline;
  }

  body .citate_item_text p {
    display: inline;
  }

  #readmore {
    font-weight: bold;
  }

  .indi-center {
    left: 0 !important;
    transform: none !important;
  }
</style>
<style lang="scss" scoped>
  @import '@/assets/scss/vars/index.scss';
  @import '@/assets/scss/mixins/index.scss';

  .full-screen {
    width: 100%;
    min-height: 50rem;
    margin: 0 !important;
  }

  .hide-map {
    position: absolute;
    left: -20px;
    bottom: -10px;
    display: inline-flex;
    height: 28px;
    width: 90px;
    padding: 5px 10px;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.05;
    color: #fff !important;
    border-radius: 3px;
    background-color: #41bfef;
  }

  .btn-overlay {
    z-index: 999;
    position: absolute;
    top: 30px;
    right: 10px;
  }

  .around_object_item {
    width: 150px;
    min-height: 65px;
  }

  .bg-alternate {
    background-color: #03697b !important;
  }

</style>
