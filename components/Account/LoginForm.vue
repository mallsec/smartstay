<template>
  <transition name="modal">
    <div class="modal-mask">
      <script src="https://apis.google.com/js/platform.js" async defer></script>
      <div @click.self="closeModal()" class="modal-wrapper">
        <div id="login-form">
          <div class="left">

            <div class="tabs">
              <ul>
                <li :class="{ 'is-active': isLogin }"><a href="#" @click="isLogin = true">Login</a></li>
                <li :class="{ 'is-active': !isLogin }"><a href="#" @click="isLogin = false">Sign up</a></li>
              </ul>
            </div>

            <template v-if='isLogin'>
              <form>
                <h1>Log in to your account</h1>
                <label for="login_email" class="cell-title">Email</label>
                <input type="text" name="email" id="login_email" v-model="email" placeholder="john@example.com" />
                <label for="login_password" class="cell-title">Password</label>
                <input type="password" name="password" id="login_password" v-model="password" placeholder="+++++++++++" />
                <input type="checkbox" id="check" name="check" value="" />
                <label for="check" class="check">
                  <span><!-- This span is needed to create the "checkbox" element --></span>Remember me
                </label>
                <input @click.prevent="authenticate" type="submit" name="login_submit" value="Login" />
              </form>
            </template>

            <template v-else>
              <form>
                <h1>Create your account</h1>
                <label for="signup_email" class="cell-title">Email</label>
                <input type="text" name="email" id="signup_email" v-model="email" placeholder="john@example.com" />
                <label for="signup_password" class="cell-title">Password</label>
                <input type="password" name="password" id="signup_password" v-model="password" placeholder="+++++++++++" />
                <label for="signup_password2" class="cell-title">Retype password</label>
                <input type="password" name="password2" id="signup_password2" v-model="password2" placeholder="+++++++++++" />
                <input @click.prevent="signup" type="submit" name="signup_submit" value="Sign up" />
              </form>
            </template>

          </div>

          <div v-show="false" class="right">
            <span class="loginwith">Sign in with</span>
            <button type="button" class="google-button">
              <span class="google-button-icon">
                <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg"><path d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z" id="Shape" fill="#EA4335"/><path d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z" id="Shape" fill="#FBBC05"/><path d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z" id="Shape" fill="#4285F4"/><path d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z" fill="#34A853"/></svg>
              </span>
              <span class="google-button-text">Sign in with Google</span>
            </button>

            <button class="social-signin facebook">
              <span class="facebook-button-icon">
                <f-a :icon="['fab', 'facebook']" />
              </span>
              <span class="facebook-button-text">Login with Facebook</span>
            </button>

          </div>
          <div v-show="false" class="or">OR</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
export default {
  data() {
     return {
        isLogin: true,
        email: null,
        password: null,
        password2: null
     }
  },
  methods: {
    closeModal(event) {
      this.$emit('close')
    },
    authenticate () {
      this.$store.dispatch('obtainToken', [this.email, this.password])
        .then((response) => {
          this.closeModal()
        })
        .catch((error) => {
          this.$toasted.global.traveler_error({ message : 'Not authorized to access' })
        })
    },
    signup () {
      const payload = {
        'email': this.email,
        'password': this.password
      }
      axios.post(process.env.usersUrl, payload)
        .then((response) => {
          this.$store.dispatch('obtainToken', [this.email, this.password]).then((response) => {
            this.closeModal()
          })
        })
        .catch((error) => {
          console.log(error)
          this.$toasted.global.traveler_error({ message : 'Unable to create user account' })
        })
      }
  }
}
</script>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300ita‌​lic,400italic,500,500italic,700,700italic,900italic,900);

.modal-mask {
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

 #login-form {
  position: relative;
  margin: 5% auto;
  width: 300px;
  height: 440px;
  background: #FFF;
  font-family: Avenir, sans-serif;
  border-radius: .25rem;
}

.left {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 40px;
  width: 300px;
  height: 400px;
}

h1 {
  margin: 20px 0 5px 0;
  font-weight: 300;
  font-size: 21px;
  color: #343434;
}

input[type="text"],
input[type="password"] {
  display: block;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 4px;
  width: 220px;
  height: 30px;
  background: #fff;
  border: none;
  border-bottom: 1px solid #AAA;
  font-weight: 400;
  font-size: 14px;
  transition: 0.2s ease;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-bottom: 2px solid #1e8bea;
  color: #1e8bea;
  transition: 0.2s ease;
}

input[type="text"]::-moz-placeholder,
input[type="password"]::-moz-placeholder {
  color: #ccc;
}

input[type="text"]:-ms-input-placeholder,
input[type="password"]:-ms-input-placeholder {
  color: #ccc;
}

input[type="submit"] {
  margin-top: 10px;
  width: 120px;
  height: 37px;
  background: #1e8bea;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: 500;
  font-size: 15px;
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

.cell-title {
  color: #888;
  font-size: .6em;
  font-weight: 500;
  letter-spacing: .15rem;
  text-transform: uppercase;
}

.or {
  position: absolute;
  top: 198px;
  left: 280px;
  width: 40px;
  height: 40px;
  background: #DDD;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  line-height: 44px;
  text-align: center;
}

.right {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  padding: 40px;
  width: 300px;
  height: 440px;
  border-left: 2px solid #eeeeee;
  background: #f7f7f7;
  border-radius: 0 2px 2px 0;
  text-align: center;
}

.right .loginwith {
  display: block;
  margin-bottom: 85px;
  font-size: 28px;
  color: #343434;
  text-align: center;
}

button.social-signin {
  margin-bottom: 20px;
  width: 200px;
  height: 40px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  font-family: 'Roboto',arial,sans-serif;
  transition: 0.2s ease;
  cursor: pointer;
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

.google-button {
  margin-bottom: 20px;
  height: 40px;
  border-width: 0;
  background: white;
  color: #737373;
  border-radius: 5px;
  white-space: nowrap;
  box-shadow: 1px 1px 0px 1px rgba(0, 0, 0, .05);
  transition-property: background-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
  padding: 0;

  &:focus,
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    transition: 0.2s ease;
  }

  &:active {
    background-color: #e5e5e5;
    box-shadow: none;
    transition-duration: 10ms;
  }
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
  padding: 0 24px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', arial, sans-serif;
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
  font-family: 'Roboto', arial, sans-serif;
}

.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabs ul {
  padding: 0;
  display: flex;
}

.tabs li {
  display: block;
}

.tabs li.is-active a {
  border-bottom-color: #1e8bea;
  color: #1e8bea;
}

.tabs a {
  border-bottom: 2px solid #dbdbdb;
  padding: .5em 2em;
  font-size: .8em;
  letter-spacing: .1rem;
  text-transform: uppercase;
}

label.check {
    display: inline-block;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;

    span {
      display: inline-block;
      position: relative;
      background-color: transparent;
      width: 25px;
      height: 25px;
      transform-origin: center;
      border: 2px solid #1e8bea;
      border-radius: 50%;
      vertical-align: -6px;
      margin-right: 10px;
      transition: background-color 150ms 200ms, transform 350ms cubic-bezier(.78,-1.22,.17,1.89);

    &:before {
      content: "";
      width: 0px;
      height: 2px;
      border-radius: 2px;
      background: #1e8bea;
      position: absolute;
      transform: rotate(45deg);
      top: 12px;
      left: 8px;
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
      top: 15px;
      left: 9px;
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

</style>
