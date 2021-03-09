import Vue from 'vue'

Vue.prototype.$formatDate = (data) => {
    var d = new Date(data),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};
Vue.prototype.$formatDateRaw = (dataObj) => {
    var month = '' + (dataObj.getMonth() + 1),
        day = '' + dataObj.getDate(),
        year = dataObj.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};
