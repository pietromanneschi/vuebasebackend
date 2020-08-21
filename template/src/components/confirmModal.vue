<template>
    <div class="opModal">
        <p>\{{text}}</p>
        <div class="d-flex justify-content-around">
            <button type="button" class="btn btn-danger" @click="ko">NO</button>
            <button type="button" class="btn btn-green" @click="ok">SI</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as OM from '@/model';
import * as VM from '@/viewmodel';

@Component
export default class ConfirmModal extends Vue {

    @Prop() text: string;
    @Prop() okCb: () => void;
    @Prop() koCb: () => void;

    ok(){
        if(this.okCb)
            this.okCb();
        this.$emit('close');
    }
    ko(){
        if(this.koCb)
            this.koCb();
        this.$emit('close');
    }

}

</script>

<style scoped>

.opModal {
    width: 65%;
    max-width: 400px;
}

@media screen and (max-width: 768px) {
    .opModal {
        width: 95%;
    }
}

</style>
