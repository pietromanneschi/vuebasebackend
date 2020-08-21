import { ModalInput } from './classes'
class _ModalBus {

    addModalCb: any;
    registerAddModalCallback(cb){
        this.addModalCb = cb;
    }
    addModal(item, props, closeCallback){
        this.addModalCb(item, props, closeCallback);
    }
    
    closeLastModalCb: any;
    registerCloseLastModal(cb){
        this.closeLastModal = cb;
    }
    closeLastModal(){
        this.closeLastModalCb();
    }

    modals: ModalInput[];
    setModalsArray(arr: ModalInput[]){
        this.modals = arr;
    }

}

export const ModalBus = new _ModalBus();