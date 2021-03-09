<template>
  <main class="main landing">
    <section class="home-top align-center">
        <div class="home-top-bg-image">
            <div class="is-left"></div>
            <div class="is-middle"></div>
            <div class="is-right"></div>
        </div>
        <div class="push-40"></div>

        <div class="container">

            <!-- Welcome Login Form -->
            <div v-show="showWelcome" class="widget-wrapper">
                <div class="widget--header align-center">
                    <h1 class="h1">Member Login</h1>
                    <div class="py-2">
                        <p class="text-gray text-xs">Login or create a free account to manage your trips.</p>
                    </div>
                </div>
                <div class="widget--main">
                    <input v-on:click="isWelcome = false; isLogin = true" type="submit" value="Log in email" />
                    <no-ssr>
                      <fb-signin-button
                        :params="fbSignInParams"
                        @success="onFbSignInSuccess"
                        @error="onFbSignInError">
                        <button class="social-signin facebook">
                            <span class="facebook-button-icon">
                                <f-a :icon="['fab', 'facebook']" />
                            </span>
                            <span class="facebook-button-text">Login with Facebook</span>
                        </button>
                      </fb-signin-button>
                    </no-ssr>
                </div>
                <div class="widget--footer text-xs">
                  <span class="text-gray">Don't have an account? </span>
                  <a v-on:click="isWelcome = false; isSignup = true" class="weight-medium">Sign up</a>
                </div>
            </div>

            <!-- Login Form -->
          <password-reset-form v-show="passwordForgotted"></password-reset-form>
            <div v-show="showLogin && !passwordForgotted" class="widget-wrapper">
                <div class="widget--header">
                    <form>
                        <input type="text" name="email" id="login_email" v-model="email" placeholder="Email address" />
                        <span class="mail-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 512 512" enable-background="new 0 0 512 512"><path d="M0,64v384h512V64H0z M455.438,96L256,266.938L56.578,96H455.438z M32,416V117.063l224,192l224-192V416H32z" fill="#a1aebe"/>
                            </svg>
                        </span>
                        <input :type="passwordFieldType" name="password" id="login_password" v-model="password" placeholder="Password" />
                        <span class="lock-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20px" height="20px">
                            <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z " fill="#a1aebe"/>
                            </svg>
                        </span>
                        <div class="flex is-align-justify text-xs">
                            <div>
                                <input type="checkbox" id="check" name="check" value="" />
                                <label for="check" class="check">
                                  <span><!-- This span is needed to create the "checkbox" element --></span>Remember me
                                </label>
                            </div>
                            <div>
                                <a @click="switchVisibility" class="text-gray">Show password</a>
                            </div>
                        </div>
                        <input @click.prevent="authenticate" type="submit" value="Log in" />
                        <a  @click="forgotPassword" class="text-xs">Forgot password?</a>
                    </form>
                </div>
                <div class="widget--main">
                    <no-ssr>
                      <fb-signin-button
                        :params="fbSignInParams"
                        @success="onFbSignInSuccess"
                        @error="onFbSignInError">
                        <button class="social-signin facebook">
                            <span class="facebook-button-icon">
                                <f-a :icon="['fab', 'facebook']" />
                            </span>
                            <span class="facebook-button-text">Login with Facebook</span>
                        </button>
                      </fb-signin-button>
                    </no-ssr>
                    <g-signin-button
                      :params="googleSignInParams"
                      @success="onGoogleSignInSuccess"
                      @error="onGoogleSignInError">
                      <button type="button" class="google-button">
                          <span class="google-button-icon">
                              <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg"><path d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z" id="Shape" fill="#EA4335"/><path d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z" id="Shape" fill="#FBBC05"/><path d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z" id="Shape" fill="#4285F4"/><path d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z" fill="#34A853"/></svg>
                          </span>
                          <span class="google-button-text">Sign in with Google</span>
                      </button>
                    </g-signin-button>
                </div>
                <div class="widget--footer text-xs">
                    <span class="text-gray">Don't have an account? </span>
                    <a v-on:click="isLogin = false; isSignup = true" class="weight-medium">Sign up</a>
                </div>
            </div>

            <!-- Signup Form -->
            <div v-show="showSignup" class="widget-wrapper">
                <div class="widget--header">
                    <input type="text" name="email" id="signup_email" v-model="email" placeholder="Email address" />
                    <span class="mail-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 512 512" enable-background="new 0 0 512 512"><path d="M0,64v384h512V64H0z M455.438,96L256,266.938L56.578,96H455.438z M32,416V117.063l224,192l224-192V416H32z" fill="#a1aebe"/>
                        </svg>
                    </span>
                    <input :type="passwordFieldType" name="password" id="signup_password" v-model="password" placeholder="Choose password" />
                    <span class="lock-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20px" height="20px">
                        <path style=" " d="M 16 3 C 12.15625 3 9 6.15625 9 10 L 9 13 L 6 13 L 6 29 L 26 29 L 26 13 L 23 13 L 23 10 C 23 6.15625 19.84375 3 16 3 Z M 16 5 C 18.753906 5 21 7.246094 21 10 L 21 13 L 11 13 L 11 10 C 11 7.246094 13.246094 5 16 5 Z M 8 15 L 24 15 L 24 27 L 8 27 Z " fill="#a1aebe"/>
                        </svg>
                    </span>
                    <div class="flex is-align-justify text-xs">
                        <div>
                            <input type="checkbox" id="check" name="check" value="" />
                            <label for="check" class="check">
                              <span><!-- This span is needed to create the "checkbox" element --></span>Remember me
                            </label>
                        </div>
                        <div>
                            <a @click="switchVisibility" class="text-gray">Show password</a>
                        </div>
                    </div>
                    <input @click.prevent="signup" type="submit" value="Sign up" />
                </div>
                <div class="widget--main">
                    <no-ssr>
                      <fb-signin-button
                        :params="fbSignInParams"
                        @success="onFbSignInSuccess"
                        @error="onFbSignInError">
                        <button class="social-signin facebook">
                            <span class="facebook-button-icon">
                                <f-a :icon="['fab', 'facebook']" />
                            </span>
                            <span class="facebook-button-text">Login with Facebook</span>
                        </button>
                      </fb-signin-button>
                    </no-ssr>
                    <g-signin-button
                      :params="googleSignInParams"
                      @success="onGoogleSignInSuccess"
                      @error="onGoogleSignInError">
                      <button type="button" class="google-button">
                          <span class="google-button-icon">
                              <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg"><path d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z" id="Shape" fill="#EA4335"/><path d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z" id="Shape" fill="#FBBC05"/><path d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z" id="Shape" fill="#4285F4"/><path d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z" fill="#34A853"/></svg>
                          </span>
                          <span class="google-button-text">Sign in with Google</span>
                      </button>
                    </g-signin-button>
                </div>
                <div class="widget--footer text-xs">
                    <span class="text-gray">Already have an account? </span>
                    <a v-on:click="isSignup = false; isLogin = true" class="weight-medium">Log in</a>
                </div>
            </div>

            <no-ssr>
            <!-- Priceline Search Form -->
            <div v-if="isAuthenticated" class="widget-wrapper">
                    <div class="widget--main no-border">
                        <label for="where_to" class="cell-title text-gray">Where to?</label>
                        <autocomplete
                          ref="whereTo"
                          :source="cityAutoSuggestUrl"
                          placeholder=""
                          :results-display="formatDisplay"
                          results-value="cityid_ppn"
                          @selected="setObjValue"
                          @clear="setObjValue({})">
                        </autocomplete>
                        <div class="flex">
                            <div>
                                <label for="check_in" class="cell-title text-gray">Check-in</label>
                                <date-picker
                                ref="checkIn"
                                v-model="checkIn"
                                lang="en"
                                format="YYYY-MM-DD"
                                placeholder="yyyy-mm-dd"
                                input-name="check_in"
                                :not-before="new Date()"
                                @input="changeStartDate"
                                />
                            </div>
                            <div>
                                <label for="check_out" class="cell-title text-gray">Check-out</label>
                                <date-picker
                                ref="checkOut"
                                v-model="checkOut"
                                lang="en"
                                format="YYYY-MM-DD"
                                placeholder="yyyy-mm-dd"
                                input-name="check_out"
                                :not-before="this.checkIn"
                                />
                            </div>
                        </div>
                        <label for="rooms_list" class="cell-title text-gray">Guests</label>
                        <autocomplete
                          v-model="numberOfGuests"
                          :source="[{id:1,name:'1 Guest'},{id:2,name:'2 Guests'},{id:3,name:'3 Guests'},{id:4,name:'4 Guests'}]"
                          :initial-display="'1 Guest'"
                          :initial-value="1"
                          placeholder="">
                        </autocomplete>
                        <input @click="searchByPriceline" type="submit" value="Search">
                    </div>
                <div class="widget--footer text-xs">
                    <span class="text-gray">Going to an event? </span>
                    <a href="/events" class="weight-medium">Click here</a>
                </div>
            </div>
            </no-ssr>

        </div>
    </section>


