<template>
    <div>
        <div class="imageDropSpace">
            <div class="drag-drop" @dragover.prevent @drop.prevent="dropImage" @click="click">
                <span class="dragSpace">
                    <slot>Trascina l'immagine <br /> o clicca qui</slot>
                </span>
                <input type="file" @change="onFileSelect" ref="fileInput" class="hidden absolute" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import store from '@/store';
import * as OM from '@/model';

@Component
export default class FileDropper extends Vue {

    click(){
        (<any>this.$refs.fileInput).click();
    }

    dropImage(ev){
        ev.stopPropagation();
        ev.preventDefault();
        let file = ev.dataTransfer.files[0];
        this.$emit('input', file);
    }

    onFileSelect(ev){
        let file = ev.target.files[0];
        this.$emit('input', file);
    }
}

</script>
<style scoped>
    .imageDropSpace {
        text-align: center;
        background: #efefef;
        padding: 20px 0;
    }

    .imageDropSpace img {
        max-width: 150px;
        max-height: 150px;
    }

    .drag-drop {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dragSpace {
        padding: 30px;
        display: inline-block;
        border: 3px dashed rgba(0,0,0,0.1);
    }

    .hidden {
        visibility: hidden;
    }
    .absolute {
        position: absolute;
    }
</style>