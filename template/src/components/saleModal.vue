<template>
    <div class="opModal">
        <div class="form-group">
            <label>Cliente <small v-if="!customer">Scrivi per cercare</small></label>
            <autocomplete :list="customerList" :search-callback="searchCustomer" :obj-key="'name'"
                v-model="selectedCustomer" v-if="!customer"></autocomplete>
            <input type="text" class="form-control" readonly disabled v-else v-model="selectedCustomer.name" />
        </div>
        <div class="form-group">
            <label>Prodotto <small>(Scrivi per cercare)</small></label>
            <autocomplete :list="productList" :search-callback="searchProduct" :obj-key="'name'"
                v-model="selectedProduct"></autocomplete>
        </div>
        <div class="text-center">
            <button type="button" class="btn btn-yellow" :disabled="!selectedProduct" @click="makeSale">
                Conferma
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as OM from '@/model';
import * as VM from '@/viewmodel';
import { ProductServices } from '@/services/ProductServices';
import { CustomerServices } from '@/services/CustomerServices';
import Autocomplete from '@/components/autocomplete.vue';
import { SaleServices } from '../services/SaleServices';

@Component({
    components: {
        Autocomplete
    }
})
export default class SaleModal extends Vue {

    @Prop() customer: OM.Customer;

    selectedCustomer: OM.NameIdentifier = null;
    customerList: OM.NameIdentifier[] = [];
    selectedProduct: OM.NameIdentifier = null;
    productList: OM.NameIdentifier[] = [];

    searchCustomer(val: string){
        return this.customerList.filter(x => x.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
    }
    
    searchProduct(val: string){
        return this.productList.filter(x => x.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
    }

    makeSale(){
        if(!this.selectedCustomer || !this.selectedProduct)
            return;

        SaleServices.MakeSale({
            customerIdentifier: this.selectedCustomer.identifier,
            productIdentifier: this.selectedProduct.identifier
        })
        .then(x => {
            window.toastr.success("Vendita registrata!");
            this.$emit('close');
        })
    }

    created(){
        if(!this.customer){
            CustomerServices.GetAllAsNameIdentifier()
            .then(x => {
                this.customerList = x;
            })
        } else {
            this.selectedCustomer = {
                name: this.customer.name + " " + this.customer.surname,
                identifier: this.customer.identifier
            }
        }
        ProductServices.GetAllAsNameIdentifier()
        .then(x => {
            this.productList = x;
        })
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
