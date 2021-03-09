<template>
  <div class="hotel_detail_info_item v1_mod mob_bottom_decor_mod">
    <div class="hotel_detail_info_item_header">
      <h3 class="hotel_detail_info_item_title">What fans say</h3>
      <span class="hotel_detail_info_item_subtitle">{{ hotelDetailData.review_count }} Travelers say {{ hotelDetailData.review_rating_desc }}</span>
    </div>
    <div class="hotel_detail_no-citates" v-if="reviews.length === 0">
      <h3 class="hotel_detail_info_item_title">No reviews yet</h3>
    </div>
    <div class="hotel_detail_citates" v-else>
      <easy-slider v-if='reviews.length > 0' :auto='false' width='100%' height="175px" :control-btn='false'>
        <easy-slider-item v-for="index in reviews.length" :key="index" v-if="index % 2 == 1">
          <div class="citate_item" v-if="reviews[index]">
            <p class="citate_item_text"><read-more more-str="read more" :text='`"${reviews[index].review_text || reviews[index].good_description || reviews[index].bad_description}"`' link="#" :max-chars="90"></read-more></p>
            <span class="citate_item_author">{{ reviews[index].user_name ? reviews[index].user_name :'' }} {{ reviews[index].creation_date }}</span>
          </div>
          <div class="citate_item mt-4" v-if='index+1 < reviews.length && reviews[index+1]'>
            <p class="citate_item_text"><read-more more-str="read more" :text='`"${reviews[index+1].review_text || reviews[index+1].good_description || reviews[index+1].bad_description}"`' link="#" :max-chars="90"></read-more></p>
            <span class="citate_item_author">{{ reviews[index+1].user_name ? reviews[index+1].user_name :'' }} {{ reviews[index+1].creation_date }}</span>
          </div>
        </easy-slider-item>
      </easy-slider>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['hotelDetailData', 'reviews']
  }
</script>
