<template>
    <div class="centerPageContainer bg-black">
        <div class="loginBox">
            <div class="loginLogo">
                <img src="@/img/logo.png" />
            </div>
            <form @submit.stop.prevent="recoverPassword">
                <p class="text-center">Inserisci una nuova password</p>
                <div class="form-group">
                    <label>Password</label>
                    <input class="form-control" type="password" v-model="vm.newPassword" />
                </div>
                <mini-spinner v-if="loading"></mini-spinner>
                <div class="text-center" v-else>
                    <button type="submit" class="btn btn-green">
                        Invia
                    </button>
                </div>
                <p class="text-center message" v-if="message">{{message}}</p>
                <hr />
                <router-link class="text-center" to="/">
                    Torna alla login
                </router-link>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as VM from '@/viewmodel';
import { LoginServices } from '@/services/LoginServices';
import store from '@/store';

@Component
export default class ResetPassword extends Vue {

    vm: VM.PasswordResetVm = new VM.PasswordResetVm();
    message: string = '';
    loading: boolean = false;

    created(){
        this.vm.email = <string>this.$route.query.email;
        this.vm.token = <string>this.$route.query.token;
    }

    recoverPassword(){
        if(!this.vm.newPassword)
            return;

        this.loading = true;
        this.message = '';
        LoginServices.PasswordReset(this.vm)
        .then(x => {
            this.message = "Password aggiornata! Ora puoi effettuare l'accesso";
            setTimeout(() => {
                this.$router.push('/');
            }, 3000);
        })
        .catch(err => {
            this.message = err;
        })
        .finally(() => this.loading = false)
    }
}

</script>
