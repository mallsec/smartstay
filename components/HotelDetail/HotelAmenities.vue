<template>
  <div class="hotel_detail_info_item">
    <div class="hotel_detail_info_item_header">
      <h3 class="hotel_detail_info_item_title">Hotel amenities</h3>
      <span class="hotel_detail_info_item_subtitle">What's included. Check in at {{tConvert(hotelDetailData.check_in_time)}}, Check out at {{tConvert(hotelDetailData.check_out_time)}}.</span>
    </div>
    <div class="pb-15 sm:column-count-2">
    <div class="hotel_detail_amenities">
      <div class="hotel_amenity" v-if='hotelDetailData.star_rating'>
        <div class="hotel_amenity_icon_wrap">
          <IconStar color="#fff"></IconStar>
        </div>
        <span class="hotel_amenity_text">{{ hotelDetailData.star_rating }} stars</span>
      </div>
      <div class="hotel_amenity" v-if='hotelDetailData.room_count && hotelDetailData.room_count>0'>
        <div class="hotel_amenity_icon_wrap">
          <IconRooms color="#fff"></IconRooms>
        </div>
        <span class="hotel_amenity_text">{{ hotelDetailData.room_count }} rooms</span>
      </div>
      <div class="hotel_amenity">
        <div class="hotel_amenity_icon_wrap">
          <IconWiFi color="#fff"></IconWiFi>
        </div>
        <span class="hotel_amenity_text">Free Wifi Internet</span>
      </div>
      <div class="hotel_amenity"
           :key="_amenity.id"
           v-for="_amenity in getAmenities(hotelDetailData)">
        <div class="hotel_amenity_icon_wrap" v-if="show_all === true && _amenity.rank === 8">
          <IconCheckSingle color="#fff"></IconCheckSingle>
        </div>
        <div class="hotel_amenity_icon_wrap" v-else="">
          <IconBreakfast color="#fff" v-if="_amenity.id === '5'"></IconBreakfast>
          <IconFitness color="#fff" v-if="_amenity.id === '9'"></IconFitness>
          <IconRestaurant color="#fff" v-if="_amenity.id === '14'"></IconRestaurant>
          <IconBusinessCenter color="#fff" v-if="_amenity.id === '2'"></IconBusinessCenter>
          <IconParking color="#fff" v-if="_amenity.id === '10'"></IconParking>
          <IconPetsAllowed color="#fff" v-if="_amenity.id === '13'"></IconPetsAllowed>
          <IconSwimmingPool color="#fff" v-if="_amenity.id === '15'"></IconSwimmingPool>
        </div>
        <span class="hotel_amenity_text" v-if="show_all === true || ['5', '9', '14', '2', '10', '13', '15'].includes(_amenity.id)">{{ _amenity.name }}</span>
      </div>
      <div v-if="show_all === false"><a @click="show_all = true">Show all</a></div>
    </div>
  </div>
  </div>
</template>
<script>
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
  import IconCheckSingle from "@/components/icons/IconCheckSingle.vue"

  export default {
    props: ['hotelDetailData'],
    data() {
      return {
        show_all: false
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
      IconCheckSingle,
    },
    methods: {
      tConvert (time) {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join ('').split(':')[0]+time[5]; // return adjusted time or original string
      },
      getAmenities (hotel) {
        console.log(hotel.amenity_data)
        var amenities = Object.values(hotel.amenity_data)
        console.log('amenities:', amenities)
        amenities.forEach(function(amenity, index) {
          switch(Number(amenity.id)) {
            case 5: // Free breakfast
              amenity.rank = 1
            case 10: // Free parking
              amenity.rank = 2
              break
            case 9: // Fitness center
              amenity.rank = 3
              break
            case 15: // Swimming pool
              amenity.rank = 4
              break
            case 13: // Pets Allowed
              amenity.rank = 5
              break
            case 14: // Restaurant
              amenity.rank = 6
              break
            case 2: // Business center
              amenity.rank = 7
              break
            default:
              amenity.rank = 8
              break
          }
        })
        if (this.show_all === false) {
          var filtered = amenities.filter(function(value, index, arr){
              return value.rank !== 8;
          });
          filtered.sort(function(a, b) {
            return a.rank - b.rank;
          });
        } else {
          amenities.sort(function(a, b) {
            return a.rank - b.rank;
          });
        }
        return this.show_all === true ? amenities : filtered
      },
    }
  }
</script>
