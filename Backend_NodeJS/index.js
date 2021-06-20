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
			try {
				await connection.close(); //Closes the connection
				console.log('Connection ended');
				res.status(200).send(result.rows); //Sends back the data with success status 200
			} catch (error) {
				console.log(error.message);
				res.status(401).send(error.message);
			}
		}
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
	const query = `insert into userr (u_id,admin_id,Name_Fname,Name_Lname,dob,Phone_No, user_name) values ('${data[0]}',
	(SELECT u_id FROM(SELECT u_id FROM userr where admin_id is null ORDER BY dbms_random.value) WHERE rownum = 1)
	,'${data[2]}','${data[3]}',to_date('${data[4]}','dd-mon-yyyy'),'${data[5]}', '${data[6]}')`;

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
	const query = `insert into userr (u_id, user_name, admin_id,Name_Fname,Name_Lname,passwordd,dob,age,Phone_No,user_typ) values('${data[0]}','${data[1]}', 
	(SELECT u_id FROM(SELECT u_id FROM userr where admin_id is null ORDER BY dbms_random.value) WHERE rownum = 1), 
	'${data[3]}','${data[4]}','${data[5]}',to_date('${data[6]}','yyyy-mm-dd'), TRUNC(TO_NUMBER(SYSDATE - TO_DATE('${data[6]}','yyyy-mm-dd')) / 365.25),'${data[7]}','${data[8]}')`;
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
	const query = ` BEGIN
					SAVEPOINT start_point;

						insert into userr (u_id, user_name, admin_id, Name_Fname, Name_Lname, passwordd, dob,age, Phone_No, user_typ) 
						values('${data[0]}','${data[1]}',
						(SELECT u_id FROM(SELECT u_id FROM userr where admin_id is null ORDER BY dbms_random.value) WHERE rownum = 1)
						,'${data[3]}','${data[4]}','${data[5]}',to_date('${data[6]}','yyyy-mm-dd'), TRUNC(TO_NUMBER(SYSDATE - TO_DATE('${data[6]}','yyyy-mm-dd')) / 365.25), '${data[7]}','${data[8]}');
						
						update driver
						set NID = '${info[1]}',
						Car_no = '${info[3]}'
						where U_ID ='${info[0]}';

						insert into hire (dru_id, cou_id)
						values ('${info[0]}','${info[2]}');

					EXCEPTION
					WHEN OTHERS THEN
					dbms_output.put_line('Error code ' || SQLCODE || ': ' || SQLERRM);
					ROLLBACK TO start_point;
					END;`;

	console.log(query);

	// const query1 = `update driver
	// 				set NID = '${info[1]}',
	// 				COID = '${info[2]}',
	// 				Car_ID = '${info[3]}'
	// 				where U_ID ='${info[0]}'`;

	try {
		connection = await oracledb.getConnection(dbconnection);
		console.log('Connected');

		result = await connection.execute(query, {}, { autoCommit: true });
		// result1 = await connection.execute(query1, {}, { autoCommit: true });
	} catch (error) {
		res.status(401).send(error.message);
	} finally {
		try {
			if (connection) {
				await connection.close();
				console.log('Connection ended');
			}
			res.status(200).send(result);
		} catch (error) {
			res.status(401).send(error.message);
		}
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

	//Generate 32 character hexadecimal unique ID for user
	let hexed = Date.now().toString(16);
	hexed = data.user_typ + '-' + hexed + hexed + hexed;
	let the_id = hexed.substring(0, 32).toUpperCase();
	console.log(the_id);

	const userid = the_id;
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

	//Generate 32 character hexadecimal unique ID for user
	let hexed = Date.now().toString(16);
	hexed = data.user_typ + '-' + hexed + hexed + hexed;
	let the_id = hexed.substring(0, 32).toUpperCase();
	console.log(the_id);

	const userid = the_id;
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

async function sendTripData(req, res, data) {
	const query = `BEGIN
						SAVEPOINT start_point1;
						insert into Trip(Trip_ID,Start_Time,End_time,Fare_Init_amnt,Fare_amnt,Pick_up_X,Pick_up_Y,Drop_off_X,Drop_off_Y,CL_Rating,Dr_Rating,Trip_date ,CLU_ID,DRU_ID, PICKUP_LOCATION_NAME, DESTINATION_LOCATION_NAME, TRIP_TYPE)
						values('${data[0]}',to_date('${data[1]}','hh24:mi:ss'),to_date('${data[2]}','hh24:mi:ss'),${data[3]},${data[4]},${data[5]},${data[6]},${data[7]},${data[8]},${data[9]},${data[10]},to_date('${data[11]}','yyyy-mm-dd'),'${data[12]}','${data[13]}', '${data[14]}', '${data[15]}', '${data[16]}');
						
						update cliver
						set total_trips= total_trips+1
						where U_ID =  '${data[12]}';

						update cliver
						set total_trips= total_trips+1
						where U_ID =  '${data[13]}';
						
						update driver
						set total_earning = total_earning + ${data[4]}*(1-(select percentage
						from car
						where car_no = (select car_no
										from driver
										where u_id =  '${data[13]}') )/100)
						where U_ID = '${data[13]}'; 

						update car_owner
						set owner_earning = owner_earning + ${data[4]}*((select percentage
						from car
						where car_no = (select car_no
										from driver
										where u_id =  '${data[13]}') )/100)
						where U_ID = (select couid
									from car where car_no = (select car_no
									from driver
									where u_id = '${data[13]}')); 


						insert into Company_Bill(COU_ID, Bill_ID, Bill_Month, Bill_Date, profit_amount) 
						values(( select couid
							from car where car_no = (select car_no
							from driver
							where u_id = '${data[13]}')),
							substr(CONCAT( 'BILL_', concat(to_char(sysdate, 'dd-mm-yy'), concat('_', sys_guid())  )), 1, 32), to_char(sysdate, 'Month'), to_date(sysdate, 'dd-mon-yy'),
						((select percentage
						from car
						where car_no = (select car_no
										from driver
										where u_id =  '${data[13]}') )/100) * ${data[4]}*.25
						
						);			
						
						COMMIT;
					EXCEPTION
						WHEN OTHERS THEN
						dbms_output.put_line('Error code ' || SQLCODE || ': ' || SQLERRM);
						ROLLBACK TO start_point1;
					END;`;

	console.log(query);

	try {
		connection = await oracledb.getConnection(dbconnection);

		result = await connection.execute(query);

		console.log('Connected to insert user data');
	} catch (error) {
	} finally {
		if (connection) {
			try {
				await connection.close();
				console.log('Connection ended');
				res.status(200).send(result);
			} catch (error) {
				res.status(401).send(error.message);
			}
		}
	}
}
app.post('/trip', (req, res) => {
	data = req.body;

	//Format the obtained data into separate values and form an array with it
	let piname = data.pick_up_name;
	piname = piname.replace(/ /g, '_');
	let dname = data.drop_off_name;
	dname = dname.replace(/ /g, '_');

	const senddata = [
		data.trip_id,
		data.start_time,
		data.end_time,
		data.fare_init,
		data.fare_amnt,
		data.pick_up_x,
		data.pick_up_y,
		data.drop_off_x,
		data.drop_off_y,
		0, // data.cl_rating,
		0, // data.dr_rating,
		data.trip_date,
		data.clu_id,
		data.dr_id,
		piname,
		dname,
		data.trip_type,
	];
	console.log(senddata);
	sendTripData(req, res, senddata);
});

async function UpdateTrip(req, res, data) {
	const query1 = `BEGIN
						SAVEPOINT start_point2;
						update cliver
						set total_rating = total_rating+ ${data[3]}
						where U_ID = '${data[1]}';
					
						update trip
						set CL_Rating=  ${data[3]}
						where trip_id ='${data[2]}';

						COMMIT;
					EXCEPTION
						WHEN OTHERS THEN
						ROLLBACK TO start_point2;
					END;`;

	const query2 = `BEGIN
						SAVEPOINT start_point3;
						update cliver
						set total_rating = total_rating+ ${data[3]}
						where U_ID = '${data[0]}';

						update trip
						set dr_Rating=  ${data[3]}
						where trip_id ='${data[2]}';
						
						COMMIT;
					EXCEPTION
						WHEN OTHERS THEN
						ROLLBACK TO start_point3;
					END;`;

	var query = '';

	if (data[4] === 'C') {
		query = query1;
	} else if (data[4] === 'D') {
		query = query2;
	}

	console.log(query);

	try {
		connection = await oracledb.getConnection(dbconnection);

		result = await connection.execute(query);

		console.log('Connected to insert user data');
	} catch (error) {
		console.log(error.message);
		res.status(401).send(error.message);
	} finally {
		if (connection) {
			try {
				await connection.close();
				console.log('Connection ended');
				res.status(200).send(result);
			} catch (error) {
				res.status(401).send(error.message);
			}
		}
	}
}

app.post('/updatetriprating', (req, res) => {
	data = req.body;
	const senddata = [
		data.cl_id,
		data.dr_id,
		data.trip_id,
		data.rating,
		data.user_Type,
	];
	UpdateTrip(req, res, senddata);
});

async function InsertCarOwner(req, res, data, info) {
	const query = ` BEGIN
					SAVEPOINT start_point;

						insert into userr (u_id, user_name, admin_id, Name_Fname, Name_Lname, passwordd, dob,age, Phone_No, user_typ) 
						values('${data[0]}','${data[1]}',(SELECT u_id FROM(SELECT u_id FROM userr where admin_id is null ORDER BY dbms_random.value) WHERE rownum = 1),
						'${data[3]}','${data[4]}','${data[5]}',to_date('${data[6]}','yyyy-mm-dd'), TRUNC(TO_NUMBER(SYSDATE - TO_DATE('${data[6]}','yyyy-mm-dd')) / 365.25), '${data[7]}','${data[8]}');
						
						update car
						set couid = '${data[0]}'
						where car_no = '${info[2]}';

						update car_owner
						set N_ID = ${info[1]}
						where U_ID ='${info[0]}';

						
					EXCEPTION
					WHEN OTHERS THEN
					dbms_output.put_line('Error code ' || SQLCODE || ': ' || SQLERRM);
					ROLLBACK TO start_point;
					END;`;

	// console.log(query);

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

app.post('/insertcarowner', (req, res) => {
	data = req.body;
	console.log(data);

	let hexed = Date.now().toString(16);
	hexed = data.user_typ + '-' + hexed + hexed + hexed;
	let the_id = hexed.substring(0, 32).toUpperCase();
	const userid = the_id;
	const username = data.user_name;
	const adminid = data.admin_id;
	const fname = data.Name_Fname;
	const lname = data.Name_Lname;
	const pass = data.password;
	const dob = data.dob;
	const phn = data.Phone_No;
	const usertyp = data.user_typ;

	const nid = data.nid;
	const carid = data.carID;

	const ownerinfo = [userid, nid, carid];
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
	// console.log(ownerinfo);
	// console.log(senddata);
	InsertCarOwner(req, res, senddata, ownerinfo);
	// console.log(`${senddata}`);
});

async function ShowOwnerProfile(req, res, owner_id) {
	const query = `SELECT  u.U_ID, u.User_name, u.Name_Fname ||' '|| u.Name_Lname as "Car owner Name",to_char(u.dob,'dd-mm-yyyy'), u.age, u.phone_no,c.owner_earning,c.N_ID
				   from userr u inner join car_owner c on u.u_id='${owner_id}' and u.u_id = c.u_id`;

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);
	} catch (error) {
		res.status(401).send({
			message: 'Could not fetch data from car owner',
		});
	} finally {
		if (connection) {
			await connection.close();
			res.status(200).send(result.rows);
		}
	}
}

