// API DATA COVID-19
// Handling data from API
function handlingDataAPI (result) {
	// data from API
	let total_cases = result['countrydata'][0]['total_cases'];
	let total_deaths = result['countrydata'][0]['total_deaths'];
	let total_recovered = result['countrydata'][0]['total_recovered'];
	let total_new_cases = result['countrydata'][0]['total_new_cases_today'];
	let total_new_deaths = result['countrydata'][0]['total_new_deaths_today'];

	// taruh data ke html
	$('#cases').html(total_cases);
	$('#deaths').html(total_deaths);
	$('#recovered').html(total_recovered);
	$('#new-cases').html(total_new_cases);
	$('#new-deaths').html(total_new_deaths)
}

// Get data from API
$(document).ready(function(){
	// API data covid-19
	const api = 'https://api.thevirustracker.com/free-api?countryTotal=ID';
	// get data json from API
	$.ajax({
		url: api,
		type: 'get',
		dataType: 'json',
		crossDomain: true
	})
	.done(function(result) {
		console.log("success");
		handlingDataAPI(result);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		$('#corona').hide('slow');
	});
});

// CRUD
// content form dan table
var form = document.getElementsByClassName('hide-form')[0];
var table = document.getElementsByClassName('hide-table')[0];
var captionTable =  document.getElementsByTagName('caption')[0];
var buttonForm = form[4];

// tempat penyimpanan data
var Data_Store = [];
// handling content show & hide
function handlingContent(element,action){
	switch (action) {
		case 'show':
			$(element).show('slow');
			break;
		case 'hide':
			$(element).hide('slow');
			break;
		default:
			break;
	}
}

// membuat data
function createData(data_store){
	// tutup semua table
	handlingContent(table, 'hide');
	// tampilkan form input
	handlingContent(form, 'show');
	// ubah text button form
	buttonForm.innerText = 'Create';

	// ketika button diklik, buat data
	buttonForm.onclick = function(){
		// masukan input value ke Object
		isiData = {
			nama:form[0].value,
			nim:form[1].value,
			jurusan:form[2].value,
			angkatan:form[3].value
		}
		// jika input value kosong, hapus property Object
		for( let i in isiData ){
			if( isiData[i] === '' ){
				delete isiData[i];
			}
		}
		// jika Object mempunyai property lengkap, object disimpan
		if( isiData.hasOwnProperty('nama') &&
		 	isiData.hasOwnProperty('nim') && 
		 	isiData.hasOwnProperty('jurusan') && 
		 	isiData.hasOwnProperty('angkatan')){
			// data dibuat
			data_store.push(isiData);
			// kosongkan input value
			for( let i = 0; i < form.length-1; i++ ){
				form[i].value = '';
			}
			// tampilkan data
			readData(data_store);
		}else{
			alert('Form cannot be empty');
		}
	}
}

// menampilkan data
function readData(data_store){
	// tutup semua form
	handlingContent(form, 'hide');
	// ubah text caption table
	captionTable.innerText = '';
	// ambil table body
	var tableBody = document.getElementsByTagName('tbody')[0];

	// jika isi data lebih dari satu, proses data
	if( data_store.length > 0 ){
		// deklarasi variabel
		var i, v, txt = '';
		// ambil semua data dan membuat element HTML baru
		for( i in data_store ){
			txt += '<tr class="data">';
			txt += '<th scope="row">'+ (parseInt(i)+1) +'</th>';
			for( v in data_store[i] ){
				txt += '<td>' + data_store[i][v] + '</td>';
			}
			txt += '</tr>'
		}
		// gabungkan data dan element HTML ke table body
		tableBody.innerHTML = txt;
		// tampilkan data/table data
		handlingContent(table,'show');
	} else {
		alert('Data is empty !');
		handlingContent(table, 'hide');
	}
}

// merubah data
function updateData(data_store){
	// tampilkan data
	readData(data_store);
	// ubah text caption table
	captionTable.innerText = 'Click Data For Updated';
	// ambil semua data
	var dataClick = document.getElementsByClassName('data');

	// looping semua data
	for( let i = 0; i < dataClick.length; i++ ){
		// ketika data yang dipilih diklik, tampilkan confirm
		dataClick[i].onclick = function(){
			var answer = confirm('Update Data ?');
			// jika ok, tampilkan form input
			if( answer === true ){
				// ambil nomer data dan ubah text button form
				var userUpdate = parseInt(dataClick[i].firstChild.innerText);
				handlingContent(table, 'hide');
				buttonForm.innerText = 'Update';
				handlingContent(form, 'show');
				// value data lama
				form[0].value = data_store[userUpdate-1]['nama'];
				form[1].value = data_store[userUpdate-1]['nim'];
				form[2].value = data_store[userUpdate-1]['jurusan'];
				form[3].value = data_store[userUpdate-1]['angkatan'];
				// ketika button form diklik, proses update data
				buttonForm.onclick = function(){
					// update data dengan input value yang baru
					data_store[userUpdate-1]['nama'] = form[0].value;
					data_store[userUpdate-1]['nim'] = form[1].value;
					data_store[userUpdate-1]['jurusan'] = form[2].value;
					data_store[userUpdate-1]['angkatan'] = form[3].value;
					// jika input value kosong, hapus property data yang dipilih
					for(var v in data_store[userUpdate-1] ){
						if( data_store[userUpdate-1][v] === '' ){
							delete data_store[userUpdate-1][v];
						}
					}
					// jika data yang dipilih mempunyai property lengkap, data disimpan
					if( data_store[userUpdate-1].hasOwnProperty('nama') &&
					 	data_store[userUpdate-1].hasOwnProperty('nim') && 
					 	data_store[userUpdate-1].hasOwnProperty('jurusan') && 
					 	data_store[userUpdate-1].hasOwnProperty('angkatan')){
						// data diupdate
						alert('Update Successful');
						// kosongkan input value
						for( let i = 0; i < form.length-1; i++ ){
							form[i].value = '';
						}
						// tampilkan data 
						readData(data_store);
						updateData(data_store);
					}else{
						alert('Form cannot be empty !');
					}
				};
			}
		};
	}	
}

// menghapus data
function deleteData(data_store){
	// tampilkan data
	readData(data_store);
	// ubah text caption table
	captionTable.innerText = 'Click Data For Deleted';
	// ambil semua data
	var dataClick = document.getElementsByClassName('data');

	// looping semua data
	for( let i = 0; i < dataClick.length; i++ ){
		// ketika data yang dipilih diklik, tampilkan confirm
		dataClick[i].onclick = function(){
			var answer = confirm('Delete Data ?');
			// jika ok lakukan hapus data
			if( answer === true ){
				// ambil nomer data
				var userDelete = parseInt(dataClick[i].firstChild.innerText);
				// data dihapus
				data_store.splice(userDelete - 1, 1);
				dataClick[i].remove();
				alert('Delete Successful');
				// jika isi data 0, hanya jalankan fungsi read data
				if( data_store.length === 0 ){
					readData(data_store);
				}else{
					readData(data_store);
					deleteData(data_store);
				}
			} 
		};	
	}
}