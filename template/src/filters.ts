import Vue from 'vue';
import moment from 'moment';

Vue.filter('date', function(value: any, _format: string, _showTime: boolean) {
    if (value) {
        let format;
        if(!_format){
            format = 'DD/MM/YYYY';
        } else {
            format = _format;
        }
        if(_showTime)
            format += ' HH:mm:ss';
        return moment(value).locale('it').format(format);
    }
})

Vue.filter('int', function(value: any) {
    if (value || value == 0) {
        return Math.round(value);
    }
})

Vue.filter('currency', function(value: any, decimals: number) {
    if(!decimals && decimals != 0)
        decimals = 2;
    if (value || value == 0) {
        let val = (value/1).toFixed(decimals).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
})

Vue.filter('perc', function(value: any, decimals: number) {
    if(!decimals)
        decimals = 0;
    if (value || value == 0) {
        return (value * 100).toFixed(decimals);
    }
})

Vue.filter('daysPeriod', function(value: any) {
    if (!value)
        return value;
    
    if(value < 365)
        return value;
    else if(value < 1080)
        return value;
    else
        return parseFloat((value / 365).toFixed(1));
})
