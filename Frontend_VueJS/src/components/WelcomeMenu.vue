<template>
	<!-- The menu container -->
	<div class="menu">
		<!-- Navigation bar -->
		<div class="navcontainer">
			<img src="/assets\uberlogo.png" alt="" srcset="" id="uberlogo" />
			<img
				src="/assets\profile.png"
				alt=""
				srcset=""
				id="settingsicon"
				@click="showprofile = true"
			/>
		</div>

		<!-- User profile -->
		<div class="profile">
			<div class="profilerating">
				<h1>
					{{ myrating }}
				</h1>
			</div>
			<div class="profilename">
				<h3>
					{{ user.name }}
				</h3>
			</div>
		</div>

		<!-- Header -->
		<div class="welcome">
			<h2>Welcome!</h2>

			<p>{{ welcomep1 }}</p>
			<p>{{ welcomep2 }}</p>

			<!-- If the user is a driver, show the GO button to start looking for trips -->
			<div v-if="type === 'D'" class="driverbtn">
				<button>GO</button>
			</div>
		</div>
	</div>

	<div class="driverearning" v-if="type === 'D' && driverdata.total_earning">
		<h1>Tk. {{ driverdata.total_earning }}</h1>
	</div>

	<ProfileCard
		v-if="showprofile"
		:udata="user"
		:clivdata="cliverdata"
		@closeprofile="showprofile = false"
	></ProfileCard>
</template>

<script>
	import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
	import ProfileCard from './ProfileCard.vue';

	export default {
		props: {
			user: {},
			cliverdata: {},
			driverdata: {},
			welcomep1: '', //Text to show if user is Client
			welcomep2: '', //Text to show if user is Driver
			type: '', //Type of User
			myrating: null,
		},
		components: {
			ProfileCard,
		},

		data() {
			return {
				showprofile: false,
			};
		},

		methods: {
			...mapMutations(['setRating', 'setDRating']),

			setUserRating(rating) {
				this.setRating(rating);
			},
			setDriverRating(rating) {
				this.setDRating(rating);
			},
		},

		computed: {
			myrating() {
				return this.cliverdata.total_rating === 0
					? 0
					: this.cliverdata.total_rating / this.cliverdata.total_trips;
			},
		},

		mounted() {
			setTimeout(() => {
				if (this.type === 'C')
					this.setUserRating(
						this.cliverdata.total_rating / this.cliverdata.total_trips
					);
				else if (this.type === 'D')
					this.setDRating(
						this.cliverdata.total_rating / this.cliverdata.total_trips
					);
			}, 1000);
		},
	};
</script>

<style scoped>
	.menu {
		width: 25vw;
		height: 100vh;
		margin: 0;
		float: left;
		background: rgb(28, 28, 28);

		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
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

	h2 {
		margin-bottom: 40px;
		color: #eee;
		font-size: 2rem;
		-webkit-user-select: none; /* Safari */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* IE10+/Edge */
		user-select: none; /* Standard */
	}

	.welcome {
		margin-top: 10%;
	}

	.driverbtn {
		margin-top: 6em;
	}

	.driverbtn button {
		border: none;
		box-shadow: 0 0 0 5px rgb(28, 28, 28), 0 0 0 8px #a29bfe;
		border-radius: 50%;
		width: 100px;
		height: 100px;
		background: #6c5ce7;
		color: #eee;
		padding: 0;
		font-size: 1.3rem;
		font-weight: bold;
		animation: pulsebutton 1.3s infinite ease-in-out;
		animation-delay: 3s;
		cursor: pointer;
	}
	.driverbtn button:hover {
		opacity: 0.69;
		transform: scale(1.008);
	}

	@keyframes pulsebutton {
		0% {
			-webkit-transform: scale(0);
			transform: scale(0.69);
			opacity: 0.38;
		}
		75% {
			-webkit-transform: scale(1);
			transform: scale(1);
			opacity: 1;
		}
		100% {
			-webkit-transform: scale(1);
			transform: scale(1);
			opacity: 1;
		}
	}

	.driverearning {
		position: absolute;
		top: 0%;
		left: 37%;
		transform: translateX(-37%);
		z-index: 998;
		margin: 0;
		padding-top: 0.5rem;
		padding-bottom: 1.8rem;
		padding-left: 1.3rem;
		padding-right: 1.3rem;

		border-radius: 0 0 50% 50%;
		box-shadow: 0 0 0 5px rgb(28, 28, 28), 0 0 0 8px #a29bfe;

		color: #eee;
		background: rgb(48, 48, 48);
	}

	.profile {
		margin-bottom: 1rem;
		display: inline-block;
	}
	.profilerating {
		background: #6c5ce7;
		color: white;
		border-radius: 50%;
		display: inline-block;
		width: 100px;
		height: 100px;
	}
	.profilerating h1 {
		width: 100%;
		height: 100%;
		margin: 0;
		position: relative;
		top: 50%;
		transform: translateY(-25%);
	}
</style>
