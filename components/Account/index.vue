<template>
  <transition name="modal">
    <div class="account modal-mask" v-bind:style="{zIndex: 102}">
      <div class="modal-wrapper">
        <div @click.self="closeModal()" class="flex justify-center sm:items-center max-h-full sm:px-container md:px-container sm:py-container">
          <div class="w-200 max-w-full sm:rounded bg-white -translate-y transition-transform-slow modal-box">

            <div class="modal--header">
              <div class="modal--header-wrapper">
                <div>
                  <h2 class="modal--header-title mb-hide">
                    <img src="../../assets/img/icons-bed.svg" alt="">
                    My trips
                  </h2>
                  <div class="modal--header-menu">
                    <button @click='getReservations()'>
                      <span class="modal--header-item modal--header-item_selected">Reservations</span>
                    </button>
                    <button v-show="false">
                      <span class="modal--header-item">Profile</span>
                    </button>
                  </div>
                </div>
                <div class="modal--header-right">
                  <button @click='closeModal()'>
                    <span class="mb-hide">Close</span>
                    <svg  viewBox="0 0 44.236 44.236"><g fill="#989898"><path d="M22.118 44.236C9.922 44.236 0 34.314 0 22.118S9.922 0 22.118 0s22.118 9.922 22.118 22.118-9.922 22.118-22.118 22.118zm0-42.736C10.75 1.5 1.5 10.749 1.5 22.118c0 11.368 9.25 20.618 20.618 20.618 11.37 0 20.618-9.25 20.618-20.618 0-11.369-9.248-20.618-20.618-20.618z"/><path d="M19.341 29.884a.75.75 0 0 1-.53-1.281l6.796-6.804-6.796-6.803a.75.75 0 1 1 1.061-1.061l7.325 7.333a.75.75 0 0 1 0 1.061l-7.325 7.333a.742.742 0 0 1-.531.222z"/></g></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="modal--body" :style='pageWidth > 600 ? "height: calc(100% - 44px)" : ""'>
              <Reservations />
            </div>

          </div>
        </div>
      </div>
      <loader :load='!isLoaded || !updatedData' v-if='!isLoaded || !updatedData'/>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
import Reservations from './Reservations'
import Loader from '@/components/Loader'
export default {
  data() {
    return {
      pageWidth: 0,
      isLoaded: false,
      updatedData: true,
      date_options: {
        year: 'numeric',
        month: 'short',
        weekday: 'short',
        day: 'numeric',
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
      }
    }
  },
  methods: {
    closeModal(event) {
      this.$emit('close')
      // this.isLoaded = true
      // this.$router.push('/')
    },
    getReservations(email) {
      this.$store.dispatch('inspectToken')
        .then((response) => {
          const authStr = 'JWT ' + this.$store.state.account.jwt
          axios.get(process.env.reservationsUrl, { headers: {Authorization: authStr} })
            .then(resp => {
              this.isLoaded = true
              let reservations = resp.data.items
              if (Object.keys(reservations).length > 0) {
                reservations.forEach((reservation, index) => {

                  let checkinDate = new Date(reservation.checkin_date + ' ' + reservation.checkin_time)
                  let checkoutDate = new Date(reservation.checkout_date + ' ' + reservation.checkout_time)

                  reservation.checkin_date = checkinDate.toLocaleDateString("en-US", this.date_options)
                  reservation.checkout_date = checkoutDate.toLocaleDateString("en-US", this.date_options)
                  reservation.is_upcoming = (Date.now() < checkinDate)
                })
                this.$store.commit('changeReservations', reservations)
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 401) {
                this.$toasted.global.traveler_error({ message : 'Your session has expired. Please relogin!' })
                setTimeout(() => {
                  this.$router.push('/hotels');
                });
              } else {
                this.$toasted.global.traveler_error()
              }
              this.closeModal()
            })
      })
    }
  },
  created () {
    if (!this.$store.state.account.isAuthenticated) {
      this.$router.push('/')
    }
    window.onresize = () => {
      this.pageWidth = document.body.clientWidth
    }
    this.getReservations()
  },
  components: {
    Loader,
    Reservations
  }
}
</script>

