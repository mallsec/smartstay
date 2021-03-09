<template>
  <div class="modal--room" :class="{ 'border-primary': room.quantity !== '0' }">
    <div class="modal--room-details">
      <div class="modal--room-image">
        <img :src="room.photo" alt="" />
      </div>
      <div class="modal--room-info">
        <div class="modal--room-title">
          <h3>
            {{ room.category }} Room, {{ room.beds }} bed{{
              room.beds > 1 ? "s" : ""
            }}
            <span class="text-sm" style="display: block"
              >({{ room.display_name }})</span
            >
            <!--          <p v-if='isMinimalRate' class="discount mb-show">-->
            <!--            Save {{discount}}% or ${{exchange(strangeRate - (room.total_price - room.taxes_and_fees) / nights / 100)}} per night-->
            <!--          </p>-->
          </h3>
          <span
            class="modal--room-price"
            style="margin-left: 10px; text-align: right; max-width: 50%;"
          >
            <span
              v-if="exchange(strangeRate)"
              class="old-price"
              style="display: inline-block;"
              >${{ exchange(strangeRate) }}</span
            >
            {{
              totalPrice(
                exchange((room.total_price - room.taxes_and_fees) / nights),
                room.currency
              )
            }}
            <select
              @change="changeData('quantity')"
              v-model="room.quantity"
              ref="quantity"
              style="background-color: transparent;"
            >
              <option value="0">0</option>
              <option v-for="i in room.rooms_left" :key="i" :value="i">
                {{ i }}
              </option>
            </select>
          </span>
        </div>
        <ul
          :class="{ 'full-width': amenitiesCount <= 2 }"
          style="margin-top: 15px;"
        >
          <li v-if="room.in_room_wifi">
            <svg viewBox="0 0 50 50" version="1.1" width="24px" height="24px">
              <path
                d="M 25 7 C 15.941406 7 7.339844 10.472656 0.78125 16.773438 L 0.0625 17.464844 L 5.59375 23.230469 L 6.320313 22.539063 C 11.378906 17.679688 18.015625 15 25 15 C 31.984375 15 38.621094 17.679688 43.683594 22.539063 L 44.40625 23.230469 L 49.941406 17.464844 L 49.21875 16.769531 C 42.660156 10.46875 34.058594 7 25 7 Z M 25 19 C 19.046875 19 13.394531 21.28125 9.085938 25.421875 L 8.363281 26.113281 L 13.921875 31.90625 L 14.644531 31.210938 C 17.464844 28.496094 21.144531 27 25 27 C 28.855469 27 32.535156 28.496094 35.355469 31.210938 L 36.078125 31.90625 L 41.636719 26.113281 L 40.917969 25.421875 C 36.605469 21.28125 30.953125 19 25 19 Z M 25 31 C 22.15625 31 19.453125 32.089844 17.390625 34.074219 L 16.671875 34.765625 L 25 43.441406 L 33.328125 34.765625 L 32.609375 34.074219 C 30.546875 32.089844 27.84375 31 25 31 Z "
              />
            </svg>
            Free Wifi
          </li>
          <li v-if="room.breakfast_included">
            <svg viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
              <path
                d="M 11 2 C 11 3.277344 10.78125 3.28125 10.28125 3.78125 C 9.78125 4.28125 9 5.277344 9 7 L 11 7 C 11 5.722656 11.21875 5.71875 11.71875 5.21875 C 12.21875 4.71875 13 3.722656 13 2 Z M 14.6875 3 C 14.6875 5.398438 13 5.398438 13 7 L 15 7 C 15 5.5 16.6875 5.699219 16.6875 3 Z M 5 8 L 5 14 C 5 16.199219 6.800781 18 9 18 L 15 18 C 16.902344 18 18.472656 16.660156 18.875 14.875 C 20.664063 14.476563 22 12.910156 22 11 L 22 10 C 22 9.476563 21.816406 8.941406 21.4375 8.5625 C 21.058594 8.183594 20.523438 8 20 8 Z M 19 10 L 20 10 L 20 11 C 20 11.808594 19.613281 12.429688 19 12.75 Z M 2 19 C 2 20.699219 3.300781 22 5 22 L 19 22 C 20.699219 22 22 20.699219 22 19 Z "
              />
            </svg>
            Free Breakfest
          </li>
          <li v-if="room.free_parking">
            <svg viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
              <path
                d="M 20.175781 4.367188 C 19.902344 3.550781 19.140625 3 18.277344 3 L 5.722656 3 C 4.859375 3 4.097656 3.550781 3.824219 4.367188 L 2 9.839844 L 2 20 C 2 20.550781 2.449219 21 3 21 L 5 21 C 5.550781 21 6 20.550781 6 20 L 6 18 L 18 18 L 18 20 C 18 20.550781 18.449219 21 19 21 L 21 21 C 21.550781 21 22 20.550781 22 20 L 22 9.839844 Z M 5.5 15 C 4.671875 15 4 14.328125 4 13.5 C 4 12.671875 4.671875 12 5.5 12 C 6.328125 12 7 12.671875 7 13.5 C 7 14.328125 6.328125 15 5.5 15 Z M 18.5 15 C 17.671875 15 17 14.328125 17 13.5 C 17 12.671875 17.671875 12 18.5 12 C 19.328125 12 20 12.671875 20 13.5 C 20 14.328125 19.328125 15 18.5 15 Z M 4.054688 10 L 5.722656 5 L 18.28125 5 L 19.945313 10 Z "
              />
            </svg>
            Free Parking
          </li>
          <li v-if="room.accessible">
            <f-a icon="check" />
            Accessible
          </li>
          <li v-if="room.ocean_view">
            <f-a icon="check" />
            Ocean view
          </li>
          <li v-if="room.non_smoking">
            <svg viewBox="0 0 50 50" version="1.1" width="24px" height="24px">
              <path
                d="M 29 4 C 28.746094 4 28.476563 4.085938 28.28125 4.28125 C 27.5 5.0625 25.113281 8.921875 26.28125 12.34375 C 27.15625 14.90625 29.722656 16.46875 33.875 17 C 38.839844 17.632813 40.449219 18.574219 41.03125 21.21875 C 41.132813 21.6875 41.539063 22 42 22 C 42.070313 22 42.148438 21.984375 42.21875 21.96875 C 42.757813 21.851563 43.085938 21.320313 42.96875 20.78125 C 42.082031 16.761719 39.179688 15.644531 34.125 15 C 30.789063 14.574219 28.796875 13.46875 28.1875 11.6875 C 27.363281 9.273438 29.269531 6.167969 29.71875 5.71875 C 30.109375 5.328125 30.109375 4.671875 29.71875 4.28125 C 29.523438 4.085938 29.253906 4 29 4 Z M 35 5 C 34.445313 5 34 5.449219 34 6 C 34 6.550781 34.445313 7 35 7 C 37.394531 7 40.613281 7.535156 41 12.09375 C 41.042969 12.613281 41.480469 13 42 13 C 42.757813 13 45.300781 13.128906 46.40625 14.78125 C 47.25 16.042969 47.136719 18.011719 46.0625 20.625 C 45.851563 21.136719 46.113281 21.726563 46.625 21.9375 C 46.75 21.988281 46.871094 22 47 22 C 47.394531 22 47.78125 21.761719 47.9375 21.375 C 49.28125 18.105469 49.332031 15.507813 48.09375 13.65625 C 46.777344 11.695313 44.398438 11.164063 42.875 11.03125 C 42.386719 8.097656 40.566406 5 35 5 Z M 9 9 C 8.746094 9 8.476563 9.085938 8.28125 9.28125 C 7.890625 9.671875 7.890625 10.328125 8.28125 10.71875 L 44.28125 46.71875 C 44.476563 46.914063 44.742188 47 45 47 C 45.257813 47 45.523438 46.914063 45.71875 46.71875 C 46.109375 46.328125 46.109375 45.671875 45.71875 45.28125 L 34.4375 34 L 38 34 L 38 24 L 24.4375 24 L 9.71875 9.28125 C 9.523438 9.085938 9.253906 9 9 9 Z M 1 24 C 0.445313 24 0 24.445313 0 25 L 0 33 C 0 33.554688 0.445313 34 1 34 L 28 34 L 18 24 Z M 40 24 L 40 34 L 43 34 L 43 24 Z M 45 24 L 45 34 L 49 34 C 49.554688 34 50 33.554688 50 33 L 50 25 C 50 24.449219 49.554688 24 49 24 Z "
              />
            </svg>
            Non smoking
          </li>
          <li v-if="room.shuttle_included">
            <f-a icon="check" />
            Free shuttle
          </li>
          <li v-if="room.extra_sofa_bed">
            <f-a icon="check" />
            Extra sofa bed
          </li>
          <li><f-a icon="check" /> {{ room.type }}</li>
          <li v-if="room.king_bed">
            <img class="img-responsive" src="../../../assets/icons/hotel.svg" />
            King bed
          </li>

          <li v-if="room.queen_bed">
            <img class="img-responsive" src="../../../assets/icons/hotel.svg" />
            Queen bed
          </li>

          <li v-if="room.double_bed">
            <img class="img-responsive" src="../../../assets/icons/hotel.svg" />
            Double beds
          </li>

          <li v-if="room.single_bed">
            <img class="img-responsive" src="../../../assets/icons/hotel.svg" />
            Single bed
          </li>

          <li v-if="room.two_single_beds">
            <img class="img-responsive" src="../../../assets/icons/hotel.svg" />
            Two single beds
          </li>

          <li v-if="room.extra_bed">
            <img class="img-responsive" src="../../../assets/icons/hotel.svg" />
            Extra bed
          </li>

          <li v-if="room.two_double_beds">
            <img class="img-responsive" src="../../../assets/icons/hotel.svg" />
            Two double beds
          </li>
        </ul>
      </div>
      <div class="modal--room-quantity">
        <!-- <span class="modal--room-price">
          <span class="old-price">${{exchange(strangeRate)}}</span>
          {{ totalPrice(exchange((room.total_price - room.taxes_and_fees) / nights), room.currency) }}
        </span> -->
        <!-- <select @change='changeData("quantity")' v-model='room.quantity' ref='quantity' style="background-color: transparent;">
          <option value="0">0</option>
          <option
            v-for="i in room.rooms_left"
            :key="i"
            :value="i">
              {{i}}
          </option>
        </select> -->
        <p
          v-if="isMinimalRate && isFiniteNumber(discount)"
          class="discount mb-hide"
        >
          <span>
            Save {{ discount }}% or ${{
              exchange(
                strangeRate -
                  (room.total_price - room.taxes_and_fees) / nights / 100
              )
            }}
            per night
          </span>
        </p>
      </div>
    </div>
    <!-- <div class="modal--room-form" v-if='room.quantity !== "0"'>
      <p class="text-info">Who's checking in?</p>
      <input
       @input='changeData("first_name")'
       v-model='room.first_name'
       type="text"
       placeholder="First name *">
      <input
       @input='changeData("last_name")'
       v-model='room.last_name'
       type="text"
       placeholder="Last name *">
      <input
       @input='changeData("email")'
       v-model='room.email'
       type="email"
       placeholder="Email address *">
    </div> -->
  </div>
