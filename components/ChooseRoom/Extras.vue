<template>
  <div class="extras">
    <template v-if='admissions.length > 0'>
      <div class="modal--row">
        <h3 class="modal--body-subtitle">Admissions</h3>
        <a class="lineupBtn" v-if='banner.ticketBanner && false' @click.prevent='$emit("showBanner")'>Click to open Line Up</a>
      </div>
      <ul class="modal--body-group">
        <li class="modal--row extra" v-for='(ticket, index) in admissions' :key="index">
          <div style="width: 100%">
            <h4 class="flex justify-between items-start">
              <div class="info">
                {{ticket.name}}
                <span class="price">
                  ${{exchange(ticket.discount ? (ticket.price - (ticket.price / 100 * ticket.discount)) : ticket.price)}}
                  <span v-if='ticket.discount' class="old-price">${{exchange(ticket.price)}}</span>
                  <span class="discount">Save an extra {{Number(ticket.discount)}}% with a package</span>
                </span>
              </div>
              <div style='text-align: right;margin-left: 10px;'>
                <select @change='changeData(ticket.id, `quantity-mb-${ticket.id}`)' :ref='`quantity-mb-${ticket.id}`'>
                  <option value="0">0</option>
                  <option
                    v-for="i in ticket.buy_limit"
                    :key="i"
                    :value="i">
                      {{i}}
                  </option>
                </select>
              </div>
            </h4>
            <p class='uppercase'>{{ticket.description}}</p>
          </div>
        </li>
      </ul>
    </template>
    <template v-if='extras.length > 0'>
      <div class="modal--row">
        <h3 class="modal--body-subtitle">Extras</h3>
      </div>
      <ul class="modal--body-group">
        <li class="modal--row extra" v-for='(ticket, index) in extras' :key="index">
          <div style="width: 100%">
            <h4 class="flex justify-between">{{ticket.name}}
              <div style='text-align: right;margin-left: 10px;'>
                <span class="price">
                  <span v-if='ticket.discount' class="old-price">${{exchange(ticket.price)}}</span>
                  ${{exchange(ticket.discount ? (ticket.price - (ticket.price / 100 * ticket.discount)) : ticket.price)}}
                </span>
                <select @change='changeData(ticket.id, `quantity-mb-${ticket.id}`)' :ref='`quantity-mb-${ticket.id}`'>
                  <option value="0">0</option>
                  <option
                    v-for="i in ticket.buy_limit"
                    :key="i"
                    :value="i">
                      {{i}}
                  </option>
                </select>
              </div>
            </h4>
            <p class='uppercase'>{{ticket.description}}</p>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
<script>
export default {
  name: 'Extras',
  props: ['banner'],
  methods: {
    exchange (val) {
      // problem with filters
      return Math.round(fx.convert(val, {from: 'USD', to: this.$store.state.currency}).toFixed(2))
    },
    changeData (id, ref) {
      this.$store.commit('changeExtrasQuantity', {
        id,
        value: this.$refs[ref][0].value
      })
    }
  },
  computed: {
    admissions () {
      return this.$store.state.chooseRoom.extras.filter(item => item.product_type === 'ADMISSION')
    },
    extras () {
      return this.$store.state.chooseRoom.extras.filter(item => item.product_type === 'EXTRA')
    },
  }
}
</script>


<style lang='scss' scoped>
.old-price {
  color: #D9D9D9;
  margin: 0 10px;
  text-decoration: line-through;
}

.price {
  display: flex;
  flex-wrap: wrap;
}

.discount {
    font-size: 11pt;
    font-weight: 400;
    color: #e40000;
    line-height: 20pt;
}

.info {
  border-bottom: 2px solid #efefef;
  width: calc(100% - 100px);
}

.extras {
  border-top: 2px solid #efefef;

  @media (min-width: 600px) {
    .extra {
      align-items: flex-start;
      padding: 21px;
    }

    h4 {
      margin-bottom: 10px;
    }
  }

  select {
    width: 60px;
    height: 33px;
    background-color: #fff;
    border: 1px solid #dae0e4;
    border-radius: 4px;
    outline: none;
  }
}
.modal--body-subtitle {
  margin: 20px 0 12px;
}

@media (max-width: 600px) {
  .extras {
    .modal--body-group li {
      padding: 10px;
      & > div {
        width: 100%;

        .info {
          border-bottom: none;
        }

        h4 {
          border-bottom: 1px solid #efefef;
          padding-bottom: 8px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
