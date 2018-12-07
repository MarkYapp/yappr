$(".login-button").click(function (event) {
  event.preventDefault();
  $("#log-in").addClass("hidden");
  $("#sign-up").addClass("hidden");
  $(".user-page").removeClass("hidden");
})


//functioning POST function using ajax
function postFormInfo() {
  let formInfo = {};
  formInfo.location = $('.location').val();
  formInfo.details = $('.restaurants').val();
  // formInfo.sleepspot = $('.sleep-spot').val();
  // formInfo.notes = $('.notes').val();
  console.log(formInfo);
  jQuery.ajax({
    url: "/entries",
    type: "POST",
    data: JSON.stringify(formInfo),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      console.log("it worked!");
      $('.results').html(`<p>${data.location}<br>${data.details}</p>`);
    }
  });
}

$(function listenForForm() {
  $('#submit').click(function (event) {
    event.preventDefault();
    postFormInfo();
  })
})

//functioning get request using fetch
function getResults() {
  console.log('getRequest2 called');
  fetch('/entries',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "GET"
    })
    .then(response => {
      return response.json()
    })
    .then(responseJson => {
      console.log(responseJson);
      $('.results').append(responseJson[0].location);
    })
}

$(function listenForResults() {
  $('#results').click(function (event) {
    event.preventDefault();
    getResults();
  })
})




//geoLocation
// button.getLocation("click", function() {
//   console.log("button clicked")
//   navigator.geolocation.getCurrentPosition(showPosition);

//   }
// )

// function showPosition(position) {
//   console.log(position);
//   x = document.getElementById("results");
//   x.innerHTML = "Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude;
// }

//log date and time
// function requestLogger(req, res, next) {
//   const now = new Date();
//   console.log(
//     `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
//   next();
// }


var mock_entries = {
  "entries": [
    {
      "id": "1111111",
      "place": "New York",
      "eatLocation": "A really cool diner",
      "sleepLocation": "A friend's house",
      "publishDate": 1470016976609
    },
    {
      "id": "2222222",
      "place": "Steamboat Springs",
      "eatLocation": "Creekside Cafe",
      "sleepLocation": "Camped halfway up a dirt road outside of town",
      "publishDate": 1470016976609
    },
    {
      "place": "Guadalajara",
      "eatLocation": "On the beach",
      "sleepLocation": "At a hostel",
      "publishDate": 1470016976609
    },
  ]
};

function getRecentStatusUpdates(callbackFn) {
  setTimeout(function () { callbackFn(mock_entries) }, 100);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
  for (index in data.entries) {
    $('body').append(
      '<p>Place: ' + data.entries[index].place + '</p><p>Where we ate: ' + data.entries[index].eatLocation + '</p>');
  }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
  getRecentStatusUpdates(displayStatusUpdates);
}

$(function () {
  getAndDisplayStatusUpdates();
})