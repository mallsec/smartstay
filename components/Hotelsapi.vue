<script>
  import _ from 'lodash';
  export default {
    name: 'HotelsapiHelpers',
    vendorsOrder: [
      'Expedia.com',
      'Booking.com',
      'Priceline.com',
      'Hotels.com',
      'Tripadvisor.com',
      'Agoda.com',
    ],
    catchErrorHotelsapi(index, getHotelByIndex, callback) {
      let hotel = getHotelByIndex(index);
      hotel.hotelsapi_vendors_loading = false;
      hotel.hotelsapi_vendors = [];
      callback();
    },
    applyHotelsapi(index, data, getHotelByIndex, callback, hotel, initial_price) {
      if (
        index !== undefined &&
        getHotelByIndex !== undefined &&
        hotel === undefined
      ) {
        hotel = getHotelByIndex(index);
      }
      if (initial_price === undefined) {
        initial_price = hotel.room_data.room_0.price_details['display_price']
      }
      hotel.hotelsapi_vendors_loading = false;
      let vendor_values = [null, null, null, null, null, null];
      if (data && data.comparison && data.comparison.length > 0) {
        let hotelsapiData = data.comparison[0];
        let keys = Object.keys(hotelsapiData);
        let vendor_keys = keys.filter(item => {
          return item.includes('vendor')
        });

        let prices = [];
        for (let i = 0; i < vendor_keys.length; i++) {
          if (!hotelsapiData[vendor_keys[i]]) {
            continue;
          }
          let item = hotelsapiData[vendor_keys[i]].split("-");

          if (item.length > 1 && item[1] >= initial_price) {
            let _value = {[item[0]]: item[1]};
            let vendorIndex = this.vendorsOrder.indexOf(item[0]);
            if (vendorIndex >= 0) {
              vendor_values[vendorIndex] = _value;
            } else {
              vendor_values.push(_value)
            }
            prices.push(parseInt(item[1]));
          }
        }
        if (prices.length > 0) {
          let maxPrice = Math.max(...prices);
          prices.pop(maxPrice);
          hotel.saving_percentage = parseInt((1 - initial_price / Math.max(...prices)) * 100);
        }
        _.remove(vendor_values, (value) => value === null);
        hotel.hotelsapi_vendors = _.cloneDeep(vendor_values);
      }
      if (callback !== undefined) {
        callback()
      }
    },
  }
</script>
