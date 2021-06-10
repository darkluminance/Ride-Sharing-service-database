<template>
	<!-- Menu container -->
	<div class="menu">
		<!-- Nav bar -->
		<div class="navcontainer">
			<img src="/assets\uberlogo.png" alt="" srcset="" id="uberlogo" />
			<!-- <img src="/assets\profile.png" alt="" srcset="" id="settingsicon" /> -->
		</div>

		<!-- Shows the location names -->
		<div class="locationviewer">
			<h2>Route Details</h2>

			<!-- Start location name -->
			<div class="startloc popup" :title="sl">
				{{ sl.substr(0, 20) }}...
				<i class="gg-home-alt icons"></i>
			</div>

			<!-- End location name -->
			<div class="endloc popup" :title="el">
				{{ el.substr(0, 20) }}...
				<i class="gg-edit-black-point icons"></i>
			</div>
		</div>

		<h2>Choose Class</h2>

		<!-- Trip class -->
		<div class="classes">
			<!-- Standard trip -->
			<div
				id="standard"
				class="aclass"
				:class="{ eita: !selected }"
				@click="setType(0)"
			>
				Standard
				<span style="margin-left: 69px">Tk {{ sp }}</span>
			</div>

			<!-- Premium trip -->
			<div
				id="premium"
				class="aclass"
				:class="{ eita: selected }"
				@click="setType(1)"
			>
				Premium
				<span style="margin-left: 69px">Tk {{ pp }}</span>
			</div>
		</div>

		<!-- Button container -->
		<div class="buttons">
			<button style="background: #6c5ce7" @click="emitLookTrip">
				Confirm
			</button>
			<button style="background: rgb(28, 28, 28)" @click="emitClearRoute">
				Cancel
			</button>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

	export default {
		props: {
			sl: '',
			el: '',
			sp: Number,
			pp: Number,
		},
		data() {
			return {
				startloc: this.sl,
				endloc: this.el,
				standardprice: this.sp,
				premiumprice: this.pp,
				selected: 0,
			};
		},

		//Computed functions compute the values of the variables when they are needed.
		//In short, gets dynamic values for the variables.
		//The function will run only once until the values don't get changed
		computed: {
			startloc: () => {
				return this.sl;
			},
			endloc: () => {
				return this.el;
			},
		},
		methods: {
			...mapMutations(['setTripType']),

			setType(type) {
				this.selected = type;
				let triptype = '';

				if (type === 0) {
					triptype = 'Standard';
				} else if (type === 1) {
					triptype = 'Premium';
				}

				this.setTripType(triptype);
			},

			myFunction() {
				var popup = document.getElementById('myPopup');
				popup.classList.toggle('show');
				console.log(popup.innerHTML);
			},

			emitClearRoute() {
				this.$emit('resetRoutes');
			},

			emitLookTrip() {
				this.$emit('lookTrip');
			},
		},
	};
</script>

<style scoped>
	.menu {
		width: 24vw;
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

	.locationviewer {
		margin: 0 10%;
		margin-bottom: 80px;
	}
	.classes {
		color: #d8d8d8;
		margin: 0 13%;
		margin-bottom: 69px;
	}

	h2 {
		margin-bottom: 40px;
		color: #eee;
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE10+/Edge */
		user-select: none; /* Standard */
	}

	.startloc,
	.endloc {
		color: #888;
		border: 1px solid #888;
		border-radius: 20px;
		margin: 18px;
		padding: 8px;
		padding-left: 28px;
		text-align: left;
	}

	.icons {
		float: right;
		margin-right: 13px;
		position: relative;
		color: #888;
	}

	.gg-home-alt {
		top: 8px;
	}
	.gg-edit-black-point {
		top: 3px;
	}

	.aclass {
		display: flex;
		border-radius: 80px;
		margin: 18px;
		height: 45px;
		align-items: center;
		justify-content: center;
		background: rgb(28, 28, 28);
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE10+/Edge */
		user-select: none; /* Standard */
	}

	.aclass.eita {
		background: #111;
	}

	.aclass:hover,
	button:hover {
		opacity: 0.38;
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

	.popup {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
