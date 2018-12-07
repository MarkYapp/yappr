$(".login-button").click(function (event) {
  event.preventDefault();
  $("#log-in").addClass("hidden");
  // $("#sign-up").addClass("hidden");
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