app.get('/getcarownerdata/:owner_id', (request, response) => {
	const owner_id = request.params.owner_id;

	// console.log(owner_id);
	ShowOwnerProfile(request, response, owner_id);
});

async function ShowOwnerCars(req, res, owner_id) {
	const query = ` select * from car
					where COUID ='${owner_id}'`;
	// console.log(query);

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);
	} catch (error) {
		res.status(401).send({
			message: 'Could not fetch data from car owner',
		});
	} finally {
		if (connection) {
			await connection.close();
			res.status(200).send(result.rows);
		}
	}
}

app.get('/getcarownercar/:owner_id', (request, response) => {
	const owner_id = request.params.owner_id;

	// console.log(owner_id);
	ShowOwnerCars(request, response, owner_id);
});

async function ShowOwnerDrivers(req, res, owner_id) {
	const query = ` SELECT u.User_name, u.Name_Fname ||' '|| u.Name_Lname as "Driver Name",d.total_earning,d.Car_no, u.Phone_no, to_char(u.dob, 'Month dd, yyyy'), u.age    
	from Userr u, driver d
	where u.u_ID in (select dru_id 
		from hire
		where cou_id= '${owner_id}') and u.u_id = d.u_id`;
	// console.log(query);
	let iserrorfound = false;

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);
	} catch (error) {
		iserrorfound = true;
		res.status(401).send({
			message: 'Could not fetch data from car owner',
		});
	} finally {
		if (connection) {
			await connection.close();
			if (!iserrorfound) res.status(200).send(result.rows);
		}
	}
}

