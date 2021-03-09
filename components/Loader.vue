<template>
    <transition name="fade">
        <section v-if="loading || load" :style='`color: "#000"`' class="loader fixed pin flex justify-center items-center bg-white transition-opacity" data-id="spinner">
<!--             <div class="spinner" style="font-size: 50px; font-weight: 400;"></div>
 -->            <h1 v-if="!hide_text && quote">{{quote[0]}}</h1>
            <p v-if="!hide_text && quote">{{quote[1]}}</p>
        </section>
    </transition>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    quotes: [
      ['“Oh the places you’ll go.”', '- Dr. Seuss'],
      ['“Take only memories, leave only footprints.”', '- Chief Seattle'],
      ['“You don’t have to be rich to travel well...”', '- Eugene Fodor'],
      ['“To Travel is to Live!”', '- Hans Christian Andersen'],
      ['“Traveling is a return to the essentials.”', '- Tibetans']

    ],
    quote: null,
  }),
  props: ['load', 'hide_text'],
  mounted() {
    this.quote = this.randomQuote()
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
    randomQuote() {
      return this.quotes[Math.floor(Math.random() * this.quotes.length)]
    }
  }
}
</script>

<style lang="scss" scoped>
.loader {
  z-index: 110;

  flex-direction: column;

  h1 {
    font-size: 1.5em;
    font-weight: 700;
    text-align: center;
  }

  p {
    font-size: 1.1em;
    text-align: center;
  }

  .spinner {
    margin-bottom: 20px;
  }

  span {
    margin: 0 20px;
    font-size: 14px;

    .icon {
      display: inline-block;
      height: 20px;
      width: 20px;
      text-align: center;
      border-radius: 50%;
      color: #ffffff;
      line-height: 24px;
    }
  }
}

@media (max-width: 768px) {
  section div.flex {
    flex-direction: column;
    width: auto;

    span {
      margin-bottom: 20px;
    }
  }
}
</style>
