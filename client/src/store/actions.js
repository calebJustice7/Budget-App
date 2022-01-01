"use strict";
import axios from 'axios';
import Cookies from 'js-cookie';

export const eraseCookie = (c_name) => {
    Cookies.remove(c_name);
};

export const logOut = ({ commit, getters }) => {
    Cookies.remove('token');
    commit('setUser', {});
};

export const refreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    axios.post('/auth/refresh_token', {
      refresh_token: refreshToken
    }).then(res => {
      if (res && res.data.token) {
        Cookies.set('token', JSON.stringify(res.data.token))
        resolve(res.data.token);
      } else {
        reject(false);
      }
    }).catch(() => {
      reject(false);
    })
  });
};

export const checkToken = async ({ getters }) => {
  let acookie = getters['getCookie']('token');
  if (!acookie) {
    return false;
  } else {
    let cookieTokenValue = JSON.parse(acookie);
    if (!cookieTokenValue) {
      return false;
    } else {
      if (cookieTokenValue.access_token && cookieTokenValue.access_token_expires_at) {
        let nowTimestamp = Date.now();
        if (cookieTokenValue.access_token_expires_at <= nowTimestamp) {
          if (cookieTokenValue.refresh_token_expires_at && cookieTokenValue.refresh_token_expires_at <= nowTimestamp) {
            eraseCookie("token");
            return false;
          } else {
              try {
                let refreshTokenRes = await refreshToken(cookieTokenValue.refresh_token);
                if (refreshTokenRes) {
                  return true;
                } else {
                  eraseCookie("token");
                  return false;
                }
                // eslint-disable-next-line
              } catch(_e) {
                  eraseCookie("token");
                  return false;
              }
            }
          } else {
            return true;
          }
        } else {
            eraseCookie("token");
            return false;
        }
      }
    }
};