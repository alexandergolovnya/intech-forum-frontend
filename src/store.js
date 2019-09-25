import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs from 'qs';
import jwtDecode from 'jwt-decode';
import config from '../config.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    access_token: localStorage.getItem('access_token') || '',
    refresh_token: localStorage.getItem('refresh_token') || '',
    userEmail: localStorage.getItem('userEmail'),
    userId: localStorage.getItem('userId'),
    userFirstName: '',
    userMiddleName: '',
    userLastName: '',
    userAuthorities: localStorage.getItem('userAuthorities')
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, { access_token, refresh_token, userEmail, userAuthorities }) {
      state.status = 'success';
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.userEmail = userEmail;
      state.userAuthorities = userAuthorities;
    },
    register_success(state) {
      state.status = 'success';
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.access_token = '';
      state.access_token = '';
      state.userEmail = '';
      state.userAuthorities = '';
    },

    GET_CURRENT_USER(state, { userId, userEmail, userFirstName, userMiddleName, userLastName }) {
      state.userId = userId;
      state.userEmail = userEmail;
      state.userFirstName = userFirstName;
      state.userMiddleName = userMiddleName;
      state.userLastName = userLastName;
    }
  },
  actions: {
    login({ commit }, { email, password }) {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(config.oauth.client + ':' + config.oauth.client)
      }, data = {
        grant_type: 'password',
        username: email,
        password: password
      };

      console.log(config)

      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios.post('/oauth/token', qs.stringify(data), {
          headers: Object.assign(headers)
        })
          .then(response => {
            const access_token = response.data.access_token,
              refresh_token = response.data.refresh_token,
              userPrincipal = jwtDecode(access_token),
              userEmail = userPrincipal.user_name,
              userAuthorities = userPrincipal.authorities;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userAuthorities', userAuthorities);

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
            commit('auth_success', { access_token, refresh_token, userEmail, userAuthorities });
            resolve(response);
          })
          .catch(error => {
            commit('auth_error');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userAuthorities');
            reject(error);
          });
      });
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAuthorities');
        delete axios.defaults.headers.common['Authorization'];
        resolve();
      });
    },

    signup({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios.post('/accounts', {
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName
        })
          .then(resp => {
            commit('register_success');
            resolve(resp);
          })
          .catch(err => {
            commit('auth_error', err);
            reject(err);
          });
      });
    },

    getCurrentUser({ commit }) {
      axios.get('accounts/current-user')
        .then(response => {
          const userId = response.data.id;
          const userEmail = response.data.email;
          const userFirstName = response.data.firstName;
          const userMiddleName = response.data.middleName;
          const userLastName = response.data.lastName;

          localStorage.setItem('userId', userId);

          commit('GET_CURRENT_USER', { userId, userEmail, userFirstName, userMiddleName, userLastName });
        })
        .catch(error => {
          commit('auth_error', error);
        });
    }
  },
  getters: {
    isLoggedIn: state => !!state.access_token,
    authStatus: state => state.status,
    userId: state => state.userId,
    userEmail: state => state.userEmail,
    userFirstName: state => state.userFirstName,
    userMiddleName: state => state.userMiddleName,
    userLastName: state => state.userLastName,
    userAuthorities: state => state.userAuthorities,
    userFullName: state => state.userFirstName + ' ' + state.userMiddleName + ' ' + state.userLastName,
    userFirstLastName: state => state.userFirstName + ' ' + state.userLastName,
    isAdmin: state => {
      if (state.userAuthorities.includes === 'ROLE_ADMIN' || state.userAuthorities === 'ROLE_ADMIN') {
        return true;
      }
      else return false;
    }
  }
});
