<template>
<div>
    <Loader v-if='!isLoaded' :load='!isLoaded'/>
    <no-ssr>
        <vue-gallery ref='lightbox' v-show='showGallery' :images='imgUrls'  @closeLightBox='showGallery = false'></vue-gallery>
    </no-ssr>
    <section
        v-if="!getDirections"
        class="min-h-60 bg-cover bg-center topSection"
        :style="{'background-image': `url('${mainPhoto.main_photo}')`}">
        <div style="padding-bottom: 28.32%;"></div>
        <div
            @click="showGallery = true; openImage()"
            class="absolute pin">
            <div class="container h-full">
                <div class="h-full">
                    <div
                        class="absolute pin-l pin-b mb-5 md:mb-7 flex justify-center items-center w-33 h-21 border-2 sm:w-44 sm:h-28 sm:border-3 border-white bg-cover bg-center text-heading sm:text-heading-lg text-whiteish hover:text-primary transition-color"
                        :style="{'background-image': `url('${roomPhoto.thumbnail_photo}')`}">
                            <span class="far fa-play-circle"></span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="hotel.most_booked_highlight" class="absolute pin-x pin-t bg-gray-dark-50 text-whiteish text-center">
            <div class="container flex justify-center items-center min-h-12">
                <span style="top: 1px;">Most booked hotel for Something Wicked</span>
            </div>
        </div>
    </section>
    <section class="sm:text-gray-dark border-bottom">
        <div class="container sm:flex items-center">
            <h1 class="min-w-0 text-heading md:text-heading-md leading-tight ellipsis">
                <span style="top: 1px;" class="event-name">{{ hotel.name }}</span>
                <span class="stars">
                    <template v-if='hotel.stars'>
                        <svg v-for='star in Number(hotel.stars)' :key='star' viewBox="0 0 60 60" width="24px" height="24px">
                            <path d="M10.2,48.6c-0.2,0-0.4-0.1-0.6-0.2c-0.3-0.2-0.5-0.7-0.4-1.1l4.4-16.4L0.4,20.2C0,20-0.1,19.5,0,19.1 c0.1-0.4,0.5-0.7,0.9-0.7l17-0.9l6.1-15.9C24.2,1.3,24.6,1,25,1c0.4,0,0.8,0.3,0.9,0.6l6.1,15.9l17,0.9c0.4,0,0.8,0.3,0.9,0.7 c0.1,0.4,0,0.8-0.3,1.1L36.4,30.9l4.4,16.4c0.1,0.4,0,0.8-0.4,1.1c-0.3,0.2-0.8,0.3-1.1,0L25,39.2l-14.3,9.2 C10.5,48.6,10.4,48.6,10.2,48.6z"/>
                        </svg>
                        <svg v-if='hotel.half_star'  viewBox="7 2 24 24" version="1.1" width="24px" height="24px">
                            <path style=" " d="M 16 2 L 13.1875 8.625 L 6 9.25 L 11.4375 13.96875 L 9.8125 21 L 16 17.28125 Z "/>
                        </svg>
                    </template>
                </span>
            </h1>
            <div class="z-100 sm:z-0 fixed pin-l pin-b sm:relative w-full sm:w-auto sm:ml-5 sm:flex justify-end items-center min-w-0 flex-grow">
                    <div class="hidden sm:block md:text-lg whitespace-no-wrap " style='font-weight: 300; font-size: 1.7rem;' v-if='rate'>
                        ${{exchange(rate)}}
                    </div>
                <div class="sm:ml-5 min-w-0 sm:max-w-65 flex-grow flex-no-shrink">
                    <button v-if="hotel.rooms.length > 0" @click="openModal" class="w-100 group flex justify-center items-center h-13 sm:h-11 px-4 sm:border border-black-20 sm:rounded bg-primary text-white" data-id="open-modal">
                        <div class="absolute pin bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <div class="truncate" style='font-size: 16px; font-weight: 500;'>
                            Choose room <span class="sm:hidden">${{exchange(rate)}}</span>
                        </div>
                    </button>
                    <span v-else class="group h-13 sm:h-11 px-4">

                    </span>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-alternate text-whiteish" v-if="hotel && getDirections">
        <div class="flex flex-wrap hotel-details mx-auto min-h-50rem">
            <div v-if="hotel.location.latitude_longitude[0]" class="flex flex-col justify-between w-full px-container md:px-container-md py-6 md:py-8">
                <div class="absolute pin" data-id="map1" >
                    <gmap-map
                        ref='map1'
                        :center="{lat:hotel.location.latitude_longitude[0], lng: hotel.location.latitude_longitude[1] }"
                        :zoom="11"
                        :draggable="false"
                        :options='{scrollwheel: false, fullscreenControl: false, mapTypeControl: false, gestureHandling: "none"}'
                        style="width: 110%; height: 110%">
                    </gmap-map>
                  </div>

                  <div class="flex-no-shrink">
                      <h2 class="text-heading-sm leading-tight">
                      </h2>
                      <div class="mt-3 -mb-3">
                          <div class="mb-3 flex items-center">
                              <div class="hotel_amenity_icon_wrap">
                              </div>
                              <div>
                                <a v-on:click="hideMapDirections()"
                                   class="text-primary hover:opacity-80 transition-opacity hide-map">
                                    Hide map
                                </a>
                              </div>
                          </div>
                      </div>
                  </div>
            </div>
        </div>
    </section>

    <section class="bg-alternate text-whiteish" v-if="hotel && !getDirections">
        <div class="flex flex-wrap hotel-details max-w-container mx-auto border border-black-20">
            <div class="w-full md:w-1/2 px-container md:px-container-md pt-6 pb-7 md:pt-8 md:pb-9 border border-black-20">
                <h2 class="text-heading-sm leading-tight" v-if="discount && isFinite(discount)">
                    {{discount === 100 ? 'Sorry, sold out.' : `You save ${discount}%`}}
                </h2>
                <p class="mt-1 text-xs">
                    This hotel offers a special rate for {{event.name}} guests.
                </p>
                <div class="overflow-hidden rates">
                    <div class="mt-4 -mr-8 -mb-1 sm:flex flex-wrap text-xl" role='button'>
                        <div
                        @click="openModal"
                        class="mr-8 mb-1 flex items-center flex-no-shrink" v-if='rate'>
                            <div class="mr-3 w-4 h-4 rounded-full bg-primary"></div>
                            <span class="fal fa-hand-point-right" style="top: -2px;"></span>
                            <img style='max-height: 13px' :src="logo" alt="">
                            <span class="text-white show-mb" :style='`background: ${event.branding ? event.branding.alternate_color_2 : ""};`'></span>
                            <div class="ml-2">
                                <span style="top: 1px;">${{exchange(rate)}}</span>
                            </div>
                        </div>
                        <a :href='hotel.expedia_url' v-if="hotel.expedia_sug_rate !== ''" target='_blank' class="mr-8 mb-1 flex items-center flex-no-shrink transition-opacity">
                            <img src="~/static/images/logo-expedia.png" width="70" height="21" alt="Expedia">
                            <div class="ml-2">
                                <span style="top: 1px;">${{exchange(hotel.expedia_sug_rate)}}</span>
                            </div>
                        </a>
                        <a :href='hotel.booking_url' v-if="hotel.booking_com_sug_rate !== ''" target='_blank' class="mr-8 mb-1 flex items-center flex-no-shrink transition-opacity">
                            <img src="~/static/images/logo-bookingcom.png" width="95" height="16" alt="Booking.com">
                            <div class="ml-2">
                                <span style="top: 1px;">${{exchange(hotel.booking_com_sug_rate)}}</span>
                            </div>
                        </a>
                    </div>
                </div>
                <h3 class="mt-4 font-medium">
                    {{ hotel.description_header }}
                </h3>
                <p class="text-xs">
                    {{ hotel.description_body }}
                </p>
            </div>
            <div v-if='hotel.location' class="flex flex-col justify-between w-full md:w-1/2 px-container md:px-container-md py-6 md:py-8 border border-black-20">
                <div class="absolute pin" data-id="map" >
                    <gmap-map
                        ref='map'
                        :center="{lat: hotel.location.latitude_longitude[0], lng: hotel.location.latitude_longitude[1]}"
                        :zoom="11"
                        :draggable="false"
                        :options='{styles: styles, scrollwheel: false, fullscreenControl: false, mapTypeControl: false, gestureHandling: "none"}'
                        style="width: 100%; height: 100%">
                    </gmap-map>
                </div>
                <div class="flex-no-shrink" v-if='hotel.uber_estimate && hotel.uber_estimate.prices.length > 0'>
                    <h2 class="text-heading-sm leading-tight">
                        {{`${(hotel.uber_estimate.prices[0].distance * ($store.state.currency === 'CAD' ? 1.6 : 1)).toFixed(2)} ${$store.state.currency === 'CAD' ? 'km' : 'miles'}`}} away
                    </h2>
                    <div class="mt-3 -mb-3">
                        <div class="mb-3 flex items-center">
                            <div class="mr-3 flex justify-center items-center w-7 flex-no-shrink h-6 text-xl">
                                <f-a icon="bus" style="top: -1px;" />
                            </div>
                            <div>
                                <span style="top: 1px;">{{hotel.uber_estimate.prices[0].duration / 60}} minutes away</span>
                            </div>
                        </div>
                        <div class="mb-3 flex items-center" v-if='uberPrices'>
                            <div class="mr-3 flex justify-center items-center w-7 flex-no-shrink h-6 text-xl">
                                    <f-a icon="car" style="top: -1px;" />
                            </div>
                            <div>
                                <span style="top: 1px;">
                                    ${{ uberPrices.min }}-{{uberPrices.max}} Uber Ride
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-10 flex-no-shrink overflow-hidden">
                    <div class="-mr-4 -mb-2 flex flex-wrap text-xs">
                        <div class="mr-4 mb-2 flex">
                            <div class="mr-1 flex justify-center items-center w-4 flex-no-shrink h-4">
                                <f-a icon="map-marker" />
                            </div>
                            <div>
                                {{ hotel.location.address }}, {{ hotel.location.country }} <br>
                                <a
                                    v-on:click="handleGetMapDirections()"
                                    class="text-primary hover:opacity-80 transition-opacity">
                                        How to get there
                                </a>
                            </div>
                        </div>
                        <div class="mr-4 mb-2 flex">
                            <div class="mr-1 flex justify-center items-center w-4 flex-no-shrink h-4">
                                <f-a icon="phone" />
                            </div>
                            <div>
                                {{ hotel.phone }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full md:w-1/2 px-container md:px-container-md py-6 md:py-8 border border-black-20">
                <h2 class="text-heading-sm leading-tight">
                    Need to know
                </h2>
                <p class="mt-1 text-xs">
                    Check in at 3pm, Check out at 12pm. Included amenities:
                </p>
                <div class="mt-4 -mb-3 sm:column-count-2">

                    <div class="hotel_amenity" v-if='hotel.total_number_rooms'>
                        <div class="hotel_amenity_icon_wrap">
                            <svg viewBox="0 0 30 30" width="24px" height="24px">
                                <path fill='#fff' d="M 5 4 C 3.895 4 3 4.895 3 6 L 3 13 L 5 13 L 5 11 C 5 10.448 5.448 10 6 10 L 13 10 C 13.552 10 14 10.448 14 11 L 14 13 L 16 13 L 16 11 C 16 10.448 16.448 10 17 10 L 24 10 C 24.552 10 25 10.448 25 11 L 25 13 L 27 13 L 27 6 C 27 4.895 26.105 4 25 4 L 5 4 z M 1.984375 13.986328 A 1.0001 1.0001 0 0 0 1 15 L 1 26 A 1.0001 1.0001 0 1 0 3 26 L 3 25 L 27 25 L 27 26 A 1.0001 1.0001 0 1 0 29 26 L 29 15 A 1.0001 1.0001 0 0 0 27.984375 13.986328 A 1.0001 1.0001 0 0 0 27 15 L 3 15 A 1.0001 1.0001 0 0 0 1.984375 13.986328 z"/>
                            </svg>
                        </div>
                        <span class="hotel_amenity_text">{{ hotel.total_number_rooms }} rooms</span>
                    </div>

                    <div class="hotel_amenity" v-if='hotel.wifi_cost'>
                        <div class="hotel_amenity_icon_wrap">
                                <svg  viewBox="0 0 50 50" version="1.1" width="24px" height="24px">
                                    <path style="fill: #fff" d="M 25 7 C 15.941406 7 7.339844 10.472656 0.78125 16.773438 L 0.0625 17.464844 L 5.59375 23.230469 L 6.320313 22.539063 C 11.378906 17.679688 18.015625 15 25 15 C 31.984375 15 38.621094 17.679688 43.683594 22.539063 L 44.40625 23.230469 L 49.941406 17.464844 L 49.21875 16.769531 C 42.660156 10.46875 34.058594 7 25 7 Z M 25 19 C 19.046875 19 13.394531 21.28125 9.085938 25.421875 L 8.363281 26.113281 L 13.921875 31.90625 L 14.644531 31.210938 C 17.464844 28.496094 21.144531 27 25 27 C 28.855469 27 32.535156 28.496094 35.355469 31.210938 L 36.078125 31.90625 L 41.636719 26.113281 L 40.917969 25.421875 C 36.605469 21.28125 30.953125 19 25 19 Z M 25 31 C 22.15625 31 19.453125 32.089844 17.390625 34.074219 L 16.671875 34.765625 L 25 43.441406 L 33.328125 34.765625 L 32.609375 34.074219 C 30.546875 32.089844 27.84375 31 25 31 Z "/>
                                </svg>
                        </div>
                        <span class="hotel_amenity_text">{{Number(hotel.wifi_cost) === 0 ? 'Free Wifi Internet' : `Internet access is $${exchange(hotel.wifi_cost)}`}}</span>
                    </div>

                    <div class="hotel_amenity" v-if='hotel.valet_parking_cost'>
                        <div class="hotel_amenity_icon_wrap">
                            <f-a icon="key" style="top: -1px;" />
                        </div>
                        <span class="hotel_amenity_text">Valet parking is {{Number(hotel.valet_parking_cost) > 0 ? `$${exchange(hotel.valet_parking_cost)}` : 'free'}}</span>
                    </div>


                    <div class="hotel_amenity" v-if='hotel.self_parking_cost'>
                        <div class="hotel_amenity_icon_wrap">
                            <svg  viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
                            <path style="fill: #fff" d="M 20.175781 4.367188 C 19.902344 3.550781 19.140625 3 18.277344 3 L 5.722656 3 C 4.859375 3 4.097656 3.550781 3.824219 4.367188 L 2 9.839844 L 2 20 C 2 20.550781 2.449219 21 3 21 L 5 21 C 5.550781 21 6 20.550781 6 20 L 6 18 L 18 18 L 18 20 C 18 20.550781 18.449219 21 19 21 L 21 21 C 21.550781 21 22 20.550781 22 20 L 22 9.839844 Z M 5.5 15 C 4.671875 15 4 14.328125 4 13.5 C 4 12.671875 4.671875 12 5.5 12 C 6.328125 12 7 12.671875 7 13.5 C 7 14.328125 6.328125 15 5.5 15 Z M 18.5 15 C 17.671875 15 17 14.328125 17 13.5 C 17 12.671875 17.671875 12 18.5 12 C 19.328125 12 20 12.671875 20 13.5 C 20 14.328125 19.328125 15 18.5 15 Z M 4.054688 10 L 5.722656 5 L 18.28125 5 L 19.945313 10 Z "/>
                            </svg>
                        </div>

                        <span class="hotel_amenity_text">{{Number(hotel.self_parking_cost) === 0 ? 'Free self parking' : `Self parking cost $${exchange(hotel.self_parking_cost)}`}}</span>
                    </div>



                    <div class="hotel_amenity">
                        <div class="hotel_amenity_icon_wrap">
                            <svg  viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
                            <path style="fill: #fff" d="M 6 5 L 6 19 L 9 19 L 9 14 L 15 14 L 15 19 L 18 19 L 18 5 L 15 5 L 15 10 L 9 10 L 9 5 Z M 3 6 L 3 10 L 2 10 L 2 14 L 3 14 L 3 18 L 5 18 L 5 6 Z M 19 6 L 19 18 L 21 18 L 21 14 L 22 14 L 22 10 L 21 10 L 21 6 Z "/>
                            </svg>
                        </div>

                        <span class="hotel_amenity_text">{{hotel.gym_type | toCapitalize}} Gym</span>

                    </div>
                    <div class="hotel_amenity" v-if='hotel.pet_fee'>
                        <div class="hotel_amenity_icon_wrap">
                            <f-a icon="paw" style="top: -1px;" />
                        </div>
                        <div>
                            <span style="top: 1px;">{{Number(hotel.pet_fee) === 0 ? 'Pets accepted' : `Pets fee $${exchange(hotel.pet_fee)}/day`}}</span>
                        </div>
                    </div>
                    <div class="hotel_amenity">
                        <div class="hotel_amenity_icon_wrap">
                            <svg  viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
                                <path style="fill: #fff" d="M 12 4 C 9.789063 4 8 5.789063 8 8 C 8 10.210938 9.789063 12 12 12 C 14.210938 12 16 10.210938 16 8 C 16 5.789063 14.210938 4 12 4 Z M 12 14 C 5.898438 14 4 18 4 18 L 4 20 L 20 20 L 20 18 C 20 18 18.101563 14 12 14 Z "/>
                            </svg>
                        </div>
                        <span class="hotel_amenity_text">Minimum age {{hotel.minimum_age}}+</span>
                    </div>

                    <div class="hotel_amenity" v-if='hotel.average_room_size'>
                        <span class="hotel_amenity_text">Avg. room size  {{hotel.average_room_size}}sqFT</span>
                    </div>

                    <div class="hotel_amenity">
                        <div class="hotel_amenity_icon_wrap">
                            <svg  viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
                                <path style="fill: #fff" d="M 4.5 3 C 4.238281 4.109375 3.191406 5 2 5 L 2 7 C 3.050781 7 3.898438 6.605469 4.5 6.15625 C 5.089844 6.605469 5.941406 7 7 7 C 8.058594 7 8.898438 6.605469 9.5 6.15625 C 10.101563 6.605469 10.941406 7 12 7 C 13.058594 7 13.898438 6.605469 14.5 6.15625 C 15.101563 6.605469 15.941406 7 17 7 C 18.058594 7 18.910156 6.605469 19.5 6.15625 C 20.101563 6.605469 20.949219 7 22 7 L 22 5 C 20.820313 5 19.761719 4.101563 19.5 3 C 19.21875 4.070313 18.160156 5 17 5 C 15.800781 5 14.738281 4.128906 14.5 3 C 14.261719 4.128906 13.199219 5 12 5 C 10.800781 5 9.738281 4.128906 9.5 3 C 9.261719 4.128906 8.199219 5 7 5 C 5.800781 5 4.738281 4.140625 4.5 3 Z M 4.5 10 C 4.238281 11.109375 3.191406 12 2 12 L 2 14 C 3.050781 14 3.898438 13.605469 4.5 13.15625 C 5.089844 13.605469 5.941406 14 7 14 C 8.058594 14 8.898438 13.605469 9.5 13.15625 C 10.101563 13.605469 10.941406 14 12 14 C 13.058594 14 13.898438 13.605469 14.5 13.15625 C 15.101563 13.605469 15.941406 14 17 14 C 18.058594 14 18.910156 13.605469 19.5 13.15625 C 20.101563 13.605469 20.949219 14 22 14 L 22 12 C 20.820313 12 19.761719 11.101563 19.5 10 C 19.21875 11.070313 18.160156 12 17 12 C 15.800781 12 14.738281 11.128906 14.5 10 C 14.261719 11.128906 13.199219 12 12 12 C 10.800781 12 9.738281 11.128906 9.5 10 C 9.261719 11.128906 8.199219 12 7 12 C 5.800781 12 4.738281 11.140625 4.5 10 Z M 4.5 17 C 4.238281 18.109375 3.191406 19 2 19 L 2 21 C 3.050781 21 3.898438 20.605469 4.5 20.15625 C 5.089844 20.605469 5.941406 21 7 21 C 8.058594 21 8.898438 20.605469 9.5 20.15625 C 10.101563 20.605469 10.941406 21 12 21 C 13.058594 21 13.898438 20.605469 14.5 20.15625 C 15.101563 20.605469 15.941406 21 17 21 C 18.058594 21 18.910156 20.605469 19.5 20.15625 C 20.101563 20.605469 20.949219 21 22 21 L 22 19 C 20.820313 19 19.761719 18.101563 19.5 17 C 19.21875 18.070313 18.160156 19 17 19 C 15.800781 19 14.738281 18.128906 14.5 17 C 14.261719 18.128906 13.199219 19 12 19 C 10.800781 19 9.738281 18.128906 9.5 17 C 9.261719 18.128906 8.199219 19 7 19 C 5.800781 19 4.738281 18.140625 4.5 17 Z "/>
                            </svg>
                        </div>
                        <span class="hotel_amenity_text">Big {{hotel.pool_type}} pool</span>

                    </div>

                    <div class="hotel_amenity" v-if='hotel.breakfast'>
                        <div class="hotel_amenity_icon_wrap">
                            <svg  viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
                                <path style="fill: #fff" d="M 11 2 C 11 3.277344 10.78125 3.28125 10.28125 3.78125 C 9.78125 4.28125 9 5.277344 9 7 L 11 7 C 11 5.722656 11.21875 5.71875 11.71875 5.21875 C 12.21875 4.71875 13 3.722656 13 2 Z M 14.6875 3 C 14.6875 5.398438 13 5.398438 13 7 L 15 7 C 15 5.5 16.6875 5.699219 16.6875 3 Z M 5 8 L 5 14 C 5 16.199219 6.800781 18 9 18 L 15 18 C 16.902344 18 18.472656 16.660156 18.875 14.875 C 20.664063 14.476563 22 12.910156 22 11 L 22 10 C 22 9.476563 21.816406 8.941406 21.4375 8.5625 C 21.058594 8.183594 20.523438 8 20 8 Z M 19 10 L 20 10 L 20 11 C 20 11.808594 19.613281 12.429688 19 12.75 Z M 2 19 C 2 20.699219 3.300781 22 5 22 L 19 22 C 20.699219 22 22 20.699219 22 19 Z "/>
                            </svg>
                        </div>
                        <span class="hotel_amenity_text">{{Number(hotel.breakfast) === 0 ? 'Yay! Complimentary breakfast' : `Breakfast costs $${hotel.breakfast}`}}</span>
                    </div>

                    <div class="hotel_amenity" v-if='hotel.bathroom_product_brand'>
                        <div>
                            <span style="top: 1px;">Toiletry by {{hotel.bathroom_product_brand}}</span>
                        </div>
                    </div>
                    <div class="hotel_amenity">
                        <div class="hotel_amenity_icon_wrap">
                            <svg viewBox="0 0 30 30" width="24px" height="24px">
                                <path style='fill: #fff' d="M 7 3 C 5.895 3 5 3.895 5 5 L 5 12 L 25 12 L 25 5 C 25 3.895 24.105 3 23 3 L 7 3 z M 8 6 C 8.552 6 9 6.448 9 7 L 9 9 C 9 9.552 8.552 10 8 10 C 7.448 10 7 9.552 7 9 L 7 7 C 7 6.448 7.448 6 8 6 z M 5 14 L 5 25 C 5 26.105 5.895 27 7 27 C 7 27.552 7.448 28 8 28 C 8.552 28 9 27.552 9 27 L 21 27 C 21 27.552 21.448 28 22 28 C 22.552 28 23 27.552 23 27 C 24.105 27 25 26.105 25 25 L 25 14 L 5 14 z M 8 16 C 8.552 16 9 16.448 9 17 L 9 21 C 9 21.552 8.552 22 8 22 C 7.448 22 7 21.552 7 21 L 7 17 C 7 16.448 7.448 16 8 16 z"/>
                            </svg>
                        </div>
                        <span class="hotel_amenity_text">{{hotel.minibar ? "Yes! Minibar." : 'No minibar'}}</span>
                    </div>
                </div>
                <div class="mt-4 -mb-3 sm:column-count-2">
                    <div class="hotel_amenity" v-for="(amenity, index) in getAmenities(hotel.amenities)" :key="index">
                        <div class="hotel_amenity_icon_wrap">
                          <img :src="getIconUrl(amenity.icon)" alt="">
                        </div>
                        <span class="hotel_amenity_text">{{amenity.name}}</span>
                    </div>
                    <div v-if="show_all === false"><a @click="show_all = true">Show all</a></div>
                </div>
            </div>
            <div v-if='hotel.tripadvisor_reviews_count' class="w-full md:w-1/2 px-container md:px-container-md py-6 md:py-8 border border-black-20">
                <h2 class="text-heading-sm leading-tight">
                    Reviews
                </h2>
                <div class="mt-1 flex flex-wrap sm:flex-no-wrap justify-between text-xs">
                    <div class="mr-3 mb-1 w-full sm:w-auto order-1 sm:order-0 truncate">
                        {{ hotel.tripadvisor_reviews_count }} Travelers say {{ hotel.tripadvisor_review_keyword || 'Excellent' }}
                    </div>
                    <a :href="hotel.tripadvisor_url" target="_blank" class="mb-1 flex w-full sm:w-auto">
                        <div class="truncate">
                            Based on bookings with us.
                        </div>
                    </a>
                </div>
                <div class="mt-2 mb-4 h-1px bg-black-20"></div>
                <div class="flex">
                    <easy-slider v-if='reviews.length > 0' :auto='false' width='100%' height='140px' :control-btn='false'>
                        <easy-slider-item v-for="(review, index) in reviews" :key="index" >
                            <div class="mr-4 flex justify-center items-center w-10 flex-no-shrink h-10 rounded-full bg-whiteish text-xl text-alternate">
                                <span style="top: 0px;">{{review.initials}}</span>
                            </div>
                            <div class="pt-1">
                                <div class="text-xl">
                                    {{review.author}}
                                </div>
                                <div class="text-sm review-text">
                                    {{review.comment}}
                                </div>
                            </div>
                        </easy-slider-item>
                    </easy-slider>
                </div>
            </div>
        </div>
    </section>
    <app-video :name='event.name' :videoID="getVideoID()" v-if="event.promo_video_url" />
    <choose-room
     :event="event"
     :hotel="hotel"
     :dates="{ start: event.startDate, end: event.endDate }"
     :minRate='rate'
     :strangeRate='Math.max(hotel.expedia_sug_rate, hotel.booking_com_sug_rate)'
     v-if="showModal"
     :discount='discount'
     @close="closeModal"></choose-room>
  </div>
</template>
<script>
import axios from "axios"
import Vue from 'vue'
import Loader from '@/components/Loader'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCoOdN9fa1Pg5DYYNyWAWGH4BpCTyZhwuc',
    libraries: 'places, directions'
  }
})
import ChooseRoom from "@/components/ChooseRoom"
import AppVideo from "@/components/Video.vue"
// import fx from '../../static/js/money'
export default {
    data() {
        return {
            isLoaded: false,
            showModal: false,
            mapObject: null,
            styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#787878"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#272727"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"0"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#000000"},{"visibility":"on"},{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#464646"},{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#464646"},{"lightness":"0"},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"0"},{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#464646"},{"lightness":"0"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#0f0f0f"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":"34"},{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0f0f0f"},{"lightness":17}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]}],
            discount: null,
            showGallery: null,
            rate: null,
            event: {},
            logo: '',
            reviews: [],
            hotel: {
                rooms: [],
                uber_estimate: null,
                photos: [{
                    thumbnail_photo: ''
                }]
            },
            getDirections: false,
            show_all: false // amenities
        }
    },
    created () {
        this.updateData()
    },
    methods: {
        openModal () {
            this.showModal = true
            document.getElementsByTagName('body')[0].classList.add('overflow-hidden')
        },
        closeModal () {
            this.showModal = false
            document.getElementsByTagName('body')[0].classList.remove('overflow-hidden')
        },
        getIconUrl(icon_name) {
          try {
            var images = require.context('@/assets/icons/', false, /\.svg$/)
            return images('./' + icon_name + ".svg")
          } catch (e) {
            var images = require.context('@/assets/icons/', false, /\.svg$/)
            return images("./check-single.svg")
          }
        },
        getAmenities (amenities) {
          return this.show_all === true ? amenities : []
        },
        exchange (val) {
            // problem with filters
            if (!global.window || !global.window.fx) {
                return val
            }
            return parseInt(fx.convert(val, {from: 'USD', to: this.$store.state.currency}))
        },
        handleGetMapDirections() {
          this.getDirections = true
        },
        hideMapDirections() {
          this.getDirections = false
        },
        getHotelMapLabel() {
          return { color: '#000000', fontWeight: 'bold', fontSize: '14px', text: this.hotelDetailData.name }
        },
        openImage () {
            this.$refs.lightbox.showImage(0)
        },
        drawDirection () {
            let directionsService = new google.maps.DirectionsService()
            let directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true
            })
            directionsDisplay.setOptions({
                markerOptions: {
                    icon: ``
                }
            })
            // Fix for creating overlay for direct
            let mapInner;
            if (this.$refs.map) {
              mapInner = this.$refs.map.$el.querySelectorAll('[tabindex="0"]>div:first-child')[0]
            }
            let overlay = document.createElement('div')
            overlay.classList.add('bg-alternate')
            overlay.style.opacity = 0.8
            overlay.style.width = '2000px'
            overlay.style.height = '2000px'
            overlay.style.position = 'absolute'
            overlay.style.top = '-500px'
            overlay.style.left = '-500px'
            if (mapInner) {
                mapInner.appendChild(overlay)
            }
            directionsDisplay.setMap(this.mapObject)
            directionsService.route({
                origin: `${this.hotel.location.address} ${this.hotel.location.city} ${this.hotel.location.state}`,
                destination: `${this.event.location.address} ${this.event.location.city} ${this.event.location.state}`,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    let _route = response.routes[0].legs[0];
                    let pinB = new google.maps.Marker({
                        position: _route.end_location,
                        map: this.mapObject,
                        icon: {
                            url: `${this.event.branding.aws_url}${this.event.branding.light_logo}`,
                            size: new google.maps.Size(this.event.branding.logo_width / 2, this.event.branding.logo_height / 2),
                            scaledSize: new google.maps.Size(this.event.branding.logo_width / 2, this.event.branding.logo_height / 2),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(this.event.branding.logo_width / 4, this.event.branding.logo_height * 0.5),
                        }
                    })
                    let pinA = new google.maps.Marker({
                        position: _route.start_location,
                        map: this.mapObject,
                        icon: {
                            url: require('@/assets/img/icons/dot.svg'),
                            size: new google.maps.Size(50, 50),
                            scaledSize: new google.maps.Size(50, 50),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(25, 45),
                        }
                    })
                    directionsDisplay.setDirections(response)
                }
                this.isLoaded = true
            })
        },
        updateData () {
            var makeQuery = function(obj) {
                var str = []
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
                    }
                }
                return str.join("&")
            }
            let queryString = makeQuery(this.$route.query)
            axios({
                url: `${process.env.baseUrl}hotel/${this.$route.params.id}/?${queryString}`,
                headers: {
                    'Short-Name': this.$route.query.client
                }
            }).then(resp => {
                this.hotel = resp.data[0]
                this.hotel.rooms.sort((a, b) => parseFloat(a.total_price) - parseFloat(b.total_price))
                let nights = 1
                this.hotel.half_star = null
                if (Number(this.hotel.stars) !== parseInt(this.hotel.stars)) {
                    this.hotel.stars = parseInt(this.hotel.stars)
                    this.hotel.half_star = true
                }
                if (this.hotel.rooms[0]) {
                    nights = Math.round((new Date(this.hotel.rooms[0].checkout_date) - new Date(this.hotel.rooms[0].checkin_date)) / 1000 / 60 / 60 / 24)

                }
                // discount
                let maxRate = Math.max(this.hotel.booking_com_sug_rate, this.hotel.expedia_sug_rate)
                this.hotel.rooms.forEach(room => {
                    // Min rate
                    if (this.rate === null || room.rate / 100 < this.rate) {
                        this.rate = room.rate / 100 / nights
                    }
                })
                if (this.hotel.tripadvisor_review_1_author && this.hotel.tripadvisor_review_1_comment) {
                    let authorToArray = this.hotel.tripadvisor_review_1_author.split(' ')
                    this.reviews.push({
                        initials: `${authorToArray[0][0].toUpperCase()}${authorToArray[1] ? authorToArray[1][0].toUpperCase() : ''}`,
                        author: this.hotel.tripadvisor_review_1_author,
                        comment: this.hotel.tripadvisor_review_1_comment
                    })
                }
                if (this.hotel.tripadvisor_review_2_author && this.hotel.tripadvisor_review_2_comment) {
                    let authorToArray = this.hotel.tripadvisor_review_2_author.split(' ')
                    this.reviews.push({
                        initials: `${authorToArray[0][0].toUpperCase()}${authorToArray[1] ? authorToArray[1][0].toUpperCase() : ''}`,
                        author: this.hotel.tripadvisor_review_2_author,
                        comment: this.hotel.tripadvisor_review_2_comment
                    })
                }
                if (this.hotel.tripadvisor_review_3_author && this.hotel.tripadvisor_review_3_comment) {
                    let authorToArray = this.hotel.tripadvisor_review_3_author.split(' ')
                    this.reviews.push({
                        initials: `${authorToArray[0][0].toUpperCase()}${authorToArray[1] ? authorToArray[1][0].toUpperCase() : ''}`,
                        author: this.hotel.tripadvisor_review_3_author,
                        comment: this.hotel.tripadvisor_review_3_comment
                    })
                }
                this.discount = Math.ceil((maxRate - this.rate) / (maxRate / 100))
                axios.get(`${process.env.baseUrl}festival/?client=${this.$route.query.client}`).then(resp => {
                    this.event = resp.data
                    this.$store.commit('setBranding', this.event.branding)
                    // Navbar logo
                    let url = `${resp.data.branding.aws_url}${resp.data.branding.dark_logo}`
                    this.logo = `${resp.data.branding.aws_url}${resp.data.branding.light_logo}`
                    // Api styles
                    let color_primary = this.event.branding.main_color
                    let color_alternate = this.event.branding.alternate_color
                    let styleTag = document.createElement('style')
                    styleTag.innerHTML = `
                        .text-primary { color: ${color_primary}!important; }
                        .hover\\:text-primary:hover { color: ${color_primary}!important; }
                        .focus\\:text-primary:focus { color: ${color_primary}!important; }
                        .border-primary { border-color: ${color_primary}!important; }
                        .hover\\:border-primary:hover { border-color: ${color_primary}!important; }
                        .focus\\:border-primary:focus { border-color: ${color_primary}!important; }
                        .bg-primary { background-color: ${color_primary}!important; }
                        .hover\\:bg-primary:hover { background-color: ${color_primary}!important; }
                        .focus\\:bg-primary:focus { background-color: ${color_primary}!important; }
                        .text-alternate { color: ${color_alternate}!important; }
                        .hover\\:text-alternate:hover { color: ${color_alternate}!important; }
                        .focus\\:text-alternate:focus { color: ${color_alternate}!important; }
                        .border-alternate { border-color: ${color_alternate}!important; }
                        .hover\\:border-alternate:hover { border-color: ${color_alternate}!important; }
                        .focus\\:border-alternate:focus { border-color: ${color_alternate}!important; }
                        .bg-alternate { background-color: ${color_alternate}!important; }
                        @media screen and (max-width: 768px) {
                            .sm\\:bg-alternate { background-color: ${color_alternate}!important; }
                            .sm-after\\:bg-alternate:after { background-color: ${color_alternate}!important; }
                        }
                        .hover\\:bg-alternate:hover { background-color: ${color_alternate}!important; }
                        .focus\\:bg-alternate:focus { background-color: ${color_alternate}!important; }
                    `
                    document.querySelectorAll('head')[0].appendChild(styleTag)
                    // Small fix for catching $mapObject without users actions
                        let mapObjectInterval = setInterval(() => {
                            if (this.getDirections === false && this.$refs.map.$mapObject !== undefined) {
                                this.mapObject = this.$refs.map.$mapObject
                                clearInterval(mapObjectInterval)
                            }
                        }, 50)
                      let mapObjectInterval2 = setInterval(() => {
                          if (this.getDirections === true && this.$refs.map1.$mapObject !== undefined) {
                              this.mapObject = this.$refs.map1.$mapObject
                              clearInterval(mapObjectInterval2)
                          }
                      }, 50)
                })
            })
        },
        getDirectionsURL() {
            let base = 'https://www.google.com/maps/dir/?api=1&origin='
            let start = `${this.hotel.location.address} ${this.hotel.location.city} ${this.hotel.location.state}`
            let end   = `${this.event.location.address} ${this.event.location.city} ${this.event.location.state}`
            return `${base}${start}&destination=${end}&travelmode=driving`.replace(/\s/g, "+")
        },
        getVideoID() {
            let url = this.event.promo_video_url
            let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
            let match = url.match(regExp)
            return (match&&match[7].length==11) ? match[7] : ''
        },
        next() {
            this.$refs.flickity.next();
        },
        previous() {
            this.$refs.flickity.previous();
        }
    },
    computed: {
        imgUrls () {
            let urls = []
            let photos = this.hotel.photos
            photos.forEach(photo => urls.push({
              thumb: photo.thumbnail_photo,
              src: photo.main_photo
            }))
            return urls
        },
        mainPhoto() {
            let newPhotos = this.hotel.photos.filter((photo) => {
                return photo.category === 'MAIN'
            })
            if (!newPhotos[0]) {
                return {
                    main_photo: ''
                }
            }
            return newPhotos[0]
        },
        roomPhoto() {
            let newPhotos = this.hotel.photos.filter((photo, index) => {
                return photo.category === 'ROOM'
            })
            if (!newPhotos[0]) {
                return {
                    thumbnail_photo: ''
                }
            }
            return newPhotos[0]
        },
        uberPrices() {
            var min = []
            var max = []
            if (this.hotel.uber_estimate === null) {
                return 0
            }
            let prices = this.hotel.uber_estimate.prices
            prices.forEach((price) => {
                min.push(price.low_estimate)
                max.push(price.high_estimate)
            })
            return {
                min: Math.min.apply(Math, min),
                max: Math.max.apply(Math, max)
            }
        }
    },
    components: {
        ChooseRoom,
        Loader,
        AppVideo
    },
    filters: {
        toCapitalize (str) {
            if (!str) {
                return ''
            }
            return `${str[0].toUpperCase()}${str.slice(1)}`
        }
    },
    head() {
        return {
        title: `${this.hotel.name ? this.hotel.name + ' |' : ''} SmartStay.com`,
        meta: [{
                hid: 'description',
                name: 'description',
                content: this.hotel.description_body || ''
            }]
        }
    },
    beforeDestroy () {
        this.closeModal()
    },
    watch: {
        'mapObject' () {
            this.drawDirection()
        },
        '$route' () {
            this.updateData()
        },
        getDirections: {
          handler() {
            if (this.$refs.map1 && this.getDirections === true) {
              this.mapObject = this.$refs.map1.$mapObject
              this.drawDirection()
            }
            if (this.$refs.map && this.getDirections === false) {
              this.mapObject = this.$refs.map.$mapObject
              this.drawDirection()
            }
          }
        }
    }
}
</script>
<style lang="scss">
@import url('vue-image-lightbox/dist/vue-image-lightbox.min.css');
.topSection {
    cursor: pointer;
}

