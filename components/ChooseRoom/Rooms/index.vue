<template>
  <div>
    <Room v-for="(room, index) in rooms" :discount='discount' :minRate='minRate' :strangeRate='strangeRate' :key='index' :index='index'/>
  </div>
</template>

<script>
import Room from './Room'
export default {
  name: 'Rooms',
  props: ['minRate', 'strangeRate', 'discount'],
  components: {
    Room
  },
  mounted () {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      document.addEventListener('focusin', (e) => {
          if (e.target.tagName === 'INPUT') {
            document.querySelectorAll('body')[0].classList.add('focused-input')
          }
      })
      document.addEventListener('focusout', (e) => {
        document.querySelectorAll('body')[0].classList.remove('focused-input')
      })
    }
  },
  computed: {
    rooms () {
      return this.$store.state.chooseRoom.rooms.filter(room => room.capacity >= this.$store.state.chooseRoom.guests).length
    }
  }
}
</script>
