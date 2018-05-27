/*
  * Totality Application Reader
  * Written by Gautam Mittal
  * April 2018
*/

const AUTH_TOKEN = localStorage.getItem('token')

let application = {}
var listener = new window.keypress.Listener();


function getApplication() {
  // Get reviewer stats
  $.ajax({
    type:"GET",
    url: HOST + "/reader/stats/",
    dataType: "json",
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token " + AUTH_TOKEN)
    }
  }).done(function(res) {
    $("#num_reads").text(res.num_reads)

  }).fail(function(data) {
    console.log(data.responseText)
  });

  // Get application data
  $.ajax({
    type:"GET",
    url: HOST + "/reader/next_application/",
    dataType: "json",
    beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token " + AUTH_TOKEN);
    }
  }).done(function(res) {
    application = res
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
  // Populate frontend with application information
  $("#github").html(`GitHub: <a target="_blank" href="https://github.com/${application.github_username}">@${application.github_username}</a>`)
  $("#devpost").html(`Devpost: <a target="_blank" href="https://devpost.com/${application.questions.Devpost}">@${application.questions.Devpost}</a>`)
  $("#linkedin").html(`LinkedIn: <a target="_blank" href="https://linkedin.com/in/${application.questions.LinkedIn}">@${application.questions.LinkedIn}</a>`)
  $("#website").html(`<a target="_blank" href="${application.questions["Personal Website"]}">${application.questions["Personal Website"]}</a>`)
  $("#num_hackathons").text(`${application.questions["What is your race/ethnicity?"]} student`)

  $("#name").text(`${application.questions["First Name"] + " " + application.questions["Last Name"]}`)
  $("#school").text(`${application.questions["What school do you attend?"]}`)
  $("#year").text(`Class of ${application.questions["College Graduation Year"]}`)
  $("#phone").text(`${application.questions["Phone Number"]}`)
  $("#question1").text(`${application.questions["Tell us about a project you’re proud of (hackathon, personal project, job, research, etc)."]}`)
  $("#question2").text(`${application.questions["Tell us about a time you helped another with programming."]}`)
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
