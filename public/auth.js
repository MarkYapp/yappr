//page refresh
$(function checkForAuth() {
  let authToken = localStorage.getItem("authToken");
  if (authToken) {
    showDashboard();
  }
});

function createNewUser(newUserInfo) {
  fetch("/api/users", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(newUserInfo)
  })
    .then(response => {
      $(".signup-status").text("Signup successful. Please log in.");
      return response.json();
    })
    .then(function(response) {
      if (!response.ok) {
        $(".signup-status").text(response.message);
      }
    })
    .catch(error => console.log("Bad request"));
}

$(function listenForSignup() {
  $("form[name=signup-user]").on("submit", function(event) {
    event.preventDefault();
    let newUserInfo = {};
    newUserInfo.username = $("#new-username").val();
    newUserInfo.password = $("#new-password").val();
    createNewUser(newUserInfo);
    $("#new-username").val("");
    $("#new-password").val("");
  });
});

function logInUser(userInfo) {
  fetch("/api/auth/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(userInfo)
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      localStorage.setItem("authToken", data.authToken);
      showDashboard();
      getEntries();
    })
    .catch(error => {
      $(".invalid-login-modal").removeClass("hidden");
      $("#username").val("");
      $("#password").val("");
    });
}

$(function hideInvalidUserModal() {
  $(".invalid-modal-close-button").click(function(event) {
    event.preventDefault();
    $(".invalid-login-modal").addClass("hidden");
  });
});

$(function listenForLogin() {
  $("form[name=login-user]").on("submit", function(event) {
    event.preventDefault();
    let userInfo = {};
    userInfo.username = $("#username")
      .val()
      .toLowerCase();
    userInfo.password = $("#password").val();
    logInUser(userInfo);
  });
});

$(function swapForms() {
  $("main").on("click", "#signup-link", function(event) {
    $(".login-form").addClass("hidden");
    // $('.signup-form');
    $(".signup-form").prop("hidden", false);
  });
  $("main").on("click", "#login-link", function(event) {
    $(".login-form").removeClass("hidden");
    $(".signup-form").addClass("hidden");
  });
});

function showDashboard() {
  $(".login-form").addClass("hidden");
  $(".signup-form").addClass("hidden");
  $(".icon-large")
    .addClass("hidden")
    .removeClass("icon-large");
  $(".user-dashboard").prop("hidden", false);
  $("main").addClass("dashboard");
  $("body").addClass("dashboard");
  getEntries();
}
