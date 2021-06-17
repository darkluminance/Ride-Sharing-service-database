const express = require('express'); //Import express JS library
const app = express();

const oracledb = require('oracledb'); //Import oracle library
const port = 5001; //Set backend server port number
const cors = require('cors'); //CORS allows requests from browser to be allowed
const { response, request } = require('express');

//The credentials for oracle database
const dbconnection = {
	user: 'MahaDbms',
	password: 'MahaDbms',
	connectString: 'localhost/xe',
};

//This is required for getting past the 'access blocked by cors' error
app.use(cors());

//Will convert all coming data into JSON
app.use(express.json());
app.use(express.static('public'));
//users headers
const userdata = {
    headers: ["U_ID","User_name","Admin_id","Fname","Lname","phn","dob","age","usertype"],
    rows: new Array(5).map(() => {
        return [
            Array[0].U_ID(),
            Array[1].User_name(),
            Array[2].Admin_id(),
            Array[3].Fname(),
            Array[4].Lname(),
            Array[5].phn(),
            Array[6].dob(),
            Array[7].age(),
            Array[8].usertype(),
        ];
    

    })

    
};
///USERS INFO
async function getData(req,res) {
    const query=`select * from user_view`;
		var udata = null;
    try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		udata = {
			headers: ["User ID","User Name","First Name","Last Name","Phone","Date of Birth","Age","User Type"],
			rows: result.rows,
		}


		console.log('Connected');
	} catch (error) {
		//If any error occurs while connecting or fetching data
	} finally {
		if (connection) {
			await connection.close(); //Closes the connection
			console.log('Connection ended');
		}
		res.status(200).send(udata); //Sends back the data with success status 200
    }
}
///------------Clientt---------------
async function get_ClData(req,res) {
    const query=`select * from clientt`;
		var udata = null;
    try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		udata = {
			headers: ["User ID","Client Location X","Client Location Y"],
			rows: result.rows,
		}


		console.log('Connected');
	} catch (error) {
		//If any error occurs while connecting or fetching data
	} finally {
		if (connection) {
			await connection.close(); //Closes the connection
			console.log('Connection ended');
		}
		res.status(200).send(udata); //Sends back the data with success status 200
    }
}

//------------DRIVER-----------
async function get_DrData(req,res) {
    const query=`select * from driver`;
		var udata = null;
    try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		udata = {
			headers: ["User ID","NID","Car Owner ID","Car Number","Driver Location X","Driver Location Y","Total Earning"],
			rows: result.rows,
		}


		console.log('Connected');
	} catch (error) {
		//If any error occurs while connecting or fetching data
	} finally {
		if (connection) {
			await connection.close(); //Closes the connection
			console.log('Connection ended');
		}
		res.status(200).send(udata); //Sends back the data with success status 200
    }
}
//------------TRIP-----------
async function get_Trip(req,res) {
    const query=`select  Trip_ID,
			to_char(Start_Time, 'hh:mi:ssam'),
			to_char(End_Time, 'hh:mi:ssam'),
			trip_type,
			Fare_Init_amnt,
			Fare_amnt,
			Pick_up_X,
			Pick_up_Y,
			Drop_off_X,
			Drop_off_Y,
			pickup_location_name,
			destination_location_name,
			CL_Rating,
			Dr_Rating,
			to_char(Trip_date, 'dd-mon-yyyy'),
			CLU_ID ,
			DRU_ID
			from trip`;
		var udata = null;
    try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		udata = {
			headers: ["Trip ID","Start Time","End Time","Trip Type","Fare Initial Amount","Fare Amount","Pick Up X","Pick Up Y","Drop Off X"," Drop Off Y ","Pickup Location Name","Destination Location Name","Client Rating","Driver Rating","Trip Date","Client ID","Driver ID"],
			rows: result.rows,
		}


		console.log('Connected');
	} catch (error) {
		//If any error occurs while connecting or fetching data
	} finally {
		if (connection) {
			await connection.close(); //Closes the connection
			console.log('Connection ended');
		}
		res.status(200).send(udata); //Sends back the data with success status 200
    }
}
//------------CAR OWNER-----------
async function get_CarOwn(req,res) {
    const query=`select *from Car_Owner`;
		var udata = null;
    try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		udata = {
			headers: ["User ID","Car Rent", "NID", "Car Number"],
			rows: result.rows,
		}


		console.log('Connected');
	} catch (error) {
		//If any error occurs while connecting or fetching data
	} finally {
		if (connection) {
			await connection.close(); //Closes the connection
			console.log('Connection ended');
		}
		res.status(200).send(udata); //Sends back the data with success status 200
    }
}
//------------CAR-----------
async function get_Car(req,res) {
    const query=`select *from Car`;
		var udata = null;
    try {
		//Try to perform a connection to the oracle database using the credentials above
		connection = await oracledb.getConnection(dbconnection);

		//Executes the query and stores the obtained data
		result = await connection.execute(query);

		udata = {
			headers: ["Car Number","Car Color","Car Model","Car Type","Percentage"],
			rows: result.rows,
		}


		console.log('Connected');
	} catch (error) {
		//If any error occurs while connecting or fetching data
	} finally {
		if (connection) {
			await connection.close(); //Closes the connection
			console.log('Connection ended');
		}
		res.status(200).send(udata); //Sends back the data with success status 200
    }
}
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

		console.log('Connected');
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

//Get user id 	-------> req is the request, res is the response we'll send back to the browser, un is the username
async function getUserID(req, res, un) {
	const query = `SELECT u_id FROM Userr WHERE user_name = '${un}'`;
	// console.log(query);

	try {
		connection = await oracledb.getConnection(dbconnection);

		result = await connection.execute(query);

		//if (result.rows[0] == null) throw 'Data not found';

		console.log('Connected');
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
});

///GET req for getting user info
app.get('/Userdata',(request,response) => {
    //res.json(userdata);
    console.log('req obtained');
    getData(request,response);
});

///get req form clientt
app.get('/Client',(request,response) => {
    //res.json(userdata);
    console.log('req obtained');
    get_ClData(request,response);
});
///get req from driver
app.get('/Driver',(request,response) => {
    //res.json(userdata);
    console.log('req obtained');
    get_DrData(request,response);
});
///get req from trip
app.get('/Trip',(request,response) => {
    //res.json(userdata);
    console.log('req obtained');
    get_Trip(request,response);
});
///get req from car owner
app.get('/CarOwn',(request,response) => {
    //res.json(userdata);
    console.log('req obtained');
    get_CarOwn(request,response);
});
///get req from car
app.get('/Car',(request,response) => {
    //res.json(userdata);
    console.log('req obtained');
    get_Car(request,response);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});