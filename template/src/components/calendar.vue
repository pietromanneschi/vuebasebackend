<template>
    <div class="calendar">
        <div class="modeChanger">
            <button @click="setMode('month')" :class="{ active: mode == 'month' }">VISUALIZZA MESE</button>
            <button @click="setMode('week')" :class="{ active: mode == 'week' }">VISUALIZZA SETTIMANA</button>
        </div>
        <div class="navigatorContainer">
            <div class="prev" @click="goPrev">
                <i class="fa fa-chevron-left"></i>
            </div>
            <div class="navigatorTitle">\{{navigatorTitle}}</div>
            <div class="next" @click="goNext">
                <i class="fa fa-chevron-right"></i>
            </div>
        </div>
        <div class="weekDaysContainer" v-if="mode == 'month'">
            <div class="weekDay" v-for="(giorno, i) in originalWeekDays" :key="i">
                <b>\{{giorno}}</b>
            </div>
        </div>
        <div class="weekDaysContainer" v-else>
            <div class="weekDay" v-for="(giorno, i) in weekDays" :key="i">
                <b>\{{giorno}}</b>
            </div>
        </div>
        <div class="calendarDaysContainer" ref="daysContainer">
            <slot :days="days"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import * as OM from '@/model';

@Component
export default class Calendar extends Vue {

    @Prop() items: any[];

    mode: string = "";

    originalWeekDays: string[] = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    weekDays: string[] = [];
    hours: string[] = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", 
        "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"];
    days: CalendarDay[] = [];

    currentDate: Date = new Date();
    currentViewStartDate: Date = new Date();
    currentViewEndDate: Date = new Date();

    daysContainer: HTMLDivElement;

    mounted(){
        this.setMode('week');
        setTimeout(() => {
            this.daysContainer = <HTMLDivElement>this.$refs.daysContainer;
            let currentHour = this.daysContainer.querySelector('.calendarHour.currentHour');
            currentHour.scrollIntoView({
                block: 'center'
            });
        }, 50);
    }

    get navigatorTitle(){
        if(this.mode == 'month'){
            return this.currentDate.toLocaleString('it-it', { month:'long', year:'numeric'});
        } else {
            let a = this.currentViewStartDate.toLocaleString('it-it', { day:'numeric', month:'long'});
            let b = this.currentViewEndDate.toLocaleString('it-it', { day:'numeric', month:'long'});
            return a + " - " + b;
        }
    }

    getDays(){
        if(this.mode == 'month'){
            this.days = this.getCalendarDaysMonth(this.currentDate.getMonth(), this.currentDate.getFullYear());
        } else if(this.mode == 'week'){
            this.days = this.getCalendarDaysWeek(this.currentDate);
        }
        this.$emit('changed', { start: this.currentViewStartDate, end: this.currentViewEndDate, mode: this.mode })
    }
    setMode(mode: string){
        this.mode = mode;
        this.getDays();
    }
    goPrev(){
        if(this.mode == 'month'){
            this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
        } else if(this.mode == 'week') {
            this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 7));
        }
        this.getDays();
    }
    goNext(){
        if(this.mode == 'month'){
            this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
        } else if(this.mode == 'week') {
            this.currentDate = new Date(this.currentDate.setDate(this.currentDate.getDate() + 7));
        }
        this.getDays();
    }

    getItemsOfDate(date: Date){
        let min = date.setHours(0,0,0,0);
        let max = date.setHours(23,59,59,0);
        return this.items.filter(x => new Date(x.scadenza.startDate).getTime() >= min && new Date(x.scadenza.endDate).getTime() <= max);
    }

    getCalendarDaysWeek(dayOfTheWeek){
        let currentDay = dayOfTheWeek.getDay();
        
        if(currentDay == 0){ //domenica 👍
            this.currentViewStartDate = new Date(dayOfTheWeek.getFullYear(), dayOfTheWeek.getMonth(), dayOfTheWeek.getDate() - 6);
            this.currentViewEndDate = new Date(this.currentViewStartDate.getFullYear(), this.currentViewStartDate.getMonth(), this.currentViewStartDate.getDate() + 6);
        } else {
            let ggDiff = currentDay - 1;
            this.currentViewStartDate = new Date(dayOfTheWeek.getFullYear(), dayOfTheWeek.getMonth(), dayOfTheWeek.getDate() - ggDiff)
            this.currentViewEndDate = new Date(this.currentViewStartDate.getFullYear(), this.currentViewStartDate.getMonth(), this.currentViewStartDate.getDate() + 6);
        }



        let ris: CalendarDay[] = [];
        let currentDate = new Date(this.currentViewStartDate);
        this.weekDays = [];
        for(let i = 0; i < 7; i++){
            this.weekDays[i] = this.originalWeekDays[i] + " " + currentDate.getDate();
            let classes = [];
            if(currentDate.getDay() == dayOfTheWeek.getDay()){
                classes.push('currentDay');
            }
            let pushHours = this.hours.map(x => {
                let hourClasses = [];
                if(currentDate.getDay() == dayOfTheWeek.getDay()){
                    if(parseInt(x.split(":")[0]).toString() == dayOfTheWeek.getHours().toString()){
                        hourClasses.push('currentHour');
                    }
                }
                return {
                    hour: x,
                    classes: hourClasses
                }
            });
            let toPush = {
                date: new Date(currentDate.getTime()),
                classes: classes,
                hours: pushHours
            }
            ris.push(toPush);
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
        // this.currentViewStartDate = new Date(ris[0].date);
        // this.currentViewEndDate = new Date(ris[ris.length - 1].date);
        return ris;
    }

    getCalendarDaysMonth(month: number, year: number){
        let currentMonthStartDate = new Date(year, month, 1, 0, 0, 0);
        let currentMonthEndDate = new Date(year, month + 1, 0, 0, 0, 0);

        let dayOfWeekStartDate = currentMonthStartDate.getDay();
        //lunedì=1, domenica=0
        //normalizzo domenica a 1
        let previousDaysToGet;
        if(dayOfWeekStartDate == 0)
            previousDaysToGet = 6;
        else
            previousDaysToGet = dayOfWeekStartDate - 1;

        let prevMonthEndDate = new Date(year, month, 0, 0, 0, 0);
        this.currentViewStartDate = new Date(currentMonthStartDate.setDate(currentMonthStartDate.getDate() - previousDaysToGet));
        let totalDays = 42;//(endDate.getTime() - startDate.getTime()) / (24*3600*1000);
        let ris: CalendarDay[] = [];
        let currentDate = new Date(this.currentViewStartDate);
        for(let i = 0; i < totalDays; i++){
            let classes = [];
            if(currentDate.getMonth() < this.currentDate.getMonth())
                classes.push('prevMonth');
            if(currentDate.getMonth() > this.currentDate.getMonth())
                classes.push('nextMonth');
            ris.push({
                date: new Date(currentDate.getTime()),
                classes: classes,
                hours: []
            });
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
        this.currentViewEndDate = new Date(currentDate);
        return ris;
    }

}

class CalendarDay {
    date: Date;
    classes: string[];
    hours: CalendarHour[];
}

class CalendarHour {
    hour: string;
    classes: string[];
}

interface ICalendarItem {
    startDate: string;
    endDate: string;
}

</script>
