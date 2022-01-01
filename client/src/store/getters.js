import Cookies from 'js-cookie';
"use strict";

export const getUser = state => {
    return state.user;
};

export const user = state => {
    return {...state.user, profilePicture: undefined}
}

// Usage within component: 
// this.$store.getters['getCookie'](CookieName)

export const getCookie = () => {
    return function (c_name) {
        return Cookies.get(c_name);
    };
};