app.get('/getcarownerdriver/:owner_id', (request, response) => {
	const owner_id = request.params.owner_id;
	console.log(owner_id);
	ShowOwnerDrivers(request, response, owner_id);
});

async function ShowOwnerDailyEarning(req, res, owner_id) {
	const query = `drop table earningdaily`;
	const query1 = `create table earningdaily (tripdate date, amount number)`;

	const query2 = ` create or replace procedure getdate
						As
						Begin  
							for r in (select dru_id from hire where cou_id='${owner_id}')
							loop for c in
								(select trip_date,
								Fare_amnt*((select percentage
											from car
											where car_no in (select car_no
															from driver
															where u_id = r.dru_id) )/100) Earning
									from Trip
									where dru_id = r.dru_id) loop
									insert into earningdaily values(c.trip_date, c.Earning);  
									commit;  
							end loop;
						end loop;
						EXCEPTION
						WHEN OTHERS THEN
						raise_application_error(-20001,'An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
						End;
						`;

	const query3 = `Begin
						 getdate; 
				    End;`;

	const query4 = `select to_char(tripdate,'dd-mm-yyyy'), Sum(amount) from earningdaily group by tripdate`;

	// console.log(query);
	// console.log(query1);
	// console.log(query2);
	// console.log(query3);
	// console.log(query4);
	let iserrorfound = false;

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);
		result1 = await connection.execute(query1);
		result2 = await connection.execute(query2);
		result3 = await connection.execute(query3);
		result4 = await connection.execute(query4);
	} catch (error) {
		iserrorfound = true;
		res.status(401).send({
			message: error.message,
		});
	} finally {
		if (connection) {
			await connection.close();
			if (!iserrorfound) res.status(200).send(result4.rows);
		}
	}
}

