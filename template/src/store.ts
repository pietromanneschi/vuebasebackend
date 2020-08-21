import Vue from 'vue';
import Vuex from 'vuex';
import * as OM from '@/model'
import * as CONST from '@/const'
import { StorageServices } from '@/services/StorageServices'

Vue.use(Vuex);

let storeState = {
    user: <OM.User>null,
    loginResponse: StorageServices.getLoginResponse() || null,
    isAdmin: () => {
        return storeState.user.role == CONST.AppRole.Admin;
    },
    isManager: () => {
        return storeState.user.role == CONST.AppRole.Manager;
    },
    globalSpinner: 0,
}

let store = new Vuex.Store({
    state: storeState
});


export default store;
