<template>
    <div class="formPage">
        <h3 class="pageTitle" v-if="$route.params.identifier == '0'">Nuova utenza</h3>
        <h3 class="pageTitle" v-else>Modifica utenza</h3>
        <mini-spinner v-if="!user"></mini-spinner>
        <val-form @submit="save" class="horizontal" v-else>
            <div class="form-group">
                <label>Nome</label>
                <input class="form-control" type="text" v-model="user.name" />
            </div>
            <div class="form-group">
                <label>Cognome</label>
                <input class="form-control" type="text" v-model="user.surname" />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input class="form-control" type="email" v-model="user.loginData.email" />
            </div>
            <div class="form-group">
                <label>Password <span v-if="$route.params.identifier != '0'">(sovrascrive quella precedente)</span></label>
                <input class="form-control" type="text" v-model="user.loginData.password" />
            </div>
            <div class="form-group">
                <label>Ruolo</label>
                <select class="form-control" type="text" v-model="user.role">
                    <option value="">Ruolo</option>
                    <option v-for="(item, i) in roles" :key="i" :value="item">{{item}}</option>
                </select>
            </div>
            <div class="text-right">
                <mini-spinner v-if="saving"></mini-spinner>
                <button v-else type="submit" class="btn btn-purple">
                    Salva
                </button>
            </div>
        </val-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UserServices } from '@/services/UserServices';
import * as OM from '@/model';
import * as Const from '@/const';
import * as VM from '@/viewmodel';
import store from '@/store';

@Component
export default class UserDetail extends Vue {

    user: OM.User = null;
    saving: boolean = false;
    roles: string[] = Const.AppRole.GetAll();

    created(){
        if(this.$route.params.identifier == '0'){
            this.user = new OM.User();
        } else {
            UserServices.GetById(this.$route.params.identifier)
            .then(x => {
                x.loginData.password = "";
                this.user = x;
            })
        }
    }

    save(){
        this.saving = true;
        UserServices.Save(this.user)
        .then(x => {
            window.toastr.success("Ok!")
            if(this.$route.params.identifier == '0'){
                this.$router.replace('/users/' + x);
                this.user.identifier = x;
                this.user.loginData.password = "";
            }
        })
        .finally(() => this.saving = false);
    }

}

</script>
