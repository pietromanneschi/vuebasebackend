<template>
    <div class="centerPageContainer bg-black">
        <div class="loginBox">
            <div class="loginLogo">
                <img src="@/img/logo.png" />
            </div>
            <div class="title text-center mt-4">Benvenuto</div>
            <val-form @submit="login" class="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input class="form-control" type="text" v-model="vm.email" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input class="form-control" type="password" v-model="vm.password" />
                </div>
                <div class="text-center" v-if="!loading">
                    <button type="submit" class="btn btn-yellow">
                        Accedi
                    </button>
                </div>
                <mini-spinner v-else></mini-spinner>
                <p class="text-center message">\{{message}}</p>
                <p class="text-center error">\{{error}}</p>
                <hr />
                <router-link class="text-center" to="recoverPassword">
                    Ho dimenticato la password
                </router-link>
            </val-form>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as VM from '@/viewmodel';
import * as OM from '@/model';
import { LoginServices } from '@/services/LoginServices'
import { StorageServices } from '@/services/StorageServices'
import store from '@/store';
import { menuRoutes } from '@/router';

@Component
export default class Login extends Vue {
    
    vm: VM.LoginVm = new VM.LoginVm();
    loading: boolean = false;

    message: string = "";
    error: string = "";

    login(){
        if(!this.vm.email || !this.vm.password)
            return;

        this.loading = true;
        this.message = "";
        this.error = "";
        LoginServices.Login(this.vm)
        .then(x => {
            LoginServices.loginCallback(x)
            .then(x => {
                if(this.$route.query.redirect){
                    this.$router.push(<string>this.$route.query.redirect);
                } else {
                    let firstRoute;
                    if(store.state.isAdmin()){
                        firstRoute = menuRoutes.adminRoutes()[0];
                    } else if(store.state.isManager()){
                        firstRoute = menuRoutes.managerRoutes()[0];
                    }
                    this.$router.push(firstRoute.path);
                }
            })
        })
        .catch(err => this.error = "Email non trovata o password errata")
        .finally(() => this.loading = false);
    }

}
</script>
