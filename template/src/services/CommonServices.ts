import Axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';

class _CommonServices {

    showSpinnerCb = () => {};
    hideSpinnerCb = () => {};
    unauthorizedCb = () => {};

    get<T = any>(url: string, params?: any, _showSpinner = true): Promise<T> {
        let req: AxiosRequestConfig = {
            params
        };
        if(_showSpinner)
            this.showSpinnerCb();
        let prom = new Promise<T>((resolve, reject) => {
            Axios.get<T>(url, req)
            .then(x => {
                resolve(x.data);
            }).catch( err => {
                reject(err);
            })
            .finally(() => {
                if(_showSpinner)
                    this.hideSpinnerCb();
            });
        });
        return prom;
    }
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig, _showSpinner = true): Promise<T> {
        if(_showSpinner)
            this.showSpinnerCb()
        let prom = new Promise<T>((resolve, reject) => {
            Axios.post(url, data, config).then(x => {
                resolve(x.data);
            }).catch( err => {
                reject(err);
            })
            .finally(() => {
                if(_showSpinner)
                    this.hideSpinnerCb();
            });
        });
        return prom;
    }
    uploadFileToUrl<T = any>(url: string, params: { [key: string]: any }, 
        onUploadProgress?: (progress: number) => void, _showSpinner = true): Promise<T> {
        var data = new FormData();
        if (params) {
            for (var key in params) {
                data.append(key, params[key]);
            }
        }
        var config = {
            onUploadProgress: function (ev: any) {
                if(typeof onUploadProgress == 'function')
                    onUploadProgress((100 * ev.loaded) / ev.total);
            }
        };
        if(_showSpinner)
            this.showSpinnerCb()
        let prom = new Promise<T>((resolve, reject) => {
            Axios.post<T>(url, data, config).then(x => {
                resolve(x.data);
            })
            .catch( err => {
                reject(err);
            })
            .finally(() => {
                if(_showSpinner)
                    this.hideSpinnerCb();
            });
        });
        return prom;
    }
    setAuthToken(token: string) {
        Axios.defaults.headers.common['Authorization'] = "Bearer " + token;
        window.localStorage.setItem('authtoken', token);
    }
    destroyToken() {
        Axios.defaults.headers.common['Authorization'] = "";
        window.localStorage.removeItem('authtoken');
    }
    constructor() {
        let token = window.localStorage.getItem('authtoken');
        if (token){
            this.setAuthToken(token);
        }
        Axios.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if(!error)
                return Promise.reject();

            if(!error.response)
                return Promise.reject(error);

            if (error.response.status == 401) {
                this.unauthorizedCb();
            } else if (error.response.status[0] == 5) {
                console.log("500");
                console.log(error);
            } else {
                if(error.response.data)
                    return Promise.reject(error.response.data);
                else
                    return Promise.reject(error);
            }
        });
    }
}

export let CommonServices = new _CommonServices();