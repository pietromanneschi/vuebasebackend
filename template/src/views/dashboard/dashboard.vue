<template>
    <div class="formPage">
        <h3 class="pageTitle">Benvenuto \{{$store.state.user.name}}</h3>
        <mini-spinner v-if="loading"></mini-spinner>
        <div v-else>
            \{{vm}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DashboardServices } from '@/services/DashboardServices';
import * as OM from '@/model';
import * as VM from '@/viewmodel';
import store from '@/store';

@Component
export default class Dashboard extends Vue {

    vm: VM.DashboardVm = null;
    loading: boolean = false;

    created(){
        this.loading = true;
        DashboardServices.GetDashboard()
        .then(x => {
            this.vm = x;
        })
        .finally(() => this.loading = false);
    }

}

</script>
