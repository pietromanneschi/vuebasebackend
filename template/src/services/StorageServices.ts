import * as OM from '@/model';
import * as VM from '@/viewmodel';

class _StorageServices  {
    
    private readFromLocalStorage<T>(lsName: string): T | null {
        let data = window.localStorage.getItem(lsName);
        if(data){
            return JSON.parse(data);
        } else {
            return null;
        }
    }
    
    getUserIdentifier() {
        return this.readFromLocalStorage<string>('UserIdentifier');
    }
    setUserIdentifier(UserIdentifier: string) {
        window.localStorage.setItem('UserIdentifier', JSON.stringify(UserIdentifier));
    }

    getLoginResponse() {
        return this.readFromLocalStorage<OM.LoginResponse>('loginResponse');
    }
    setLoginResponse(loginResponse: OM.LoginResponse) {
        window.localStorage.setItem('loginResponse', JSON.stringify(loginResponse));
    }
    
}

export let StorageServices = new _StorageServices();