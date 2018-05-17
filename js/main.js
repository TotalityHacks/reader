/*
  * Totality Application Reader
  * Written by Gautam Mittal
  * April 2018
*/

const AUTH_TOKEN = localStorage.getItem('token')

let application = {}
var listener = new window.keypress.Listener();

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
    $("textarea").val(JSON.parse(data.responseText).error)
  });
}

function submitReview() {
  var params = {
        "application": application.id,
        "field_skill": parseInt($('#skill').val(), 10),
        "field_community": parseInt($('#community').val(), 10),
        "field_passion": parseInt($('#passion').val(), 10)
  };
  $.ajax({
    type:"POST",
    url: HOST + "/reader/rating/",
    dataType: "json",
    data: params,
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token " + AUTH_TOKEN);
    }
  }).done(function(data) {
    console.log(data)
    window.location = "/"
  }).fail(function(data) {
    console.log(data.responseText)
  });
}

function load() {
  $("#github").text(`@${application.github_username}`)
  for (var i = 0; i < application.questions.length; i++) {
    $("#container").append(`<div class="question">
      <h3>${application.questions[i][0]}</h3>
      <p>${application.questions[i][1].replaceAll(/\n/g, '<br />')}</p>
    </div>`)
  }
}

function logout() {
    localStorage.removeItem('token');
    window.location = '/login';
}

$('#logout').click(logout);
$('#submitReview').click(submitReview);

$(document).ready(() => {
  if (AUTH_TOKEN == null)
    window.location = "/login"
  getApplication()
})

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// Keyboard shortcut handlers
listener.simple_combo("shift a", function() {
  $("#skill").focus()
});

listener.simple_combo("shift s", function() {
  $("#community").focus()
});

listener.simple_combo("shift d", function() {
  $("#passion").focus()
});

listener.simple_combo("shift enter", function() {
  submitReview()
});
