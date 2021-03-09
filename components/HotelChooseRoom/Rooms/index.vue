<template>
  <div>
    <express-room v-for="(room, index) in express_rooms" :room="room" :express_policy="express_policy" :key='index' :index='index'/>
    <Room v-for="(room1, index1) in rooms" :room="room1" :key='index1' :index='index1'/>
  </div>
</template>

<script>
import Room from './Room'
import ExpressRoom from './ExpressRoom'
export default {
  name: 'Rooms',
  props: ['rooms', 'express_rooms', 'express_policy'],
  components: {
    Room,
    'express-room': ExpressRoom
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
  }
}
</script>