</main>
</template>
<script>
import Autocomplete from 'vuejs-auto-complete'
import PassordResetForm from '../components/Account/PasswordResetForm'
import axios from 'axios'

export default {
  data () {
    return {
      isWelcome: true,
      isSignup: false,
      isLogin: false,
      email: null,
      password: null,
      passwordForgotted: false,
      passwordFieldType: 'password',
      checkIn: '',
      checkOut: '',
      citiesJson: [],
      selectedCity: null,
      numberOfGuests: 1,
      search: '',
      searchString: '',
      googleSignInParams: {
        client_id: process.env.googleClientId
      },
      cityAutoSuggestUrl: `${process.env.baseUrl}city-auto-suggest?string=`,
      fbSignInParams: {
        scope: 'public_profile,email',
        return_scopes: true
      },
    }
  },
  methods: {
    forgotPassword() {
      this.passwordForgotted = true;
    },
    setObjValue (obj) {
      if (obj.selectedObject) {
        this.selectedCity = obj.selectedObject
        if (obj.selectedObject.country_code === 'US') {
          this.$refs.whereTo.selectedDisplay = obj.selectedObject.city
          this.$refs.whereTo.selectedDisplayState = obj.selectedObject.state
        } else {
          this.$refs.whereTo.selectedDisplay = obj.selectedObject.city
          this.$refs.whereTo.selectedDisplayState = obj.selectedObject.country
        }

      } else {
        this.selectedCity = null
      }
    },
    changeStartDate (date) {
      let defaultDate = new Date(this.checkIn)
      defaultDate.setDate(this.checkIn.getDate() + 1)
      this.checkOut = defaultDate
    },
    formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    switchVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    authenticate () {
      this.isWelcome = false
      this.$store.dispatch('obtainToken', [this.email, this.password])
        .then((response) => {this.isAuthenticated = true})
        .catch((error) => {
          let errorData = error.response.data
          let errorMessage = 'Not authorized to access'

          if (errorData.hasOwnProperty('non_field_errors')) {
            errorMessage = errorData.non_field_errors
          }
          this.$toasted.global.traveler_error({ message : errorMessage })
          console.log(error)
        })
    },
    signup () {
      const payload = {
        'username': this.email,
        'email': this.email,
        'password': this.password
      }
      axios.post(process.env.usersUrl, payload)
        .then((response) => {
          this.$store.dispatch('obtainToken', [this.email, this.password]).then((response) => {})
        })
        .catch((error) => {
          let errorData = error.response.data
          let errorMessage = 'Unable to create user account'

          if (errorData.hasOwnProperty('non_field_errors')) {
            errorMessage = errorData.non_field_errors
          }
          this.$toasted.global.traveler_error({ message : errorMessage })
          console.log(error)
        })
    },
    onFbSignInSuccess (response) {
      console.log('fb response', response);
      let token = response.authResponse.accessToken

      axios.post(process.env.fbAuthUrl, {
        access_token: token
      })
        .then(response => {
          this.$store.commit('updateToken', response.data.token)
          FB.api('/me', fbResponse => {
            let avatarImgSrc = `http://graph.facebook.com/${fbResponse.id}/picture?type=normal`
            let user = Object.assign(response.data.user, {avatarImage: avatarImgSrc})
            this.$store.commit('setAuthUser', {authUser: user, isAuthenticated: true})
          })
        })
        .catch(error => {
          let errorData = error.response.data
          if (errorData.hasOwnProperty('non_field_errors')) {
            this.$toasted.global.traveler_error({ message : errorData.non_field_errors })
          }
          console.log(error)
        })
    },
    onFbSignInError (error) {
      console.log(error)
      this.$toasted.global.traveler_error({ message : 'Unable to sign in with Facebook' })
    },
    onGoogleSignInSuccess (response) {
      let token = response.Zi.access_token
      axios.post(process.env.googleAuthUrl, {
        access_token: token
      })
        .then(response => {
          this.$store.commit('updateToken', response.data.token)
          axios.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${token}`)
            .then(googleResponse => {
              let avatarUrl = googleResponse.data.image.url
              let user = Object.assign(response.data.user, {avatarImage: avatarUrl})
              this.$store.commit('setAuthUser', {authUser: user, isAuthenticated: true})
            })
        })
        .catch(error => {
          let errorData = error.response.data
          if (errorData.hasOwnProperty('non_field_errors')) {
            this.$toasted.global.traveler_error({ message : errorData.non_field_errors })
          }
          console.log(error)
        })
    },
    onGoogleSignInError (error) {
      console.log(error)
      this.$toasted.global.traveler_error({ message : 'Unable to sign in with Google' })
    },
    formatDisplay (obj) {
      var displayValue;
      var hotelString = 'Hotels'

      if (obj.country_code === 'US') {
        displayValue = '<span>' + obj.city + ', ' + obj.state_code + '</span>'
      } else {
        displayValue = obj.city + ', ' + obj.country
      }
      if (obj.hotel_count === 1) {
        hotelString = 'Hotel'
      }
      displayValue += '<span>' + obj.hotel_count + ' ' + hotelString + '</span>'

      return displayValue
    },
    searchByPriceline () {
      var resultUrl = `/city/${this.$refs.whereTo.selectedDisplayState.toLowerCase()}/${this.$refs.whereTo.selectedDisplay.toLowerCase()}?`

      if (this.selectedCity.country_code === 'US') {
        resultUrl += '&country_code=' + this.selectedCity.country_code
      }

      if (this.checkIn) {
        resultUrl += '&checkin=' + this.formatDate(this.checkIn) //.toLocaleDateString('en-US')
      }
      if (this.checkOut) {
        resultUrl += '&checkout=' + this.formatDate(this.checkOut) //.toLocaleDateString('en-US')
      }
      // if (this.selectedCity) {
      //   resultUrl += '&city_id=' + this.selectedCity.cityid_ppn
      // }
      if (this.numberOfGuests) {
        resultUrl += '&guests=' + this.numberOfGuests
      }
      window.open(resultUrl, '_blank');
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.state.account.isAuthenticated
    },
    showSignup () {
        return this.isSignup && !this.isAuthenticated
    },
    showLogin () {
        return this.isLogin && !this.isAuthenticated
    },
    showWelcome () {
        return this.isWelcome && !this.isAuthenticated
    },
    showSearchBar () {
      return this.$store.state.account.isAuthenticated && this.$route.query.findor !== 'true'
    }
  },
  components: {
    Autocomplete, 'password-reset-form': PassordResetForm
  },
  head() {
    return {
        title: `City Search | SmartStay.com`,
        meta: [
            {
                hid: 'description',
                name: 'description',
                content: 'city search',
            }
        ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import url(../assets/scss/landing.scss);
h1 {
    color:rgb(56, 56, 56);
}

.widget-wrapper {
  border-radius: .25em;
  background: #fff;
  border: 1px solid #eaeaea;
  max-width: 100%;
  width: 26em;
  position: absolute;
  left: 0;
  right: 0;
  top: 20px;
  margin: 0 auto;
  padding: 2em 2.3em 1.5em 2.3em;
}

.widget {
  &--header {
    padding-bottom: 10px;
    a {
      color: #1f8aea;
    }
    .mail-icon {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .lock-icon {
      position: absolute;
      top: 80px;
      right: 10px;
    }
  }
  &--main {
    border-top: 2px solid #f0f0f0;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 15px;
  }
  &--main.no-border {
    border: none;
    padding-bottom: 0;
  }
  &--footer {
    margin-top: 17px;
    a {
      font-weight: 600;
      color: #1f8aea;
    }
  }
}

.cell-title {
  display: block;
  margin-bottom: 10px;
  text-align: left;
}

input[type="submit"] {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 42px;
  background: #1f8aea;
  border: 1px solid rgba(18, 113, 195, 0.4);
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  transition: 0.1s ease;
  cursor: pointer;
}

input[type="submit"]:hover,
input[type="submit"]:focus {
  opacity: 0.8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: 0.1s ease;
}

input[type="submit"]:active {
  opacity: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: 0.1s ease;
}

.google-button {
  height: 42px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  color: #737373;
  border-radius: 5px;
  white-space: nowrap;
  box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, .02);
  transition-property: background-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  padding: 0;

  &:focus,
  &:hover {
    opacity: 0.8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    transition: 0.1s ease;
  }

  &:active {
    background-color: #e5e5e5;
    box-shadow: none;
    transition-duration: 10ms;
  }
}

button.social-signin {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  font-family: 'proxima-nova','Roboto',arial,sans-serif;
  transition: 0.2s ease;
}

button.social-signin:hover,
button.social-signin:focus {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: 0.2s ease;
}

button.social-signin:active {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: 0.2s ease;
}

button.social-signin.facebook {
  background: #4267B2;
}

.google-button-icon {
  display: inline-block;
  vertical-align: middle;
  margin: 8px 0 8px 8px;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
}

.google-button-text {
  display: inline-block;
  vertical-align: middle;
  padding: 0 16px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'proxima-nova','Roboto', arial, sans-serif;
}

.facebook-button-icon {
  display: inline-block;
  font-size: 28px;
  padding-top: 2px;
  vertical-align: middle;
  box-sizing: border-box;
}

.facebook-button-text {
  display: inline-block;
  vertical-align: middle;
  padding: 0 13px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'proxima-nova','Roboto', arial, sans-serif;
}

label.check {
    display: inline-block;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;
    color: #a1aebe;

    span {
      display: inline-block;
      position: relative;
      background-color: #dee5ed;
      width: 15px;
      height: 15px;
      transform-origin: center;
      border-radius: 50%;
      vertical-align: -3px;
      margin-right: 7px;
      transition: background-color 150ms 200ms, transform 350ms cubic-bezier(.78,-1.22,.17,1.89);

    &:before {
      content: "";
      width: 0px;
      height: 2px;
      border-radius: 2px;
      background: #1e8bea;
      position: absolute;
      transform: rotate(45deg);
      top: 8px;
      left: 5px;
      transition: width 50ms ease 50ms;
      transform-origin: 0% 0%;
    }

    &:after {
      content: "";
      width: 0;
      height: 2px;
      border-radius: 2px;
      background: #1e8bea;
      position: absolute;
      transform: rotate(305deg);
      top: 12px;
      left: 6px;
      transition: width 50ms ease;
      transform-origin: 0% 0%;
    }
  }

  &:hover {
    span {
      &:before {
        width: 5px;
        transition: width 100ms ease;
      }

      &:after {
        width: 10px;
        transition: width 150ms ease 100ms;
      }
    }
  }
}

input[type="checkbox"] {
    display: none;

  &:checked {
    + label {
      span {
        background-color: #fff;
        transform: scale(1.25);

        &:after {
          width: 10px;
          background: #1e8bea;
          transition: width 150ms ease 100ms;
        }

        &:before {
          width: 5px;
          background: #1e8bea;
          transition: width 150ms ease 100ms;
        }
      }

      &:hover {
        span {
          background-color: #fff;
          transform: scale(1.25);

          &:after {
            width: 10px;
            background: #1e8bea;
            transition: width 150ms ease 100ms;
          }

          &:before {
            width: 5px;
            background: #1e8bea;
            transition: width 150ms ease 100ms;
          }
        }
      }
    }
  }
}

input[type="text"],
input[type="password"] {
  display: block;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding: 15px;
  width: 100%;
  height: 40px;
  background: #fafbfd;
  color: #555;
  border: 1px solid #eff0f0;
  font-weight: 400;
  font-size: 14px;
  transition: 0.2s ease;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

input[id="login_email"],
input[id="signup_email"] {
  margin-bottom: 30px;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border: 1px solid #d4d5d7;
  color: #1e8bea;
  transition: 0.2s ease;
}

input[type="text"]::-moz-placeholder,
input[type="password"]::-moz-placeholder {
  color: #4e4e4e;
}

input[type="text"]:-ms-input-placeholder,
input[type="password"]:-ms-input-placeholder {
  color: #4e4e4e;
}

input[id="old_input_text"] {
  height: 100%;
}
input[id="old_input_text"]:focus {
  color: #555;
}

</style>

<style>
.mx-calendar, .mx-datepicker {
  font-family: "proxima-nova", Helvetica, Arial, sans-serif !important;
}
.mx-datepicker {
  width: 100% !important;
  margin-bottom: 20px;
}
.mx-input {
  height: 45px !important;
  padding: 15px !important;
  font-size: 15px !important;
  background-color: #fafbfd !important;
  border-color: #eff0f0 !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.mx-input-append {
  display: none;
  background-color: #fafbfd;
}
.mx-panel-date td, .mx-panel-date th {
  font-size: 13px !important;
}
input[name="check_in"] {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
input[name="check_out"] {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.autocomplete {
  margin-bottom: 20px;
}
.autocomplete__box, .autocomplete__inputs {
  padding: 0 !important;
}
.autocomplete__box {
  border: none !important;
  border-radius: 4px !important;
}
.autocomplete__inputs input[type="text"] {
  height: 45px;
  padding: 15px;
  color: #555;
  background-color: #fafbfd;
  border: 1px solid #eff0f0 !important;
  -webkit-border-radius: 4px !important;
  -moz-border-radius: 4px !important;
  border-radius: 4px !important;
}
.autocomplete__results {
  border-color: #eff0f0 !important;
  color: #73879c !important;
  font-size: 13px;
  text-align: left;
}
.autocomplete__results__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 15px !important;
}
.autocomplete__results__item span:last-of-type {
  font-size: 11px;
}
.autocomplete__icon {
  display: none;
}
.autocomplete--clear {
  display: inline;
  position: absolute;
  right: 12px;
  top: 14px;
}

</style>
