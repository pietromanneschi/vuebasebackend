<template>
    <input type="file" @change="onFileSelect" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class FileInput extends Vue {

    onFileSelect(ev){
        let file = ev.target.files[0];
        this.$emit('input', file);
    }
}

</script>