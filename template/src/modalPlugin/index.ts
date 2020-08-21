import { PluginObject } from "vue";
import ModalsContainer from './modalsContainer.vue';
import { ModalBus } from './modalBus';

var ModalPlugin: PluginObject<{}> = {
    install (Vue, options = {}) {
        if (this.installed) {
            return
        }

        Vue.component('ModalsContainer', ModalsContainer);
        this.installed = true
        
        Vue.prototype.$opModal = {
            modals: ModalBus.modals,
            show (modal, props, closeCallback = null) {
                ModalBus.addModal(modal, props, closeCallback);
            },
            closeLast() {
                ModalBus.closeLastModal();
            }
        }
    }
}

export default ModalPlugin;
