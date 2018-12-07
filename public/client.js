$(".login-button").click(function (event) {
  event.preventDefault();
  $("#log-in").addClass("hidden");
  $("#sign-up").addClass("hidden");
  $(".user-page").removeClass("hidden");
})