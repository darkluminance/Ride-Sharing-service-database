<template>
	<!-- Menu container -->
	<div class="menu">
		<!-- Nav bar -->
		<div class="navcontainer">
			<img src="/assets\uberlogo.png" alt="" srcset="" id="uberlogo" />
			<img src="/assets\settings.png" alt="" srcset="" id="settingsicon" />
		</div>

		<div class="driverprofile">
			<div class="profilecircle"><i class="fas fa-user"></i></div>
			<div class="driverinfo">
				<h2>{{ drivername }}</h2>
				<h3><i class="fas fa-star"></i> {{ driverrating.toFixed(1)}}</h3>
			</div>
			<p>{{ driverphone }}</p>
		</div>

		<!-- <div class="tripdetail">
			<h4>Pickup: {{ trippickup.toFixed(3) }}</h4>
			<h4>Destination: {{ tripdestination.toFixed(3) }}</h4>
		</div> -->

		<!-- Button container -->
		<div class="buttons">
			<button style="background: #6c5ce7" @click="$emit('cancelTrip')">
				Cancel Trip
			</button>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

	export default {
		props: {},
		data() {
			return {
				drivername: 'Robert Downey',
				driverrating: 5,
				driverphone: '01232432432',
				driverarrivaltime: 0,

				trippickup: 'Sector 6, Uttara',
				tripdestination: 'BUET',
				tripfare: 420,
				triptype: 'Standard',

				userdata: [],
			};
		},

		//Computed functions compute the values of the variables when they are needed.
		//In short, gets dynamic values for the variables.
		//The function will run only once until the values don't get changed
		computed: {
			...mapState([
				'driverRating',
				'driverLocation',
				'driverName',
				'driverPhoneNo',
				'driverID',
				'driverArrivalTime',

				'pickupLocation',
				'pickupCoords',
				'destination',
				'tripType',
				'tripFare',
			]),
			userdata() {
				return this.$store.getters.getUData;
			},
			drivername() {
				return this.driverName;
			},
			driverrating() {
				return this.driverRating;
			},
			driverphone() {
				return this.driverPhoneNo;
			},
			driverarrivaltime() {
				return this.driverArrivalTime;
			},

			trippickup() {
				return this.pickupCoords;
			},
			tripdestination() {
				return this.destination;
			},
			tripfare() {
				return this.tripFare;
			},
			triptype() {
				return this.tripType;
			},
		},
		methods: {
			...mapMutations(['setTripType']),
		},
	};
</script>

<style scoped>
	.menu {
		width: 25vw;
		height: 100vh;
		margin: 0;
		float: left;
		background: rgb(28, 28, 28);
	}
	.menu img#uberlogo {
		width: 128px;
		height: auto;
		float: left;
		position: relative;
		top: 0%;
	}
	.menu img#settingsicon {
		width: 28px;
		height: auto;
		float: right;
		position: relative;
		top: 0%;
	}
	.navcontainer {
		margin-top: 45px;
		margin-left: 13%;
		margin-right: 13%;
		height: 80px;
	}

	h2,
	h3 {
		margin-bottom: 40px;
		color: #eee;
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE10+/Edge */
		user-select: none; /* Standard */
	}

	.buttons button {
		border-radius: 80px;
		border: none;
		color: #eee; /* White text */
		padding: 10px 24px; /* Some padding */
		cursor: pointer; /* Pointer/hand icon */
		width: 100%; /* Set a width if needed */
		display: block; /* Make the buttons appear below each other */
		height: 45px;
		margin: 18px 0;
	}

	.buttons {
		margin: 0 18%;
	}

	.profilecircle {
		background: #2d3436;
		width: 80px !important;
		height: 80px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		position: relative;
		left: 50%;
		transform: translateX(-50%);
	}

	.driverprofile {
		margin: 3rem;
	}

	.tripdetail {
		text-align: left;
		margin-left: 20%;
		margin-top: 20%;
		margin-bottom: 20%;
	}
</style>
