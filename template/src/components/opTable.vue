<template>
    <div ref="rootElement">
        <div class="opPaginationContainer top" v-if="showUpperPagination">
            <select class="opItemsPerPage" v-model="itemsPerPage">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
            </select>
            <div class="opPaginationNumber" @click="subtractPage">
                &lt;
            </div>
            <div class="opPaginationNumber" v-for="i in pages" :key="i"
                :class="{selected: selectedPage == i}" @click="setSelectedPage(i)">
                {{i}}
            </div>
            <div class="opPaginationNumber" @click="addPage">
                &gt;
            </div>
        </div>
        <table class="opTable" ref="tableRoot">
            <slot :data="paginated"></slot>
        </table>
        <div class="opPaginationContainer bottom" v-if="showLowerPagination">
            <div class="opPaginationNumber" @click="subtractPage">
                &lt;
            </div>
            <div class="opPaginationNumber" v-for="i in pages" :key="i"
                :class="{selected: selectedPage == i}" @click="setSelectedPage(i)">
                {{i}}
            </div>
            <div class="opPaginationNumber" @click="addPage">
                &gt;
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class OpTable extends Vue {
    @Prop() items: any[];
    @Prop() fullTextSearch: boolean;
    @Prop({
        default: true
    }) showUpperPagination: boolean;
    @Prop({
        default: true
    }) showLowerPagination: boolean;
    @Prop({
        type: Number,
        default: 10
    }) itemsPerPage: number;

    tableRoot: any;
    allItems: any[];
    data: any[] = [];

    filters: ((item: any) => boolean)[] = [];
    sorts: SortDefinition[] = [];

    totalPages: number = 0;
    lowerPages: number = 0;
    upperPages: number = 0;
    pages: number[] = [];
    selectedPage: number = 1;


    setSelectedPage(index: number){
        this.selectedPage = index;
        this.calcPagination();
    }
    subtractPage(){
        if(this.selectedPage > 1){
            this.selectedPage--;
            this.calcPagination();
        }
    }
    addPage(){
        if(this.selectedPage < this.totalPages){
            this.selectedPage++;
            this.calcPagination();
        }
    }

    created(){
        this.allItems = this.items.slice();
        this.data = this.allItems.slice();
    }

    @Watch('items')
    onItemsChange(next, prev){
        this.allItems = this.items.slice();
        this.data = this.allItems.slice();
        this.calcPagination();
    }

    mounted(){
        var rootElement: any = this.$refs.rootElement;
        var classes = [];
        rootElement.classList.forEach(x => {
            classes.push(x);
        })
        rootElement.classList.value = "";
        this.tableRoot = this.$refs.tableRoot;
        classes.forEach(x => this.tableRoot.classList.add(x));
        
        let headTds = this.tableRoot.querySelectorAll('thead td')
        headTds.forEach(x => {
            this.insertFilter(x);
            this.insertSort(x);
        })
        this.calcPagination();
    }

    @Watch('itemsPerPage')
    onItemsPerPageChange(next, prev){
        this.calcPagination();
    }

    calcPagination(){
        this.totalPages = Math.ceil((this.allItems.length) / this.itemsPerPage);
        if(this.selectedPage > this.totalPages && this.selectedPage > 1){
            this.selectedPage = this.totalPages;
        }
        this.lowerPages = this.selectedPage - 5;
        this.upperPages = this.selectedPage + 5;
        if(this.lowerPages <= 0)
            this.lowerPages = 1;
        if(this.upperPages > this.totalPages)
            this.upperPages = this.totalPages;
        this.pages = [];
        for(let i = this.lowerPages; i <= this.upperPages; i++){
            this.pages.push(i);
        }
    }
    get paginated(){
        let start = this.itemsPerPage * (this.selectedPage - 1);
        return this.data.slice(start, start + this.itemsPerPage);
    }

    insertSort(element){
        if(!element.hasAttribute('sort'))
            return;

        let prop = element.getAttribute('sort');
        let sortDefinition = new SortDefinition();
        sortDefinition.type = "";
        sortDefinition.el = element;
        element.onclick = () => {
            if(!sortDefinition.type){
                sortDefinition.type = 'asc';
                element.classList.add('asc');
            } else if(sortDefinition.type == 'asc') {
                sortDefinition.type = 'desc';
                element.classList.remove('asc');
                element.classList.add('desc');
            } else {
                sortDefinition.type = '';
                element.classList.remove('asc');
                element.classList.remove('desc');
            }
            this.applySorts(sortDefinition);
        }
        sortDefinition.fn = (a, b) => {
            let aValue = this.getValueByProp(a, prop);
            let bValue = this.getValueByProp(b, prop);

            if(!aValue) aValue = -1;
            if(!bValue) bValue = -1;
            let aVal = aValue; //.toString().toLowerCase().trim();
            let bVal = bValue; //.toString().toLowerCase().trim();
            if (aVal < bVal)
                return sortDefinition.type == 'asc' ? -1 : 1;
            if (aVal > bVal)
                return sortDefinition.type == 'asc' ? 1 : -1;
            return 0;
        }
        this.sorts.push(sortDefinition);
    }

    insertFilter(element){
        if(!element.hasAttribute('filter'))
            return;

        var inputContainer = document.createElement('div');
        var input = document.createElement('input');
        input.type = "text";
        let prop = element.getAttribute('filter');
        let filterFn = (item) => {
            let val = input.value.toString().toLowerCase().trim();
            if(!val) return true;
            let propVal = this.getValueByProp(item, prop);
            if(!propVal) return false;
            return propVal.toString().toLowerCase().trim().indexOf(val) > -1
        }
        this.filters.push(filterFn);
        input.oninput = this.applyFilters;
        input.onclick = (ev) => ev.stopPropagation();
        inputContainer.classList.add('opTdFilterContainer')
        input.classList.add('opTdFilter')
        element.append(inputContainer);
        inputContainer.append(input);
    }

    getValueByProp(input: any, propString: string){
        let props = propString.split('.');
        let ris = input;
        props.forEach(x => {
            if(ris != null)
                ris = ris[x];
        })
        return ris;
    }

    applyFilters(){
        this.data = this.allItems.slice();
        this.filters.forEach(x => {
            this.data = this.data.filter(x);
        })
    }

    applySorts(def: SortDefinition){
        if(this.sorts.filter(x => !x.type).length == this.sorts.length){
            this.applyFilters();
        } else {
            this.sorts.forEach(x => {
                if(x != def){
                    x.el.classList.remove('asc');
                    x.el.classList.remove('desc');
                    x.type = '';
                    return;
                }
                this.data.sort(x.fn);
            })
        }
    }

}

