<template>
  <div class="modal--reservation" :class='{"border-primary": reservation.is_upcoming}'>
    <div class="modal--reservation-details">
      <div>
        <div class="modal--reservation-image">
          <img :src="reservation.room_photo ? reservation.room_photo : noimage" alt="">
        </div>
        <div class="modal--reservation-trip">
          <span>Trip # {{reservation.id}}</span>
          <p>Call Hotel</p>
          <p>{{reservation.phone}}</p>
        </div>
      </div>
      <div class="modal--reservation-info">
        <div>
          <h2>{{reservation.name}}</h2>
          <p>{{reservation.description}}</p>
          <a v-if="reservation.has_tickets" href="https://help.www.privetravels.com/admissions/redeeming-your-admission/how-do-i-get-my-tickets" target="_blank">How do I get my tickets</a>
          <p v-else>Hotel Only</p>
        </div>
        <div class="modal--reservation-checkin">
          <div>
            <p>Check-in</p>
            <p>Check-out</p>
          </div>
          <div>
            <span>{{reservation.checkin_date}}</span>
            <span>{{reservation.checkout_date}}</span>
          </div>
        </div>
      </div>
      <div class="modal--reservation-menu">
        <button v-if="reservation.cancelled" style="color: red;">Canceled</button>
        <button v-if="!reservation.cancelled" @click="sendRequest('modify')">
          <span v-if="isUpcoming">Modify</span>
        </button>
        <a v-if="isUpcoming && !reservation.cancelled" @click="sendRequest('cancel')">Cancel</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['index', 'isUpcoming'],
  name: 'Reservation',
  data () {
    return {
      noimage: require('@/assets/img/noimage.jpg')
    }
  },
  methods: {
    sendRequest (requestType) {
      this.$store.dispatch('inspectToken')
        .then((response) => {
          const authStr = 'JWT ' + this.$store.state.account.jwt
          const payload = {
            email: this.email,
            reservation: this.reservation,
            type: requestType
          }
          axios.put(process.env.reservationsUrl, payload, {headers: {Authorization: authStr}})
            .then((response) => {
              this.$toasted.show('Your request has been sent to the Traveler team', {
                type: 'info',
                icon: 'email'
              })
            })
            .catch((error) => {
              console.log(error)
            })
        })
    }
  },
  computed: {
    reservation () {
      return this.$store.state.account.reservations.filter(reservation => reservation.is_upcoming === this.isUpcoming)[this.index]
    },
    email () {
      return this.$store.state.account.authUser.email
    }
  }
}
</script>

<style scoped>
</style>
