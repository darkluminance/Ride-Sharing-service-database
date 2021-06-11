<template>
	<div id="mapid"></div>
	<div v-if="isLoading" class="loadingScreen">
		<div v-if="spinShape === 'square'">
			<SquareSpinner></SquareSpinner>
		</div>

		<div v-if="spinShape === 'pulse'">
			<PulseSpinner></PulseSpinner>
		</div>

		<div v-if="spinShape === 'cube'">
			<CubeSpinner></CubeSpinner>
			<h2>
				Checking for available routes
			</h2>
		</div>
	</div>

	<!-- Location pointer Button -->
	<div @click="flytolocation" class="locationbtnr">
		<img src="/assets/curloc.png" alt="" srcset="" />
	</div>
</template>

<script>
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
			var mymap = null;
			var locmarker = ref(null);
			var routedvals = ref([]);
			var routestorage = null;
			var firsttime = true;
			let rfare = 0;
			let rprem = 0;
			let isLocationEnabled = false;
			let isLoading = ref(true);
			let spinShape = ref('cube');
			var carmarker = ref(null);
			let driverMarkers = ref(null);
			let circlelayer = ref(null);
			let firstClick = false;

			//Get the map data from the API
			const getMapData = () => {
				//Making the map and adding the tiles
				mymap = L.map('mapid');

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
							'pk.eyJ1IjoiZGFya2x1bWluYW5jZSIsImEiOiJja29zcGJrdDIwM291Mm9xanczMnRtNWc1In0.4y8psgTFHMCq2CR0A6AszQ',
					}
				).addTo(mymap);

				//Adding the marker with custom icon
				var mapIcon = L.icon({
					iconUrl: 'https://i.imgur.com/QEBEeOP.png',

					iconSize: [28, 28], // size of the icon
					iconAnchor: [14, 14], // point of the icon which will correspond to marker's location
				});

				locmarker = L.marker([0, 0], { icon: mapIcon }).addTo(mymap);

				L.Control.geocoder().addTo(mymap);
			};

			function getLocation() {
				if (navigator.geolocation) {
					return new Promise((showPosition) => {
						navigator.geolocation.getCurrentPosition(showPosition, showError);
					});
				} else {
					alert(
						'Cannot find the location. Please check your GPS or browser compatibility.'
					);
				}
			}

			async function findloc() {
				let calculatedPos = await getLocation();
				let foundpos = [
					calculatedPos.coords.latitude,
					calculatedPos.coords.longitude,
				];
				setthepos(foundpos);
			}

			function showPosition(position) {
				return [position.coords.latitude, position.coords.longitude];
			}
			function showError(error) {
				console.log(error.message);
				isLocationEnabled = false;
			}
			function setthepos(loca) {
				locmarker.setLatLng(loca);

				//Clears the location circle
				mymap.removeLayer(circlelayer);
				circlelayer = L.layerGroup();
				circlelayer.clearLayers();

				//Sets the radius of the circle
				var radius = 13;

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

				//Add map circle 	ONLY IF FIRST TIME
				if (firsttime && !isLocationEnabled) {
					mymap.setView(loca, 18, { animate: true, duration: 0.75 });
					isLoading.value = false;
				}

				//Add the circle layer to the map
				mymap.addLayer(circlelayer);

				curlocation.value = loca;

				isLocationEnabled = true;
			}

			//routing
			async function gettheroute(xpos, ypos) {
				console.log(
					'Asi re vai ..... ki chas',
					xpos,
					ypos,
					curlocation.value[0],
					curlocation.value[1]
				);
				//Clear previous routes
				if (routestorage != null) {
					mymap.removeControl(routestorage);
					routestorage = null;
				}

				//Custom marker for route points
				var toIcon = new L.Icon({
					iconUrl: 'https://i.imgur.com/i0DSvtU.png',
					iconSize: [20, 20],
					iconAnchor: [10, 12],
				});

				//Store the new route and add it to the map
				routestorage = L.Routing.control({
					waypoints: [
						L.latLng(curlocation.value[0], curlocation.value[1]),
						L.latLng(xpos, ypos),
					],
					lineOptions: {
						styles: [{ color: '#6c5ce7', opacity: 1, weight: 5 }],
					},
					routeWhileDragging: true,
					autoRoute: true,

					createMarker: function(i, wp, nWps) {
						if (i === nWps - 1) {
							// here change the user location icons
							return L.marker(wp.latLng, {
								icon: toIcon, // here pass the custom marker icon instance
							});
							/* .bindPopup('Hello World')
								.on('add', function(event) {
									event.target.openPopup();
								}); */
						}
					},
				}).addTo(mymap);
				routestorage.hide();

				let routedist = 0;
				let routedtime = 0;

				await new Promise(() =>
					routestorage.on('routesfound', function(e) {
						var routes = e.routes;
						var summary = routes[0].summary;
						// alert distance and time in km and minutes
						/* alert(
						'Total distance is ' +
							summary.totalDistance / 1000 +
							' km and total time is ' +
							(summary.totalTime % 3600) / 60 +
							' minutes'
					); */
						routedist = summary.totalDistance;
						routedtime = summary.totalTime;

						store.commit('setRequestGoTime', routedtime / 60); //Set the pickup time in vuex

						getpositionname(xpos, ypos);

						setTimeout(() => {
							console.log(
								'Total distance is : ' +
									routedist / 1000 +
									' km.\n' +
									'Total time is : ' +
									routedtime / 60 +
									' minutes.\n' +
									'Destination is : ' +
									targetlocationname.value +
									'\nFrom : ' +
									startlocationname.value
							);
							//Set the mapview to middle point of the two points
							mymap.flyTo(
								[
									(xpos + curlocation.value[0]) / 2,
									(ypos + curlocation.value[1]) / 2,
								],
								15,
								{ animate: true, duration: 0.5 }
							);

							// console.log(isLoading, Date.now());
						}, 1000);

						/*
					console.log(summary.totalDistance, summary.totalTime);
					//console.log(a, aa);
					console.log('the routed:');
					console.log(routedist, routedtime); */
						routedvals.value = [routedist, routedtime];
					})
				);
			}

			function clearTheRoute() {
				//Clear previous routes
				if (routestorage != null) {
					mymap.removeControl(routestorage);
					routestorage = null;

					mymap.flyTo(curlocation.value, 18, {
						animate: true,
						duration: 0.75,
					});

					startlocation.value = curlocation.value;

					getstartpositionname(startlocation.value[0], startlocation.value[1]);
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
				console.log('Routes cleared');
			}

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
						} else {
							//console.log(data.results[0]);
							console.log(
								data.results[0].components.house_number +
									' ' +
									data.results[0].components.road +
									' ' +
									data.results[0].components.residential +
									' ' +
									data.results[0].components.suburb +
									' ' +
									data.results[0].components.city
							);
							targetlocationname.value = data.results[0].formatted;
							// console.log(data.results[0]);
						}
					})
				);
			}

			function flytolocation() {
				mymap.flyTo(curlocation.value, 18, {
					animate: true,
					duration: 0.75,
				});
			}

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
							console.log(err);
						} else {
							startlocationname.value = data.results[0].formatted;
						}
					})
				);
			}

			async function getpreviousLocation() {
				let fetched = await fetch(
					`http://localhost:5000/getlastlocation/${props.user_id}/D`
				);
				let locdata = await fetched.json();

				startlocation.value = locdata;
				curlocation.value = locdata;
			}

			onMounted(() => {
				spinShape.value = 'square';
				isLoading.value = true;
				getMapData();
				getpreviousLocation();
				findloc();
				context.emit('updatelocationd', curlocation.value);

				// var timemultiple = 1;
				setInterval(() => {
					findloc();
					store.commit('setDLocation', [
						curlocation.value[0],
						curlocation.value[1],
					]);

					context.emit('updatelocationd', curlocation.value);
					/* if (timemultiple % 15 == 0) {
						context.emit('updatelocation', curlocation.value);

						timemultiple = 1;
					}
 */
					// timemultiple = timemultiple + 1;
				}, 1000);
			});

			return {
				mymap,
				getLocation,
				showPosition,
				getMapData,
				locmarker,
				gettheroute,
				routedvals,
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
				carmarker,
				circlelayer,
				flytolocation,
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

	.locationbtnr {
		position: absolute;
		top: 85%;
		left: 5%;
		bottom: 10%;
		width: 32px;
		height: 32px;
		z-index: 999;
		background: #282828;
		border-radius: 50%;
		padding: 0.75em;
		filter: drop-shadow(0 0 0.5rem #6c5ce7);
	}
	.locationbtnr img {
		width: 32px;
		height: 32px;
		/* Invert color to white */
		-webkit-filter: invert(100%); /* Safari/Chrome */
		filter: invert(100%);
	}
</style>
