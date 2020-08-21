<template>
    <div class="__modalsContainer" :class="{ '__show': items.length > 0 }">
        <div class="__modalBg" v-for="(item, i) in items" :key="i" :ref="'__modalBg' + i" 
            @mousedown="onDownBg($event, i)" @mouseup="onUpBg($event, i)" 
            @touchstart="onDownBg($event, i)" @touchend="onUpBg($event, i)">
            <component :is="item.modalComponent" v-bind="item.props" @close="closeModal(i)">
            </component>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';
import { ModalBus } from './modalBus';
import { ModalInput } from './classes'

@Component
export default class ModalsContainer extends Vue {

    items: ModalInput[] = [];
    //modalsContainer: any;

    created(){
        ModalBus.registerAddModalCallback((item, props, closeCallback = null) => {
            this.items.push({
                modalComponent: item,
                props: props,
                closeCallback: closeCallback
            })
            document.body.classList.add('__modal-open');
        })
        ModalBus.registerCloseLastModal(this.closeLastModal);
        ModalBus.setModalsArray(this.items);
    }

    // mounted(){
    //     this.modalsContainer = this.$refs.modalsContainer;
    // }

    hasMouseDown: boolean;
    onDownBg(ev, i){
        if(ev.target == this.$refs['__modalBg' + i][0]){
            this.hasMouseDown = true;
        }
    }
    onUpBg(ev, i){
        if(this.hasMouseDown){
            this.hasMouseDown = false;
            if(ev.target == this.$refs['__modalBg' + i][0]){
                this.closeLastModal();
            }
        }
    }

    closeModal(index){
        let removed = this.items.splice(index, 1)[0];
        if(removed.closeCallback){
            removed.closeCallback();
        }
        if(this.items.length == 0){
            document.body.classList.remove('__modal-open');
        }
    }
    closeFromBg(ev){
        this.closeLastModal();
    }
    closeLastModal(){
        let removed = this.items.pop();
        if(removed.closeCallback){
            removed.closeCallback();
        }
        if(this.items.length == 0){
            document.body.classList.remove('__modal-open');
        }
    }

}
</script>

<style scoped>

    .__modalsContainer {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        overflow: auto;
        display: none;
        z-index: 999;
    }

    .__modalBg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.4);
        overflow-y: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .__show {
        display: flex;
    }

</style>
<style>
body.__modal-open {
    overflow: hidden;
}
</style>