<template>
    <section class="hotel_detail_choose">
      <div class="container">
        <div class="hotel_detail_choose_in">
          <h1 class="hotel_detail_choose_title">{{ hotelDetailData.name }}</h1>
          <div class="hotel_detail_choose_control_wrap">
            <span class="choose_room_btn v1_mod" v-if="hotelDetailData.room_count > 0" @click="openModal">Choose room</span>
            <span v-else class="group h-13 sm:h-11 px-4"></span>
          </div>
        </div>
      </div>
    </section>
</template>
<script>
  export default {
    props: ['hotelDetailData', 'hotelInfo', 'exchange', 'openModal']
  }
</script>
