import { ModalInput } from './classes';

export declare interface IModalPlugin {
    show: (modalComponent: Vue.VueConstructor, props: { [key: string]: any}, closeCallback?: () => void ) => void;
    closeLast();
    modals: ModalInput[];
}

declare module "vue/types/vue" {
    interface Vue {
        $opModal: IModalPlugin;
    }
}
