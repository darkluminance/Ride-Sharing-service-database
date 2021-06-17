<template>
	<div class="logincontainer">
		<div class="container" id="container">
			<div class="form-container choose-container" id="choose">
				<form action="#">
					<div class="logo2">
						<img src="uberlogo.png" height="30" width="110" />
					</div>
					<br /><br /><br />
					<h1>What are you?</h1>
					<br /><br />
					<button class="cliver" id="cl">Client</button>
					<br />
					<button class="cliver" id="dr">Driver</button>
				</form>
			</div>

			<div class="form-container sign-in-container" id="signin">
				<form action="#">
					<div class="logo">
						<img src="uberlogo.png" height="30" width="110" />
					</div>
					<br /><br />
					<h1>Sign In</h1>
					<br /><br />
					<input
						type="text"
						placeholder="User Name"
						required
						v-model="username"
					/>
					<input
						type="password"
						placeholder="Password"
						required
						v-model="password"
					/>
					<a href="#">Forgot your password?</a><br />
					<button id="userlogin" @click="GetUserData">LOG IN</button>
				</form>
			</div>

			<div class="overlay-container" id="ovcontainer">
				<div class="overlay" id="overlay">
					<div class="overlay-panel overlay-left">
						<h1>Welcome back!</h1>
						<br />
						<p>
							To keep connected with us please log in with your personal info
						</p>
						<button class="ghost" id="signIn">LOG IN</button>
					</div>

					<div class="overlay-panel overlay-right" id="hithere">
						<br />
						<h1>Hi, there!</h1>
						<br />
						<p>Join us on your journey and enjoy trips the simplest way</p>
						<br />
						<button class="ghost" id="signUp">Sign Up</button>
						<br />
						<a href="#" class="own" id="owner">Are you a car owner?</a>
					</div>
				</div>
			</div>
		</div>

		<div class="form-c client-container" id="client">
			<form action="#">
				<i
					class="fas fa-arrow-left"
					id="backclient"
					style="margin-left:-300px; color: white ; margin-top:10px"
				></i>
				<p class="create">Create Account</p>
				<p class="client">As a client user</p>
				<input type="text" placeholder="User Name" required v-model="cluname" />
				<input type="text" placeholder="First Name" required v-model="fname" />
				<input type="text" placeholder="Last Name" required v-model="lname" />
				<input
					type="password"
					placeholder="Password"
					required
					v-model="clpass"
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					required
					v-model="clconpass"
				/>
				<input
					type="date"
					placeholder="Date of Birth"
					required
					v-model="cldob"
				/>
				<input type="tel" placeholder="Phone No" required v-model="clphone" />
				<button class="csign" @click="insertclientdata" id="csign">
					SIGN UP
				</button>
			</form>
		</div>

		<div class="form-c driver-container1" id="driver1">
			<form class="Driver1">
				<i
					class="fas fa-arrow-left"
					id="backtochoose"
					style="margin-left:-300px; color: white ; margin-top:20px; margin-bottom:-20px"
				></i>
				<p class="create">Create Account</p>
				<p class="adriver">As a driver user</p>
				<input type="text" placeholder="User Name" required v-model="duname" />
				<input type="text" placeholder="First Name" required v-model="dfname" />
				<input type="text" placeholder="Last Name" required v-model="dlname" />
				<input
					type="password"
					placeholder="Password"
					required
					v-model="dpass"
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					required
					v-model="dconpass"
				/>
				<input
					type="date"
					placeholder="Date of Birth"
					required
					v-model="ddob"
				/>

				<button class="next" id="next">NEXT PAGE</button>
			</form>
		</div>
		<div class="form-c driver-container2" id="driver2">
			<form class="Driver2">
				<i
					class="fas fa-arrow-left"
					id="backtod1"
					style="margin-left:-300px; color: white ; margin-top:-40px"
				></i>
				<p class="create">Create Account</p>
				<p class="adriver" style="padding-top:20px">As a driver user</p>
				<input type="tel" placeholder="Phone No" required v-model="dphn" />
				<input type="number" placeholder="NID No" required v-model="dnid" />
				<input
					type="text"
					placeholder="Car Owner ID"
					required
					v-model="dcoid"
				/>
				<input type="text" placeholder="Car ID" required v-model="dcarid" />
				<button @click="insertDriverdata" id="drisign">SIGN UP</button>
				<!-- <button>GO BACK</button> -->
			</form>
		</div>

		<div class="form-c owner-container1" id="owner1">
			<form class="owner1">
				<i
					class="fas fa-arrow-left"
					id="backhi"
					style="margin-left:-300px; color: white ; margin-top:15px; margin-bottom:-20px"
				></i>
				<p class="create">Create Account</p>
				<p class="aowner">As a car owner</p>
				<input type="text" placeholder="User Name" required v-model="cuname" />
				<input type="text" placeholder="First Name" required v-model="cfname" />
				<input type="text" placeholder="Last Name" required v-model="clname" />
				<input
					type="password"
					placeholder="Password"
					required
					v-model="cpass"
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					required
					v-model="cconpass"
				/>
				<input
					type="date"
					placeholder="Date of Birth"
					required
					v-model="cdob"
				/>
				<button class="nextown" id="nextown">NEXT PAGE</button>
			</form>
		</div>
		<div class="form-c owner-container2" id="owner2">
			<form class="owner2">
				<i
					class="fas fa-arrow-left"
					id="backown1"
					style="margin-left:-300px; color: white ; margin-top:-40px"
				></i>
				<p class="create">Create Account</p>
				<p class="aowner">As a car owner</p>
				<input type="tel" placeholder="Phone No" required v-model="cphn" />
				<input type="number" placeholder="NID No" required v-model="cnid" />
				<input type="text" placeholder="Car Number" required v-model="ccar" />
				<button @click="insertCarOwnerdata" class="finalsign" id="finalsign">
					SIGN UP
				</button>
				<!-- <button>GO BACK</button> -->
			</form>
		</div>
		<div class="blurr"></div>
	</div>
