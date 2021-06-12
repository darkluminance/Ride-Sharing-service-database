/* 
Raiyan Abrar
28th May, 2021, 9.46PM
*/

const express = require('express'); //Import express JS library
const app = express();
const oracledb = require('oracledb'); //Import oracle library
const port = 5000; //Set backend server port number
const cors = require('cors'); //CORS allows requests from browser to be allowed
const { Server } = require('socket.io'); //Import socket.io for websockets i.e Client to Client com

//The credentials for oracle database
const dbconnection = {
	user: 'ryoko',
	password: 'ryoko',
	connectString: 'localhost/xe',
};

//This is required for getting past the 'access blocked by cors' error
app.use(cors());

//Will convert all coming data into JSON
app.use(express.json());
//
//
//
//
//
//Get user data	-------> req is the request, res is the response we'll send back to the browser and uid is the userid whose
//data we'll search
async function getUserData(req, res, uid) {
	//Oracle query for getting data from userr table
	const query = `SELECT u_id,Name_Fname,Name_Lname,Phone_No,TO_DATE(dob), TRUNC(TO_NUMBER(SYSDATE - TO_DATE(dob)) / 365.25) AS AGE, user_typ,user_name FROM Userr WHERE u_id = '${uid}'`;
	// console.log(query);

	try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		console.log('Connected to get user data');
	} catch (error) {
		//If any error occurs while connecting or fetching data
		console.log(error.message);
		console.log(uid);
		res.status(401).send(error.message);
	} finally {
		if (connection) {
			try {
				await connection.close(); //Closes the connection
			} catch (error) {}
			console.log('Connection ended');
		}
		res.status(200).send(result.rows); //Sends back the data with success status 200
	}
}
//
//
//
//Get cliver data	-------> req is the request, res is the response we'll send back to the browser and uid is the userid whose
//data we'll search
async function getCliverData(req, res, uid) {
	//Oracle query for getting data from userr table
	const query = `SELECT u_id, total_rating, total_trips from Cliver WHERE u_id = '${uid}'`;
	// console.log(query);

	try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		console.log('Connected to get cliver data');
	} catch (error) {
		//If any error occurs while connecting or fetching data
		console.log(error.message);
		res.status(401).send(error.message);
	} finally {
		if (connection) {
			try {
				await connection.close(); //Closes the connection
			} catch (error) {}
			console.log('Connection ended');
		}
		res.status(200).send(result.rows); //Sends back the data with success status 200
	}
}
//
//
//
//Get driver data	-------> req is the request, res is the response we'll send back to the browser and uid is the userid whose
//data we'll search
async function getDriverData(req, res, uid) {
	//Oracle query for getting data from userr table
	const query = `SELECT u_id, total_earning from Driver WHERE u_id = '${uid}'`;
	// console.log(query);

	try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		console.log('Connected to get driver data');
	} catch (error) {
		//If any error occurs while connecting or fetching data
	} finally {
		if (connection) {
			await connection.close(); //Closes the connection
			console.log('Connection ended');
		}
		res.status(200).send(result.rows); //Sends back the data with success status 200
	}
}
//
//
//
//Get user id 	-------> req is the request, res is the response we'll send back to the browser, un is the username
async function getUserID(req, res, un) {
	const query = `SELECT u_id FROM Userr WHERE user_name = '${un}'`;
	// console.log(query);

	try {
		connection = await oracledb.getConnection(dbconnection);

		result = await connection.execute(query);

		//if (result.rows[0] == null) throw 'Data not found';

		console.log('Connected to get user id');
	} catch (error) {
		// res.status(404).send('Error occurred! ' + error.message);
	} finally {
		if (connection) {
			await connection.close();
			console.log('Connection ended');
		}
		res.status(200).send(result.rows[0]);
	}
}
//
//
//
//Insert new User data into the database
async function sendUserData(req, res, data) {
	const query = `insert into userr (u_id,admin_id,Name_Fname,Name_Lname,dob,Phone_No, user_name) values ('${data[0]}','${data[1]}','${data[2]}','${data[3]}',to_date('${data[4]}','dd-mon-yyyy'),'${data[5]}', '${data[6]}')`;

	try {
		connection = await oracledb.getConnection(dbconnection);

		result = await connection.execute(query, {}, { autoCommit: true });

		console.log('Connected to insert user data');
	} catch (error) {
	} finally {
		if (connection) {
			await connection.close();
			console.log('Connection ended');
		}
		res.status(200).send(result);
	}
}
//
//
//
//Update user's current location
async function getlastlocation(req, res, uid, type) {
	let query = '';
	// console.log(data, Date.now());

	//Set query based on user types
	if (type === 'C') {
		query = `
				SELECT C_Location_X, C_Location_Y
				FROM clientt
				WHERE u_id = '${uid}'
		`;
	} else if (type === 'D') {
		query = `
			SELECT Dr_Location_X, Dr_Location_Y
			FROM driver
			WHERE u_id = '${uid}'
	`;
	}

	try {
		connection = await oracledb.getConnection(dbconnection);
		console.log(query);

		result = await connection.execute(query);
	} catch (error) {
		console.log('eror', error.message);
		res.status(401).send(error.message);
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (error) {}

			// console.log('Connection ended');
		}
		res.status(200).send(result.rows[0]);
	}
}
//
//
//
//Update user's current location
async function updateUserLocation(req, res, data) {
	let query = '';
	// console.log(data, Date.now());

	//Set query based on user types
	if (data[1] === 'C') {
		query = `
				UPDATE clientt
				SET C_Location_X = ${data[2]},
						C_Location_Y = ${data[3]}
				WHERE u_id = '${data[0]}'
		`;
	} else if (data[1] === 'D') {
		query = `
			UPDATE driver
			SET DR_Location_X = ${data[2]},
					DR_Location_Y = ${data[3]}
			WHERE u_id = '${data[0]}'
	`;
	}

	try {
		connection = await oracledb.getConnection(dbconnection);

		result = await connection.execute(query, {}, { autoCommit: true });

		// console.log(`Connected to update user location ${data}`);
	} catch (error) {
		console.log('eror', data);
		console.log('eror', error.message);
		res.status(401).send(error.message);
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (error) {}

			// console.log('Connection ended');
		}
		res.status(200).send(result);
	}
}
//
//
//
//Send list of drivers within the range
// 	-------> req is the request, res is the response we'll send back to the browser
// ----> lat and lng are the lattitude and longitude of the current location of the user
async function getDriversWithinRange(req, res, lat, lng) {
	const query = `Select D.U_ID, D.Dr_Location_X, D.Dr_Location_Y
	From driver D 
	Where 3963.0 * acos(round((sin(${lng}/ 57.29577951) * sin(D.Dr_Location_Y/ 57.29577951))) + round(cos(${lng}/ 57.29577951) * cos(D.Dr_Location_Y/ 57.29577951) * cos((D.Dr_Location_X/ 57.29577951) - (${lat}/ 57.29577951)))) <= 0.5`;
	//The above formula checks whether the geographical distance between user and location of any driver belongs to the range

	// console.log(query);

	try {
		connection = await oracledb.getConnection(dbconnection);

		result = await connection.execute(query);

		// console.log('Connected to get drivers within range of the user');
	} catch (error) {
		console.log('eror', error.message);
		res.status(401).send(error.message);
	} finally {
		if (connection) {
			try {
				await connection.close();
				res.status(200).send(result);
			} catch (error) {
				console.log(error.message);
				res.status(401).send(error.message);
			}
			// console.log('Connection ended');
		}
	}
}
//
//
//
//Create account for Clientt
async function UserClient(req, res, data) {
	const query = `insert into userr (u_id, user_name, admin_id,Name_Fname,Name_Lname,passwordd,dob,age,Phone_No,user_typ) values('${data[0]}','${data[1]}','${data[2]}','${data[3]}','${data[4]}','${data[5]}',to_date('${data[6]}','yyyy-mm-dd'), TRUNC(TO_NUMBER(SYSDATE - TO_DATE('${data[6]}','yyyy-mm-dd')) / 365.25),'${data[7]}','${data[8]}')`;
	/* console.log(data);
	console.log(query); */
	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query, {}, { autoCommit: true });
	} catch (error) {
	} finally {
		if (connection) {
			await connection.close();
			// console.log('Connection ended');
		}
		res.status(200).send(result);
	}
}

