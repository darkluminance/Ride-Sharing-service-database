import { createWebHistory, createRouter } from 'vue-router';
/* import Home from '@/views/Home.vue';
import About from '@/views/About.vue'; */
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

import Account from './components/Account.vue';
import LoginPage from './components/Loginform.vue';

const routes = [
	{

		path: '/',
		name: 'LoginPage',
		component: () => {
			if (localStorage.getItem('token')) {
				return Account;
			} else {
				return LoginPage;
			}
		},
	},
	{
		path: '/home',
		name: 'Account',
		component: () => {
			if (localStorage.getItem('token')) {
				return Account;
			} else {
				return LoginPage;
			}
		},
	},
];
//router ekta object
const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
