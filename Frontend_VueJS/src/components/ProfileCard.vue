<template>
	<div class="fullshit"></div>
	<div class="cardcontainer">
		<div class="closebtn" @click="$emit('closeprofile')">
			<i class="fas fa-times"></i>
		</div>

		<div class="profile">
			<div class="profilecirc">
				<img src="/assets\profile.png" alt="" srcset="" id="profileimg" />
			</div>
			<div>
				<h1>{{ udata.name }}</h1>
				<h2>
					{{ myrating }}
					<i class="fas fa-star" style="font-size:1rem;"></i>
				</h2>
				<p>{{ udata.phone }}</p>
			</div>

			<div class="tripinfo">
				<h3>Total trips: {{ clivdata.total_trips }}</h3>
			</div>
		</div>

		<div class="logoutbtn">
			<button style="background: #6c5ce7" @click="logoutUser">
				Logout
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['udata', 'clivdata'],
		data() {
			return {
				myrating: null,
			};
		},
		computed: {
			myrating() {
				return this.clivdata.total_rating === 0
					? 0
					: this.clivdata.total_rating / this.clivdata.total_trips;
			},
		},
		methods: {
			logoutUser() {
				localStorage.removeItem('token');
				location.reload();
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
		z-index: 9999;
		opacity: 0.69;
	}
	.cardcontainer {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 350px;
		height: 480px;
		background: #eee;
		margin: 0;
		padding: 2rem;
		z-index: 10000;
		filter: drop-shadow(8px 8px 15px black);
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
	.fas {
		font-size: 2rem;
	}
	.profile {
		color: rgb(69, 69, 69);
		height: 350px;
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
		padding: 0;
		margin-bottom: -8%;
	}
	#profileimg {
		width: inherit;
		height: inherit;
		margin: 0;
		padding: 0;
	}

	.logoutbtn {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button:hover {
		opacity: 0.38;
	}

	.logoutbtn button {
		border-radius: 80px;
		border: none;
		color: #eee; /* White text */
		padding: 10px 24px; /* Some padding */
		cursor: pointer; /* Pointer/hand icon */
		width: 69%; /* Set a width if needed */
		display: block; /* Make the buttons appear below each other */
		height: 45px;
		margin: 18px 0;
	}
</style>
