<template>
	<div class="container">
		<div class="requesterinfo">
			<div class="infoitem">
				<h3>{{ usertripType }}</h3>
			</div>
			<div class="profilecircle infoitem">
				<!-- <i class="gg-user"></i> -->
				<i class="fas fa-user"></i>
			</div>
			<div class="infoitem">
				<h3><i class="fas fa-star"></i>{{ userRat }}</h3>
			</div>
		</div>
		<div class="usertime">
			<h4 style="margin-top: 0px;">{{ rqgotime.toFixed(3) }} minutes</h4>
		</div>
		<div class="decision">
			<button class="acceptbtn decisionbtn" @click="$emit('accepted')">
				Accept
			</button>
			<button class="rejectbtn decisionbtn" @click="$emit('declined')">
				Decline
			</button>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
	export default {
		data() {
			return {
				usertripType: '',
				userRat: 0,
				rqgotime: null,
			};
		},

		computed: {
			...mapState(['userRating', 'tripType', 'requestGoTime']),
			usertripType() {
				return this.tripType;
			},
			userRat() {
				return this.userRating;
			},
			rqgotime() {
				return this.requestGoTime;
			},
		},
	};
</script>

<style scoped>
	.container {
		position: fixed;
		top: 70%;
		left: 50%;
		transform: translateX(-76%);
		z-index: 9999;
		width: 50vw;
		height: 30vh;
		margin: 0;
		background: #6c5ce7;
		border-radius: 80px 80px 0 0;
		filter: drop-shadow(0 0 0.5rem #6c5ce7);
	}
	.requesterinfo {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80px;
		margin-bottom: 1rem;
	}
	.profilecircle {
		background: #2d3436;
		width: 80px !important;
		height: 80px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
	}

	.infoitem {
		margin: 2rem;
		margin-top: 0.69rem;
		margin-bottom: 0px;
		width: 100px;
	}

	.decisionbtn {
		padding: 1rem;
		border: none;
		width: 120px;
		margin-top: 1rem;
		margin-left: 2rem;
		margin-right: 2rem;
		background: #a29bfe;
		color: rgb(58, 58, 58);
	}
	.decisionbtn:hover {
		opacity: 0.5;
	}
</style>
