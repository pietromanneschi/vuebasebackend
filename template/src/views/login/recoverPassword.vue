<template>
    <div class="centerPageContainer bg-black">
        <div class="loginBox">
            <!-- <div class="loginLogo">
                <img src="@/img/logo.png" />
            </div> -->
            <div class="title text-center mt-4">Recupero password</div>
            <form @submit.stop.prevent="recoverPassword" class="loginForm">
                <p class="text-center">Inserisci la tua email per recuperare la password</p>
                <div class="form-group">
                    <input class="form-control" type="email" placeholder="Email" v-model="email" />
                </div>
                <mini-spinner v-if="loading"></mini-spinner>
                <div class="text-center" v-else>
                    <button type="submit" class="btn btn-green">
                        Invia
                    </button>
                </div>
                <div class="text-center mt-2 success" v-if="message">{{message}}</div>
                <div class="text-center mt-2 error" v-if="error">{{error}}</div>
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
import { LoginServices } from '@/services/LoginServices'
import store from '@/store';

@Component
export default class RecoverPassword extends Vue {

    email: string = '';
    message: string = '';
    error: string = '';
    loading: boolean = false;

    recoverPassword(){
        if(!this.email)
            return;

        this.loading = true;
        this.message = '';
        this.error = '';
        LoginServices.AskPasswordReset(this.email)
        .then(x => {
            this.message = "Ti abbiamo inviato una mail con la procedura per il recupero";
        })
        .catch(err => {
            this.error = err;
        })
        .finally(() => this.loading = false)
    }
}

</script>
