<template>
	<!-- The root vue file -->

	<!-- If client -->
	<div v-if="userdata.type === 'C'" class="Client">
		<div v-if="loaded" class="appcontainer">
			<WelcomeMenu
				:user="this.userdata"
				:cliverdata="this.cliverdata"
				:welcomep1="'Click on any part of the map'"
				:welcomep2="'to set the destination'"
				:type="'C'"
				v-if="!isRouteSearching"
			></WelcomeMenu>

			<Menubar
				:sl="this.sloc"
				:el="this.tloc"
				:sp="this.rfarestan"
				:pp="this.rfareprem"
				@resetRoutes="clearRoutes"
				@lookTrip="searchTrip"
				v-if="isRouteSearching && !isTripAccepted"
			></Menubar>

			<AcceptRequestMenu v-if="isTripAccepted" @cancelTrip="canceltrip">
			</AcceptRequestMenu>

			<MapClient
				@updatestartlocationnamevalue="getname"
				@routesearched="isRouteSearching = true"
				@updatelocation="updateuserlocation"
				ref="mapComponent"
			></MapClient>
		</div>
	</div>

	<!-- If driver -->
	<div class="driver" v-if="userdata.type === 'D'" style="display: flex;">
		<map-driver
			@updatelocation="updateuserlocation"
			ref="dmapComponent"
		></map-driver>

		<welcome-menu
			:user="this.userdata"
			:welcomep1="'Click on the GO button'"
			:welcomep2="'to start searching for trips'"
			:type="'D'"
			:driverdata="this.driverdata"
			:cliverdata="this.cliverdata"
		></welcome-menu>

		<div v-if="foundreq" class="requestfound">
			<TripRequest
				@declined="declinerequest"
				@accepted="acceptrequest"
			></TripRequest>
		</div>
	</div>

	<!-- Loading screen -->
	<div v-if="!loaded" class="loading">
		<div>
			<img src="/assets/uberlogob.png" alt="" srcset="" style="width: 280px;" />
		</div>
		<CircleSpinner style="height: 48px;"></CircleSpinner>
		<div style="margin: 0; margin-bottom: 96px;"></div>
		<h2>
			Logging in...
		</h2>
	</div>
</template>

