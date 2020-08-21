import { CommonServices } from "@/services/CommonServices";
import { baseUrl } from '@/config';
import * as OM from '@/model';
import * as VM from '@/viewmodel';
import { StorageServices } from '@/services/StorageServices';
import { UserServices } from '@/services/UserServices';
import store from '@/store';

class _LoginServices {

    loginCallback = (loginResponse: OM.LoginResponse) => {
        return new Promise<void>((resolve, reject) => {
            CommonServices.setAuthToken(loginResponse.token);
            StorageServices.setUserIdentifier(loginResponse.userIdentifier);
            UserServices.GetById(loginResponse.userIdentifier)
            .then(x => {
                store.state.user = x;
                resolve();
            })
            .catch(err => {
                reject(err);
            })
        })
    }

    Login(vm: VM.LoginVm){
        return CommonServices.post<OM.LoginResponse>(baseUrl + 'api/login/Login', vm);
    }
    
    Register(user: OM.User){
        return CommonServices.post<string>(baseUrl + 'api/login/Register', user);
    }
    
    AskPasswordReset(email: string){
        return CommonServices.post<string>(baseUrl + 'api/login/AskPasswordReset', {
            email
        });
    }
    
    PasswordReset(vm: VM.PasswordResetVm){
        return CommonServices.post<void>(baseUrl + 'api/login/PasswordReset', vm);
    }

}

export let LoginServices = new _LoginServices();