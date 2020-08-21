<template>
    <input ref="input" />
</template>

<script lang="ts">
import router from "@/router";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import "flatpickr/dist/flatpickr.min.css";
import flatpickr from "flatpickr";

@Component
export default class OpTime extends Vue {

    @Prop() value: any;
    @Prop() initialvalue: any;

    fp: any = null;
    mounted(){
        var date = new Date().toISOString();
        if(this.value){
            date = new Date(this.value).toISOString();
        } else {
            if(this.initialvalue !== undefined){
                date = this.initialvalue;
            } else {
                this.$emit('input', date);
            }
        }

        this.fp = flatpickr(<HTMLInputElement>this.$refs.input, {
            defaultDate: date,
            allowInput: true,
            onChange: (val) => {
                this.$emit('input', this.validateDate(val[0]));
            },
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true
        });
    }

    @Watch('value')
    onValueChange(next, prev){
        var data = null;
        if(next !== null){
            data = new Date(next).toISOString();
        }
        this.fp.setDate(data, false);
    }

    validateDate(inputDate: Date){
        if(this.isValidDate(inputDate)){
            let years = inputDate.getFullYear().toString();
            while(years.length < 4){
                years = "0" + years;
            } 
            let months = (inputDate.getMonth() + 1).toString();
            if(months.length < 2) months = "0" + months;
            let days = inputDate.getDate().toString();
            if(days.length < 2) days = "0" + days;
            
            let hours = inputDate.getHours().toString();
            if(hours.length < 2) hours = "0" + hours;
            let minutes = inputDate.getMinutes().toString();
            if(minutes.length < 2) minutes = "0" + minutes;

            return years +  "-" + months + "-" + days + " " + hours + ":" + minutes;
        }
    }
    
    isValidDate(d: any) {
        return d instanceof Date && !isNaN(<any>d);
    }

}
</script>

<style scoped>

</style>