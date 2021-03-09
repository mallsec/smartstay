<template>
  <root-element>
    <header
      class='header z-100 fixed pin-x pin-t h-17 bg-white border-bottom sm:bg-alternate'>
      <div class="fill-height lg-container container">
        <ul class="flex is-align-justify is-align-middle fill-height">
          <li class="is-no-shrink">
            <no-ssr>
              <a class="event-logo v2" href="https://www.smartstay.com">
                <img class="desktop-logo-only" src="@/assets/img/smartstay-logo.png"
                     srcset="@/assets/img/smartstay-logo@2x.png 2x">
                <img class="mobile-logo-only" src="@/assets/img/logo_mobile.png">
              </a>
            </no-ssr>
          </li>
          <li>
            <ul class="header-nav">
              <li><a class="header-nav-link v2_mod" href="/">
                <span class="header-nav-img-wrap">
                  <img class="header-nav-img desktop_mod" ref='mainBgImg' src="@/assets/img/icons/zoom.svg"/>
                  <img class="header-nav-img mobile_mod" ref='mainBgImg' src="@/assets/img/icons/zoom_white.png"/>
                </span>
                <span class="header-nav-in">City Search</span>
              </a></li>
              <li><a class="header-nav-link v2_mod" href="/events?main_currency=USD">
                  <span class="header-nav-img-wrap">
                      <img class="header-nav-img desktop_mod" ref='mainBgImg' src="@/assets/img/icons/calendar-2.png" />
                      <img class="header-nav-img mobile_mod" ref='mainBgImg' src="@/assets/img/icons/calendar_white.png" />
                      </span>
                  <span class="header-nav-in">Events</span>
              </a></li>
              <li><a class="header-nav-link v2_mod" href="http://help.smartstay.com">
                <span class="header-nav-img-wrap">
                  <img class="header-nav-img desktop_mod" ref='mainBgImg' src="@/assets/img/icons/c-question.png"/>
                  <img class="header-nav-img mobile_mod" ref='mainBgImg' src="@/assets/img/icons/question_white.png"/>
                </span>
                <span class="header-nav-in">Help</span>
              </a></li>
              <li><a class="header-nav-link v2_mod" @click="openTripsModal">
                <span class="header-nav-img-wrap">
                  <img class="header-nav-img desktop_mod" ref='mainBgImg' src="@/assets/img/icons/single-02-2.svg"/>
                  <img class="header-nav-img mobile_mod" ref='mainBgImg' src="@/assets/img/icons/profile_white.png"/>
                </span>
                <span class="header-nav-in">Trips</span>
              </a></li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
    <account
      v-if="showTripsModal"
      @close="closeTripsModal"></account>
  </root-element>
</template>

<script>
  import LoginForm from '@/components/Account/LoginForm'
  import Account from '@/components/Account'
  import Avatar from 'vue-avatar'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        showLoginModal: false,
        showTripsModal: false,
        showContext: false,
        searchTxt: '',
      }
    },
    methods: {
      openLoginModal() {
        this.showLoginModal = true
        document.getElementsByTagName('body')[0].classList.add('overflow-hidden')
      },
      closeLoginModal() {
        this.showLoginModal = false
        document.getElementsByTagName('body')[0].classList.remove('overflow-hidden')
      },
      openTripsModal() {
        this.hideContextMenu()
        this.showTripsModal = true
        document.getElementsByTagName('body')[0].classList.add('overflow-hidden')
      },
      closeTripsModal() {
        this.showTripsModal = false
        document.getElementsByTagName('body')[0].classList.remove('overflow-hidden')
      },
      logout() {
        this.hideContextMenu()
        this.$store.commit('logout')
        this.$toasted.info('You signed out of your account')
      },
      showContextMenu() {
        this.showContext = true
      },
      hideContextMenu() {
        this.showContext = false
      }
    },
    computed: {
      ...mapState('city', ['cityList']),
      branding() {
        return this.$store.state.branding
      },
      isLandingPage() {
        return this.$route.name === 'index' || this.$route.fullPath === '/partners' || this.$route.fullPath === '/tour' || this.$route.path === '/events' || this.$route.path === '/findor'
      },
      isAuthenticated() {
        return this.$store.state.account.isAuthenticated
      },
      username() {
        return this.$store.state.account.authUser.username
      },
      avatarImage() {
        return this.$store.state.account.authUser.avatarImage
      }
    },
    components: {
      Account,
      Avatar,
      LoginForm
    }
  }
