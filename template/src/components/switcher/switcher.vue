<template>
    <div class="form-group">
        <label class="control-label">\{{label}}</label>
        <div class="btn-group">
            <button type="button" class="btn btn-link" :class="value ? 'btn-green' : ''" @click="emit(true)">Si</button>
            <button type="button" class="btn btn-link" :class="!value ? 'btn-red' : ''" @click="emit(false)">No</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Switcher extends Vue {
    @Prop() value: boolean;
    @Prop() label: string;
    emit(val){
        this.$emit('input', val);
    }
}

</script>