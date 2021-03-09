const pkg = require('./package')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'SmartStay.com',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: pkg.description}
    ],
    script: [
      {src: '/js/money.js'},
      {src: '/js/fb-sdk.js'},
      {src: 'https://js.stripe.com/v3/'},
      {src: 'https://apis.google.com/js/api:client.js'},
      {src: 'https://code.jquery.com/jquery-3.3.0.js'},
      {src: '/js/jquery.payment.js'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href:
          '/fonts/material-font.css'
      },
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: '~/components/Loader.vue',

  serverMiddleware: [
    'redirect-ssl'
  ],

  // server: {
  //   port: 3000, // default: 3000
  //   host: '0.0.0.0', // default: localhost
  // },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    {src: '~/plugins/vue-fa.js', ssr: false},
    {src: '~/plugins/currency-symbol-map.js'},
    {src: '~/plugins/vue-moment.js', ssr: false},
    {src: '~/plugins/vue-easy-slider', ssr: false},
    {src: '~/plugins/vue-agile', ssr: false},
    {src: '~/plugins/vue-gallery', ssr: false},
    {src: '~/plugins/vuex-persist', ssr: false},
    {src: '~/plugins/vue-toasted', ssr: false},
    {src: '~/plugins/vue2-datepicker', ssr: false},
    {src: '~/plugins/vue-google-signin', ssr: false},
    {src: '~/plugins/vue-facebook-signin', ssr: false},
    {src: '~/plugins/directives.js', ssr: false},
    {src: '~/plugins/vue-inject.js', ssr: false},
    {src: '~/plugins/vue-read-more.js', ssr: false},
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    ['@nuxtjs/google-analytics', {
      id: 'G-KSSSW78DML'
    }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['vue-image-lightbox', 'vue-easy-slider', 'vue-toasted', 'vue-read-more']
  },

  css: [
    '@/assets/scss/static.css',
    '@/assets/scss/topSlider.scss',
    '@/assets/scss/index.scss'
  ],

  icon: {
    iconSrc: '/images/pwa/pwa.png',
    sizes: [16, 120, 144, 152, 192, 384, 512],
  },

  manifest: {
    name: 'SmartStay',
    short_name: 'SmartStay',
    icons: [
      {
        "src": "/images/pwa/pwa-64.png",
        "type": "image/png",
        "sizes": "64x64"
      },
      {
        "src": "/images/pwa/pwa-120.png",
        "type": "image/png",
        "sizes": "120x120"
      },
      {
        "src": "/images/pwa/pwa-144.png",
        "type": "image/png",
        "sizes": "144x144"
      },
      {
        "src": "/images/pwa/pwa-152.png",
        "type": "image/png",
        "sizes": "152x152"
      },
      {
        "src": "/images/pwa/pwa-192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "/images/pwa/pwa-384.png",
        "type": "image/png",
        "sizes": "384x384"
      },
      {
        "src": "/images/pwa/pwa-512.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
  },

  env: {
    obtainJWT: process.env.FINDOR_OBTAIN_JWT_URL || 'https://api.smartstay.com/auth/obtain_token/',
    refreshJWT: process.env.FINDOR_REFRESH_JWT_URL || 'https://api.smartstay.com/auth/refresh_token/',
    usersUrl: process.env.FINDOR_USERS_URL || 'https://api.smartstay.com/v2/users/',
    baseUrl: process.env.FINDOR_BASE_URL || 'https://api.smartstay.com/v2/',
    reservationsUrl: process.env.FINDOR_RESERVATIONS_URL || 'https://api.smartstay.com/v2/reservations/',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '1062681649882-dq0iebhgudqbu2ova4o1go1637tkh31q.apps.googleusercontent.com',
    googleAuthUrl: process.env.FINDOR_GOOGLE_AUTH_URL || 'https://api.smartstay.com/auth/google/',
    fbAuthUrl: process.env.FINDOR_FB_AUTH_URL || 'https://api.smartstay.com/auth/facebook/',
    pricelineUrl: process.env.PRICELINE_URL || 'http://secure.rezserver.com/hotels/results/?refid=8565',
    resetPassword: process.env.FINDOR_PASSWORD_RESET || 'https://api.smartstay.com/rest-auth/password/reset/'
  }
}
