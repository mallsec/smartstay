<template>
  <div>
    <h3 v-if="(upcomingReservations == 0 && pastReservations == 0)" class="modal--body-title">No items</h3>
    <div>
      <h3 v-if="upcomingReservations > 0" class="modal--body-title">Upcoming</h3>
      <Reservation v-for="(reservation, index) in upcomingReservations" :key='index' :index='index' :isUpcoming='true'/>
    </div>
    <div>
      <h3 v-if="pastReservations > 0" class="modal--body-title">Past</h3>
      <Reservation v-for="(reservation, index) in pastReservations" :key='index' :index='index' :isUpcoming='false'/>
    </div>
  </div>
</template>

<script>
import Reservation from './Reservation'
export default {
  name: 'Reservations',
  components: {
    Reservation
  },
  computed: {
    upcomingReservations () {
      return this.$store.state.account.reservations.filter(reservation => reservation.is_upcoming === true).length
    },
    pastReservations () {
      return this.$store.state.account.reservations.filter(reservation => reservation.is_upcoming === false).length
    }
  }
}
</script>