<style lang="scss">
.account {
  &.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;

    @media (max-width: 600px) {
      height: 100vh;
    }

    &::-webkit-scrollbar{
      width: 0;
    }

    select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding-left: 10px;
      background-image: url('../../assets/img/select-icon.png');
      background-size: 20px;
      background-repeat: no-repeat;
      background-position: 100% center;

  		@media (max-width: 768px) {
  			background-image: url('../../assets/img/select-icon-white.png');
  		}
    }

    .datepicker__inner {
      padding: 0;
    }

    input {
      overflow: hidden;

      &.border-error {
        border: 1px solid #cc0000!important;
      }
    }

    .text-error {
      color: #cc0000;
    }

    .datepicker__wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 134px;
      height: 28px;
      background: none;

      .datepicker__clear-button {
        display: none;
      }
      .datepicker__dummy-wrapper {
        opacity: 0;
      }
      .datepicker__dummy-input {
        cursor: pointer;
      }
    }

  }

  .modal-wrapper {
    // display: table-cell;
    position: absolute;
    width: 100%;
    top: 5%;
    bottom: 5%;
    -ms-overflow-style: none;
    overflow: auto;

    @media (min-width: 600px) {
      overflow: hidden;

      &>div {
        height: 100%;
        align-items: flex-start;
      }
    }
  }
  .modal-wrapper::-webkit-scrollbar
   { width: 0; }


  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
  }

  .text-error {
    color: #cc0000!important;
    width: 100%;
  }

  .modal-default-button {
    float: right;
  }

  .modal-box {
    max-height: calc(100vh - 40px);
    max-width: 100vw;
    width: 885px;
    overflow: auto;
    margin-top: 20px;
    padding-bottom: 10px;
    position: relative;

    @media (min-width: 600px) {
      overflow: hidden;

      &.checkout {
        .modal--body {
          max-height: calc(90vh - 50px);
        }
      }
    }
   }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    transition: all, 5s ease;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  // slide transition
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  .modal {
    &--header {
      padding: 15px 47px 10px 47px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;

      &.checkout {
        padding-left: 16px;

        .modal--header-left {
          svg {
            width: 23px;
            transform: rotate(180deg);
            height: auto;
            margin-left: 11px;

            path {
              fill: rgb(152, 152, 152);
            }
          }
        }
      }

       a, button {
        font-size: 13px;
        color: #989898;
        display: block;
        white-space: nowrap;
        transition: all .22s ease;
        outline: none;
        &.active,
        &:active,
        &:hover {
          color: #5cb718;
        }
        &:focus {
          text-decoration: underline;
        }
      }
      &-wrapper {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid #eeeeee;
        width: 100%;
      }
      &-title {
        padding-right: 10px;
        font-size: 24px;
        color: #343434;
        margin-bottom: 6px;
        padding-left: 12px;
        img {
          width: 27px;
          position: relative;
          top: 5px;
          margin-right: 6px;
        }
      }
      &-item {
        font-size: 1rem;
        color: #8c8c8c;
        padding: 8px 10px;
        line-height: 1;
        border-radius: 4px;
        border: 1px solid #dae0e4;
        user-select: none;
        display: inline-block;
        font-weight: 400;
        margin: 0 9px 23px 9px;
        &_selected {
          color: #fff;
          background-color: #298de9;
          border-color: #1b73c1;
        }
      }
      &-left {
        width: 16px;
        height: 16px;
        display: flex;
        svg {
          display: inline-block;
          vertical-align: middle;
          margin: 0 17px;
          path {
            fill: #dfdfdf;
          }
        }
      }
      &-right {
        button, a {
          svg {
            width: 23px;
            height: auto;
            margin-left: 11px;
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
      &-menu {
        display: flex;
      }
    }
    &--row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &--body {
      padding: 5px 47px 17px 47px;
      overflow: auto;

      @media (min-width: 768px) {
        max-height: calc(90vh - 150px);
      }

      &::-webkit-scrollbar{
        width: 0;
      }

      &-top {
        padding-bottom: 25px;
        &_border {
          border-bottom: 2px solid #eaeaea;
          margin-bottom: 20px;
        }
      }
      &-title {
        font-size: 20px;
        color: #8c8c8c;
        img {
          width: 27px;
          position: relative;
          top: 5px;
        }
      }
      &-subtitle {
        color: #b8b8b8;
        font-size: 20px;
        margin: 30px 0 22px;
      }
      &-item {
        font-size: 15px;
        color: #8c8c8c;
        padding: 7px 9px 5px;
        line-height: 1;
        border-radius: 4px;
        border: 1px solid #dae0e4;
        user-select: none;
        display: inline-block;
        font-weight: 400;
        margin-left: 9px;
        &_selected {
          color: #fff;
          background-color: #298de9;
          border-color: #1b73c1;
        }
      }
      &-group {
        width: 100%;
        border: 2px solid #efefef;
        border-radius: 5px;
        padding: 0;
        list-style: none;
        li {
          padding: 25px;
          &:not(:last-child) {
            border-bottom: 2px solid #efefef;
          }
        }
        h4 {
          color: #2c2c2c;
          font-size: 18px;
        }
        p {
          color: #808080;
          font-size: 13px;
        }
      }
      .lineupBtn {
        text-transform: uppercase;
        font-size: 13px;
        color: #298de9;
        &:hover {
          text-decoration: underline;
        }
      }
      select {
        width: 50px;
        height: 32px;
        border-radius: 4px;
        border: 2px solid #efefef;
        margin-left: 10px;
      }
      .price {
        font-size: 20px;
      }
    }
    &--footer {
      padding: 0px 45px;
      background: #fff;
      border-top: 2px solid #efefef;
      flex-wrap: wrap;
      justify-content: center;
      & > div {
        flex: 1;
        margin: 20px 20px 20px 0;
        min-width: 50%;
      }
      h5 {
        font-size: 18px;
        font-weight: normal;
        color: #21c640;
      }
      p {
        font-size: 13px;
        color: #898989;
      }
      button {
        background-color: #63c61a;
        color: white;
        padding: 11px 40px 10px;
        line-height: 1;
        border-radius: 4px;
        font-weight: 400;
        font-size: 16px;
        border: 1px solid rgba(0, 0, 0, .2);
        transition: all .22s ease;
        white-space: nowrap;
        height: 44px;
        max-width: 16.25rem;
        width: 100%;

        &:hover {
          background-color: #58af17;
        }
        svg {
          margin-left: 8px;
          vertical-align: middle;
          position: relative;
          top: -1px;
          path {
            fill: white;
          }
        }
      }
    }
    &--reservation {
      width: 100%;
      border: 1px solid #dae0e4;
      border-radius: 5px;
      padding: 0;
      margin: 10px 0 22px 0;
      font-size: .9rem;
      list-style: none;
      overflow: hidden;
      &.active {
        border-color: #58af17;
      }
      &:not(:last-child) {
        margin-bottom: 25px;
      }
      &-details {
        display: flex;
        align-items: flex-start;
        flex-wrap: nowrap;
      }
      &-image {
        position: relative;
        img {
          width: 200px;
          height: 150px;
          display: block;
          object-fit: cover;
        }
        span {
          display: block;
          position: absolute;
          bottom: 0px;
          right: 2px;
          padding: 7px 13px;
          font-size: 15px;
          letter-spacing: -0.4px;
          background-color: rgba(0, 0, 0, .6);
          color: #fff;
        }
      }
      &-data {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      &-trip {
        padding: 13px 15px 17px 17px;
        background-color: #fbfbfb;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 210px;
        span {
          font-weight: bold;
        }
        p {
          color: #686868;
        }
      }
      &-info {
        display: flex;
        flex-direction: column;
        padding: 21px 10px 10px 18px;
        margin-right: auto;
        min-height: 222px;
        min-width: 350px;
        max-width: 100%;
        h2 {
          font-size: 1.3rem;
          color: #3c3c3c;
          border-bottom: 1px solid #dae0e4;
          padding-bottom: 3px;
          margin-bottom: 8px;
        }
      }
      &-menu {
        display: flex;
        flex-direction: column;
        margin: 18px 21px 0 10px;
        align-items: center;
        min-height: 200px;
        width: 100px;
        span {
          color: #8c8c8c;
          padding: 9px 0;
          line-height: 1;
          border-radius: 4px;
          border: 1px solid #dae0e4;
          user-select: none;
          display: inline-block;
          font-size: 1rem;
          font-weight: 400;
          text-align: center;
          width: 100%;
          &.selected {
            color: #fff;
            background-color: #298de9;
            border-color: #1b73c1;
          }
        }
        a {
          margin-top: auto;
          display: block;
        }
        button {
          width: 100%;
          margin-bottom: 15px;
        }
      }
      &-checkin {
        display: flex;
        align-self: flex-end;
        margin-top: auto;
        margin-right: auto;
        span {
          display: block;
          padding-left: 12px;
          font-weight: bold;
        }
      }
      a {
        font-weight: bold;
        font-size: .8rem;
        color: #298de9;
      }
      a:hover {
        color: #58BCEB;
      }
    }
    @media screen and (max-width: 700px) {
      &--body {
        padding: 25px 20px;
      }
    }
  }

  .border-primary {
    border-color: #00da00;
  }

  .mb-show {
    display: none!important;
  }

  .guests .dropdown {
    // position: absolute;
    // width: 90px;
    // background-color: #fff;
    // border: 1px solid #dae0e4;
    // border-radius: 4px;
    // z-index: 999;
    // top: 30px;
    // left: 0;

    // span {
    //   display: block;
    //   text-align: center;
    //   padding: 7px 9px 5px;
    //   border-bottom: 1px solid #dae0e4;
    //   cursor: pointer;
    //   color: #333;
    //   &:hover {
    //     background-color: #0033cc;
    //     color: #ffffff;
    //   }
    // }
  }

  @media (max-width: 1024px) {
    .modal--reservation-details {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 768px) {
    .modal--reservation-info ul li {
      width: 100%;
    }

    .modal-wrapper {
      top: 0;
      bottom: 0;
    }

    body {
      font-size: 16px;
    }

    .modal-mask {
      .datepicker__inner,
      .datepicker__header,
      .datepicker__inner>* {
        position: static;
      }
    }
    .close-arrow{
      position: relative;
      bottom: 5px;
      right: 10px;
      svg{
        width: 23px;
        height: auto;
        //transform: rotate(180deg);
        stroke-width: 0;
      }
    }

    .modal--header {
      padding: 12px 16px;
    }

    .mb-hide{
      display: none!important;
    }

    .mb-show{
      display: block!important;
    }

    body.focused-input .sticky-buttons button {
      display: none!important;
    }

    .sticky-buttons button {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      border: 1px solid rgba(0, 0, 0, .2);
      background-color: #63c61a;
      color: white;
      padding: 6px 40px 10px;
      line-height: 1;
      font-weight: 400;
      height: 52px;
      font-size: 16px;
      transition: all .22s ease;
      white-space: nowrap;
      &:hover {
        background-color: #58af17;
      }

      &:last-child {
        border-bottom: none;
      }
      svg {
        margin-left: 8px;
        vertical-align: bottom;
        path {
          fill: white;
        }
      }
    }

    .modal-box {
      width: 100%;
      max-height: 100vh;
      top: 12px;
      padding-bottom: 80px;
      height: 100vh;



      &.overflow-hidden {
        overflow: hidden!important;
        position: fixed;
        width: 100%;
      }

      &.confirm {
        padding-bottom: 0;
      }

      .modal--body-info {
        justify-content: space-between;
        width: 100%;
        display: flex;

        .guests .dropdown {
          top: 39px;
          width: 100%;

          span {
            width: 100%;
            line-height: 37px;
          }
        }

        span {
          width: 45%;
          text-align: center;
          height: 40px;
          line-height: 25px;
        }
      }

      .modal--reservation-form input {
        width: 100%;
        flex: auto;
      }

      .modal--reservation-details {
        align-items: flex-start;
        flex-wrap: wrap;
        .modal--reservation-image {
          order: 1;
          img {
            width: 100%;
            height: auto;
          }
        }
        .modal--reservation-info {
          order: 2;
          min-height: auto;
          min-width: auto;
          width: 100%;
        }
        .modal--reservation-checkin {
          margin-top: 20px;
        }
        .modal--reservation-menu {
          order: 3;
          min-height: auto;
          width: 100%;
          justify-content: flex-end;
          padding: 16px 0 18px 10px;
        }
        .modal--reservation-trip {
          width: 100%;
          padding-left: 27px;
        }
      }
    }
  }

  .modal_arrow_back {
    position: absolute;
    top: 8px;
    left: 0;
    display: block;
    width: 24px;
    height: 18px;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    @media (min-width: 768px) {
      display: none;
    }
  }
}
</style>
