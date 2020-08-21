<template>
    <div class="trello">   
        <div class="trelloMove left" @dragover="moveTrelloLeft($event)"></div>
        <div class="trelloMove right" @dragover="moveTrelloRight($event)"></div>
        <div ref="trello" class="trelloScroll"
            @mousedown="onMouseDown" 
            @mouseleave="onMouseLeave" 
            @mouseup="onMouseUp" 
            @mousemove="onMouseMove">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as OM from '@/model';
import store from '@/store';

@Component
export default class TrelloContainer extends Vue {

    trello: any;
    isDown: boolean;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;

    @Prop({
        default: 3
    }) speed: number;

    mounted(){
        this.trello = this.$refs.trello;
        this.isDown = false;
        this.startX = 0;
        this.startY = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;
    }

    onMouseDown(e){
        if(e.target != this.trello)
            return;
        this.isDown = true;
        this.startX = e.pageX - this.trello.offsetLeft;
        this.startY = e.pageY - this.trello.offsetTop;
        this.scrollLeft = this.trello.scrollLeft;
        this.scrollTop = this.trello.scrollTop;
    }
    onMouseLeave(e){
        this.isDown = false;
    }
    onMouseUp(e){
        this.isDown = false;
    }
    onMouseMove(e){
        if(!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.trello.offsetLeft;
        const y = e.pageY - this.trello.offsetTop;
        const walkX = (x - this.startX) * this.speed; //scroll-fast
        const walkY = (y - this.startY) * this.speed; //scroll-fast
        this.trello.scrollLeft = this.scrollLeft - walkX;
        this.trello.scrollTop = this.scrollTop - walkY;
    }

    moveTrelloLeft(ev){
        var trello = <HTMLElement>this.$refs.trello;
        if(trello.scrollLeft > 0){
            trello.scrollLeft = trello.scrollLeft - 10;
            if(trello.scrollLeft < 0)
                trello.scrollLeft = 0;
        }
    }
    moveTrelloRight(ev){
        var trello = <HTMLElement>this.$refs.trello;
        if(trello.scrollLeft < trello.scrollWidth){
            trello.scrollLeft = trello.scrollLeft + 10;
            if(trello.scrollLeft > trello.scrollWidth)
                trello.scrollLeft = trello.scrollWidth;
        }
    }

}

</script>
