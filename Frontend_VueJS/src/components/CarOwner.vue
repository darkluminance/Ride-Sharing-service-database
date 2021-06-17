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
						<h2>Driver Name: {{ driveritem.name }}</h2>
						<h2>Car using: {{ driveritem.car }}</h2>
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
				coname: 'Thomas Shelby',
				couname: 'tommy',
				cophn: '4646465456',
				codob: '11/11/1912',
				coage: 102,
				coearn: 420,
				cocars: [],
				codrivers: [],
				activemenu: 1,
			};
		},
		methods: {
			logoutUser() {
				localStorage.removeItem('token');
				location.reload();
			},
			changeactivemenu(mi) {
				this.activemenu = mi;
			},
		},
		mounted() {
			this.cocars = [
				{
					carno: 'DHAKA-D-11-9999-111',
					carcolor: 'white',
					carmodel: 'X corolla',
					cartype: 'Car_X(Affordable)',
				},
			];
			this.codrivers = [
				{
					username: 'arthur',
					name: 'Arthur Shelby',
					car: 'DHAKA-D-11-9999-111',
				},
			];
		},
	};
</script>

<style>
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
