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