app.get('/getcarownerdailyearning/:owner_id', (request, response) => {
	const owner_id = request.params.owner_id;
	// console.log(owner_id);
	ShowOwnerDailyEarning(request, response, owner_id);
});

async function ShowOwnerRelatedTrips(req, res, owner_id) {
	const query = `drop table tripcldr`;
	const query1 = `create table tripcldr	(tripid varchar2(32),cl_id varchar2(32), dr_id varchar2(32))`;

	const query2 = ` 
					create or replace procedure gettripclientdriver
					is d varchar2(32); e varchar2(32);   
					Begin  for d in ( select u_id
														from driver
														where car_no = (select car_no
																						from car
																						where couid ='${owner_id}'))
							loop for e in
										( select trip_id,clu_id,dru_id
											from trip
											where trip_id= trip_id 
											and dru_id = d.u_id)
							loop
					insert into tripcldr values(e.trip_id, e.clu_id,e.dru_id );    
							end loop;
					end loop;
					EXCEPTION
					WHEN OTHERS THEN
						raise_application_error(-20001,'An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
					End;
	
						`;

	const query3 = `Begin
										gettripclientdriver; 
				    			End;`;

	const query4 = `select t.trip_id, to_char(t.trip_date, 'Mon dd, yyyy'), to_char(t.start_time, 'hh:mi:ssam') || ' - ' || to_char(t.end_time, 'hh:mi:ssam'), u.name_Fname ||' '|| u.name_Lname as "Client", v.name_Fname ||' '|| v.name_Lname as "Driver", t.pickup_location_name, t.destination_location_name, t.fare_amnt
									from trip t, userr u, userr v
									where (t.trip_id,u.u_id ,v.u_id) in (select tripid, cl_id, dr_id
																											from tripcldr)
	`;

	// console.log(query);
	// console.log(query1);
	// console.log(query2);
	// console.log(query3);
	// console.log(query4);
	// res.status(201).send({ message: 'Hahahaha' });
	let iserrorfound = false;

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);
		result1 = await connection.execute(query1);
		result2 = await connection.execute(query2);
		result3 = await connection.execute(query3);
		result4 = await connection.execute(query4);
	} catch (error) {
		iserrorfound = true;
		res.status(401).send({
			message: error.message,
		});
	} finally {
		if (connection) {
			await connection.close();
			if (!iserrorfound) res.status(200).send(result4.rows);
		}
	}
}

