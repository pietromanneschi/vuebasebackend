import { CommonServices } from "@/services/CommonServices";
import { baseUrl } from '@/config';
import * as OM from '@/model';
import * as VM from '@/viewmodel';

class _UserServices {

    GetAll(){
        return CommonServices.get<OM.User[]>(baseUrl + 'api/User/GetAll');
    }
    
    GetById(identifier: string){
        return CommonServices.get<OM.User>(baseUrl + 'api/User/GetById', {
            identifier
        });
    }
    
    Save(customer: OM.User){
        return CommonServices.post<string>(baseUrl + 'api/User/Save', customer);
    }
    
    Delete(identifier: string){
        return CommonServices.get<void>(baseUrl + 'api/User/Delete', {
            identifier
        });
    }

}

export let UserServices = new _UserServices();