import { createStore } from 'vuex';

export default createStore({
	state: {
		pickupCoords: [0, 0],
		requestWaitTime: 25,
		requestGoTime: 0,

		isAuthenticated: false,

		//UserInfo
		userRating: 5,
		userLocation: [0, 0],
		userName: '',
		userPhoneNo: '',
		userID: '',

		//Driver info
		driverRating: 5,
		driverLocation: [0, 0],
		driverName: '',
		driverPhoneNo: '',
		driverID: '',
		driverArrivalTime: 0,

		//Trip info
		pickupLocation: [0, 0],
		pickupLocationName: '',
		destination: [0, 0],
		destinationLocationName: '',
		tripType: '',
		tripFare: [0, 0],
		tripDuration: 0,

		amIontrip: false,
		lastTripData: {},
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

		//User
		setURating(state, rating) {
			state.userRating = rating;
		},
		setUPhone(state, phn) {
			state.userPhoneNo = phn;
		},
		setUUID(state, id) {
			state.userID = id;
		},
		setUName(state, nm) {
			state.userName = nm;
		},
		setULocation(state, loc) {
			state.userLocation = loc;
		},

		//Trips
		setTripType(state, tt) {
			state.tripType = tt;
		},
		setTrippickup(state, pickup) {
			state.pickupLocation = pickup;
		},
		setTripPickupName(state, pickup) {
			state.pickupLocationName = pickup;
		},
		setTripDestination(state, destination) {
			state.destination = destination;
		},
		setTripDestinationName(state, destination) {
			state.destinationLocationName = destination;
		},
		setTripFare(state, fares, farep) {
			state.tripFare = [fares, farep];
		},
		setTripDuration(state, duration) {
			state.tripDuration = duration;
		},
		setontrip(state, bool) {
			state.amIontrip = bool;
		},

		setLastTripData(state, data) {
			state.lastTripData = data;
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
				state.tripDuration,
				state.pickupLocationName,
				state.destinationLocationName,
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
		getUData(state) {
			return [
				state.userID,
				state.userName,
				state.userPhoneNo,
				state.userLocation,
				state.userRating,
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
