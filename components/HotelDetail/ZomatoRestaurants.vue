<template>
  <div class="hotel_detail_info_item mob_bottom_decor_mod">
    <div class="hotel_detail_info_item_header">
      <h3 class="hotel_detail_info_item_title">Restaurants </h3>
      <span class="hotel_detail_info_item_subtitle">Where to eat neaby</span>
      <div class="hotel_detail_info_item_logo_wrap">
        <img class="hotel_detail_info_item_logo" src="@/assets/img/logo_zomato.png" alt="">
      </div>
    </div>
    <div class="hotel_detail_restaurants_slider_wrap">
      <easy-slider v-if='true' :auto='false' width='100%' height='198px' :control-btn='false'>
        <easy-slider-item v-for="num in range(zomatoRestaurantsList.length/4)" :key="num">
          <div class="hotel_detail_restaurants">
            <div class="restaurant_item" v-for="item in zomatoRestaurantsList.slice(num*4, num*4+4)"
                 :key="item.restaurant.id" @click="setDirectionToRestaurant(item.restaurant)">
              <div class="restaurant_item_in">
                <div class="restaurant_item_img_wrap">
                  <img class="restaurant_item_img" :src="item.restaurant.thumb" alt="img slide"
                       onerror="this.style='opacity:0;'">
                </div>
                <div class="restaurant_item_descr_wrap">
                  <h3 class="restaurant_item_descr_title">
                    {{ item.restaurant.name }}
                  </h3>
                  <div class="restaurant_item_descr_subtitle">
                    {{ item.restaurant.cuisines.split(',')[0] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </easy-slider-item>
      </easy-slider>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['zomatoRestaurantsList', 'setDirectionToRestaurant'],
    methods: {
      range(n) {
        return Array.from(Array(n).keys())
      },
    }
  }
</script>