//Create account for the driver
async function UserDriver(req, res, data, info) {
	const query = `insert into userr (u_id, user_name, admin_id, Name_Fname, Name_Lname, passwordd, dob,age, Phone_No, user_typ) 
					values('${data[0]}','${data[1]}','${data[2]}','${data[3]}','${data[4]}','${data[5]}',to_date('${data[6]}','yyyy-mm-dd'), TRUNC(TO_NUMBER(SYSDATE - TO_DATE('${data[6]}','yyyy-mm-dd')) / 365.25), '${data[7]}','${data[8]}')`;

	const query1 = `update driver
					set NID = '${info[1]}',
					COID = '${info[2]}',
					Car_ID = '${info[3]}'
					where U_ID ='${info[0]}'`;

	try {
		connection = await oracledb.getConnection(dbconnection);
		console.log('Connected');

		result = await connection.execute(query, {}, { autoCommit: true });
		result1 = await connection.execute(query1, {}, { autoCommit: true });
	} catch (error) {
	} finally {
		if (connection) {
			await connection.close();
			console.log('Connection ended');
		}
		res.status(200).send(result);
	}
}

//Try to sign in using username and password
async function getsignIn(req, res, username, password) {
	const query = `select u_id
					from userr
					where user_name = '${username}' and passwordd = '${password}'`;

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);

		if (result.rows.length === 0) {
			throw new Error('Invalid username or password');
		} else {
			let response = result.rows[0][0];

			res.status(200).send({
				message: 'Success',
				uid: response,
			});
		}
	} catch (error) {
		res.status(401).send({
			message: 'Invalid username or password',
		});
	} finally {
		if (connection) {
			await connection.close();
		}
	}
}