<script>
	import WelcomeMenu from '../components/WelcomeMenu.vue';
	import Menubar from '../components/Menubar.vue';
	import MapClient from '../components/MapClient.vue';
	import MapDriver from '../components/MapDriver.vue';
	import CircleSpinner from '../components/Animations/CircleSpinner';
	import TripRequest from '../components/TripRequest.vue';
	import AcceptRequestMenu from '../components/AcceptRequestMenu.vue';
	import { io } from 'socket.io-client';
	import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

	const socket = io.connect('http://localhost:5000');

	export default {
		/* props: {
			startlocname: String,
		}, */
		name: 'App',
		components: {
			WelcomeMenu,
			Menubar,
			MapClient,
			MapDriver,
			CircleSpinner,
			TripRequest,
			AcceptRequestMenu,
		},

		data() {
			return {
				sloc: '',
				tloc: '',
				rfarestan: 0,
				rfareprem: 0,
				isRouteSearching: false,
				uid: '',
				userdata: {},
				loaded: false,
				cliverdata: {},
				driverdata: {},
				connection: null,
				foundreq: false,
				isTripAccepted: false,
				socketid_of_requester: '',
				tripdetails: null,
			};
		},

		computed: {
			...mapGetters(['getTripDetails']),
			/* tripdetails(){
				return 
			} */
		},

		created() {
			window.onbeforeunload = () => {
				socket.emit('leave', socket.id);
			};

			socket.on('cancelled', (data) => {
				this.isTripAccepted = false;
				this.socketid_of_requester = '';
				this.tripdetails = null;
				this.foundreq = false;
				this.isRouteSearching = false;

				if (this.userdata.type === 'D')
					this.$refs.dmapComponent.clearTheRoute();
				else if (this.userdata.type === 'C')
					this.$refs.mapComponent.clearTheRoute();
			});

			socket.on('accepted', (data, ddata) => {
				if (this.userdata.type === 'C' && !this.isTripAccepted) {
					console.log('Accepted yeaaa');
					console.log(data, ddata);
					this.isTripAccepted = true;

					this.$store.commit('setDID', ddata[0]);
					this.$store.commit('setDRating', ddata[4]);
					this.$store.commit('setDPhone', ddata[2]);
					this.$store.commit('setDName', ddata[1]);
					this.$store.commit('setDLocation', ddata[3]);

					this.$refs.mapComponent.tripFoundTrue(ddata[3][0], ddata[3][1]);
				}
				/* this.acceptid = data;
				this.accepted = true; */
			});

			socket.on('request', (socketid, tdata) => {
				if (this.userdata.type === 'D' && !this.foundreq) {
					this.foundreq = true;
					this.socketid_of_requester = socketid;
					this.tripdetails = tdata;
					console.log('The user bitch is at ', tdata[0]);
					this.$refs.dmapComponent.gettheroute(tdata[0][0], tdata[0][1]);
					this.$store.commit('setTripType', tdata[2]);
					this.$store.commit('setRating', tdata[1]);
					this.$store.commit('setTrippickup', tdata[0]);
					this.$store.commit('setTripDestination', tdata[3]);
					this.$store.commit('setTripFare', tdata[4]);

					console.log(
						this.socketid_of_requester,
						' Got request ',
						this.tripdetails
					);

					setTimeout(() => {
						if (!this.isTripAccepted) {
							this.foundreq = false;
							this.$refs.dmapComponent.clearTheRoute();
						}
					}, this.$store.getters.getWaitTime * 1000);
				}
			});

			socket.on('connect', () => {
				console.log(socket.id);
				// this.id = socket.id;
			});
		},

		methods: {
			...mapMutations[('setDData', 'setDName', 'setDPhone', 'setDUID')],
			...mapGetters['getDData'],

			sendrequest() {
				let tripdetails = this.$store.getters.getTripDetails;
				console.log(tripdetails);
				socket.emit('request', socket.id, tripdetails);
			},

			acceptrequest() {
				this.isTripAccepted = true;
				this.foundreq = false;

				this.$store.commit('setDName', this.userdata.name);
				this.$store.commit('setDPhone', this.userdata.phone);
				this.$store.commit('setDUID', this.uid);

				let drdata = this.$store.getters.getDData;

				socket.emit('accepted', this.socketid_of_requester, drdata);
			},

			declinerequest() {
				if (this.userdata.type === 'D') {
					this.socketid_of_requester = '';
					this.tripdetails = null;
					this.foundreq = false;
					this.$refs.dmapComponent.clearTheRoute();
				}
			},

			canceltrip() {
				this.isTripAccepted = false;
				this.socketid_of_requester = '';
				this.tripdetails = null;
				this.foundreq = false;
				this.isRouteSearching = false;

				if (this.userdata.type === 'D')
					this.$refs.dmapComponent.clearTheRoute();
				else if (this.userdata.type === 'C')
					this.$refs.mapComponent.clearTheRoute();

				socket.emit('cancelled', this.socketid_of_requester);
			},

			getname(value, value2, f1, f2) {
				this.sloc = value;
				this.tloc = value2;
				this.rfarestan = f1;
				this.rfareprem = f2;
			},

			clearRoutes() {
				this.$refs.mapComponent.clearTheRoute();
				this.isRouteSearching = false;
			},

			searchTrip() {
				this.$refs.mapComponent.searchForTrips();
				this.sendrequest();
			},

			async getUserID(un) {
				let user_id = null;

				await fetch(`http://localhost:5000/getuserid/${un}`)
					.then((res) => res.json())
					.then((data) => {
						user_id = data;
						this.uid = user_id[0];
					})
					.catch((err) => {
						console.log(err, 'Error!!!');
						alert('Sorry could not find user. Try again');
						location.reload();
					});
			},

			async updateuserlocation(loc) {
				var sendingdata = {};

				if (this.userdata.type === 'C') {
					sendingdata = {
						u_id: this.userdata.uid,
						user_typ: 'C',
						C_Location_X: loc[0],
						C_Location_Y: loc[1],
					};
				} else if (this.userdata.type === 'D') {
					sendingdata = {
						u_id: this.userdata.uid,
						user_typ: 'D',
						DR_Location_X: loc[0],
						DR_Location_Y: loc[1],
					};
				}

				// console.log('to send', sendingdata);

				fetch('http://localhost:5000/updateuserlocation', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(sendingdata),
				})
					.then((response) => response.json())
					.then((data) => {
						// console.log('Success:', data);
					})
					.catch((error) => {
						console.error('Error:', error);
						alert('An error occured. Please reload the page again');
					});
			},

			async getCliverData() {
				let udata = null;

				let fetched = await fetch(
					`http://localhost:5000/getcliverdata/${this.uid}`
				)
					.then((res) => res.json())
					.then((data) => {
						udata = data[0];
						this.cliverdata = {
							uid: udata[0],
							total_rating: udata[1],
							total_trips: udata[2],
						};
						console.log(this.cliverdata);
					})
					.catch((err) => console.log(err, 'Error!!!'));

				/* setTimeout(() => {
					this.cliverdata = {
						uid: udata[0],
						total_rating: udata[1],
						total_trips: udata[2],
					};
					console.log(this.cliverdata);
				}, 1800); */
			},

			async getDriverData() {
				let udata = null;

				let fetched = await fetch(
					`http://localhost:5000/getdriverdata/${this.uid}`
				)
					.then((res) => res.json())
					.then((data) => {
						udata = data[0];
						this.driverdata = {
							uid: udata[0],
							total_earning: udata[1],
						};
						console.log('Driver', this.driverdata);
					})
					.catch((err) => console.log(err, 'Error!!!'));

				/* setTimeout(() => {
					this.deepcliverdata = {
						uid: udata[0],
						DR_Location_X: udata[1],
						DR_Location_Y: udata[2],
					};
					console.log(this.deepcliverdata);
				}, 1800); */
			},

			async getUserData() {
				let udata = null;

				let fetched = await fetch(
					`http://localhost:5000/getuserdata/${this.uid}`
				)
					.then((res) => res.json())
					.then((data) => {
						udata = data[0];
						this.userdata = {
							uid: udata[0],
							name: udata[1] + ' ' + udata[2],
							phone: udata[3],
							dob: udata[4],
							age: udata[5],
							type: udata[6],
							username: udata[7],
						};

						//Data is loaded
						this.loaded = true;
					})
					.catch((err) => console.log(err, 'Error!!!'));

				/* setTimeout(() => {
					this.userdata = {
						uid: udata[0],
						name: udata[1] + ' ' + udata[2],
						phone: udata[3],
						dob: udata[4],
						age: udata[5],
						type: udata[6],
						username: udata[7],
					};

					//Data is loaded
					this.loaded = true;
				}, 2800); */
			},
		},

		mounted() {
			//WHen loaded, asks the user to enter the username. Then find the user id of the username
			/* var promp = prompt('Please enter your username', '');
			this.getUserID(promp); */
			this.uid = localStorage.getItem('token');
			console.log(this.uid);
			/* this.getUserID('confusedungabunga'); */
			/* this.getUserID('noobmaster69'); */

			//Now after 800ms search the database for the user data of that user id
			setTimeout(() => {
				this.getUserData();
			}, 800);

			//Now after 800ms search the database for the cliver data of that user id
			setTimeout(() => {
				this.getCliverData();
			}, 800);

			//Now after 800ms search the database for the client or driver data of that user id
			setTimeout(() => {
				if (this.userdata.type === 'D') this.getDriverData();
			}, 1800);

			this.$store.commit('setTripType', 'Standard');
		},
	};
</script>

<style>
	#app {
		/* font-family: Avenir, Helvetica, Arial, sans-serif; */
		/* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #eee;
		/* margin-top: 60px; */
	}
	body {
		margin: 0;
		background: rgb(28, 28, 28);
	}
	.appcontainer {
		width: 100vw;
		/* height: 100vh; */
		display: flex;
	}
	.loading {
		background: #eee;
		width: 100%;
		height: 100%;
		z-index: 999;
		position: fixed;
		top: 0%;
		left: 0%;
		color: rgb(28, 28, 28);
		font-size: 1.18rem;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.loading h2 {
		font-size: 2rem;
		font-style: bold;
	}

	.requestfound {
	}
</style>
