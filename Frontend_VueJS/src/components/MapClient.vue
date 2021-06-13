<!-- HTML part of the code -->
<template>
	<!--		The map data will be inside this div  -->
	<div id="mapid"></div>

	<!-- Loading screen will show only if anything is loading. It's controlled by a boolean value -->
	<div v-if="isLoading" class="loadingScreen">
		<!-- There are three types of loading animations. Each will show depending on what's being loaded -->
		<!-- Square loading will be while logging in -->
		<!-- Cube loading will be when a destination has been selected and the route is being searched -->
		<!-- Pulse loading will occur when searching for a trip -->
		<div v-if="spinShape === 'square'">
			<SquareSpinner></SquareSpinner>
		</div>

		<div v-if="spinShape === 'pulse'">
			<PulseSpinner></PulseSpinner>
			<h2>
				Searching for trips
			</h2>
		</div>

		<div v-if="spinShape === 'cube'">
			<CubeSpinner></CubeSpinner>
			<h2>
				Checking for available routes
			</h2>
		</div>
	</div>

	<!-- Location pointer Button. Clicking this will make the map cursor to fly to the current location  -->
	<div @click="flytolocation" class="locationbtnl">
		<img src="/assets/curloc.png" alt="" srcset="" />
	</div>
</template>

<script>
	// Imports necessary files for the program
	import { computed, onMounted, ref } from 'vue';
	import SquareSpinner from './Animations/SquareSpinner';
	import PulseSpinner from './Animations/PulseSpinner';
	import CubeSpinner from './Animations/CubeSpinner';
	import { useStore } from 'vuex';

	export default {
		props: { user_id: '' },
		components: { SquareSpinner, PulseSpinner, CubeSpinner },
		setup(props, context) {
			const store = useStore(); //Using vuex store. Same as this.$store
			var curlocation = ref([0, 0]); //Storing the current location
			var startlocation = ref([0, 0]); //Storing the current location
			var startlocationname = ref(''); //Storing the start location name
			var targetlocation = ref([0, 0]); //Storing the target location
			var targetlocationname = ref(''); //Storing the target location name
			var mymap = null; //Stores the map data
			var locmarker = ref(null); //The marker data of current location
			var routestorage = null; //For storing the route data between start point and destination point
			var firsttime = true; //Whether it's user's first time
			let rfare = 0; //The expected fare for the trip for standard trip
			let rprem = 0; //The expected fare for the trip for premium trip
			let isLocationEnabled = false; //Whether location access is given or not
			let isLoading = ref(true); //Whether the screen is loading anything or not
			let spinShape = ref('cube'); //The shape of the loading screen
			var carmarker = ref(null); //Marker of each driver for pushing in the map
			let driverMarkers = ref(null); //Stores the markers of the drivers in range
			let circlelayer = ref(null); //The small circle around the user's location
			let firstClick = false; //To prevent users from setting start location at first before setting destination
			let isTripSearching = ref(false); //Checks if trip is being searched or not
			let isTripFound = ref(false); //Checks if trip is found after search

			//Get the map data from the API
			const getMapData = () => {
				//Making the map and adding the tiles
				mymap = L.map('mapid');

				//This is show the map
				L.tileLayer(
					'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
					{
						attribution:
							'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
						maxZoom: 21,
						id: 'mapbox/streets-v11',
						tileSize: 512,
						zoomOffset: -1,
						accessToken:
							'pk.eyJ1IjoiZGFya2x1bWluYW5jZSIsImEiOiJja3B0bmdodXQwc2swMnFwOHg0cnNsdHJoIn0.EBXOdyWxjG2OPtO3d2hbRw',
					}
				).addTo(mymap); //Add the tilelayer to the map variable

				/* 
				Alternate tile map. Image style. Use this if lags or map loads slowly
				 */
				/* L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png', {
					attribution:
						'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
					maxZoom: 17,
					minZoom: 9,
				}).addTo(mymap); */

				//Adding the marker with custom icon
				var mapIcon = L.icon({
					iconUrl: 'https://i.imgur.com/QEBEeOP.png',

					iconSize: [28, 28], // size of the icon
					iconAnchor: [14, 14], // point of the icon which will correspond to marker's location
				});

				locmarker = L.marker([0, 0], { icon: mapIcon }).addTo(mymap);

				//search functionality..Pochondo hoynai eta
				/* var searchControl = L.esri.Geocoding.geosearch().addTo(mymap);

				var results = L.layerGroup().addTo(mymap);

				searchControl.on('results', function(data) {
					results.clearLayers();
					for (var i = data.results.length - 1; i >= 0; i--) {
						results.addLayer(L.marker(data.results[i].latlng));
						let pointloc = [];
						pointloc.push(data.results[i].latlng.lat);
						pointloc.push(data.results[i].latlng.lng);
						targetlocation.value = pointloc;
						//gettheroute(pointloc[0], pointloc[1]);
					}
				}); */
				L.Control.geocoder().addTo(mymap); //This search bar is better

				//Checks for any click on the map
				mymap.on('click', function(e) {
					//If the click is alt + left click, then set the starting point but only if destination is set
					//The click event will be click collected with the local variable e from where we can get the map cords
					if (e.originalEvent.altKey) {
						startlocation.value = [e.latlng.lat, e.latlng.lng];
						getstartpositionname(e.latlng.lat, e.latlng.lng);
					} else {
						let pointlocc = [e.latlng.lat, e.latlng.lng];
						targetlocation.value = pointlocc;
						getpositionname(e.latlng.lat, e.latlng.lng);
						firstClick = true; //Destination is set which means user can set start location now
					}
					if (firstClick)
						gettheroute(targetlocation.value[0], targetlocation.value[1]);
				});
			};

			//Get the current location of the user
			function getLocation() {
				if (navigator.geolocation) {
					return new Promise((showPosition) => {
						navigator.geolocation.getCurrentPosition(showPosition, showError);
					});
				} else {
					alert(
						'Cannot find the location. Please check your GPS or browser compatibility and reload.'
					);
				}
			}
			async function findloc() {
				let calculatedPos = await getLocation();
				let foundpos = [
					calculatedPos.coords.latitude,
					calculatedPos.coords.longitude,
				];
				setthepos(foundpos); //For plotting the current obtained location in the map
			}
			function showPosition(position) {
				return [position.coords.latitude, position.coords.longitude];
			}
			function showError(error) {
				console.log(error.message);
				alert('Please enable your location access');
				isLocationEnabled = false;
			}
			function setthepos(loca) {
				locmarker.setLatLng(loca);

				//Clears the location circle
				mymap.removeLayer(circlelayer);
				circlelayer = L.layerGroup();
				circlelayer.clearLayers();

				//Sets the radius of the circle
				var radius = 25;

				//---------------CHANGE THIS circleMarker() to circle() AND REMOVE SET RADIUS PART IF ANY ERROR ----------
				//Add the circle to the circle layer
				circlelayer.addLayer(
					L.circle(loca, radius, {
						opacity: 0.5,
						weight: 1,
						fillOpacity: 0.2,
					})
				);
				// .setRadius(420 / zoomlevel.value)
				//.addTo(mymap);

				//First time done so map loaded now set the viewpoint to the user's cur location
				if (firsttime && !isLocationEnabled) {
					mymap.setView(loca, 18, { animate: true, duration: 0.75 });
					isLoading.value = false;
				}

				//Add the circle layer to the map
				mymap.addLayer(circlelayer);

				curlocation.value = loca;

				isLocationEnabled = true; //Since we successfully got the location which means location access is on

				if (firsttime) startlocation.value = curlocation.value;
			}

			//Function to start searching for trips
			function searchForTrips() {
				store.commit('setCords', [
					startlocation.value[0],
					startlocation.value[1],
				]); //Set the pickup cords in vuex
				store.commit('setTrippickup', [
					startlocation.value[0],
					startlocation.value[1],
				]); //Set the pickup cords in vuex
				store.commit('setTripDestination', [
					targetlocation.value[0],
					targetlocation.value[1],
				]);
				store.commit('setULocation', [
					startlocation.value[0],
					startlocation.value[1],
				]);

				spinShape.value = 'pulse';
				isLoading.value = true; //Animate 'Searching for trips'
				isTripSearching.value = true; //Now searching for trips

				setTimeout(() => {
					spinShape.value = '';
					isTripSearching.value = false; //Stop searching

					if (isTripFound.value == false) {
						alert('Sorry, no trips are found');
					}

					isLoading.value = false;
				}, store.getters.getWaitTime * 1000);
			}

			//Called from App.vue in order to set isTripFound = true. Hectic IKR
			function tripFoundTrue(x, y) {
				isTripFound.value = true;

				spinShape.value = '';
				isLoading.value = false; //Animate 'Searching for trips'
				isTripSearching.value = false; //Now searching for trips
				// alert('Trip has been found');
				let sxpo = startlocation.value[0];
				let sypo = startlocation.value[1];

				clearTheRoute();
				// console.log(x, y);

				setTimeout(() => {
					gettheroute(x, y, sxpo, sypo, true);
				}, 800);
			}

			//Find the best path between user's start location and destination
			async function gettheroute(xpos, ypos, sx = 0, sy = 0, isDriver = false) {
				spinShape.value = 'cube';
				isLoading.value = true; //Animate 'Checking for routes'

				//Clear previous routes
				if (routestorage != null) {
					mymap.removeControl(routestorage);
					routestorage = null;
				}

				//Custom marker for route points
				var fromIcon = new L.Icon({
					iconUrl: 'https://i.imgur.com/dj2M62Z.png', //Home icon for start location
					iconSize: [20, 20],
					iconAnchor: [10, 12],
				});
				var toIcon = new L.Icon({
					iconUrl: 'https://i.imgur.com/i0DSvtU.png', //Circle icon for destination
					iconSize: [20, 20],
					iconAnchor: [10, 12],
				});

				let slx = 0;
				let sly = 0;

				if (isDriver) {
					slx = sx;
					sly = sy;
				} else {
					slx = startlocation.value[0];
					sly = startlocation.value[1];
				}

				//Store the new route and add it to the map using leaftlet js function
				routestorage = L.Routing.control({
					//The coordinates to be included in the route
					waypoints: [L.latLng(slx, sly), L.latLng(xpos, ypos)],
					//Route line styling
					lineOptions: {
						styles: [{ color: '#6c5ce7', opacity: 1, weight: 5 }],
					},
					routeWhileDragging: true,
					autoRoute: true,

					//Sets the start and end location markers
					createMarker: function(i, wp, nWps) {
						if (i === 0) {
							// here change the starting and ending icons
							return L.marker(wp.latLng, {
								icon: fromIcon, // here pass the custom marker icon instance
							});
						} else if (i === nWps - 1) {
							// here change the starting and ending icons
							return L.marker(wp.latLng, {
								icon: toIcon, // here pass the custom marker icon instance
							});
							/* .bindPopup('Hello World')
								.on('add', function(event) {
									event.target.openPopup();
								}); */
						} else {
							// here change all the others
							return L.marker(wp.latLng, {
								icon: toIcon,
							});
						}
					},
				}).addTo(mymap);
				routestorage.hide(); //Hide the route details

				let routedist = 0; //The distance between the start and end point
				let routedtime = 0; //Possible time to reach the destination

				//If route is found
				await new Promise(() =>
					routestorage.on('routesfound', function(e) {
						var routes = e.routes;
						var summary = routes[0].summary;

						routedist = summary.totalDistance;
						routedtime = summary.totalTime;
						store.commit('setTripDuration', routedtime / 60);

						var basefare = 40;
						var basefareprem = 80;
						var costperminute = 3;
						var timeofride = routedtime / 60;
						var costperkm = 21;
						var costperkmprem = 25;
						var ridedistance = routedist / 1000;
						var bookingfee = 30;

						//Standard trip fare
						var ridefare =
							basefare +
							(costperminute * timeofride + costperkm * ridedistance) +
							bookingfee;

						//Premium trip fare
						var ridefareprem =
							basefareprem +
							(costperminute * timeofride + costperkmprem * ridedistance) +
							bookingfee;

						ridefare = Math.round(ridefare);
						ridefareprem = Math.round(ridefareprem);

						rfare = ridefare;
						rprem = ridefareprem;

						getpositionname(xpos, ypos);

						//Perform this after 1000ms i.e, 1s of finding the route
						setTimeout(() => {
							/* console.log(
								'Total distance is : ' +
									routedist / 1000 +
									' km.\n' +
									'Total time is : ' +
									routedtime / 60 +
									' minutes.\n' +
									'Destination is : ' +
									targetlocationname.value +
									'\nFrom : ' +
									startlocationname.value +
									'\nEstimated fare for the trip is : Tk. ' +
									ridefare
							); */

							//Send the start end location names, trip fares to the left panel using emit function of vuejs

							store.commit('setTripPickupName', startlocationname.value);
							store.commit('setTripDestinationName', targetlocationname.value);
							if (
								startlocation.value[0] === curlocation.value[0] &&
								startlocation.value[1] === curlocation.value[1]
							)
								startlocationname.value = 'Current location';
							context.emit(
								'updatestartlocationnamevalue',
								startlocationname.value,
								targetlocationname.value,
								ridefare,
								ridefareprem
							);

							//Set the mapview to middle point of the two points
							mymap.flyTo(
								[
									(xpos + startlocation.value[0]) / 2,
									(ypos + startlocation.value[1]) / 2,
								],
								13,
								{ animate: true, duration: 1 }
							);

							isLoading.value = false;
							context.emit('routesearched'); //Tell the other files that route is found so show it to the user
						}, 1000);
					})
				);
			}

			function clearTheRoute() {
				//Clear previous routes
				if (routestorage != null) {
					mymap.removeControl(routestorage);
					routestorage = null;

					//Route cleared so jump user back to current location
					mymap.flyTo(curlocation.value, 18, {
						animate: true,
						duration: 0.75,
					});

					startlocation.value = curlocation.value;

					getstartpositionname(startlocation.value[0], startlocation.value[1]);
					store.commit('setTripPickupName', startlocationname.value);
					startlocationname.value = 'Current location';
					targetlocationname.value = '';

					context.emit(
						'updatestartlocationnamevalue',
						startlocationname.value,
						targetlocationname.value,
						rfare,
						rprem
					);
				}
			}

			//Convert the geographical coordinates into location names using REVERSE GEOCODING
			async function getpositionname(x, y) {
				var geocoding = new require('reverse-geocoding');
				var config = {
					latitude: x,
					longitude: y,
					key: 'af039561477a4dc08203210bd02e06a3',
					url:
						'https://api.opencagedata.com/geocode/v1/json?q=latitude+longitude&key=af039561477a4dc08203210bd02e06a3&pretty=1',
				};
				await new Promise(() =>
					geocoding(config, function(err, data) {
						if (err) {
							console.log(err);
							//If for some reason, unable to get the location name, just use the coords instead as name
							targetlocationname.value = `${x.toFixed(5)}, ${y.toFixed(5)}`;
							store.commit(
								'setTripDestinationName',
								`${x.toFixed(5)}, ${y.toFixed(5)}`
							);
						} else {
							//console.log(data.results[0]);
							/* console.log(
								data.results[0].components.house_number +
									' ' +
									data.results[0].components.road +
									' ' +
									data.results[0].components.residential +
									' ' +
									data.results[0].components.suburb +
									' ' +
									data.results[0].components.city
							); */
							let locname = data.results[0].formatted;
							locname = locname.replace(/unnamed road, /g, '');
							targetlocationname.value = locname;
							store.commit('setTripDestinationName', locname);
							// console.log(data.results[0]);
						}
					})
				);
			}

			//Same stuff but for start position
			async function getstartpositionname(x, y) {
				var geocoding = new require('reverse-geocoding');
				var config = {
					latitude: x,
					longitude: y,
					key: 'af039561477a4dc08203210bd02e06a3',
					url:
						'https://api.opencagedata.com/geocode/v1/json?q=latitude+longitude&key=af039561477a4dc08203210bd02e06a3&pretty=1',
				};
				await new Promise(() =>
					geocoding(config, function(err, data) {
						if (err) {
							//console.log(err);
							//If for some reason, unable to get the location name, just use the coords instead as name
							startlocationname.value = `${x.toFixed(5)}, ${y.toFixed(5)}`;
							store.commit(
								'setTripPickupName',
								`${x.toFixed(5)}, ${y.toFixed(5)}`
							);
						} else {
							let locname = data.results[0].formatted;
							locname = locname.replace(/unnamed road, /g, '');
							startlocationname.value = locname;
							store.commit('setTripPickupName', locname);
						}
					})
				);
			}

			//Will take the user back to it's current location
			function flytolocation() {
				mymap.flyTo(curlocation.value, 18, {
					animate: true,
					duration: 0.75,
				});
			}

			async function showAllDriversInRange(lat, lng) {
				// console.log(lat, lng);
				let driverLocations = [];
				let backupmarker;
				let datalength = 0;
				let debugdata = null;

				backupmarker = driverMarkers;
				driverMarkers = null; //Will make sure, every driver movement is updated
				driverMarkers = L.layerGroup();
				driverMarkers.clearLayers(); //Will make sure, every driver movement is updated

				//Using the FETCH API, tell the backend server to get the list of drivers around the user from the database
				let driverlocationfetch = await fetch(
					`http://localhost:5000/getdriverlocation/${lat}/${lng}`
				);
				let fetcheddata = await driverlocationfetch.json();

				// console.log(fetcheddata);

				driverLocations = fetcheddata.rows; //Store the driver locations in the variable
				if (fetcheddata.rows) datalength = fetcheddata.rows.length;
				// console.log(driverLocations);

				//For every driver location in the array, push its location in the variable
				try {
					if (datalength) {
						mymap.removeLayer(backupmarker);
						// console.log(backupmarker);
						for (let index = 0; index < datalength; index++) {
							var carIcon = new L.Icon({
								iconUrl: 'https://i.imgur.com/dl2jT16.png',
								iconSize: [21, 53.5],
								iconAnchor: [10.5, 26.75],
							});

							carmarker = L.marker(
								[driverLocations[index][1], driverLocations[index][2]],
								{
									icon: carIcon,
								}
							);

							driverMarkers.addLayer(carmarker);
						}
						mymap.addLayer(driverMarkers);
					}
				} catch (error) {
					console.log(error, error.message);
				}

				/* 	let fetched = await fetch(
					`http://localhost:5000/getdriverlocation/${lat}/${lng}`
				)
					.then((res) => res.json()) //Convert the data to JSON format
					.then((data) => {
						driverLocations = data.rows; //Store the driver locations in the variable
						if (data.rows) datalength = data.rows.length;
						console.log(driverLocations);

						//For every driver location in the array, push its location in the variable
						try {
							if (driverLocations) mymap.removeLayer(backupmarker);
							// console.log(backupmarker);
							for (let index = 0; index < datalength; index++) {
								var carIcon = new L.Icon({
									iconUrl: 'https://i.imgur.com/dl2jT16.png',
									iconSize: [21, 53.5],
									iconAnchor: [10.5, 26.75],
								});

								carmarker = L.marker(
									[driverLocations[index][1], driverLocations[index][2]],
									{
										icon: carIcon,
									}
								);

								driverMarkers.addLayer(carmarker);
							}
							if (driverLocations) mymap.addLayer(driverMarkers);
						} catch (error) {
							console.log(error, error.message);
						}
					})
					.catch((err) =>
						console.log(err, 'Error!!!', lat, lng, datalength, driverLocations)
					); */
				/////////////////////////////////////////////////////////////////////////////////////////////////////////////
				/* //After 800ms, reset the driver markers and show the updated one
				setTimeout(() => {
					// mymap.removeLayer(driverMarkers);

					
				}, 800); */
			}

			async function getpreviousLocation() {
				let fetched = await fetch(
					`http://localhost:5000/getlastlocation/${props.user_id}/C`
				);
				let locdata = await fetched.json();

				startlocation.value = locdata;
				curlocation.value = locdata;
			}

			//WIll fire when the page loads first
			onMounted(() => {
				spinShape.value = 'square';
				isLoading.value = true;
				getpreviousLocation();
				getMapData();
				// var timemultiple = 1; //the location will update not every time but only when the value % 15 = 0
				findloc(); //Find the current location

				//Perform updates every 2s
				setInterval(() => {
					findloc(); //Find the current location
					context.emit('updatelocationc', curlocation.value);

					// context.emit('updatelocation', curlocation.value);

					/* //Update user location to database only after specific period of time
					if (timemultiple % 15 == 0) {
						context.emit('updatelocation', curlocation.value);
						timemultiple = 1;
					}
					timemultiple = timemultiple + 1; */

					setTimeout(() => {
						// //After 800 ms, update the start location
						// setTimeout(() => {
						// 	if (firsttime) startlocation.value = curlocation.value;
						// 	/* if (isLocationEnabled && !firsttime) {
						// 		getstartpositionname(
						// 			startlocation.value[0],
						// 			startlocation.value[1]
						// 		);
						// 	} */
						// }, 800);

						//After 800 ms, send the location names, fare data to the left panel display

						// setTimeout(() => {
						// if (
						// 	startlocation.value[0] === curlocation.value[0] &&
						// 	startlocation.value[1] === curlocation.value[1]
						// )
						// 	startlocationname.value = 'Current location';
						// context.emit(
						// 	'updatestartlocationnamevalue',
						// 	startlocationname.value,
						// 	targetlocationname.value,
						// 	rfare,
						// 	rprem
						// );

						if (firsttime && isLocationEnabled) {
							firsttime = false; //If it was user's first time, achievement unlocked so don't do some stuffs next time
						}
						if (isLocationEnabled && !store.state.amIontrip)
							showAllDriversInRange(curlocation.value[0], curlocation.value[1]);
						// }, 800);
					}, 800);
				}, 1000);
			});

			//Sets up all the variables for other parts of the file or other files to access
			return {
				mymap,
				getLocation,
				showPosition,
				getMapData,
				locmarker,
				gettheroute,
				curlocation,
				targetlocation,
				routestorage,
				getpositionname,
				targetlocationname,
				startlocationname,
				getstartpositionname,
				firsttime,
				rfare,
				rprem,
				isLocationEnabled,
				clearTheRoute,
				isLoading,
				spinShape,
				showAllDriversInRange,
				carmarker,
				driverMarkers,
				circlelayer,
				flytolocation,
				isTripSearching,
				isTripFound,
				searchForTrips,
				tripFoundTrue,
				getpreviousLocation,
			};
		},
	};
</script>

<style scoped>
	#mapid {
		height: 100vh;
		width: 75vw;
		float: right;
	}

	.leaflet-control-container .leaflet-routing-container-hide {
		display: none;
		width: 0px;
		height: 0px;
	}

	.leaflet-touch .leaflet-control-layers,
	.leaflet-touch .leaflet-bar {
		border: 0px solid rgba(0, 0, 0, 0.2);
		background-clip: padding-box;
	}

	.loadingScreen {
		background: rgba(255, 255, 255, 0.85);
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
	}
	.loadingScreen h2 {
	}

	.locationbtnl {
		position: absolute;
		top: 85%;
		left: 90%;
		bottom: 10%;
		width: 32px;
		height: 32px;
		z-index: 999;
		background: #282828;
		border-radius: 50%;
		padding: 0.75em;
		filter: drop-shadow(0 0 0.5rem #6c5ce7);
	}
	.locationbtnl img {
		width: 32px;
		height: 32px;
		/* Invert color to white */
		-webkit-filter: invert(100%); /* Safari/Chrome */
		filter: invert(100%);
	}
</style>
