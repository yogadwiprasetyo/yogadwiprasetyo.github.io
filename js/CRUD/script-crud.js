// content form dan table
var form = document.getElementsByClassName('hide-form')[0];
var table = document.getElementsByClassName('hide-table')[0];
var captionTable =  document.getElementsByTagName('caption')[0];

// tempat penyimpanan data
var Data_Store = [];

function showContent(element){
	$(element).show('slow');
}

function hideContent(element){
	$(element).hide('slow');
}

// membuat data
function createData(data_store){
	// tutup semua table
	hideContent(table);

	// tampilkan form input
	showContent(form);

	// ubah text button form
	form[4].innerText = 'Create';

	// ketika button diklik, buat data
	form[4].onclick = function(){
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
			alert('Create Data Successful');
			// kosongkan input value
			for( let i = 0; i < form.length-1; i++ ){
				form[i].value = '';
			}
			// sembunyikan form dan tampilkan data
			// hideContent();
			readData(data_store);
		}else{
			alert('Form cannot be empty');
		}
	}
}

// menampilkan data
function readData(data_store){
	// tutup semua form
	hideContent(form);

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
		showContent(table);
	} else {
		alert('Data is empty !');
		hideContent(table);
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
				hideContent(table);
				form[4].innerText = 'Update';
				showContent(form);
				// ketika button form diklik, proses update data
				form[4].onclick = function(){
					// update data dengan input value yang baru
					console.log(data_store[userUpdate-1]);
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
						// tampilkan data dan sembunyikan form
						readData(data_store);
						hideContent(form);
						updateData(data_store);
					}else{
						alert('Form cannot be empty !');
					}
				};
			} else {
				console.log('Data not update');
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
	// jika isi data lebih dari 0, proses data
	if( data_store.length > 0 ){
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
					// jika isi data 0, hanya tampilkan data
					if( data_store.length === 0 ){
						readData(data_store);
					}else{
						readData(data_store);
						deleteData(data_store);
					}
				} else {
					console.log('Data not update');
				}
			};	
		}
	}
}