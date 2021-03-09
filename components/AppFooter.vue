<template>
<footer class="footer text-gray text-xs overflow-hidden">
    <div class="container lg-container footer_in">
        <div class="footer_content">
            <ul class="footer_menu">
                <li class="footer_menu_item">
                    <a href="/" class="footer_menu_link">City Search</a>
                </li>
                <li class="footer_menu_item">
                    <a href="/events?main_currency=USD" class="footer_menu_link">Events</a>
                </li>
                <li class="footer_menu_item">
                    <a href="http://help.smartstay.com/en/collections/2097282-smartstay-perks" class="footer_menu_link">Perks</a>
                </li>
                <li class="footer_menu_item">
                    <a href="http://help.smartstay.com" class="footer_menu_link">Help</a>
                </li>
                <li class="footer_menu_item">
                    <a href="http://help.smartstay.com/en/articles/3617504-our-terms" class="footer_menu_link">Terms of use</a>
                </li>
            </ul>
            <div class="footer_copyright">© 2019 SmartStay Technologies LLC. Trademarks and brands are the property of their respective owners.</div>
        </div>
        <a href="http://help.smartstay.com" class="footer_logo_wrap">
          <img class="footer_logo" src="@/assets/img/priceline-logo.png" alt="logo">
        </a>
    </div>
</footer>

</template>

<script>
export default {
  name: 'app-footer',
  data () {
    return {
      showCurrencyList: false,
      currencyList: ['USD', 'CAD']
    }
  },
  methods: {
    checkCurrencyInUrl () {
      if (this.$route.query.main_currency) {
          localStorage.setItem('currency', this.$route.query.main_currency)
          this.$store.commit('changeCurrency', this.$route.query.main_currency)
        } else {
          if (!localStorage.getItem('currency')) {
            localStorage.setItem('currency', 'USD')
            this.$store.commit('changeCurrency', 'USD')
          }
          this.$store.commit('changeCurrency', localStorage.getItem('currency'))
          this.$router.replace({ query: {...this.$route.query, main_currency: localStorage.getItem('currency') || 'USD'}})
        }
    },
    setDefaultCurrency (currency) {
      localStorage.setItem('currency', currency)
      this.$store.commit('changeCurrency', currency)
      this.$router.replace({ query: {...this.$route.query, main_currency: currency}})
    }
  },
  computed: {
    mainColor () {
        return this.$store.state.mainColor || '#000'
    },
    currency () {
      return this.$store.state.currency
    }
  },
  mounted () {
    this.checkCurrencyInUrl()
  }
}
</script>


<style lang="scss" scoped>
@import '@/assets/scss/vars/index.scss';
@import '@/assets/scss/mixins/index.scss';

.padding-fw {
    padding: 0 60px;

    @media (max-width: 576px) {
        padding: 0 5%;
    }
}

.color-brand {
    color: #58BCEB;
}

.line {
    width: 77px;
    height: 1px;
    background-color: #58BCEB;
    opcaity: 0.5;
}

.footer {
    background: #fff;
    border-top: 1px solid rgba(0,0,0,.15);

    @media (max-width: 1024px) {
        background-color: #007f94;
    }
}

.currency-list {
  cursor: pointer;

    .dropdown {
      cursor: pointer;
      position: absolute;
      width: 150px;
      text-align: right;
      bottom: 30px;
      right: 0;
    }

    @media (max-width: 576px) {
        display: flex;
        flex-direction: column;
        padding: 5px 10px;
        background: #fff;

        &>.dropdown{
            bottom: 0;
            width: auto;
            position: relative;
        }
    }

}

.lg-container {
    width: 1350px !important;
    max-width: 100% !important;
    padding-bottom: 27px;
    padding-top: 10px;
}

.footer {
    background-color: #202020;
}

.footer_in {
    display: flex;
    align-items: center;
}

.footer_menu {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 0;

    list-style: none;

}

.footer_menu_item {
    display: flex;
    align-items: center;

    & + & {
        margin-left: 9px;
    }
    &:last-child {
        &:after {
            display: none;
        }
    }
    &:after {
        content: '|';
        margin-left: 15px;
        font-size: 15px;
        color: #fff;
    }
}

.footer_menu_link {
    font-family: 'proxima-nova',avenir,helvetica,sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #fff;

    @media (max-width: 1024px) {
        font-size: 12px;
    }
}

.footer_copyright {
    font-family: 'proxima-nova',avenir,helvetica,sans-serif;
    margin-top: 3px;

    font-size: 13px;
    font-weight: 400;

    @media (max-width: 1024px) {
        font-size: 12px;
        max-width: 720px;
    }

    @media (max-width: 480px) {
        text-align: left;
    }
}

.footer_logo_wrap {
    display: block;
    height: 29px;
    margin: 9px 23px 0 auto;

    @media (max-width: 1024px) {
        display: none;
    }
}

.footer_logo {
    height: 100%;
}

</style>
