<template>
    <form @submit.stop.prevent="submitWrapper">
        <slot></slot>
    </form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ValForm extends Vue {

    submitWrapper(ev){
        let untoucheds = ev.target.querySelectorAll('.v-untouched');
        untoucheds.forEach(x => {
            x.classList.remove('v-untouched');
        })

        let invalids = ev.target.querySelectorAll('[class*="v-invalid"]');
        if(invalids.length > 0){
            this.$emit('invalid');
            return;
        }

        this.$emit('submit');
    }
}
</script>