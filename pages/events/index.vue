<template>
  <main class="main events">
    <section class="events-top">
      <div class="events-top-bg-smart"></div>
      <div class="push-20"></div>
      <div class="push-45 hide@mobile"></div>
      <div class="container">
        <div class="width-800 contain-width block-align-center light">
          <div class="width-800 contain-width align-center@mobile block-align-center@mobile">
            <h1-w class="h1-w">Stay close to the action for less</h1-w>
            <div class="push-5"></div>
            <h2-w class="h2-w">Search for festivals, conferences, and sporting events.</h2-w>
            <div class="push-25"></div>
            <form class="input with-button is-large" name="search">
              <input type="text" name="search" v-bind="query" id="search-input">
              <button class="button is-large" type="submit">Search</button>
            </form>
            <div class="push-20"></div>
            <p class="color-text-light">Up to 60% off published rates</p>
          </div>
        </div>
      </div>
      <div class="push-60"></div>
    </section>
    <section class="events-list">
      <div class="push-50"></div>
      <div class="container">
        <div class="flex is-grid is-align-stretch h-gap-30 v-gap-30 is-3-columns is-2-columns@tablet is-1-column@mobile"
             id="events-list">
          <div class="template" v-for='event in eventsList' :key='event.id'>
            <div :class='{"is-past": event.is_past}' class="event-item size-small line-height-heading">
              <div class="event-item-header">
                <div class="event-item-image" :style='`background-image: url(${event.branding ? event.branding.banner : ""})`'>
                  <a :href='event.url' class='event-item-link' target="_blank"></a>
                </div>
                <div class="event-item-price" v-if='event.hotel_offer'>
                  <div>
                    <div class="event-item-price-label">From</div>
                    <div class="event-item-price-value">{{`$${exchange(event.hotel_offer)}`}}</div>
                  </div>
                </div>
              </div>
              <div class="event-item-body">
                <div class="push-18"></div>
                <div class="event-item-dates">{{event.start_date && event.end_date ?
                  event.start_date.toLocaleDateString("en-US", date_options) + " &ndash; " +
                  event.end_date.toLocaleDateString("en-US", date_options) : ''}}
                </div>
                <div class="event-item-name">{{event.name}}</div>
                <div class="event-item-location color-text-light">{{ `${event.location.address}, ${event.location.city}, ${event.location.country}` }}</div>
              </div>
              <div class="event-item-footer">
                <div class="push-20"></div>
                <ul class="flex is-align-justify is-align-bottom h-gap-10 v-gap-10">
                  <li>
                    <span @click="$store.commit('setBranding', event.branding)">
                      <router-link
                        :to='`/event/${event.short_name}`'
                        v-if='event.url'
                        class="event-item-view event-hotels-link cta-link color-brand uppercase letter-spacing">View
                        Hotels
                      </router-link>
                    </span>
                  </li>
                  <li>
                    <div class="event-item-category">{{event.category}}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="align-center">
          <div v-if="loading">
            <div class="push-40"></div>
            <h1 class="h3">Loading...</h1>
            <div class="push-40"></div>
          </div>
          <div style="display: none" v-if="!loading && eventsList.length === 0">
            <div class="push-40"></div>
            <h1 class="h3">No upcoming events yet.</h1>
            <div class="push-40"></div>
          </div>
        </div>
      </div>
      <div class="push-40"></div>
    </section>
    <section class="events-companies">
      <div class="container">
        <ul
          class="flex is-grid is-4-columns is-3-columns@small-laptop is-2-columns@medium-tablet is-1-column@mini-tablet">
          <li>
            <div class="event-company"><img src="../../assets/img/company-6.png" alt="Marriott" width="217" height="44">
            </div>
          </li>
          <li>
            <div class="event-company"><img src="../../assets/img/company-5.png" alt="Crowne Plaza" width="310"
                                            height="32"></div>
          </li>
          <li>
            <div class="event-company"><img src="../../assets/img/company-4.png" alt="Hilton" width="151" height="56">
            </div>
          </li>
          <li>
            <div class="event-company"><img src="../../assets/img/company-3.png" alt="W" width="87" height="72"></div>
          </li>
          <li>
            <div class="event-company"><img src="../../assets/img/company-2.png" alt="Ramada" width="169" height="61">
            </div>
          </li>
          <li>
            <div class="event-company"><img src="../../assets/img/company-7.png" alt="La Quinta" width="189"
                                            height="102"></div>
          </li>
          <li>
            <div class="event-company"><img src="../../assets/img/company-1.png" alt="Holiday Inn" width="243"
                                            height="53"></div>
          </li>
          <li>
            <div class="event-company"><img src="../../assets/img/company-8.png" alt="Sheraton" width="224" height="49">
            </div>
          </li>
        </ul>
      </div>
      <div class="push-40"></div>
    </section>
  </main>
