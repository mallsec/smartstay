<template>
  <div class="container fill-height">
    <ul class="flex is-align-justify is-align-middle fill-height">
        <li class="is-no-shrink">
          <a class="header-logo" href="http://www.traveler.co.com">
            <img class="img-logo hide-mb" src="../assets/img/logo.png" alt="Traveler">
            <img class="show-mb" src="~/static/images/logo.png" width="29" height="29" alt="Traveler">
          </a>
        </li>
        <li>
            <ul class="header-nav">
                <li><a class="header-nav-link" href="http://www.www.privetravels.com/tour">Events</a></li>
                <li><a class="header-nav-link" href="http://www.privetravels.com/partners">Tour</a></li>
                <li><a class="header-nav-link is-button" href="http://help.privetravels.com">Help</a></li>
            </ul>
        </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
@import url(../assets/scss/landing.scss);

    @supports ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))) {
      .header {
        background-color: rgba(255, 255, 255, 0.9);
        -webkit-backdrop-filter: blur(10px);
                backdrop-filter: blur(10px); } }
    @media (min-width: 701px) {
      .header.has-no-border {
        border-color: transparent; } }

  .header-logo {
    display: block;
    padding: 0.625rem 1.25rem;
    margin-left: -1.25rem;
    opacity: 1;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s; }
    .header-logo:hover {
      opacity: 0.75; }

  .header-nav {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    margin-left: -0.3125rem;
    margin-right: -0.3125rem; }
    .header-nav > * {
      min-width: 0; }
    .header-nav > * {
      padding-left: 0.3125rem;
      padding-right: 0.3125rem; }
    .header-nav > li {
      display: block; }
      .header-nav-link {
        display: block;
        padding: 0.5rem 0.875rem;
        font-size: 1.4vw;
        opacity: 1;
        -webkit-transition: opacity 0.3s;
        transition: opacity 0.3s; }
        @media (max-width: 952.22008px) {
          .header-nav-link {
            font-size: 13.33108px; } }
        @media (min-width: 1001px) {
          .header-nav-link {
            font-size: 14px; } }
        .header-nav-link:hover {
          opacity: 0.6; }
        .header-nav-link.is-active {
          color: #383838; }
        .header-nav-link.is-button {
          padding: 0.5625rem 2.5rem;
          border: 1px solid #dedede;
          border-radius: 0.3125rem;
          -webkit-transition: background-color 0.3s;
          transition: background-color 0.3s; }
          .header-nav-link.is-button:hover {
            opacity: 1;
            background-color: #dedede; }
          @media (max-width: 380px) {
            .header-nav-link.is-button {
              padding-left: 16px;
              padding-right: 16px; } }
      .header-nav-search {
        width: 17.5rem;
        margin-left: 1rem; }
        @media (max-width: 500px) {
          .header-nav-search {
            display: none; } }

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
</style>