app.get('/getcarownertrips/:owner_id', (request, response) => {
	const owner_id = request.params.owner_id;
	// console.log(owner_id);
	ShowOwnerRelatedTrips(request, response, owner_id);
});

async function ShowOwnerTrips(req, res, owner_id) {
	const query = `select * from trip`;
	// console.log(query);
	let iserrorfound = false;

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);
		// console.log(result);
	} catch (error) {
		iserrorfound = true;
		res.status(401).send({
			message: 'Could not fetch data from Trips',
		});
	} finally {
		if (connection) {
			await connection.close();
			if (!iserrorfound) res.status(200).send(result.rows);
		}
	}
}

app.get('/getcarownertrips/:owner_id', (request, response) => {
	const owner_id = request.params.owner_id;
	// console.log(`WHYYYYY ${owner_id}`);
	ShowOwnerTrips(request, response, owner_id);
});

async function ShowUserTrips(req, res, owner_id) {
	const query = `
	select  Trip_ID as "Trip ID",
        to_char(Trip_date, 'dd-Mon-yyyy') as "Trip Date",
        to_char(Start_Time, 'hh:mi:ssam') || ' to ' ||
        to_char(End_Time, 'hh:mi:ssam') as "Trip Time",
        c.name_fname || ' ' || c.name_lname as "Client",
        d.name_fname || ' ' || d.name_lname as "Driver",
        pickup_location_name || ':    (' || Pick_up_X || ', ' ||
        Pick_up_Y || ')' as "Pickup Location",
        destination_location_name || ':    (' || Drop_off_X || ', ' || 
        Drop_off_Y || ')' as "Drop off Location",
        Fare_amnt as "Fare Amount",
        trip_type as "Trip Type"
from trip,  userr c, userr d
where clu_id = c.u_id and dru_id = d.u_id and c.u_id = '${owner_id}'
order by trip_date desc
	`;
	const dquery = `
	select  Trip_ID as "Trip ID",
        to_char(Trip_date, 'dd-Mon-yyyy') as "Trip Date",
        to_char(Start_Time, 'hh:mi:ssam') || ' to ' ||
        to_char(End_Time, 'hh:mi:ssam') as "Trip Time",
        c.name_fname || ' ' || c.name_lname as "Client",
        d.name_fname || ' ' || d.name_lname as "Driver",
        pickup_location_name || ':    (' || Pick_up_X || ', ' ||
        Pick_up_Y || ')' as "Pickup Location",
        destination_location_name || ':    (' || Drop_off_X || ', ' || 
        Drop_off_Y || ')' as "Drop off Location",
        Fare_amnt as "Fare Amount",
        trip_type as "Trip Type"
from trip,  userr c, userr d
where clu_id = c.u_id and dru_id = d.u_id and d.u_id = '${owner_id}'
order by trip_date desc
	`;
	// console.log(query);
	let iserrorfound = false;

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);
		dresult = await connection.execute(dquery);
		// console.log(result);
		// console.log(dresult);
	} catch (error) {
		iserrorfound = true;
		res.status(401).send({
			message: error.message,
		});
	} finally {
		if (connection) {
			await connection.close();
			if (!iserrorfound) {
				if (result.rows.length) res.status(200).send(result.rows);
				else if (dresult.rows.length) res.status(200).send(dresult.rows);
			}
		}
	}
}

