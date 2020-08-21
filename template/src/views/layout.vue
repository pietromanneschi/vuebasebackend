<template>
    <div class="layout">
        <div class="headerBg">
            <div class="headerbar">
                <div class="headerLeft">
                    <img src="@/img/logo.png" />
                </div>
                <div class="headerRight">
                    <div class="text-yellow">
                        Benvenuto
                    </div>
                    <div class="text-white">
                        \{{$store.state.user.name}} \{{$store.state.user.surname}}
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex">
            <div class="leftNavTabs" v-if="userRoutes.length > 0">
                <router-link class="leftNavTab" :to="item.path" v-for="(item, i) in userRoutes" :key="i">
                    \{{item.text}}
                </router-link>
                <div class="leftNavTab pointer" @click="logout">
                    Logout
                </div>
            </div>
            <div class="container-fluid mainContainer pb-5">
                <div class="pt-3">
                    <router-view :key="viewKey"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import { StorageServices } from '@/services/StorageServices'
import { CommonServices } from '@/services/CommonServices'
import * as OM from '@/model';
import { menuRoutes } from '@/router';

@Component
export default class Layout extends Vue {
    
    userRoutes: any[] = [];
    showBgTasks: boolean = false;

    viewKey: string = Date.now().toString();

    get showBecomeCliente(){
        return this.$route.matched.some(x => x.name == 'customerDash');
    }

    logout(){
        CommonServices.destroyToken();
        store.state.loginResponse = null;
        StorageServices.setLoginResponse(store.state.loginResponse);
        this.$router.push('/');
    }

    created(){
        if(store.state.isAdmin()){
            this.userRoutes = menuRoutes.adminRoutes();
        } else if(store.state.isManager()){
            this.userRoutes = menuRoutes.managerRoutes();
        }
    }


}

</script>

<style scoped>


</style>