//
//
//--------- REQUESTS------------------

//POST request --> which means calls for inserting into database
//The parameters req and res means request and respose.
//Request means the data we get from the browser. req.body will store any data we send from the frontend for inserting into database.
//Response will store the data we get from the database and send it back to the browser. In this case, the data we insert will be sent back.

app.post('/login', (request, response) => {
	const username = request.body.username;
	const password = request.body.password;

	// console.log(`${username}, ${password}`);

	getsignIn(request, response, username, password);
});

app.post('/insertuserclient', (req, res) => {
	data = req.body;
	const userid = Date.now();
	const username = data.user_name;
	const adminid = data.admin_id;
	const fname = data.Name_Fname;
	const lname = data.Name_Lname;
	const pass = data.password;
	const dob = data.dob;
	const phn = data.Phone_No;
	const usertyp = data.user_typ;
	const senddata = [
		userid,
		username,
		adminid,
		fname,
		lname,
		pass,
		dob,
		phn,
		usertyp,
	];
	console.log(`from app post ${senddata}`);
	UserClient(req, res, senddata);
});

app.post('/insertuserdriver', (req, res) => {
	data = req.body;
	console.log(data);
	const userid = Date.now();
	const username = data.user_name;
	const adminid = data.admin_id;
	const fname = data.Name_Fname;
	const lname = data.Name_Lname;
	const pass = data.password;
	const dob = data.dob;
	const phn = data.Phone_No;
	const usertyp = data.user_typ;

	const nid = data.nid;
	const cownid = data.CownID;
	const carid = data.carID;

	const dinfo = [userid, nid, cownid, carid];
	const senddata = [
		userid,
		username,
		adminid,
		fname,
		lname,
		pass,
		dob,
		phn,
		usertyp,
	];
	console.log(dinfo);
	console.log(senddata);
	UserDriver(req, res, senddata, dinfo);
	console.log(`${senddata}`);
});

//
//
app.post('/userr', (req, res) => {
	data = req.body;

	//Format the obtained data into separate values and form an array with it
	const uid = data.u_id;
	const adminid = data.admin_id;
	const fname = data.Name_Fname;
	const lname = data.Name_Lname;
	const dob = data.dob;
	const phn = data.Phone_No;
	const uname = data.user_name;
	const pass = data.password;

	const senddata = [uid, adminid, fname, lname, dob, phn, uname, pass];

	sendUserData(req, res, senddata);
});

