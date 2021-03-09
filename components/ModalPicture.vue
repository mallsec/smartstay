<template>
  <div class="overlay" @click='$emit("close")'>
    <!-- <div class="modal" :style='`background-image: url(${image})`'></div> -->
    <img :src="image" alt="">
  </div>
</template>
<script>
export default {
  name: 'modal-picture',
  props: ['image']
}
</script>
<style lang="scss" scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;

    .modal {
      width: 65%;
      background-color: #fff;
      background-position: center;
      background-repeat: no-repeat;
      background-size: auto 100%;
      height: 65%;
      border-radius: 5px;
    }
  }
</style>
