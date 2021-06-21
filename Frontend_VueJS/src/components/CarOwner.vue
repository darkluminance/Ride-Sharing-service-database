<template>
	<div class="carcontainer">
		<div class="dashboard">
			<div class="navcontainer">
				<img src="/assets\uberlogo.png" alt="" srcset="" id="uberlogo" />
				<img
					src="/assets\logout.png"
					alt=""
					srcset=""
					id="settingsicon"
					@click="logoutUser"
				/>
			</div>

			<div class="dashboarditems">
				<div
					@click="changeactivemenu(1)"
					:class="{ selected: activemenu === 1 }"
				>
					<h2>Profile</h2>
				</div>
				<div
					@click="changeactivemenu(2)"
					:class="{ selected: activemenu === 2 }"
				>
					<h2>Cars</h2>
				</div>
				<div
					@click="changeactivemenu(3)"
					:class="{ selected: activemenu === 3 }"
				>
					<h2>Drivers</h2>
				</div>

				<div
					@click="changeactivemenu(4)"
					:class="{ selected: activemenu === 4 }"
				>
					<h2>Daily Earning</h2>
				</div>

				<div
					@click="changeactivemenu(5)"
					:class="{ selected: activemenu === 5 }"
				>
					<h2>Trips</h2>
				</div>
			</div>
		</div>

		<div v-if="activemenu === 1" class="carownerprofile">
			<h1>Welcome, Car Owner</h1>

			<div style="margin-top: 3rem;" class="userprofile">
				<div>
					<h1>{{ coname }}</h1>
					<p id="userphn">Phone No: {{ cophn }}</p>
					<p id="userdob">Date of Birth: {{ codob }}</p>
					<p id="userearn">Total Earning: Tk. {{ coearn }}</p>
				</div>
			</div>
		</div>

		<div v-if="activemenu === 2" class="carownercars">
			<h1>Car Owner Cars</h1>

			<div style="margin-top: 3rem;">
				<div class="cars">
					<div v-for="caritem in cocars" :key="caritem.carno" class="caritem">
						<img src="/assets\car.png" style="width: 420px; height:auto;" />
						<h2>Car No: {{ caritem.carno }}</h2>
						<h2>Color: {{ caritem.carcolor }}</h2>
						<h2>Model: {{ caritem.carmodel }}</h2>
						<h2>Car Type: {{ caritem.cartype }}</h2>
					</div>
				</div>
			</div>
		</div>

		<div v-if="activemenu === 3" class="carownerdrivers">
			<h1>Car Owner Drivers</h1>

			<div class="MommaDriver" style="margin-top: 3rem;">
				<div class="drivers">
					<div
						v-for="driveritem in codrivers"
						:key="driveritem.username"
						class="driveritem"
					>
						<!-- <h1>Driver</h1> -->
						<div class="profilecirc">
							<img src="/assets\joey.png" alt="" srcset="" id="profileimg" />
						</div>
						<br /><br />
						<p><strong>Driver Username: </strong>{{ driveritem.username }}</p>
						<p><strong>Driver Name: </strong>{{ driveritem.name }}</p>
						<!-- <p>Total Earning: {{ driveritem.total_earning }}</p> -->
						<p><strong>Phone No: </strong>{{ driveritem.phone }}</p>
						<p><strong>Date of Birth: </strong>{{ driveritem.date }}</p>
						<p><strong>Age: </strong>{{ driveritem.age }}</p>
						<p><strong>Car using: </strong>{{ driveritem.car }}</p>
					</div>
				</div>
			</div>
		</div>

		<div v-if="activemenu === 4" class="dailyearning">
			<h1>Daily Earning</h1>

			<div
				style="margin-top: 5rem; position: relative; 
				left:42%; transform: translateX(-60%); 
				max-width: 420px; "
			>
				<table class="dailyearning_inside">
					<th>
						<h3>
							Date
						</h3>
					</th>
					<th>
						<h3>
							Total Earning
						</h3>
					</th>
					<tr
						v-for="earningitem in earning"
						:key="earningitem.date"
						class="earningitem"
					>
						<!-- <h1>Driver</h1> -->
						<td>{{ earningitem.date }}</td>
						<td>Tk. {{ earningitem.earning }}</td>
						<br />
					</tr>
				</table>
			</div>
		</div>

		<div v-if="activemenu === 5" class="trips">
			<h1>Trips</h1>

			<div style="margin-top: 3rem;">
				<div class="another_trip">
					<div
						v-for="(tripitem, index) in triptable"
						:key="tripitem.tripid"
						class="tripitem"
					>
						<h1>{{ index + 1 }}</h1>
						<p><strong>Trip ID: </strong>{{ tripitem.tripid }}</p>
						<p><strong>Trip Date:</strong> {{ tripitem.date }}</p>
						<p><strong>Time: </strong>{{ tripitem.time }}</p>
						<p><strong>Driver Name: </strong>{{ tripitem.drivername }}</p>
						<p><strong>Client Name:</strong> {{ tripitem.clientname }}</p>
						<p>
							<strong>Pick Up Location: </strong>{{ tripitem.pickuplocation }}
						</p>
						<p>
							<strong>Drop Off Location: </strong>{{ tripitem.destlocation }}
						</p>
						<p><strong>Trip Fare:</strong> {{ tripitem.fare }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				coname: '',
				couname: '',
				cophn: '',
				codob: '',
				coage: 0,
				coearn: 0,
				cocars: [],
				codrivers: [],
				activemenu: 1,
				earning: [],
				triptable: [],
			};
		},
		props: {
			owner_id: '',
		},
		methods: {
			async GetCarOwnerData() {
				let fetched = await fetch(
					`http://localhost:5000/getcarownerdata/${this.owner_id}`
				);
				let theresponse = await fetched.json();
				console.log(theresponse);

				(this.couname = theresponse[0][1]),
					(this.coname = theresponse[0][2]),
					(this.codob = theresponse[0][3]),
					(this.coage = theresponse[0][4]),
					(this.cophn = theresponse[0][5]),
					(this.coearn = theresponse[0][6].toFixed(2));
			},

			async GetCarOwnerCar() {
				let fetched = await fetch(
					`http://localhost:5000/getcarownercar/${this.owner_id}`
				);
				let theresponse = await fetched.json();
				console.log(theresponse);
				this.cocars = [
					{
						carno: theresponse[0][0],
						carcolor: theresponse[0][1],
						carmodel: theresponse[0][2],
						cartype: theresponse[0][3],
					},
				];
			},

			async GetCarOwnerDriver() {
				let fetched = await fetch(
					`http://localhost:5000/getcarownerdriver/${this.owner_id}`
				);
				let theresponse = await fetched.json();
				console.log(theresponse);
				theresponse.forEach((element) => {
					this.codrivers.push({
						username: element[0],
						name: element[1],
						total_earning: element[2],
						car: element[3],
						phone: element[4],
						date: element[5],
						age: element[6],
					});
				});
			},

			async GetCarOwnerDailyEarning() {
				let fetched = await fetch(
					`http://localhost:5000/getcarownerdailyearning/${this.owner_id}`
				);
				let theresponse = await fetched.json();
				// console.log(theresponse);
				theresponse.forEach((element) => {
					this.earning.push({
						date: element[0],
						earning: element[1].toFixed(2),
					});
				});
			},
			async GetCarOwnerTrips() {
				let fetched = await fetch(
					`http://localhost:5000/getcarownertrips/${this.owner_id}`
				);
				let theresponse = await fetched.json();
				console.log(theresponse, 'Trip table here it goes');
				theresponse.forEach((element) => {

					if(element[5])
					{
						element[5] = element[5].replaceAll(',_Bangladesh', '');
						element[5] = element[5].replaceAll('_', ' ');
					}
					
					if(element[6])
					{
						element[6] = element[6].replaceAll(',_Bangladesh', '');
						element[6] = element[6].replaceAll('_', ' ');
					}
					

					this.triptable.push({
						tripid: element[0],
						date: element[1],
						time: element[2],
						drivername: element[3],
						clientname: element[4],
						pickuplocation: element[5],
						destlocation: element[6],
						fare: element[7],
					});
				});
			},

			logoutUser() {
				localStorage.removeItem('token');
				location.reload();
			},
			changeactivemenu(mi) {
				this.activemenu = mi;
			},
		},
		mounted() {
			this.GetCarOwnerData();
			this.GetCarOwnerCar();
			this.GetCarOwnerDriver();
			
			setTimeout(() => {
				this.GetCarOwnerDailyEarning();
			}, 800);

			setTimeout(() => {
				this.GetCarOwnerTrips();
			}, 1400);
		},
	};