//POST request for updating user's current location
app.post('/updateuserlocation', (req, res) => {
	const data = req.body;

	const uid = data.u_id;
	const usertype = data.user_typ;
	var lat = 0;
	var lng = 0;

	if (usertype === 'C') {
		lat = data.C_Location_X;
		lng = data.C_Location_Y;
	} else if (usertype === 'D') {
		lat = data.DR_Location_X;
		lng = data.DR_Location_Y;
	}

	const senddata = [uid, usertype, lat, lng];
	// console.log('Post req got from user..', senddata);

	updateUserLocation(req, res, senddata);
});
//
//
//
//
//GET request for getting list of drivers arouund a certain range from the user
//Here ':' colon sign beside the word means it's a variable
//So any data in this field will be stored in lat variable
//Example in ---------> /getdriverlocation/23/90   ......... 23 will be stored in lat and 90 will be stored in lng
//The variables can be accessed using the req.params.<the variable name> command.

app.get('/getlastlocation/:uid/:type', function (req, res) {
	getlastlocation(req, res, req.params.uid, req.params.type);
});

app.get('/getsignindata/:username/:password', (request, response) => {
	const username = request.params.username;
	const password = request.params.password;

	console.log(`HAGU ${username}, ${password}`);

	getsignIn(request, response, username, password);
});

app.get('/getdriverlocation/:lat/:lng', (req, res) => {
	const dr_lattitude = req.params.lat;
	const dr_longitude = req.params.lng;

	getDriversWithinRange(req, res, dr_lattitude, dr_longitude);
});

//GET request for getting driver data
app.get('/getdriverdata/:id', (request, response) => {
	const usid = request.params.id; //ID is the user id using which we'll search the database

	getDriverData(request, response, usid);
});

//GET request for getting cliver data
app.get('/getcliverdata/:id', (request, response) => {
	const usid = request.params.id; //ID is the user id using which we'll search the database

	getCliverData(request, response, usid);
});

//GET request --> which means calls for getting data from the database
//Fetching user data where user id is given
app.get('/getuserdata/:id', (request, response) => {
	const usid = request.params.id; //ID is the user id using which we'll search the database

	getUserData(request, response, usid);
});

//GET request for getting user id from a username
app.get('/getuserid/:name', (request, response) => {
	const usname = request.params.name;
	console.log('Get request obtained', usname);

	getUserID(request, response, usname);
	//console.log('Data obtained from the user', response);
});

async function abcd(req, res) {
	const query = `select * from userr`;

	try {
		connection = await oracledb.getConnection(dbconnection);
		console.log('Connected');

		result = await connection.execute(query, {}, { autoCommit: true });
	} catch (error) {
	} finally {
		if (connection) {
			await connection.close();
			console.log('Connection ended');
		}
		res.status(200).send(result);
	}
}

app.get('/getu', (req, res) => {
	abcd(req, res);
});

//Listen to the specific port to connect to the server
//This is the main part of the backend server
//When we run the file using node <filename>	command, the file will listen for any type of requests
//through the mentioned port. In this case we declared port as port 5000. Any valid open ports can be used.
//When any requests are sent from the frontend to this port, the file will determine whether it's a
//GET request ---> Which means frontend is asking for data
//POST request ----> The frontend is sending data or storage
//The perform the required tasks based on the url and functions called from them
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

/* // Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules')); */

//------------------------------ WEBSOCKET PART --------------------------------------------------

//Set up websocket in this server with access to cors policy
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
}); // Create a websocket server

//When any user connects to this server
io.on('connection', (socket) => {
	console.log('A user connected with socket id ', socket.id);
	//
	//
	socket.on('disconnect', function () {
		console.log('A user with ID: ' + socket.id + ' disconnected');
	});
	//
	//
	socket.on('request', (soket_id, tripdata, usdata) => {
		console.log('Request found from ', soket_id, tripdata, usdata);
		socket.broadcast.emit('request', soket_id, tripdata, usdata);
	});
	//
	//
	socket.on('accepted', (socet_id, ddata) => {
		socket.broadcast.emit('accepted', socet_id, ddata);
	});
	//
	//
	socket.on('cancelled', (socet_id) => {
		socket.broadcast.emit('cancelled', socet_id);
	});
	//
	//
	//
	socket.on('tripstart', (socet_id) => {
		socket.broadcast.emit('tripstart', socet_id);
	});
	//
	//
	//
	socket.on('finishtrip', (socet_id) => {
		socket.broadcast.emit('finishtrip', socet_id);
	});
	//
	//
	//
});