class SortDefinition {
    type: string;
    el: HTMLElement;
    fn: (a: any, b: any) => number;
}

</script>
<style>
.opTable thead td {
    position: relative;
    padding: 10px;
}
.opTable td.desc:after {
    content: '';
    position: absolute;
    top: 14px;
    right: 10px;
    border-top: 10px solid #000000;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
}
.opTable td.asc:after {
    content: '';
    position: absolute;
    top: 14px;
    right: 10px;
    border-bottom: 10px solid #000000;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
}
.opTable thead td .opTdFilterContainer {
    display: block;
    max-width: 100%;
    position: relative;
}
/* .opTable thead td .opTdFilterContainer:after {
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    right: 4px;
    top: 6px;
    background-image: url('../img/lens.png');
    background-size: cover;
    background-position: center;
    pointer-events: none;
} */

.opTable thead td input {
    border-radius: 2px;
    border: 1px solid rgba(0,0,0,0.3);
    width: 100%;
    padding: 4px;
    color: #000000;
}
.opTable thead td input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #000000;
  opacity: 1; /* Firefox */
}
.opTable thead td input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #000000;
}
.opTable thead td input::-ms-input-placeholder { /* Microsoft Edge */
  color: #000000;
}

.opPaginationContainer {
    text-align: right;
}

.opPaginationNumber {
    display: inline-block;
    border: 1px solid rgba(0,0,0,0.2);
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    user-select: none;
}
.opPaginationNumber.selected {
    background-color: #393939;
    color: white;
}
.opItemsPerPage {
    height: 30px;
    border: 1px solid rgba(0,0,0,0.2);
    line-height: 30px;
    padding-top: 1px;
    padding-left: 10px;
    padding-right: 5px;
    margin-right: 10px;
}
</style>