// var myVar = document.getElementById('haga');

// myVar.addEventListener("click",function(){
//     alert("hi");
// });
{
	/**
	 * Populates a data table with some data
	 * @param {HTMLDivElement} root
	 */
	//-------------- user info---------------
	async function updateTable(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/Userdata');
		const userdata = await response.json();
		console.log(userdata.headers);

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'User table';

		//populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}

		//populate data
		for (const [i, data] of userdata.rows.entries()) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td>${td}</td>`;
			}
			table.querySelector('tbody').insertAdjacentHTML(
				'afterbegin',
				`<tr class="addbtn"> ${tablerowdata} <td><i class="fas fa-trash deleteBtn" 
					onclick="executedelete('${userdata.rows[i][0]}', '${userdata.rows[i][3]}')" 
					></i></td></tr> `
			);
		}
	}

	//-----------CLIENT-----------
	async function update_ClTable(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/Client');
		const userdata = await response.json();
		console.log(userdata.headers);

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'Client table';

		//populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}
		console.log(userdata.rows);
		//populate data
		for (const [i, data] of userdata.rows.entries()) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td >${td}</td>`;
			}
			table
				.querySelector('tbody')
				.insertAdjacentHTML(
					'afterbegin',
					`<tr class="addbtn"> ${tablerowdata} <td><i class="fas fa-trash deleteBtn" onclick="executedelete('${userdata.rows[i][0]}', 'C')" ></i></td></tr> `
				);
		}
	}
	//DELETE EXECUTION
	function executedelete(innerhtml, tt) {
		if (!tt) return;
		console.log(innerhtml);
		deletecall(innerhtml, tt);

		location.reload();
	}

	async function deletecall(uid, tt) {
		const fetching = await fetch(`http://localhost:5001/d/userr/${uid}/${tt}`);
		const response = await fetching.json();
		console.log(response);
	}

	//---------DRIVER-----------
	async function update_DrTable(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/Driver');
		const userdata = await response.json();
		console.log(userdata.headers);

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'Driver table';

		//populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}

		//populate data
		for (const [i, data] of userdata.rows.entries()) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td>${td}</td>`;
			}
			table
				.querySelector('tbody')
				.insertAdjacentHTML(
					'afterbegin',
					`<tr class="addbtn"> ${tablerowdata} <td><i class="fas fa-trash deleteBtn" onclick="executedelete('${userdata.rows[i][0]}', 'D')" ></i></td></tr> `
				);
		}
	}
	//---------TRIP-----------\
	async function update_Trip(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/Trip');
		const userdata = await response.json();
		console.log(userdata.headers);

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'Trip table';

		//populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}

		//populate data
		for (const data of userdata.rows) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td>${td}</td>`;
			}
			table
				.querySelector('tbody')
				.insertAdjacentHTML(
					'afterbegin',
					`<tr class="addbtn"> ${tablerowdata}</tr> `
				);
		}
	}
	//---------CAR_OWNER-----------\
	async function update_CarOwn(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/CarOwn');
		const userdata = await response.json();
		console.log(userdata.headers);

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'Car Owner table';

		//populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}

		//populate data
		for (const [i, data] of userdata.rows.entries()) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td>${td}</td>`;
			}
			table
				.querySelector('tbody')
				.insertAdjacentHTML(
					'afterbegin',
					`<tr class="addbtn"> ${tablerowdata} <td><i class="fas fa-trash deleteBtn" onclick="executedelete('${userdata.rows[i][0]}', 'CO')" ></i></td></tr> `
				);
		}
	}
	//---------CAR-----------\
	async function update_Car(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/Car');
		const userdata = await response.json();
		console.log(userdata.headers);

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'Car table';

		//populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}

		//populate data
		for (const data of userdata.rows) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td>${td}</td>`;
			}
			table
				.querySelector('tbody')
				.insertAdjacentHTML(
					'afterbegin',
					`<tr class="addbtn"> ${tablerowdata} </tr> `
				);
		}
	}
	///--------------Company Bill Daily------------
	async function update_bill(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/combilldaily');
		const userdata = await response.json();
		console.log(userdata.headers);
		// console.log('mappy');

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'Company Bill data daily';

		///populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}

		//populate data
		for (const data of userdata.rows) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td>${td}</td>`;
			}
			table
				.querySelector('tbody')
				.insertAdjacentHTML(
					'afterbegin',
					`<tr class="addbtn"> ${tablerowdata}</tr> `
				);
		}
	}
	//--------------Company Bill monthy------------
	async function update_bill_monthly(root) {
		const table = root.querySelector('.table-ref-data');
		const response = await fetch('http://localhost:5001/combillmonthly');
		const userdata = await response.json();
		console.log(userdata.headers);

		//clear data
		table.querySelector('thead tr').innerHTML = '';
		table.querySelector('tbody').innerHTML = '';
		document.querySelector('h2.pt-3').innerHTML = 'Company Bill data monthly';

		//populate headers

		for (var index in userdata.headers) {
			table
				.querySelector('thead tr')
				.insertAdjacentHTML(
					'afterbegin',
					`<th>${userdata.headers[userdata.headers.length - index - 1]}</th>`
				);
		}

		//populate data
		for (const [i, data] of userdata.rows.entries()) {
			let tablerowdata = '';
			for (const td of data) {
				tablerowdata += `<td>${td}</td>`;
			}
			table
				.querySelector('tbody')
				.insertAdjacentHTML(
					'afterbegin',
					`<tr class="addbtn"> ${tablerowdata}</tr> `
				);
		}
	} //END OF TABLES

	for (const root of document.querySelectorAll('.table-ref[data-url]')) {
		const table = document.createElement('table');

		table.classList.add('table-ref-data');

		table.innerHTML = `
            <thead>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Welcome! Click on any table on the left to view</strong></td>
                <tr>
            </tbody>
        `;

		root.append(table);
		var user = document.getElementById('user');
		var client = document.getElementById('client');
		var driver = document.getElementById('driver');
		var trip = document.getElementById('trip');
		var carown = document.getElementById('CarOwn');
		var car = document.getElementById('car');
		var bill_daily = document.getElementById('cbd');
		var bill_monthly = document.getElementById('cbm');
		var logout_btn = document.getElementsByClassName('lgt');
		var deletebtn = document.getElementsByClassName('deleteBtn');

		logout_btn.addEventListener('click', function () {
			localStorage.removeItem('token');
			window.location.replace('http://localhost:8081');
			location.reload();
		});

		if (user) {
			user.addEventListener('click', function () {
				//  alert("hi");
				updateTable(root);
			});
		}
		if (client) {
			client.addEventListener('click', function () {
				//  alert("hi");
				update_ClTable(root);
			});
		}
		if (driver) {
			driver.addEventListener('click', function () {
				//  alert("hi");
				update_DrTable(root);
			});
		}
		if (trip) {
			trip.addEventListener('click', function () {
				//  alert("hi");
				update_Trip(root);
			});
		}
		if (carown) {
			carown.addEventListener('click', function () {
				// alert("hi");
				update_CarOwn(root);
			});
		}
		if (car) {
			car.addEventListener('click', function () {
				// alert("hi");
				update_Car(root);
			});
		}
		if (bill_daily) {
			bill_daily.addEventListener('click', function () {
				// alert("hi");
				update_bill(root);
			});
		}
		if (bill_monthly) {
			bill_monthly.addEventListener('click', function () {
				//  alert("hi");
				update_bill_monthly(root);
			});
		}
	}
}
