<template>
  <div class="widget-wrapper">
    <div class="widget--header">
      <form>
        <input type="text" name="email" id="login_email" v-model="email"
               placeholder="Email address"/>
        <span class="mail-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18px"
                                 height="18px" viewBox="0 0 512 512"
                                 enable-background="new 0 0 512 512"><path
                              d="M0,64v384h512V64H0z M455.438,96L256,266.938L56.578,96H455.438z M32,416V117.063l224,192l224-192V416H32z"
                              fill="#a1aebe"/>
                            </svg>
                        </span>
        <input @click.prevent="sendResetEmail" type="submit"
               value="Send email"/>
      </form>
    </div>
    <div class="widget--main" v-if="emailError !== null">
      <div v-if="!emailError">
        Check your inbox for a link to reset your password. If an email doesn't
        appear within a few
        minutes, check your spam folder.
      </div>
      <div v-else>
        A error occured while processing your request.
      </div>

      <a href="/" class="text-xs">
        return to login page
      </a>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import Autocomplete from 'vuejs-auto-complete';
  import axios from 'axios';

  export default {
    data() {
      return {
        email: null,
        emailError: null,
      };
    },
    methods: {
      sendResetEmail() {
        axios.post(process.env.resetPassword, {email: this.email})
          .then(data => this.emailError = false)
          .catch(error => {
            this.emailError = true;
          });
      }
    },
    components: {
      Autocomplete
    }
  };
</script>


<style lang="scss">
  h1 {
    color: rgb(56, 56, 56);
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
      margin-top: 15px;
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

  input[type="text"] {
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

  input[type="text"]:focus {
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

  .autocomplete__results__item span:last-of-type {
    font-size: 11px;
  }
</style>
