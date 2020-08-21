<template>
    <div class="_v-autocomplete-container" ref="autocompleteContainer">
        <slot :search="search">
            <input type="search" class="form-control" v-model="search.value" autocomplete="false" />
        </slot>
        <div class="_v-autocomplete-list" ref="autocompleteList">
            <div class="_v-autocomplete-list-item" :class="{'active': selectedIndex == i }" 
                v-for="(item, i) in results" :key="i" @click="setResult(item)">
                <slot :item="item" name="list-item">
                    \{{objKey ? item[objKey] : item}}
                </slot>  
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import router from "@/router";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

function delegate(el, evt, sel, handler) {
    el.addEventListener(evt, function(event) {
        var t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode;
        }
    });
}

@Component
export default class vAutocomplete extends Vue {

    @Prop({
        type: [Object, Array]
    }) list: any;
    @Prop({
        type: [Object, Function]
    }) searchCallback: any;
    @Prop({
        type: null
    }) value: any;
    @Prop() objKey: string;
    
    results = [];
    autoCompleteListHeight = 0;

    get local(){
        return this.value || '';
    }

    setResult(item){
        this.$emit('input', item);
        if(this.objKey)
            this.search.value = item[this.objKey];
        else
            this.search.value = item;
    }

    search: any = { value: '' };
    selectedIndex: number = 0;

    @Watch('search.value')
    onSearchChange(next, prev){
        this.selectedIndex = 0;
        if(this.searchCallback){
            this.results = this.searchCallback(next);
        }
        
        this.$nextTick( () => {
            let autocompleteList: HTMLElement = <HTMLElement>this.$refs.autocompleteList;
            autocompleteList.scrollTo(0, 0);
            this.autoCompleteListHeight = autocompleteList.offsetHeight;
        })
    }

    mounted(){
        let container = this.$refs.autocompleteContainer;
        let autocompleteList: HTMLElement = <HTMLElement>this.$refs.autocompleteList;

        delegate(container, 'keydown', 'input', (ev) => {
            let listItem = (<HTMLElement>this.$refs.autocompleteList).querySelector('._v-autocomplete-list-item');
            if(!listItem)
                return;
            let itemHeight = parseInt(getComputedStyle(listItem).height);
            let maxItems = Math.floor(this.autoCompleteListHeight / itemHeight);

            if(!ev.key)
                return;
            if(ev.key == "ArrowUp"){
                if(this.selectedIndex > 0)
                    this.selectedIndex--;
                autocompleteList.scrollTop -= itemHeight;
            } else if(ev.key == "ArrowDown") {
                if(this.selectedIndex < this.results.length - 1)
                    this.selectedIndex++;

                if((this.selectedIndex + 1) / maxItems > 1){
                    autocompleteList.scrollTop += itemHeight;
                }
            } else if(ev.key == "Enter") {
                this.setResult(this.results[this.selectedIndex]);
            }

        })
    }


}
</script>

<style scoped>

._v-autocomplete-container {
    position: relative;
}

._v-autocomplete-list {
    display: none;
}

._v-autocomplete-container input:focus + ._v-autocomplete-list,._v-autocomplete-container ._v-autocomplete-list:active {
    display: block;
}

._v-autocomplete-list {
    position: absolute;
    background: white;
    z-index: 2;
    cursor: pointer;
    width: 100%;
    max-height: 300px;
    overflow-y: scroll;
    border-left: 1px solid #f1f1f1;
    border-bottom: 1px solid #f1f1f1;
}

._v-autocomplete-list-item.active {
    background: #09adca;
}

    ._v-autocomplete-list ._v-autocomplete-list-item{
        padding-left: 10px;
    }

        ._v-autocomplete-list ._v-autocomplete-list-item:hover{
            background: #09adca;
        }
</style>