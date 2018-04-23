/*
  * Totality Application Reader
  * Written by Gautam Mittal
  * April 2018
*/

const HOST = 'https://madras-test.herokuapp.com'
const AUTH_TOKEN = localStorage.getItem('token')

let application = {}

function getApplication() {
  $.ajax({
    type:"GET",
    url: HOST + "/reader/next_application/",
    dataType: "json",
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token " + AUTH_TOKEN);
    }
  }).done(function(data) {
    application = data
    load()
  }).fail(function(data) {
    console.log(data.responseText)
  });
}

function load() {
  $("#idVal").text(application.id)
}

function logout() {
    localStorage.removeItem('token');
    window.location = '/login';
}

$('#logOut').click(logout);

$(document).ready(() => {
  if (AUTH_TOKEN == null)
    window.location = "/login"
  getApplication()
})
