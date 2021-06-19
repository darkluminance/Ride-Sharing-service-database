<template>
	<div class="carcontainer">
		<div class="dashboard">
			<div class="navcontainer">
				<img src="/assets\uberlogow.png" alt="" srcset="" id="uberlogo" />
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
			</div>
		</div>
		<div v-if="activemenu === 1" class="carownerprofile">
			<h1>Car Owner Profile</h1>

			<div style="margin-top: 3rem;">
				<h1>{{ coname }}</h1>
				<h2>Phone No: {{ cophn }}</h2>
				<h2>Date of Birth: {{ codob }}</h2>
				<h1>Total Earning: Tk. {{ coearn }}</h1>
			</div>
		</div>
		<div v-if="activemenu === 2" class="carownercars">
			<h1>Car Owner Cars</h1>

			<div style="margin-top: 3rem;">
				<div class="cars">
					<div v-for="caritem in cocars" :key="caritem.carno" class="caritem">
						<img
							src="/assets\toyotaxcorolla.png"
							style="width: 420px; height:auto;"
						/>
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

			<div style="margin-top: 3rem;">
				<div class="drivers">
					<div
						v-for="driveritem in codrivers"
						:key="driveritem.username"
						class="caritem"
					>
						<h1>Driver</h1>
						<p>Driver User Name: {{ driveritem.username }}</p>
						<p>Driver Name: {{ driveritem.name }}</p>
						<p>Total Earning: {{ driveritem.total_earning }}</p>
						<p>Car using: {{ driveritem.car }}</p>
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
					(this.coearn = theresponse[0][6]);
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
					});
				});
				/* this.codrivers = [
					{
						username: theresponse[0][0],
						name: theresponse[0][1],
						total_earning: theresponse[0][2],
						car: theresponse[0][3],
					},
				]; */
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
			this.GetCarOwnerData(), this.GetCarOwnerCar(), this.GetCarOwnerDriver();
		},
	};
</script>

<style scope>
	body {
		/* background: #eee !important; */
	}
	.carcontainer {
		background: #eee;
		/* width: 100vw; */
		height: 100vh;
		margin: 0;
		color: rgb(68, 68, 68);
		display: grid;
	}
	.dashboard {
		/* width: 25%; */
		/* height: 100vh; */
		background: #6c5ce7;
		grid-column-start: 1;
		grid-column-end: 1;
		text-align: left;

		padding: 10%;
	}
	.carownerprofile,
	.carownercars,
	.carownerdrivers {
		/* height: 100vh; */
		margin: 0;
		padding: 5%;
		/* position: relative; */
		grid-column-start: 2;
		grid-column-end: 6;
	}
	.navcontainer img#uberlogo {
		width: 108px;
		height: auto;
		float: left;
		position: relative;
		top: 0%;
	}
	.navcontainer img#settingsicon {
		width: 28px;
		height: auto;
		float: right;
		position: relative;
		top: 0%;
	}
	.dashboarditems {
		margin-top: 8rem;
		color: #eee;
		padding-left: 2rem;
		cursor: pointer;
	}
	.dashboarditems div:hover {
		opacity: 0.69;
	}
	.dashboarditems .selected {
		color: rgb(78, 78, 78);
	}
</style>