</template>

<script>
import getSymbolFromCurrency from "currency-symbol-map";
export default {
  props: ["index", "minRate", "strangeRate", "discount"],
  name: "Room",
  computed: {
    room() {
      return this.$store.state.chooseRoom.rooms.filter(
        room => room.capacity >= this.$store.state.chooseRoom.guests
      )[this.index];
    },
    isMinimalRate() {
      return (
        this.minRate ===
        (this.room.total_price - this.room.taxes_and_fees) / this.nights / 100
      );
    },
    nights() {
      return Math.round(
        (new Date(this.room.checkout_date) - new Date(this.room.checkin_date)) /
          1000 /
          60 /
          60 /
          24
      );
    },
    amenitiesCount() {
      return (
        +this.room.in_room_wifi +
        +this.room.breakfast_included +
        +this.room.free_parking +
        +this.room.accessible +
        +this.room.ocean_view +
        +this.room.shuttle_included +
        +this.room.extra_sofa_bed +
        +this.room.non_smoking +
        +this.room.king_bed +
        +this.room.queen_bed +
        +this.room.double_bed +
        +this.room.single_bed +
        +this.room.extra_bed +
        +this.room.two_double_bed 
      );
    }
  },
  methods: {
    isFiniteNumber(value) {
      return typeof Number.isFinite === "function"
        ? Number.isFinite(value)
        : (() => {
            // 1. If Type(number) is not Number, return false.
            if (typeof value !== "number") {
              return false;
            }
            // 2. If number is NaN, +∞, or −∞, return false.
            if (value !== value || value === Infinity || value === -Infinity) {
              return false;
            }
            // 3. Otherwise, return true.
            return true;
          })();
    },
    exchange(val) {
      // problem with filters
      return parseInt(
        fx.convert(val, { from: "USD", to: this.$store.state.currency })
      );
    },
    changeData(field) {
      let value = this.room[field];
      this.$store.commit("changeRoomsData", {
        field,
        id: this.room.id,
        value
      });
    },
    totalPrice(price, currency) {
      return `${getSymbolFromCurrency(currency)}${price
        .toString()
        .slice(0, -2)}`;
    }
  }
};
</script>

