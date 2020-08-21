<template>
    <div class="spinner">
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as OM from '@/model';

@Component
export default class MiniSpinner extends Vue {

}

</script>
<style scoped>
    @keyframes spinner {
        100% {
            transform: rotate(360deg);
        }
    }

    .spinner {
        position: relative;
        height: 30px;
        width: 30px;
        margin: auto;
    }
    
    .spinner:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        margin-left: -20px;
        border-radius: 50%;
        border-top: 6px solid #f5f000;
        border-right: 6px solid transparent;
        animation: spinner .6s linear infinite;
        border-left: 6px solid transparent;
        border-bottom: 6px solid #06161d;
    }
</style>