.stars {
    top: 5px;
    display: inline-flex;
}

.min-h-50rem {
  min-height: 50rem;
}
.border-bottom {
  border-bottom: 1px solid rgba(0,0,0,.15);
}
.hide-map {
  position: absolute;
  left: -20px;
  bottom: -10px;
  display: inline-flex;
  height: 28px;
  width: 90px;
  padding: 5px 10px;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.05;
  color: #fff !important;
  border-radius: 3px;
  background-color: #41bfef;
}

.event-name {
    margin-right: 15px;
}

.slider .review-text {
    max-height: 80px;
    overflow: auto;

    &::-webkit-scrollbar{
        width: 0;
    }
}

.vue-lb-container {
    z-index: 101!important;
}

button[data-id='open-modal'] {
    width: 100%;
}

.slider-item .wrap {
    display: flex;
}

.flex .indi-center {
    transform: none!important;
    left: 55px!important;
    bottom: 0!important;
    z-index: 99 !important;
}

.vue-lb-thumbnail-wrapper {
    bottom: 140px;
}

div[data-id="map"] {
    overflow: hidden;

    *{
        cursor: default!important;
    }
}

.show-mb {
    display: none;
}

@media (max-width: 600px) {
    .rates {

        .show-mb {
            display: inline-block;
            font-size: 12px;
            border-radius: 4px;
            padding: 2px 5px;
            margin-left: 10px;
        }

        [role='button']>* {
            border-bottom: 1px solid rgba(0,0,0,0.2);
        }
        .ml-2 {
            order: -1;
            margin-left: 0;
            margin-right: 10px;
        }
    }
}
</style>