</template>

<script>
  import $ from 'jquery'

  export default {
    head() {
      return {
        title: `Events | SmartStay.com`,
        meta: [{
          hid: 'description',
          name: 'description',
          content: 'Events'
        }]
      }
    },
    computed: {
      currency() {
        return this.$store.state.currency
      }
    },
    data() {
      return {
        query: '',
        loading: false,
        eventsList: [],
        date_options: {
          year: 'numeric',
          month: 'short',
          weekday: 'short',
          day: 'numeric'
        }
      }
    },
    methods: {
      exchange(value) {
        return parseInt(fx.convert(value, {from: 'USD', to: this.currency}))
      },
      processHotels(events) {
        let past_events = [];
        let future_events = [];
        let today = new Date();
        this.query = this.query || this.$route.query.search;
        for (let event of events) {
          let location = `${event.location.address}, ${event.location.city}, ${event.location.country}`.toLowerCase();
          let event_name = event.name ? event.name.toLowerCase() : '';
          if (this.query !== undefined && this.query !== "" && event_name.indexOf(this.query.toLowerCase()) === -1 && location.indexOf(this.query.toLowerCase()) === -1) {
              continue;
          }
          event.is_past = event.end_date < today;
          if (event.is_past) {
            past_events.push(event);
          } else {
            future_events.push(event);
          }
        }
        future_events.sort((a, b) => {
          return a.start_date - b.start_date;
        });
        past_events.sort((a, b) => {
          return b.start_date - a.start_date;
        });
        this.eventsList = future_events.concat(past_events);
      },
      displayHotels() {
        let that = this;
        $("form[name='search']").each(() => {
          let $form = $(this);
          let action = $form.attr("action");
          let $input = $form.find("input[name='search']");
          let $events_list = $("#events-list");
          let events_api_endpoint = `${process.env.baseUrl}festivals/`; //"https://api.findor.com/v2/festivals/"
          let hash_prefix = "#search=";
          that.query = that.query || that.$route.query.search;
          $('#search-input').val(that.query);

          let get_search_query = () => {
            let hash = window.location.hash;
            if (hash && hash.indexOf(hash_prefix) === 0) {
              return hash.replace(hash_prefix, "")
            }
            return ""
          };

          let search = (query, push_state) => {
            that.query = query;
            let hash = hash_prefix + query;
            if ($events_list.length === 0) {
              window.location.href = action + hash;
              return
            }
            if (push_state) {
              history.pushState({query: query}, "", hash);
            }
          };

          $form.submit((e) => {
            e.preventDefault();
            $input.blur();
            search($input.val(), true);
          });

          $(window).on("popstate", () => {
            search(get_search_query(), false);
          });

            that.loading = true;
            $.ajax({
              method: "GET",
              url: events_api_endpoint,
              dataType: "json",
            })
              .then((data) => {
                that.processHotels(data);
              })
              .always(() => {
                that.loading = false;
              });
            search(get_search_query(), false);
        })
      }
    },
    mounted() {
      this.displayHotels()
    },
    watch: {
      'currency'() {
        this.displayHotels()
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import url(../../assets/scss/landing.scss);
</style>
