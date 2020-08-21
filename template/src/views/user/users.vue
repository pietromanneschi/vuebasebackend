<template>
    <div>
        <router-link to="/users/0" class="btn btn-yellow float-right">
            Nuova utenza
        </router-link>
        <h3 class="pageTitle">Utenze</h3>
        <mini-spinner v-if="loading"></mini-spinner>
        <op-table v-else class="table table-striped" :items="users" v-slot="data">
            <thead>
                <tr>
                    <td filter="createdOn" sort="createdOn">Data creazione</td>
                    <td filter="name" sort="name">Nome</td>
                    <td filter="surname" sort="surname">Cognome</td>
                    <td filter="loginData.email" sort="loginData.email">Email</td>
                    <td></td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in data.data" :key="i">
                    <td>\{{item.createdOn | date}}</td>
                    <td>\{{item.name}}</td>
                    <td>\{{item.surname}}</td>
                    <td>\{{item.loginData.email}}</td>
                    <td>
                        <router-link class="btn btn-sm btn-yellow" :to="'/users/' + item.identifier">Modifica</router-link>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-danger" @click="removeItem(item)">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </op-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UserServices } from '@/services/UserServices';
import * as OM from '@/model';
import * as VM from '@/viewmodel';
import ConfirmModal from '@/components/confirmModal.vue';

@Component
export default class Users extends Vue {

    loading: boolean = false;
    users: OM.User[] = [];

    created(){
        this.init();        
    }

    init(){
        this.loading = true;
        UserServices.GetAll()
        .then(x => {
            this.users = x;
        })
        .finally(() => this.loading = false);
    }

    removeItem(item: OM.User){
        this.$opModal.show(ConfirmModal, {
            text: "Confermi la rimozione di " + item.name,
            okCb: () => {
                UserServices.Delete(item.identifier)
                .then(x => {
                    window.toastr.success("Utenza rimossa");
                    this.init();
                })
            }
        })
    }
}

</script>
