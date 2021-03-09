<template>
  <div>
    <no-ssr>
        <vue-gallery ref='lightbox' :nThumbs="5" v-show='showGallery' :images='imgUrls'  @closeLightBox='showGallery = false'></vue-gallery>
    </no-ssr>
    <section
        v-if="!getDirections"
        class="min-h-60 bg-cover bg-center topSection">
        <div style="padding-bottom: 15vw"></div>
        <div class="absolute pin">
          <v-carousel v-if="imgUrls && imgUrls.length> 0" hide-controls hide-delimiters class="carousel">
              <v-carousel-item :key="i" v-for="i in parseInt(imgUrls.length/4)">
                  <v-layout row wrap>
                      <v-flex lg3 md4 sm6 xs12 v-for="j in 4" :key="j">
                          <img :src="imgUrls[(i-1)*4+j-1].src" alt="" @click="showGallery = true; openImage((i-1)*4 + j-1)">
                      </v-flex>
                  </v-layout>
              </v-carousel-item>
          </v-carousel>
        </div>
    </section>
    <style>
      .vue-lb-modal-thumbnail, .vue-lb-modal-thumbnail-active {
        display: table-cell;
      }
      .vue-lb-container {
        z-index: 9999!important;
      }
    </style>
  </div>
</template>
<script>
  export default {
    props: ['getDirections', 'imgUrls'],
    data() {
      return {
        showGallery: null,
      }
    },
    methods: {
      openImage (j) {
        this.$refs.lightbox.showImage(j)
      },
    }
  }
</script>
