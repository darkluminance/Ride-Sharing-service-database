<template>
	<div class="fullshit"></div>
	<div class="cardcontainer">
		<div class="profile">
			<h1><strong>Trip Summary</strong></h1>
			<div style="margin-top: 3rem;">
				<h4>Trip ID: {{ $store.state.lastTripData.trip_id }}</h4>
				<h2>User: {{ $store.state.userName }}</h2>
				<h2>Driver: {{ $store.state.driverName }}</h2>
				<h2>Trip type: {{ $store.state.lastTripData.trip_type }}</h2>
			</div>

			<div class="tripinfo">
				<h3>Pickup: {{ $store.state.lastTripData.pick_up_name }}</h3>
				<h3>Destination: {{ $store.state.lastTripData.drop_off_name }}</h3>
				<h3>
					Trip time: {{ $store.state.lastTripData.start_time }} -
					{{ $store.state.lastTripData.end_time }}
				</h3>
				<h3>Fare: Tk. {{ $store.state.lastTripData.fare_amnt }}</h3>
			</div>
			<h3>Rate your trip</h3>
		</div>

		<div class="ratingbtn">
			<button style="background: #6c5ce7" @click="rate(1)">
				1
			</button>
			<button style="background: #6c5ce7" @click="rate(2)">
				2
			</button>
			<button style="background: #6c5ce7" @click="rate(3)">
				3
			</button>
			<button style="background: #6c5ce7" @click="rate(4)">
				4
			</button>
			<button style="background: #6c5ce7" @click="rate(5)">
				5
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['udata', 'clivdata'],
		data() {
			return {};
		},
		computed: {},
		methods: {
			rate(givenrating) {
				this.$emit('rate', givenrating);
			},
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
		opacity: 0.69;
	}
	.cardcontainer {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 800px;
		height: 690px;
		background: #eee;
		margin: 0;
		padding: 2rem;
		z-index: 10000;
		filter: drop-shadow(8px 8px 15px black);
	}
	.fas {
		font-size: 2rem;
	}
	.profile {
		color: rgb(69, 69, 69);
		height: 500px;
	}

	.ratingbtn {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button:hover {
		opacity: 0.38;
	}

	.ratingbtn button {
		border-radius: 80px;
		border: none;
		color: #eee; /* White text */
		padding: 10px 24px; /* Some padding */
		cursor: pointer; /* Pointer/hand icon */
		width: 69px; /* Set a width if needed */
		display: block; /* Make the buttons appear below each other */
		height: 69px;
		margin: 18px;
	}
</style>
