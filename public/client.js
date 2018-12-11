//error handling
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response);
  }
  return response;
}

//POST new user
function createNewUser(newUserInfo) {
  fetch('/api/users',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(newUserInfo)
    })
    .then(response => {
      return response.json()
    })
    // .then(handleErrors)
    .then(function (response) {
      if (!response.ok) {
        $('.signup-status').text(response.message);
      }
      // $('.signup-status').text("Signup successful. Please log in.")
    })
}

$(function listenForSignup() {
  $('#user-signup').click(function (event) {
    event.preventDefault();
    let newUserInfo = {};
    newUserInfo.username = $('#new-username').val();
    newUserInfo.password = $('#new-password').val();
    createNewUser(newUserInfo);
    $('#new-username').val('');
    $('#new-password').val('');
  })
})

//POST user login
function logInUser(userInfo) {
  fetch('/api/auth/login',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(userInfo)
    })
    .then(handleErrors)
    .then(response => {
      return response.json()
    })
    .then(data => {
      localStorage.setItem('authToken', data.authToken);
      // location.pathname = '/users';
      $('.user-dashboard').removeClass('hidden');
      $("#log-in").addClass("hidden");
      $("#sign-up").addClass("hidden");
    })
    .catch(error => console.log(error.message));
}

$(function listenForLogin() {
  $('#login-button').click(function (event) {
    event.preventDefault();
    let userInfo = {};
    userInfo.username = $('#username').val();
    userInfo.password = $('#password').val();
    logInUser(userInfo);
  })
})

$(function swapForms() {
  $('main').on('click', '#signup-link', function (event) {
    $("#log-in").addClass("hidden");
    $("#sign-up").removeClass("hidden");
  })
  $('main').on('click', '#login-link', function (event) {
    $("#log-in").removeClass("hidden");
    $("#sign-up").addClass("hidden");
  })
})

//POST a blog entry using ajax
function postNewEntry(newEntry) {
  jQuery.ajax({
    url: "/entries",
    type: "POST",
    data: JSON.stringify(newEntry),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      console.log("successfully added new entry");
      $('.entries').html(`<p>${data.activity}<br>${data.location}<br>${data.notes}</p>`);
    }
  });
}

$(function listenForEntrySubmit() {
  $('main').on('click', '#submit-entry-button', function (event) {
    event.preventDefault();
    console.log("new entry submit clicked");
    let newEntry = {};
    newEntry.activity = $('#activity').val();
    newEntry.location = $('#location').val();
    newEntry.notes = $('#notes').val();
    console.log(newEntry);
    postNewEntry(newEntry);
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


// var mock_entries = {
//   "entries": [
//     {
//       "id": "1111111",
//       "place": "New York",
//       "eatLocation": "A really cool diner",
//       "sleepLocation": "A friend's house",
//       "publishDate": 1470016976609
//     },
//     {
//       "id": "2222222",
//       "place": "Steamboat Springs",
//       "eatLocation": "Creekside Cafe",
//       "sleepLocation": "Camped halfway up a dirt road outside of town",
//       "publishDate": 1470016976609
//     },
//     {
//       "place": "Guadalajara",
//       "eatLocation": "On the beach",
//       "sleepLocation": "At a hostel",
//       "publishDate": 1470016976609
//     },
//   ]
// };

// function getRecentStatusUpdates(callbackFn) {
//   setTimeout(function () { callbackFn(mock_entries) }, 100);
// }

// // this function stays the same when we connect
// // to real API later
// function displayStatusUpdates(data) {
//   for (index in data.entries) {
//     $('body').append(
//       '<p>Place: ' + data.entries[index].place + '</p><p>Where we ate: ' + data.entries[index].eatLocation + '</p>');
//   }
// }

// // this function can stay the same even when we
// // are connecting to real API
// function getAndDisplayStatusUpdates() {
//   getRecentStatusUpdates(displayStatusUpdates);
// }

// $(function () {
//   getAndDisplayStatusUpdates();
// })