import Vue, { VNodeDirective, VNodeData } from 'vue';
import store from '@/store';
import * as OM from '@/model';


function directiveBindFn(el, binding, vnode, regExpr: RegExp, classSuffix: string){
    if(binding.value != undefined && !binding.value)
        return;

    el.classList.add('v-untouched');
    let vmodelIndex = vnode.data.directives.findIndex(x => x.name == 'model');
    let vmodelValue = vnode.data.directives[vmodelIndex].value;
    //if(vmodelValue == undefined || vmodelValue == null || vmodelValue == '')
    //    return;
    if(checkFunction(vmodelValue, regExpr)){
        el.classList.add('v-valid-' + classSuffix);
    } else {
        el.classList.add('v-invalid-' + classSuffix);
    }
}
function directiveUpdateFn(el, binding, vnode, regExpr: RegExp, classSuffix: string){
    let vmodelIndex = vnode.data.directives.findIndex(x => x.name == 'model');
    let vmodelDirective = vnode.data.directives[vmodelIndex];
    if(vmodelDirective.oldValue === undefined || vmodelDirective.value === vmodelDirective.oldValue)
        return;


    el.classList.remove('v-untouched');

    el.classList.remove('v-invalid-' + classSuffix);
    el.classList.remove('v-valid-' + classSuffix);
    if (binding.value != undefined && !binding.value) {
        return;
    }

    let vmodelValue = vmodelDirective.value;
    if(checkFunction(vmodelValue, regExpr)){
        el.classList.add('v-valid-' + classSuffix);
    } else {
        el.classList.add('v-invalid-' + classSuffix);
    }
}
function checkFunction(val, regExp){
    if(val === null || val === undefined)
        return false;
    val = val.toString().trim();
    if(!regExp){
        return !!val;
    } else {
        if(regExp.test(val)){
            return true;
        } else {
            return false;
        }
    }
}
Vue.directive('required', {
    bind: (el, binding, vnode) => {
        directiveBindFn(el, binding, vnode, null, 'required'); 
    },
    update: (el, binding, vnode) => {
        directiveUpdateFn(el, binding, vnode, null, 'required');
    }
});
Vue.directive('number', {
    bind: (el, binding, vnode) => {
        let regExp = new RegExp(/^(-?\d+\.\d+)$|^(-?\d+)$/gm)
        directiveBindFn(el, binding, vnode, regExp, 'number'); 
    },
    update: (el, binding, vnode) => {
        let regExp = new RegExp(/^(-?\d+\.\d+)$|^(-?\d+)$/gm)
        directiveUpdateFn(el, binding, vnode, regExp, 'number');
    }
});

// Vue.directive('number', {
//     update: function(el, binding, vnode) {
//         if(el.tagName.toLowerCase() != 'input'){
//             console.error('v-number directive is not on tag input, but on tag ' + el.tagName);
//             return;
//         }
        
//         el.classList.remove('v-invalid-number');
//         el.classList.remove('v-valid-number');
        
//         let regex = new RegExp("^(-?\d+\.\d+)$|^(-?\d+)$", "gm");
//         let val = (<HTMLInputElement>el).value;
//         if(regex.test(val)){
//             el.classList.add('v-valid-number');
//         } else {
//             el.classList.add('v-invalid-number');
//         }
//     }
// });

export let telephoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
Vue.directive('telephone', 
    function (el: HTMLElement, binding: VNodeDirective, vnode) {
        el.classList.remove('v-invalid-telephone');
        el.classList.remove('v-valid-telephone');

        let vmodelIndex = vnode.data.directives.findIndex(x => x.name == 'model');
        let vmodelValue = vnode.data.directives[vmodelIndex].value;
        if(el.tagName.toLowerCase() != 'input' && el.tagName.toLowerCase() != 'select'){
            console.error('v-telephone directive is not on tag input or select, but on tag ' + el.tagName + ". Se è una textarea aggiusta la cosa");
            return;
        }

        let found = vmodelValue.match(telephoneRegex);
        if(!found){
            el.classList.add('v-invalid-telephone');
        }
})

Vue.directive('date', function(el, binding, next, prev){
    if(el.tagName.toLowerCase() != 'input'){
        console.error('v-date directive must be used on input tags. use type="date"');
        return;
    }
    if(el.getAttribute('type') != 'date'){
        console.error('v-date directive must be used on input with type="date"');
        return;
    }
    let modelDirectiveIndex = next.data.directives.findIndex(x => x.name == 'model');
    if(modelDirectiveIndex == -1){
        console.error('v-date directive requires v-model on element');
        return;
    }
    let val = next.data.directives[modelDirectiveIndex].value;
    if(val){
        (<HTMLInputElement>el).value = validateDate(val);
    }
})

function validateDate(inputDate: string){
    let date = new Date(inputDate);
    if(isValidDate(date)){
        let years = date.getFullYear().toString();
        while(years.length < 4){
            years = "0" + years;
        } 
        let months = (date.getMonth() + 1).toString();
        if(months.length < 2) months = "0" + months;
        let days = date.getDate().toString();
        if(days.length < 2) days = "0" + days;
        return years +  "-" + months + "-" + days;
    }
}
function isValidDate(d: any) {
    return d instanceof Date && !isNaN(<any>d);
}


