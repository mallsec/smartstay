<template>
  <ul class="hotel_stats_list" v-if="hotel.uber_estimate && hotel.uber_estimate.prices.length && hotel.uber_estimate.prices[0]">
    <li class="hotel_stats_item">
      <span class="icon flex-no-shrink text-xl">
        <svg viewBox="0 0 16 15.3">
          <path
            d="M12.6 15.3l-.2-.1L8 12.9l-4.4 2.3h-.5c-.2-.1-.2-.3-.2-.5l.8-4.9L.2 6.3C0 6.2 0 6 0 5.8c.1-.2.2-.3.4-.3l4.9-.7L7.5.3c.2-.3.7-.3.9 0l2.2 4.5 4.9.7c.2 0 .3.2.4.3s0 .4-.1.5l-3.6 3.5.8 4.9c0 .2 0 .4-.2.5l-.2.1zM8 11.8l.2.1 3.7 2-.7-4.2.1-.4 3-2.9-4.2-.6c-.2 0-.3-.1-.4-.3L8 1.6 6.1 5.4c0 .2-.2.3-.3.3l-4.2.6 3 2.9c.1.1.2.3.1.4L4 13.9l3.7-2 .3-.1z"/>
        </svg>
      </span>
      Smart Rate
    </li>
    <li class="hotel_stats_item"
        v-if='hotel.uber_estimate && hotel.uber_estimate.prices.length && hotel.uber_estimate.prices[0]'>
      <span class="icon flex-no-shrink text-xl">
        <svg id="lay_1" viewBox="0 0 16 16">
          <path
            d="M8 16l-.3-.1C7.4 15.7 2 10.7 2 6c0-3.3 2.7-6 6-6s6 2.7 6 6c0 4.7-5.4 9.7-5.7 9.9L8 16zM8 1a5 5 0 0 0-5 5c0 3.6 3.8 7.7 5 8.8 1.2-1.2 5-5.2 5-8.8a5 5 0 0 0-5-5z"
            class="st0"/>
          <path
            d="M8 9C6.3 9 5 7.7 5 6s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            class="st0"/>
        </svg>
      </span>
      {{`${(hotel.uber_estimate.prices[0].distance * (currency === 'CAD' ? 1.6 : 1)).toFixed(2)}
      ${currency === 'CAD' ? 'km' : 'miles'}`}} to {{event.name}}
    </li>
    <li class="hotel_stats_item"
        v-if='hotel.uber_estimate && hotel.uber_estimate.prices.length && hotel.uber_estimate.prices[0]'>
      <span class="icon flex-no-shrink text-xl">
        <svg id="lay_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
          <title>car</title>
          <path
            d="M16,7.42a.47.47,0,0,0,0-.08L14.2,2a1.5,1.5,0,0,0-1.42-1H3.22A1.5,1.5,0,0,0,1.8,2L0,7.34a.47.47,0,0,0,0,.08A.47.47,0,0,0,0,7.5v7a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V13h6v1.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-7A.47.47,0,0,0,16,7.42ZM1,12V8H15v4ZM2.75,2.34A.5.5,0,0,1,3.22,2h9.56a.5.5,0,0,1,.47.34L14.81,7H1.19ZM4,14H1V13H4Zm8,0V13h3v1ZM4,10A1,1,0,1,1,3,9,1,1,0,0,1,4,10Zm10,0a1,1,0,1,1-1-1A1,1,0,0,1,14,10Z"
            style=""/>
        </svg>
      </span>
      ${{exchange(hotel.uberPrices.min)}}-{{exchange(hotel.uberPrices.max)}} UBER Ride
    </li>
    <li class="hotel_stats_item" v-if="hotel.stars">
      <span class="icon flex-no-shrink text-xl">
        <svg viewBox="0 0 16 15.3">
          <path
            d="M12.6 15.3l-.2-.1L8 12.9l-4.4 2.3h-.5c-.2-.1-.2-.3-.2-.5l.8-4.9L.2 6.3C0 6.2 0 6 0 5.8c.1-.2.2-.3.4-.3l4.9-.7L7.5.3c.2-.3.7-.3.9 0l2.2 4.5 4.9.7c.2 0 .3.2.4.3s0 .4-.1.5l-3.6 3.5.8 4.9c0 .2 0 .4-.2.5l-.2.1zM8 11.8l.2.1 3.7 2-.7-4.2.1-.4 3-2.9-4.2-.6c-.2 0-.3-.1-.4-.3L8 1.6 6.1 5.4c0 .2-.2.3-.3.3l-4.2.6 3 2.9c.1.1.2.3.1.4L4 13.9l3.7-2 .3-.1z"/>
        </svg>
      </span>
      {{parseInt(hotel.stars)}} Stars
    </li>
    <li class="hotel_stats_item" v-if="hotel.tripadvisor_url">
      <span class="icon-trip icon flex-no-shrink text-xl">
        <svg id="lay_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 16.01 16"><title>good2</title>
          <path
            d="M3.5,16H.5a.5.5,0,0,1-.5-.5v-8A.5.5,0,0,1,.5,7h3a.5.5,0,0,1,.5.5v8A.5.5,0,0,1,3.5,16ZM1,15H3V8H1Zm13.84-1L16,9a2.5,2.5,0,0,0-1.9-3A1.72,1.72,0,0,0,13.51,6H10V2.5A2.5,2.5,0,0,0,7.5,0,.5.5,0,0,0,7,.34l-2,6A.5.5,0,0,0,6,6.66L7.85,1A1.5,1.5,0,0,1,9,2.5v4a.5.5,0,0,0,.5.5h4a2.63,2.63,0,0,1,.33,0A1.5,1.5,0,0,1,15,8.83l-1.11,5A1.51,1.51,0,0,1,12.4,15H5.5a.5.5,0,0,0,0,1h6.9A2.48,2.48,0,0,0,14.84,14Z"/>
        </svg>
      </span>
      {{hotel.tripadvisor_review_keyword}}
    </li>
  </ul>
</template>
<script>
  export default {
    props: ['hotel', 'event'],
    data() {
      return {}
    },
    methods: {
      exchange(val) {
        // problem with filters
        if (!global.window || !global.window.fx) {
          return val
        }
        return parseInt(fx.convert(val, {from: 'USD', to: this.$store.state.currency}))
      },
      currency() {
        return this.$store.state.currency
      },
    }
  }
</script>
