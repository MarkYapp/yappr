//page refresh
$(function checkForAuth() {
  let authToken = localStorage.getItem('authToken')
  if (authToken) {
    showDashboard();
  }
})


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
      showDashboard();
      getEntries();
    })
    .catch(error => {
      console.log(error.message);
      $('.invalid-login-modal').removeClass('hidden')
    });
}

$(function hideInvalidUserModal() {
  $('.invalid-modal-close-button').click(function (event) {
    event.preventDefault();
    console.log('clicked')
    $('.invalid-login-modal').addClass('hidden');
  })
})

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
    $(".login-form").addClass("hidden");
    $(".signup-form").removeClass("hidden");
  })
  $('main').on('click', '#login-link', function (event) {
    $(".login-form").removeClass("hidden");
    $(".signup-form").addClass("hidden");
  })
})

function showDashboard() {
  $(".login-form").addClass("hidden");
  $(".signup-form").addClass("hidden");
  $('.icon-large').addClass('hidden');
  $('.icon-large').removeClass('icon-large');
  document.body.style.background = 'none';
  document.body.style.background = 'linear-gradient(165deg, rgb(243,238,238) 25%, rgb(170,166,166) 75%';
  $('.user-dashboard').removeClass('hidden');
  getEntries();
}