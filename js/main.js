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
  }).done(function(res) {
    application = process(res)
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
  $("#github").text(`@${application.github}`)
  $("#devpost").text(`@${application.devpost}`)
  $("#linkedin").text(`@${application.linkedin}`)
  $("#website").text(`@${application.website}`)
  $("#num_hackathons").text(`${application.num_hackathons} hackathons attended`)

  $("#name").text(`${application.name}`)
  $("#school").text(`${application.school}`)
  $("#year").text(`Class of ${application.grad_year}`)
  $("#phone").text(`${application.phone}`)
  $("#question1").text(`${application.question1}`)
  $("#question1").text(`${application.question1}`)
  $("#question2").text(`${application.question2}`)

}

function logout() {
    localStorage.removeItem('token');
    window.location = '/login';
}

function process(app) {
  let mappings = [["name", "Name"],
                  ["school", "School"],
                  ["devpost", "Devpost"],
                  ["linkedin", "LinkedIn"],
                  ["phone", "Phone Number"],
                  ["website", "Personal Website"],
                  ["num_hackathons", "How many hackathons have you attended?"],
                  ["grad_year", "College Graduation Year"],
                  ["question1", "Tell us about a project you’re proud of (hackathon, personal project, job, research, etc)."],
                  ["question2", "Tell us about a time you helped another with programming."]
                 ]
  var data = {
    "github": app.github_username
  }
  for (m in mappings) {
    data[mappings[m][0]] = app.questions.filter(x => x[0] == mappings[m][1])[0][1]
  }
  return data
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
