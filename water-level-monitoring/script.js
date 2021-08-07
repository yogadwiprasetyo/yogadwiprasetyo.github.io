// Setup Status IoT is On or Off
function setStatus (data) {
  const firstDistance = $('#first-distance').text()

  let isOneMinutes = data == 6;
  let isNotChange = $('#volume').text() == firstDistance;

  if (isOneMinutes && isNotChange) {
    $('#status').removeClass('badge-success').addClass('badge-danger').text('OFF');
    i = 0; 
    return;
  } 

  if (!isNotChange && i == 1) {
    $('#status').removeClass('badge-danger').addClass('badge-success').text('ON');
  }

  if (i == 6) {
    i = 0
  }
}

// Setup position level water is safe, warning, or danger.
function setPosition (value) {
  if (value <= 5) {
    $('#position').removeClass('badge-success badge-warning').addClass('badge-danger').text('Danger');
  } else if (value >= 6 && value <= 15) {
    $('#position').removeClass('badge-danger badge-success').addClass('badge-warning').text('Warning');
  } else if (value >= 16 && value <= 30) {
    $('#position').removeClass('badge-danger badge-warning').addClass('badge-success').text('Safe');
  }
}

// Setup volume water in cm
function setVolume (value) {
  if (value > 30) {
    return;
  }

  $('#volume').text(`${value} cm`);
}

// Setup status alert email
function setEmail () {
  const status = $('#status').text()

  if (status != 'ON') {
    $('#email').removeClass('badge-primary').addClass('badge-danger').text('Non-Active');
    return;
  }

  $('#email').removeClass('badge-danger').addClass('badge-primary').text('Active');
}

// Send alert email if status active
function sendAlertEmail () {
  const isEmailNonActive = $('#email').text() == "Non-Active";

  // Check status email
  if (isEmailNonActive) {
    return;
  }

  // Send alert email
  $.ajax({
    url: 'https://api.thingspeak.com/alerts/send',
    headers: {
        'ThingSpeak-Alerts-API-Key':'TAKT1FY716X2VZEMTZ3AM',
        'Content-Type':'application/json'
    },
    method: 'POST',
    dataType: 'json',
    data: {
      'subject': 'Water Level Monitoring',
      'body': 'The water level is in a dangerous position!'
    },
    success: function(data){
      console.log('succes: '+data);
    }
  });
}

// Change volume in water tank
// from API value
function fillWater (value) {
  if (value <= 5) { // +4
    let sumHeight = $('.water').height()
      
    if (sumHeight >= 100) {
      return;
    }

    if (sumHeight < 80) {
      $('.water').height(`90%`);
      return;
    }

    if (sumHeight >= 80) {
      $('.water').height(`${sumHeight+4}%`)
    }
  } else if (value >= 6 && value <= 15) { // +4
    let sumHeight = $('.water').height()
    
    if (sumHeight == 80) {
      return
    }

    if (sumHeight < 40) {
      $('.water').height(`60%`);
      return;
    }

    if (sumHeight > 80) {
      $('.water').height(`60%`);
    }

    if (sumHeight >= 40 && sumHeight <= 79) {
      $('.water').height(`${sumHeight+4}%`)
    }
  } else if (value >= 16 && value <= 30) {
      let sumHeight = $('.water').height()

      if (sumHeight == 40) {
        return;
      }

      if (sumHeight > 40) {
        $('.water').height(`30%`)
      }
      
      if (sumHeight >= 0 && sumHeight <= 39) {
        $('.water').height(`${sumHeight+4}%`)
      }
  }
}

// ===================================================


// Running all function logic to display information
let i = 0;
function run (data) {
  i += 1;

  setPosition(data); // TESTING PASS
  setVolume(data); // TESTING PASS
  setEmail(); // TESTING PASS
  setStatus(i); // TESTING PASS
  fillWater(data); // TESTING PASS

  // Send Alert if position on danger and IoT is ON
  if ($('#position').text() == "Danger") {
    // sendAlertEmail();
  }

  // Show alert success, connecting, and info.
  if ($('#status').text() == 'ON') {
    $('#connecting').show();
    $('#success').show();
    $('#off').hide();
  } else {
    $('#success').hide();
    $('#connecting').hide();
    $('#off').show();
  }

  // Set first value for checking status IoT
  $('#first-distance').text($('#volume').text());
}

// Running for 10 seconds to check status IoT
// if in 60 seconds value from API not change, IoT is off.
// if in 10 seconds value from API change, IoT is on.
const si = setInterval(function()
{ 
  $.ajax({
    type: "GET",
    url: "https://api.thingspeak.com/channels/1462518/feeds/last.json?api_key=OJOHX0ZKR58DKOMJ",
    datatype:"json",
    success: function(data)
    {
      console.log(data)
      run(data.field1)
    },
    error: function (err) {
      $('#err').text(err);
    }
  });
}, 10000);



// clearInterval(si);
