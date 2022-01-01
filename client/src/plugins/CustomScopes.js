"use strict";
import store from '../store/index';

export default {
    install(Vue) {
        Vue.prototype.$checkScopes = scopes => {
            let tokenScopes = JSON.parse(store.getters['getCookie']('token')).scopes;
            if (!tokenScopes) {
                return false;
            } else {
                let containsAppropriateScopes = scopes.filter(el => tokenScopes.includes(el));
                return containsAppropriateScopes.length ? true : false;
            }
        }

        Vue.directive('scopes', {
            // eslint-disable-next-line
            inserted(el, binding, vnode, oldVnode) {
                let tokenScopes = JSON.parse(store.getters['getCookie']('token')).scopes;
                if (!tokenScopes) {
                    return false;
                } else {
                    let containsAppropriateScopes;
                    if (Array.isArray(binding.value)) {
                        containsAppropriateScopes = binding.value.filter(el => tokenScopes.includes(el));
                    } else {
                        containsAppropriateScopes = tokenScopes.includes(binding.value) ? [true] : [];
                    }

                    if (!containsAppropriateScopes.length) {
                        vnode.elm.parentElement.removeChild(vnode.elm);
                    }
                }
            }
        });
    }
}