</script>

<style scoped>
	body {
		background: #eee important;
	}
	.carcontainer {
		background: #eee;
		/* width: 100vw; */
		height: 100vh;
		margin: 0;
		color: rgb(68, 68, 68);
		/* display: grid; */
		/* display: flex; */
	}
	.dashboard {
		/* width: 25%; */
		height: 100vh;
		position: fixed;
		background: #6c5ce7;
		/* grid-column-start: 1;
		grid-column-end: 1; */
		text-align: left;
		/* min-width: 250px;
		max-width: 250px; */
		width: 300px;

		/* padding: 10%; */
	}
	.carownerprofile,
	.carownercars,
	.dailyearning,
	.trips {
		/* height: 100vh; */
		margin: 0;
		padding-top: 5%;
		/* position: relative; */
		/* grid-column-start: 2;
		grid-column-end: 6; */
		width: calc(100vw - 300px);
		float: right;
	}
	.trips {
		background-color: #eee;
		margin-left: 50px;
		width: calc(100vw - 300px);
	}
	.carownerdrivers {
		margin: 0;
		padding-top: 5%;
		/* position: relative; */
		/* grid-column-start: 2;
		grid-column-end: 6; */
		width: calc(100vw - 315px);
		float: right;
		background: #eee;
	}

	.navcontainer img#uberlogo {
		width: 108px;
		height: auto;
		float: left;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}
	.navcontainer img#settingsicon {
		width: 28px;
		height: auto;
		float: right;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}
	.dashboarditems {
		position: relative;
		margin-top: 13rem;
		color: #eee;
		padding-left: 3rem;
		cursor: pointer;
	}
	.dashboarditems div:hover {
		opacity: 0.88;
		border-left: 5px solid white;
		padding-left: 3px;
	}
	.dashboarditems .selected {
		color: rgb(78, 78, 78);
	}
	.drivers {
		/* background-color: #eee; */
		display: flex;
		flex-wrap: wrap;
		/* width: 98.5%; */
		/* // width: 1200px; */
		max-width: calc(100vw - 318px);
		justify-content: center;
		/* margin-left: auto; */
		position: relative;
		left: 50%;
		transform: translateX(-51%);
		margin-top: 5%;
		margin-bottom: 8%;
	}
	.driveritem h1 {
		position: relative;
		z-index: 5;
	}
	.driveritem p {
		position: relative;
		z-index: 5;
		display: block;
	}
	.drivers .driveritem {
		background-color: #eee;
		margin-left: 33px;
		position: relative;
		margin-bottom: 50px;
		margin-top: 50px;
		min-width: 300px;
		height: 420px;
		padding: 2rem;
		color: rgb(88, 88, 88);
		box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
		border-radius: 10px;
	}

	.drivers .driveritem:before {
		z-index: 0;

		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #6c5ce7;
		border-radius: 10px;
		transform: scaleY(0);
		transform-origin: top;
		transition: transform 0.5s;
		opacity: 1;
	}

	.drivers .driveritem:hover:before {
		border-radius: 10px;
		transform: scaleY(1);
		transform-origin: bottom;
		transition: transform 0.5s;
	}
	.drivers .driveritem:hover {
		color: #eee;
		text-shadow: 1px 1px rgba(0, 0, 0, 0.3);
		transition: 0.8s;
	}
	.driveritem p {
		text-align: left;
	}
	.another_trip {
		margin-top: 5%;
		margin-bottom: 13%;
	}

	.another_trip,
	.cars {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.tripitem {
		margin: 1.5rem;
		padding: 3rem;
		text-align: left;
		width: 800px;
		background: whitesmoke;
		/* background: #e8e8e8; */
		color: rgb(108, 108, 108);
		filter: drop-shadow(1px 1px 10px #c2c2c2);
		transition: 0.5s;
	}
	.tripitem:hover,
	.caritem:hover {
		filter: drop-shadow(1px 1px 13px #696969);
		transition: 0.25s;
	}

	.caritem {
		/* margin-top: 1.5rem; */
		padding: 2.5rem;
		width: 420px;
		background: whitesmoke;
		/* background: #e8e8e8; */
		color: rgb(108, 108, 108);
		filter: drop-shadow(1px 1px 10px #c2c2c2);
		transition: 0.5s;
	}

	.carownercars {
		margin-top: 2%;
		padding-top: 0.5%;
	}
	.userprofile {
		/* width: 420px;
		height: 500px; */
		padding: 1rem;
		padding-top: 5rem;
		padding-bottom: 8rem;
		margin: 2rem;
		margin-left: 30%;
		margin-right: 30%;
		background: #e1e1e1;
		color: rgb(88, 88, 88);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: 0.5s;
	}
	.userprofile h1 {
		font-size: 2.5rem;
	}
	.userprofile:hover {
		background: #c7c7c7;
		transition: 0.65s;
		border-radius: 50%;
	}
	#userphn {
		font-size: 1.3rem;
	}
	#userdob {
		font-size: 1rem;
	}
	#userearn {
		font-size: 1.5rem;
	}
	#userphn,
	#userdob,
	#userearn {
		padding: 5px;
	}

	.navcontainer {
		background: rgb(48, 48, 48);
		width: calc(252px);
		height: 120px;
		position: absolute;
		top: 0;
		left: 0;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	td {
		padding: 2rem;
		min-width: 280px;
		font-size: 18px;
	}

	tr {
		background: #e8e5ff;
		transition: 0.5s;
	}
	tr:nth-child(2n) {
		background: #cdc9ff;
	}
	tr:hover {
		opacity: 0.69;
		filter: drop-shadow(1px 1px 13px #696969);
		transition: 0.15s;
	}
	th {
		padding: 1rem;
		background: rgb(69, 69, 69);
		color: #eee;
	}
	table {
		border-collapse: collapse;
		border-radius: 8px;
		border-style: hidden; /* hide standard table (collapsed) border */
		box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}
	.profilecirc {
		border-radius: 50%;
		position: relative;
		top: 10%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120px;
		height: 120px;
		margin: 0;
		margin-top: 30px;
		padding: 0;
		margin-bottom: -8%;
	}
	#profileimg {
		width: inherit;
		height: inherit;
		margin: 0;
		padding: 0;
	}
</style>