<style scoped>
li svg {
  fill: #63c61a;
  width: 13px;
  height: 13px;
}

.img-responsive {
  position: absolute;
  top: 3px;
  left: 0;
  width: 16px;
  height: 16px;
  fill: #555555;
}

.old-price {
  text-decoration: line-through;
  color: #d9d9d9;
}

.discount {
  width: 100%;
  text-align: right;
  font-size: 11pt;
  font-weight: 400;
  margin-top: 6px;
  color: #e40000;
}

.modal--room-quantity {
  justify-content: flex-end;
  flex-wrap: wrap;
}

li.no-icon {
  padding-left: 28px;
}

span.text-sm {
  font-size: 0.7em;
}

.text-info {
  width: 100%;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  padding-left: 10px;
}

.text-error {
  padding-left: 10px;
}

.full-width li {
  width: 100% !important;
}

h3 .discount {
  text-align: left;
  margin-top: 0;
}

.modal--room-title {
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
}

@media (max-width: 600px) {
  h3 {
    font-size: 17px;
  }

  .discount {
    font-size: 13px;
  }

  .modal--room-quantity {
    flex-wrap: nowrap;
  }
  .modal--room-quantity .modal--room-price {
    display: inline-flex;
  }

  .modal--room-price {
    font-size: 18px;
  }

  .old-price {
    margin-right: 5px;
  }
}
</style>
