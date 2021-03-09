<template>
  <div class="hotel_detail_info_item v1_mod">
    <div class="hotel_detail_info_item_header">
      <h3 class="hotel_detail_info_item_title">What’s around</h3>
      <span class="hotel_detail_info_item_subtitle">Places to go</span>
      <div class="hotel_detail_info_item_logo_wrap">
        <img class="hotel_detail_info_item_logo" src="@/assets/img/logo_google.png" alt="">
      </div>
    </div>
    <div class="hotel_detail_around_objects">
      <ul class="around_object_list">
        <li class="around_object_list_title">Things to do</li>
        <li class="around_object_item" v-for="(item, i) in nearbyThingsToDo.slice(0, 2)" :key="i">
          <div class="around_object_item_name">{{i+1}}. {{item.name}}</div>
          <div class="around_object_item_dist_wrap">
            <span class="around_object_item_dist">{{calculateDistance({lat: hotelDetailData.geo.latitude, lng: hotelDetailData.geo.longitude}, item.geometry.location )}} miles</span>
          </div>
        </li>
    <!--                           <li class="around_object_item">
          <div class="around_object_item_name">2. South Beach</div>
          <div class="around_object_item_dist_wrap">
            <span class="around_object_item_dist">17m</span>
            <span class="around_object_item_dist">43m</span>
          </div>
        </li> -->
      </ul>
      <ul class="around_object_list">
        <li class="around_object_list_title">Transit</li>
        <li class="around_object_item" v-for="(item, i) in nearbyTransit.slice(0, 2)" :key="i">
          <div class="around_object_item_name">{{i+1}}. {{item.name}}</div>
          <div class="around_object_item_dist_wrap">
            <span class="around_object_item_dist">{{calculateDistance({lat: hotelDetailData.geo.latitude, lng: hotelDetailData.geo.longitude}, item.geometry.location )}} miles</span>
          </div>
        </li>
    <!--                           <li class="around_object_item">
          <div class="around_object_item_name">2. South Beach</div>
          <div class="around_object_item_dist_wrap">
            <span class="around_object_item_dist">17m</span>
            <span class="around_object_item_dist">43m</span>
          </div>
        </li> -->
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['hotelDetailData', 'nearbyThingsToDo', 'nearbyTransit'],
    methods: {
      rad(x) {
        return x * Math.PI / 180;
      },
      calculateDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat - p1.lat);
        var dLong = this.rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1.lat) * Math.cos(this.rad(p2.lat))) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c * 0.000621371192; // in miles
        return Number(d.toFixed(2)); // returns the distance in miles
      },
    }
  }
</script>
