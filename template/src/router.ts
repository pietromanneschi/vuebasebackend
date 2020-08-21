import Vue from 'vue';
import Router from 'vue-router';
import * as OM from '@/model';
import store from '@/store';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('./views/login/login.vue'),
        },
        {
            path: '/recoverPassword',
            name: 'recoverPassword',
            component: () => import('./views/login/recoverPassword.vue'),
        },
        {
            path: '/resetPassword',
            name: 'resetPassword',
            component: () => import('./views/login/resetPassword.vue'),
        },
        {
            path: '/',
            name: 'layout',
            component: () => import('./views/layout.vue'),
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('./views/dashboard/dashboard.vue'),
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('./views/user/users.vue'),
                },
                {
                    path: '/users/:identifier',
                    name: 'userDetail',
                    component: () => import('./views/user/userDetail.vue'),
                },
            ]
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if(window.innerWidth > 860)
                return { x: 0, y: 0 }
        }
    }
});

let adminRoutes: () => AppRoute[] = () => [
    { path: '/dashboard', text: 'Dashboard'},
    { path: '/users', text: 'Utenze'},
];
let managerRoutes: () => AppRoute[] = () => [
];

export let menuRoutes = {
    adminRoutes,
    managerRoutes,
}

class AppRoute {
    text: string;
    path: string;
}