app.get('/getusertrips/:owner_id', (request, response) => {
	const owner_id = request.params.owner_id;
	// console.log(`WHYYYYY ${owner_id}`);
	ShowUserTrips(request, response, owner_id);
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

async function checkforusername(req, res, un) {
	const query = `select * from userr where user_name = '${un}'`;

	try {
		connection = await oracledb.getConnection(dbconnection);
		// console.log('Checking if the username exists ', un);

		result = await connection.execute(query);

		// console.log(result.rows.length);

		if (result.rows.length === 0) {
			res.status(201).send({
				found: false,
			});
		} else {
			res.status(201).send({
				found: true,
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(401).send(error.message);
	} finally {
		try {
			if (connection) {
				await connection.close();
				// console.log('Checking for username ended successfully');
			}
			res.status(201).send();
		} catch (error) {
			console.error(error.message);
			res.status(401).send(error.message);
		}
	}
}

app.get('/checkusername/:username', (req, res) => {
	let username = req.params.username;

	checkforusername(req, res, username);
});

//------------------------CHECK FOR CAR OWNER -----------------------------
async function checkforCOUID(req, res, couid) {
	const query = `select * from userr
				   where u_id= '${couid}'`;
	console.log(query);

	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);

		if (result.rows.length === 0) {
			res.status(201).send({
				found: false,
			});
		} else {
			res.status(201).send({
				found: true,
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(401).send(error.message);
	} finally {
		try {
			if (connection) {
				await connection.close();
			}
		} catch (error) {
			console.error(error.message);
			res.status(401).send(error.message);
		}
	}
}

app.get('/checkcarownerid/:couid', (req, res) => {
	let couid = req.params.couid;

	checkforCOUID(req, res, couid);
});

//------------------------CHECK FOR CAR NO -----------------------------
async function checkforCarNo(req, res, carno, ownerno) {
	const query = `select * from car
				   where car_no = '${carno}' and couid = '${ownerno}'`;

	console.log(query);
	try {
		connection = await oracledb.getConnection(dbconnection);
		result = await connection.execute(query);

		if (result.rows.length === 0) {
			res.status(201).send({
				found: false,
			});
		} else {
			res.status(201).send({
				found: true,
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(401).send(error.message);
	} finally {
		try {
			if (connection) {
				await connection.close();
			}
		} catch (error) {
			console.error(error.message);
			res.status(401).send(error.message);
		}
	}
}
app.get('/checkcarno/:carno/:ownerid', (req, res) => {
	let carno = req.params.carno;
	let ownerno = req.params.ownerid;
	console.log(`CHECKCHEKCHEK ${carno} ${ownerno}`);
	checkforCarNo(req, res, carno, ownerno);
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
	socket.on('finishtrip', (socet_id, tripdata) => {
		socket.broadcast.emit('finishtrip', socet_id, tripdata);
	});
	//
	//
	//
});
