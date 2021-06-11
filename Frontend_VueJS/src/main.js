import { createApp } from 'vue';
import Home from './App.vue';
import store from './store';
import router from './router';

createApp(Home)
	.use(router)
	.use(store)
	.mount('#app');

	
//TEST GITHUB