<template>
	<div class="fullshit"></div>
	<div class="cardcontainer">
		<div class="closebtn" @click="$emit('closetrips')">
			<i class="fas fa-times"></i>
		</div>
		<div class="tripcard">
			<h1><strong>Your Trips</strong></h1>
			<div class="trips">
				<div
					class="tripitem"
					v-for="(tripitem, index) in triptable"
					:key="tripitem.tripid"
				>
					<h1>{{ index + 1 }}</h1>
					<p><strong>Trip ID: </strong>{{ tripitem.tripid }}</p>
					<p><strong>Trip Date:</strong> {{ tripitem.date }}</p>
					<p><strong>Time: </strong>{{ tripitem.time }}</p>
					<p><strong>Driver Name: </strong>{{ tripitem.drivername }}</p>
					<p><strong>Client Name:</strong> {{ tripitem.clientname }}</p>
					<p><strong>Trip Type:</strong> {{ tripitem.type }}</p>
					<p><strong>Trip Fare: </strong>Tk. {{ tripitem.fare }}</p>
					<p>
						<strong>Pick Up Location: </strong>{{ tripitem.pickuplocation }}
					</p>
					<p><strong>Drop Off Location: </strong>{{ tripitem.destlocation }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['uid'],
		data() {
			return {
				triptable: [],
			};
		},
		computed: {},
		methods: {
			async getTripDetails() {
				let fetched = await fetch(
					`http://localhost:5000/getusertrips/${this.uid}`
				);
				let theresponse = await fetched.json();
				console.log(theresponse, 'Trips here it goes');
				theresponse.forEach((element) => {
					element[5] = element[5].replaceAll(',_Bangladesh', '');
					element[5] = element[5].replaceAll('_', ' ');
					element[6] = element[6].replaceAll(',_Bangladesh', '');
					element[6] = element[6].replaceAll('_', ' ');

					this.triptable.push({
						tripid: element[0],
						date: element[1],
						time: element[2],
						clientname: element[3],
						drivername: element[4],
						pickuplocation: element[5],
						destlocation: element[6],
						fare: element[7],
						type: element[8],
					});
				});
			},
		},
		mounted() {
			this.getTripDetails();
		},
	};
</script>

<style scoped>
	.fullshit {
		position: absolute;
		background: black;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		top: 0%;
		left: 0%;
		opacity: 0.9;
	}
	.cardcontainer {
		position: absolute;
		top: 8%;
		left: 50%;
		transform: translateX(-50%);
		width: 900px;
		/* height: 600px; */
		background: #eee;
		margin: 0;
		padding: 2rem;
		z-index: 10000;
		filter: drop-shadow(8px 8px 15px black);
	}
	.fas {
		font-size: 2rem;
	}
	.tripcard {
		color: rgb(69, 69, 69);
		/* height: 500px; */
	}

	button:hover {
		opacity: 0.38;
	}

	.closebtn {
		position: relative;
		/* top: calc(100vh - 480px - (100vh - 480px + 24px)); */
		top: -3rem;
		left: calc(100% + 3rem);
		transform: translateX(-100%);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #6c5ce7;
		margin: 0;
		z-index: 10001;
		color: #eee;
		display: flex;
		justify-content: center;
		align-items: center;
		filter: drop-shadow(8px 8px 5px black);
		padding: 0.2rem;
	}
	.tripitem {
		padding: 5rem;
		text-align: left;
	}
</style>