</template>

<script>
	//mapGetters -> Change kore fetch korle
	//mapMutations -> function (Set function)
	//mapState -> keeps variables
	//mapActions -> function with async await. Data fetch e use hoy

	import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'; /// shob global stuff ekhane
	import Account from '../components/Account.vue';

	export default {
		data() {
			return {
				cluname: '',
				fname: '',
				lname: '',
				clpass: '',
				clconpass: '',
				cldob: '',
				clphone: '',
				duname: '',
				dfname: '',
				dlname: '',
				dpass: '',
				dconpass: '',
				ddob: '',
				dphn: '',
				dnid: '',
				dcoid: '',
				dcarid: '',
				cuname: '',
				cfname: '',
				clname: '',
				cpass: '',
				cconpass: '',
				cdob: '',
				cphn: '',
				cnid: '',
				ccar: '',
				username: '',
				password: '',
				usernameexists: false,
				COUIDexists: false,
				CARExists: false
			};
		},

		//Watch portion of vuejs automatically runs whenever a change happens in that variable
		watch: {
			cluname(newval, oldval) {
				if (newval !== '') this.checkUsername(newval);
			},
			cuname(newval, oldval) {
				if (newval !== '') this.checkUsername(newval);
			},
			duname(newval, oldval) {
				if (newval !== '') this.checkUsername(newval);
			},
			dcoid(newval, oldval) {
				if (newval !== '') this.checkCarOwnerID(newval);
			},
			dcarid(newval, oldval) {
				if (newval !== '') this.checkCarNo(newval);
			},
			ccar(newval, oldval) {
				if (newval !== '') this.checkCarNo(newval);
			}
		},
		methods: {
			...mapMutations['setAuthentication'],

			async checkUsername(just_a_name) {
				let responsed = await fetch(
					`http://localhost:5000/checkusername/${just_a_name}`
				);

				let does_username_exists = await responsed.json();

				if (does_username_exists.found) {
					this.usernameexists = true;
				} else this.usernameexists = false;
			},

			async checkCarOwnerID(id) {
				let responsed = await fetch(
					`http://localhost:5000/checkcarownerid/${id}`
				);

				let id_exists = await responsed.json();
				if (id_exists.found) {
					this.COUIDexists = true;
				} else this.COUIDexists = false;
			},

			async checkCarNo(id) {
				let responsed = await fetch(
					`http://localhost:5000/checkcarno/${id}`
				);

				let id_exists = await responsed.json();
				if (id_exists.found) {
					this.Carexists = true;
				} else this.Carexists = false;
			},

			async insertclientdata() {
				let clientdata = {
					user_name: this.cluname,
					admin_id: 'null',
					Name_Fname: this.fname,
					Name_Lname: this.lname,
					password: this.clpass,
					dob: this.cldob,
					Phone_No: this.clphone,
					user_typ: 'C',
				};
				console.log(clientdata);
				const isEmpty = Object.values(clientdata).some(
					(x) => x === null || x === ''
				);
				console.log(isEmpty);

				if (isEmpty) {
					alert('Please enter all of the information');
				} else if (this.clpass != this.clconpass) {
					alert('Passwords do not match');
				} else {
					if (this.usernameexists) {
						alert('The username already exists!');
					} else {
						const something = await fetch(
							'http://localhost:5000/insertuserclient',
							{
								method: 'post',
								headers: {
									Accept: 'application/json, text/plain, /',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(clientdata),
							}
						);

						if (something.ok) {
							alert('Sign up successful');
							location.reload();
						} else {
							alert('Could not sign you up. Please try again');
							location.reload();
						}
					}
				}
			},
			async insertDriverdata() {
				let driverdata = {
					user_name: this.duname,
					admin_id: '1010',
					Name_Fname: this.dfname,
					Name_Lname: this.dlname,
					password: this.dpass,
					dob: this.ddob,
					Phone_No: this.dphn,
					user_typ: 'D',
					nid: this.dnid,
					CownID: this.dcoid,
					carID: this.dcarid,
				};
				console.log(driverdata);

				const isEmpty = Object.values(driverdata).some(
					(x) => x === null || x === ''
				);
				console.log(isEmpty);

				if (isEmpty) {
					alert('Please enter all of the information!');
				} else if (this.dpass != this.dconpass) {
					alert('Passwords do not match');
				}  else {
					if(this.COUIDexists===false)
					{
						// console.log(`HAGA ${this.COUIDexists}`);
						alert('The Car Owner ID does not exist!');
						
					}
					else if(this.Carexists===false)
					{
						alert('The Car Number does not exist!');
					}
					else if (this.usernameexists) {
						// console.log(`ANOTHER HAGA ${this.usernameexists}`);
						alert('The username already exists!');
						
					} else {
						const something = await fetch(
							'http://localhost:5000/insertuserdriver',
							{
								method: 'post',
								headers: {
									Accept: 'application/json, text/plain, /',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(driverdata),
							}
						);

						if (something.ok) {
							alert('Sign up successful');
							location.reload();
						} else {
							alert('Could not sign you up. Please try again');
							location.reload();
						}
					}
				}
			},
			async insertCarOwnerdata() {
				let ownerdata = {
					user_name: this.cuname,
					admin_id: '1010',
					Name_Fname: this.cfname,
					Name_Lname: this.clname,
					password: this.cpass,
					dob: this.cdob,
					Phone_No: this.cphn,
					user_typ: 'CO',
					nid: this.cnid,
					carID: this.ccar,
				};
				console.log(ownerdata);

				const isEmpty = Object.values(ownerdata).some(
					(x) => x === null || x === ''
				);
				console.log(isEmpty);

				if (isEmpty) {
					alert('Please enter all of the information!');
				} else {
					if(this.Carexists===false)
					{
						console.log(`CARRRRROWNERRHAGA ${this.Carexists}`);
						alert('The Car Number does not exist!');
					}
					else if (this.usernameexists) {
						alert('The username already exists!');
					} else {
						const something = await fetch(
							'http://localhost:5000/insertcarowner',
							{
								method: 'post',
								headers: {
									Accept: 'application/json, text/plain, /',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(ownerdata),
							}
						);

						if (something.ok) {
							alert('Sign up successful');
							location.reload();
						}
					}
				}
			},

			async GetUserData() {
				let loginusername = this.username;
				let loginpassword = this.password;

				let fetched = await fetch('http://localhost:5000/login', {
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						/* Authorization: `Basic ${base64.encode(
							`${loginusername}:${loginpassword}`
						)}`, */
					},
					body: JSON.stringify({
						username: loginusername,
						password: loginpassword,
					}),
				});
				let theresponse = await fetched.json();

				if (!fetched.ok) {
					alert(theresponse.message);
					localStorage.removeItem('token');
				} else {
					localStorage.setItem('token', theresponse.uid);
					console.log('Success ', localStorage.getItem('token'));
					location.reload();
				}
			},

			//
			//
			//
		},

		mounted() {
			console.log('Login page ', localStorage.getItem('token'));
			////////////// Variables ////////////
			// const allbutton = document.getElementsByTagName('button');

			const signUpButton = document.getElementById('signUp');
			const signInButton = document.getElementById('signIn');

			const container = document.getElementById('container');
			const client = document.getElementById('client');

			const clientbutton = document.getElementById('cl');
			const driverbutton = document.getElementById('dr');
			const chooseuser = document.getElementById('choose');
			const signin = document.getElementById('signin');

			const owner = document.getElementById('owner');
			const owner1 = document.getElementById('owner1');
			const owner2 = document.getElementById('owner2');
			const hithere = document.getElementById('hithere');
			const ovcontainer = document.getElementById('ovcontainer');

			const driver1 = document.getElementById('driver1');
			const driver2 = document.getElementById('driver2');

			const next = document.getElementById('next');

			const nextown = document.getElementById('nextown');
			const finalsign = document.getElementById('finalsign');

			const driversign = document.getElementById('drisign');

			const csign = document.getElementById('csign');

			const backclient = document.getElementById('backclient');

			const userlogin = document.getElementById('userlogin');

			const backtochoose = document.getElementById('backtochoose');

			const backtod1 = document.getElementById('backtod1');

			const backhi = document.getElementById('backhi');
			const backown1 = document.getElementById('backown1');

			//////Preventing the default for button events.
			backown1.addEventListener('click', function(event) {
				event.preventDefault();
			});

			backhi.addEventListener('click', function(event) {
				event.preventDefault();
			});
			backtod1.addEventListener('click', function(event) {
				event.preventDefault();
			});
			userlogin.addEventListener('click', function(event) {
				event.preventDefault();
			});
			backclient.addEventListener('click', function(event) {
				event.preventDefault();
			});
			backtochoose.addEventListener('click', function(event) {
				event.preventDefault();
			});

			csign.addEventListener('click', function(event) {
				event.preventDefault();
			});

			driversign.addEventListener('click', function(event) {
				event.preventDefault();
			});

			clientbutton.addEventListener('click', function(event) {
				event.preventDefault();
			});
			driverbutton.addEventListener('click', function(event) {
				event.preventDefault();
			});
			next.addEventListener('click', function(event) {
				event.preventDefault();
			});
			owner.addEventListener('click', function(event) {
				event.preventDefault();
			});
			nextown.addEventListener('click', function(event) {
				event.preventDefault();
			});
			finalsign.addEventListener('click', function(event) {
				event.preventDefault();
			});

			////Button Events.

			signUpButton.addEventListener('click', () => {
				container.classList.add('right-panel-active');
			});

			signInButton.addEventListener('click', () => {
				// hithere.classList.remove("remove");
				container.classList.remove('right-panel-active');
				chooseuser.classList.remove('erase');
				signin.classList.remove('erase');
				// driver1.classList.remove("showdriver");
				// driver2.classList.remove("showdriver");
			});

			clientbutton.addEventListener('click', () => {
				client.classList.add('position');
				chooseuser.classList.add('erase');
				signin.classList.add('erase');
				// hithere.classList.add("remove");
				driver1.classList.remove('showdriver');
				driver2.classList.remove('showdriver');
			});

			backclient.addEventListener('click', () => {
				// client.classList.remove("position");
				// signin.classList.add("erase");
				chooseuser.classList.remove('erase');
				// hithere.classList.add("remove");
				// driver1.classList.remove("showdriver");
				// driver2.classList.remove("showdriver");
			});

			driverbutton.addEventListener('click', () => {
				driver1.classList.add('showdriver');
				driver2.classList.remove('showdriver');
				chooseuser.classList.add('erase');
				signin.classList.add('erase');
				// hithere.classList.add("remove");
				client.classList.remove('position');
			});

			backtochoose.addEventListener('click', () => {
				chooseuser.classList.remove('erase');
				// driver1.classList.remove("showdriver");
				// driver2.classList.remove("showdriver");
				// signin.classList.add("erase");
				// hithere.classList.add("remove");
				// client.classList.remove("position");
			});

			next.addEventListener('click', () => {
				driver2.classList.add('showdriver');
				driver1.classList.remove('showdriver');
				chooseuser.classList.add('erase');
				signin.classList.add('erase');
				client.classList.remove('position');
			});

			backtod1.addEventListener('click', () => {
				driver2.classList.remove('showdriver');
				driver1.classList.add('showdriver');
				chooseuser.classList.add('erase');
				signin.classList.add('erase');
				client.classList.remove('position');
			});
			owner.addEventListener('click', () => {
				ovcontainer.classList.add('remove');
				hithere.classList.add('remove');
				driver2.classList.remove('showdriver');
				driver1.classList.remove('showdriver');
				chooseuser.classList.add('erase');
				client.classList.remove('position');
				owner1.classList.add('showowner');
			});

			nextown.addEventListener('click', () => {
				ovcontainer.classList.add('remove');
				hithere.classList.add('remove');
				driver2.classList.remove('showdriver');
				driver1.classList.remove('showdriver');
				chooseuser.classList.add('erase');
				client.classList.remove('position');
				owner1.classList.remove('showowner');
				owner2.classList.add('showowner');
			});

			backhi.addEventListener('click', () => {
				hithere.classList.remove('remove');
				owner1.classList.remove('showowner');
				ovcontainer.classList.remove('remove');
				chooseuser.classList.remove('erase');
			});

			backown1.addEventListener('click', () => {
				owner1.classList.add('showowner');
				owner2.classList.remove('showowner');
			});
		},
	};
</script>

<style scoped>
	* {
		box-sizing: border-box;
	}

	.logincontainer {
		background: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* margin: 20px 0 50px; */
		opacity: 1;
	}
	.blurr {
		height: 100vh;
		width: 1536px;
		position: fixed;
		z-index: -30;
		background-color: white;
		opacity: 0.5;
		filter: blur(8px);
		-webkit-filter: blur(8px);
	}

	.cliver {
		border-radius: 80px, 0px, 0px, 80px;
	}
	.dob {
		color: #eee;
		font-size: 13px;
		padding: 0px;
		margin-top: -3px;
		margin-bottom: 5px;
		margin-left: -210px;
	}

	.csign {
		margin-top: 5px;
		font-size: 12px;
	}
	.logo {
		margin-left: -200px;
		margin-top: -10px;
	}
	.logo2 {
		margin-left: 220px;
		margin-top: -100px;
	}
	h1 {
		text-align: center;
		font-weight: bold;
		margin: 0;
		color: whitesmoke;
	}

	p {
		font-size: 14px;
		font-weight: 100;
		line-height: 20px;
		letter-spacing: 0.5px;
		margin: 20px 0 30px;
	}

	a {
		color: #eee;
		font-size: 14px;
		text-decoration: none;
		margin: 15px 0;
	}
	#cl {
		background-color: rgb(24, 24, 24);
		color: #8373ff;
		border: 2px solid #8373ff;
		font-size: 18px;
		font-weight: normal;
	}
	#dr {
		background-color: rgb(24, 24, 24);
		color: #8373ff;
		border: 2px solid #8373ff;
		font-weight: bold;
		font-size: 18px;
		font-weight: normal;
	}
	.own {
		color: #ffffff;
		font-weight: bold;
		font-size: 14px;
		text-decoration: none;
		margin: 15px 0;
	}

	button {
		border-radius: 20px;
		border: 1px solid #6c5ce7;
		background-color: #6c5ce7;
		color: #ffffff;
		font-size: 14px;
		font-weight: bold;
		padding: 12px 45px;
		letter-spacing: 1px;
		text-transform: uppercase;
		transition: transform 80ms ease-in;
	}

	button:active {
		transform: scale(0.95);
	}

	button:focus {
		outline: none;
	}

	button.ghost {
		background-color: transparent;
		border-color: #ffffff;
	}

	form {
		background-color: rgb(24, 24, 24);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0 50px;
		height: 100%;
		text-align: center;
	}

	input {
		background-color: rgb(64, 64, 64, 0.5);
		color: #dcdcdc;
		border: none;
		padding: 12px 15px;
		margin: 8px 0;
		width: 100%;
	}

	.container {
		/* margin-top: 70px; */
		border-radius: 10px;
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
		position: relative;
		overflow: hidden;
		width: 768px;
		max-width: 100%;
		min-height: 500px;
	}

	.form-container {
		position: absolute;
		top: 0;
		height: 100%;
		transition: all 0.6s ease-in-out;
	}

	.sign-in-container {
		float: left;
		left: 0;
		width: 50%;
		z-index: 4;
		color: black;
		border-radius: 10px;
	}

	.container.right-panel-active .sign-in-container {
		transform: translateX(100%);
	}

	.choose-container {
		left: 0;
		width: 50%;
		opacity: 0;
		z-index: 4;
	}

	.container.right-panel-active .choose-container {
		transform: translateX(100%);
		opacity: 1;
		z-index: 5;
		animation: show 0.6s;
	}

	@keyframes show {
		0%,
		49.99% {
			opacity: 0;
			z-index: 1;
		}

		50%,
		100% {
			opacity: 1;
			z-index: 5;
		}
	}

	.overlay-container {
		position: absolute;
		top: 0;
		left: 50%;
		width: 50%;
		height: 100%;
		overflow: hidden;
		transition: transform 0.6s ease-in-out;
		z-index: 100;
	}

	.container.right-panel-active .overlay-container {
		transform: translateX(-100%);
	}

	.overlay {
		background: -webkit-linear-gradient(to right, #694dbd, #6c5ce7);
		background: linear-gradient(to right, #694dbd, #6c5ce7);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 0 0;
		color: #ffffff;
		position: relative;
		left: -100%;
		height: 100%;
		width: 200%;
		transform: translateX(0);
		transition: transform 0.6s ease-in-out;
		border-radius: 10px;
	}

	.container.right-panel-active .overlay {
		transform: translateX(50%);
	}

	.overlay-panel {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0 40px;
		text-align: center;
		top: 0;
		height: 100%;
		width: 50%;
		transform: translateX(0);
		transition: transform 0.6s ease-in-out;
	}

	.overlay-left {
		transform: translateX(-20%);
	}

	.container.right-panel-active .overlay-left {
		transform: translateX(0);
	}

	.overlay-right {
		right: 0;
		transform: translateX(0);
		border-radius: 0px 10px 10px 0px;
	}

	.overlay-right.remove,
	.overlay-container.remove {
		display: none;
	}

	.container.right-panel-active .overlay-right {
		transform: translateX(20%);
	}

	.create {
		margin-top: 10px;
		font-size: 22px;
		font-weight: bold;
		color: #ffffff;
	}
	.client {
		margin-top: -20px;
		padding-bottom: 0px;
		font-size: 14px;
		color: #eee;
	}

	.driver-container1 {
		border-radius: 0px 10px 10px 0px;
		display: none;
	}

	.driver-container1 form {
		border-radius: 0px 10px 10px 0px;
	}
	.driver-container2 form {
		border-radius: 0px 10px 10px 0px;
	}
	.driver-container2 {
		border-radius: 0px 10px 10px 0px;
		display: none;
	}

	.client-container {
		border-radius: 10px !important;
		display: none;
	}
	.client-container form {
		border-radius: 0px 10px 10px 0px;
	}
	.owner-container1 {
		border-radius: 0px 10px 10px 0px;
		display: none;
	}
	.owner-container2 {
		border-radius: 0px 10px 10px 0px;
		display: none;
	}

	.client-container input {
		margin-top: -5px;
		background-color: rgb(64, 64, 64, 0.5);
	}

	.client-container.position {
		display: initial;
		margin-left: 380px;
		width: 390px;
		height: 500px;
		/* background-color:pink; */
		right: 0;
		transform: translateX(0);
		float: right;
		margin-top: -500px;
		border-radius: 0px 10px 10px 0px;
	}

	.choose-container.erase {
		display: none;
	}
	.sign-in-container.erase {
		display: none;
	}

	.next {
		margin-top: 20px;
		font-size: 12px;
	}
	.adriver {
		margin-top: -10px;
		color: #eee;
	}
	.driver-container1 input {
		margin-top: -4px;
		background-color: rgb(64, 64, 64, 0.5);
	}
	.driver-container1.showdriver {
		display: initial;
		margin-left: 380px;
		width: 390px;
		height: 500px;
		/* background-color: pink;     */
		right: 0;
		transform: translateX(0);
		float: right;
		margin-top: -500px;
		border-radius: 0px 10px 10px 0px;
	}

	.driver-container2 input {
		margin-top: -4px;
		background-color: rgb(64, 64, 64, 0.5);
	}
	.driver-container2.showdriver {
		display: initial;
		margin-left: 380px;
		width: 390px;
		height: 500px;
		/* background-color: red; */
		right: 0;
		transform: translateX(0);
		float: right;
		margin-top: -500px;
		border-radius: 0px 10px 10px 0px;
	}

	.aowner {
		color: #ffffff;
		margin-top: -10px;
	}
	.owner-container1 input {
		margin-top: 1px;
		background-color: #a29bfe;
		border-radius: 0px 50px 50px 0px;
		border: none;
		color: black;
	}

	.nextown {
		color: #ffffff;
		margin-top: 20px;
		font-size: 12px;
		background: black;
	}
	.owner1 {
		background-color: #6c5ce7;
		color: black;
		border-radius: 0px 10px 10px 0px;
	}
	.owner-container1.showowner {
		display: initial;
		margin-left: 380px;
		width: 390px;
		height: 500px;
		background-color: #6c5ce7;
		right: 0;
		color: black;
		transform: translateX(0);
		float: right;
		margin-top: -500px;
	}

	.finalsign {
		color: #ffffff;
		margin-top: 20px;
		font-size: 12px;
		background: black;
	}
	.owner2 {
		background-color: #6c5ce7;
		color: black;
		border-radius: 0px 10px 10px 0px;
	}

	.owner-container2 input {
		margin-top: 1px;
		background-color: #a29bfe;
		border-radius: 50px;
		border: none;
		color: black;
	}

	.owner-container2.showowner {
		display: initial;
		margin-left: 380px;
		width: 390px;
		height: 500px;
		background-color: #6c5ce7;
		right: 0;
		color: black;
		transform: translateX(0);
		float: right;
		margin-top: -500px;
	}
	#drisign {
		margin-top: 20px;
	}
</style>
