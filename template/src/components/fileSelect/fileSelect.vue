<template>
    <input type="file" value="" @change="onChange" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FileSelect extends Vue {
    @Prop([File, Object]) value: any;

    onChange(ev: any){
        if (ev) {
            let file = ev.target.files[0];
            this.$emit('input', file);
        }
    }
}
</script>