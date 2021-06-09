import { createStore } from 'vuex';

export default createStore({
	state: {
		pickupCoords: [0, 0],
		requestWaitTime: 60,
		requestGoTime: 0,

		isAuthenticated: false,

		//UserInfo
		userRating: 0.0,
		userLocation: [0, 0],
		userName: '',
		userPhoneNo: '',
		userID: '',

		//Driver info
		driverRating: 0.0,
		driverLocation: [0, 0],
		driverName: '',
		driverPhoneNo: '',
		driverID: '',
		driverArrivalTime: 0,

		//Trip info
		pickupLocation: [0, 0],
		destination: [0, 0],
		tripType: '',
		tripFare: 0,
	},
	mutations: {
		setRequestGoTime(state, gotime) {
			state.requestGoTime = gotime;
		},
		setCords(state, cord) {
			state.pickupCoords = cord;
		},
		setRating(state, rating) {
			state.userRating = rating;
		},
		setAuthentication(state) {
			console.log('Authentication true');
			state.isAuthenticated = true;
		},

		//Driver
		setDRating(state, rating) {
			state.driverRating = rating;
		},
		setDPhone(state, phn) {
			state.driverPhoneNo = phn;
		},
		setDUID(state, id) {
			state.driverID = id;
		},
		setDName(state, nm) {
			state.driverName = nm;
		},
		setDLocation(state, loc) {
			state.driverLocation = loc;
		},
		setDArrivalTime(state, time) {
			state.driverArrivalTime = time;
		},

		//Trips
		setTripType(state, tt) {
			state.tripType = tt;
		},
		setTrippickup(state, pickup) {
			state.pickupLocation = pickup;
		},
		setTripDestination(state, destination) {
			state.destination = destination;
		},
		setTripFare(state, fare) {
			state.tripfare = fare;
		},
	},
	actions: {},
	modules: {},
	getters: {
		getTripDetails(state) {
			return [
				state.pickupCoords,
				state.userRating,
				state.tripType,
				state.destination,
				state.tripFare,
			];
		},
		getDData(state) {
			return [
				state.driverID,
				state.driverName,
				state.driverPhoneNo,
				state.driverLocation,
				state.driverRating,
			];
		},
		getWaitTime(state) {
			return state.requestWaitTime;
		},
		getGoTime(state) {
			return state.requestGoTime;
		},
	},
});
