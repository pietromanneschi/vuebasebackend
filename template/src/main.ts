import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/css/nunito.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/css/style.css';

import '@/filters';
import '@/directives';


import MiniSpinner from '@/components/miniSpinner.vue'
Vue.component('MiniSpinner', MiniSpinner);

import OpTable from '@/components/opTable.vue'
Vue.component('OpTable', OpTable);

import ValForm from '@/components/valForm.vue';
Vue.component('ValForm', ValForm);

import OpDate from '@/components/opDate.vue';
Vue.component('opDate', OpDate);


import OpModal from '@/modalPlugin';
Vue.use(OpModal);

Vue.config.productionTip = false;

import { UserServices } from '@/services/UserServices';

// AppConfigServices.GetConfig()
// .then(x =>{
//     store.state.config = x;
    let prom = new Promise((resolve, reject) => {
        let userId = StorageServices.getUserIdentifier();
        if(userId){
            UserServices.GetById(userId)
            .then(x => {
                store.state.user = x;
                resolve();
            })
            .catch(err => {
                resolve();
            })
        } else {
            resolve();
        }
    });

    prom.then(x => {
        new Vue({
            router,
            store,
            render: (h) => h(App),
        }).$mount('#app');
    })
// })


import { CommonServices } from '@/services/CommonServices';

CommonServices.unauthorizedCb = () => {
    if(router.currentRoute.name != 'login'){
        router.push('/?redirect=' + router.currentRoute.fullPath );
    }
}
import 'toastr/build/toastr.min.css';

import toastr from 'toastr';
import { StorageServices } from './services/StorageServices';
toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 4000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};
window.toastr = toastr;