</script>

<style lang="scss" scoped>

  @import '@/assets/scss/vars/index.scss';

  @import '@/assets/scss/mixins/index.scss';

  .city-search {
    display: flex;
    align-items: center;
    position: fixed;
    margin-top: -20px;

    input {
      border-color: transparent;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 5px;
      font-size: 18px;
      margin-left: 10px;
      padding: 3px 10px;
      color: white;
    }

    input:focus {
      outline-width: 0px;
    }

    ul {
      list-style-type: none;
      position: absolute;
      width: calc(100% - 45px);
      right: 0px;
      top: 35px;
      background: white;
      color: black;
      max-height: 185px;
      overflow-y: auto;

      li {
        padding: 7px 10px;
        border-bottom: 1px solid #D9D9D9;
        cursor: pointer;
      }
    }
  }

  .padding-fw {
    padding: 0 60px;

    @media (max-width: 576px) {
      padding: 0 5%;
    }
  }

  .landing.header {
    width: 100%;
    height: 4rem;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    background-color: white;
    -webkit-transition: border-color 0.3s;
    transition: border-color 0.3s;
  }

  .border-bottom {
    border-bottom: 1px solid #DADADA !important;
  }

  @import url(../assets/scss/landing.scss);

  @supports ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))) {
    .header {
      background-color: rgba(255, 255, 255, 0.9);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
    }
  }

  @media (min-width: 701px) {
    .header.has-no-border {
      border-color: transparent;
    }
  }

  .header-logo {
    display: block;
    padding: 0.625rem 1.25rem;
    margin-left: -1.25rem;
    opacity: 1;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
  }

  .header-logo:hover {
    opacity: 0.75;
  }

  .header-nav {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-left: -0.3125rem;
    margin-right: -0.3125rem;
  }

  .header-nav > * {
    min-width: 0;
  }

  .header-nav > * {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
  }

  .header-nav > li {
    display: block;
  }

  .header-nav-link {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.875rem;
    font-size: 1.4vw;
    font-weight: 600;
    color: #383838;
    opacity: 1;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
  }

  @media (max-width: 952.22008px) {
    .header-nav-link {
      font-size: 12.33108px;
    }
  }

  @media (min-width: 1001px) {
    .header-nav-link {
      font-size: 14px;
    }
  }

  .header-nav-link:hover {
    opacity: 0.6;
  }

  .header-nav-link.is-active {
    color: #383838;
  }

  .header-nav-link.is-button {
    padding: 0.5625rem 2.5rem;
    border: 1px solid #dedede;
    border-radius: 0.3125rem;
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
  }

  .header-nav-link.is-button:hover {
    opacity: 1;
    background-color: #dedede;
  }

  @media (max-width: 380px) {
    .header-nav-link.is-button {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  .header-nav-search {
    width: 17.5rem;
    margin-left: 1rem;
  }

  .logout {
    display: block;
    font-size: 34px;
  }

  @media (max-width: 500px) {
    .header-nav-search {
      display: none;
    }
  }

  .show-mb {
    display: none;
  }

  @media (max-width: 768px) {
    .hide-mb {
      display: none;
    }
    .show-mb {
      display: block;
    }
  }

  // Event header

  header.event-header {
    overflow: hidden;

    &.inverse {
      position: absolute;
      top: 0;
      right: 0;
      background: transparent !important;
      border: none !important;
      color: #fff;

      .padding-fw {
        padding: 0;
      }

      .header-nav-link {
        color: #fff !important;
      }

      .header-nav-link.is-button:hover {
        background: rgba(255, 255, 255, 0.3);
      }

    }

    @media (max-width: 576px) {
      .header-nav li:not(:last-child) {
        display: none;
      }

      &:not(.inverse) {
        .header-nav li:nth-child(2) {
          display: block;
        }
      }
    }

    .event-logo img {
      width: auto;
      height: 33px;
    }
  }

  // CTX menu

  .ctx {
    position: absolute;
    top: 52px;
    right: 200px;
    background-color: transparent;
  }

  .ctx-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: .9rem;
    color: #373a3c;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: .25rem;
    -moz-box-shadow: 0 0 5px #ccc;
    -webkit-box-shadow: 0 0 5px #ccc;
    box-shadow: 0 0 5px #ccc
  }

  .ctx-divider {
    height: 1px;
    margin: .5rem 0;
    overflow: hidden;
    background-color: #e5e5e5
  }

  .ctx-item {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: 400;
    line-height: 1.5;
    color: #373a3c;
    text-align: inherit;
    white-space: nowrap;
    background: none;
    border: 0;
    cursor: default
  }

  .ctx-item:focus,
  .ctx-item:hover {
    color: #2b2d2f;
    text-decoration: none;
    background-color: #f5f5f5;
    cursor: normal
  }

  .ctx-item.active,
  .ctx-item.active:focus,
  .ctx-item.active:hover {
    color: #fff;
    text-decoration: none;
    background-color: #0275d8;
    outline: 0
  }

  .ctx-item.disabled,
  .ctx-item.disabled:focus,
  .ctx-item.disabled:hover {
    color: #818a91
  }

  .ctx-item.disabled:focus,
  .ctx-item.disabled:hover {
    text-decoration: none;
    cursor: not-allowed;
    background-color: transparent;
    background-image: none;
    filter: "progid: DXImageTransform.Microsoft.gradient(enabled = false)"
  }

  .open > .ctx-menu {
    display: block
  }

  .open > a {
    outline: 0
  }

  .ctx-menu-right {
    right: 0;
    left: auto
  }

  .ctx-menu-left {
    right: auto;
    left: 0
  }

  .ctx-header {
    display: block;
    padding: 3px 20px;
    font-size: .9rem;
    line-height: 1.5;
    color: #818a91;
    white-space: nowrap
  }

  .ctx-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 990
  }

  .pull-right > .ctx-menu {
    right: 0;
    left: auto
  }

  .ctx-menu-container {
    position: fixed;
    padding: 0;
    background-color: #f5f5f5;
    z-index: 99999;
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, .18), 0 4px 15px 0 rgba(0, 0, 0, .15);
  }

  .header {

    @include bp($bp) {
      background-color: #1d1d1d;
    }

    @include bp($bp) {
      &.border-bottom {
        border-bottom: none !important;
      }

      &.h-17 {
        height: 57px;
      }

      .container {
        padding: 9px 10px 16px 9px !important;
      }
    }
  }

  .event-logo.v2 img {
    width: auto;
    height: 23px;
  }

  .header-nav-img-wrap {
    display: inline-flex;
    width: 16px;
    height: 16px;

    margin-right: 8px;

    @include bp($bp) {
      margin-right: 0;
      width: 19px;
      height: 19px;
    }
  }

  .header-nav-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;

    &.desktop_mod {
      @include bp($bp) {
        display: none;
      }
    }

    &.mobile_mod {
      display: none;
      @include bp($bp) {
        display: block;
      }
    }
  }

  .lg-container {
    width: 1380px !important;
    max-width: 100% !important;
  }

  .header-nav-link {
    &.v2_mod {
      padding: 0.5rem 0.975rem;

      @include bp($bp) {
        padding: 0 8px;
      }
    }
  }

  .header-nav-in {
    @include bp($bp) {
      display: none;
    }
  }

  .desktop-logo-only {
    @include bp($bp) {
      display: none;
    }
  }

  .mobile-logo-only {
    display: none;
    @include bp($bp) {
      display: block;
    }
  }

</style>
