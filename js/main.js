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
    console.log(res)
    application = res
    load()
  }).fail(function(data) {
    console.log(data.responseText)
    $("#name").text(`Application Reader`)
    $("#school").text(`Inbox Empty`)
    $("textarea").val(JSON.parse(data.responseText).error)
  });
}

function submitReview() {
  var params = {
        "application": application.application_id,
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
  Object.keys(application).forEach((item) => {
    if (application[item] == "")
      $(`#${item}`).css({'display': 'none'})
  });

  $("#github").html(`<a target="_blank" href="https://github.com/${application.github}"><ion-icon name="logo-github"></ion-icon> @${application.github}</a>`)
  $("#devpost").html(`<a target="_blank" href="https://devpost.com/${application.devpost}"><ion-icon name="code"></ion-icon> @${application.devpost}</a>`)
  $("#linkedin").html(`<a target="_blank" href="https://linkedin.com/in/${application.linkedin}"><ion-icon name="logo-linkedin"></ion-icon> @${application.linkedin}</a>`)
  $("#website").html(`<a target="_blank" href="${application.personal_website}"><ion-icon name="link"></ion-icon> ${application.personal_website}</a>`)

  $("#name").text(`Application #${application.user}`)
  $("#school").text(`${application.school}`)
  $("#year").text(`Class of ${application.college_grad_year}`)
  $("#question1").text(`${application.essay_project}`)
  $("#question2").text(`${application.essay_helped}`)

  document.getElementById("resume").src = `https://api.totalityhacks.com/application/resumes/${application.resumes[0]}#view=FitH`

  $("#skill").focus()
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
var container = document.getElementById("assessment");
container.onkeyup = function(e) {
    var target = e.srcElement || e.target;
    var maxLength = parseInt(target.attributes["maxlength"].value, 10);
    var myLength = target.value.length;
    if (myLength >= maxLength) {
        var next = target;
        while (next = next.nextElementSibling) {
            if (next == null)
                break;
            if (next.tagName.toLowerCase() === "input") {
                next.focus();
                break;
            }
        }
    }
    // Move to previous field if empty (user pressed backspace)
    else if (myLength === 0) {
        var previous = target;
        while (previous = previous.previousElementSibling) {
            if (previous == null)
                break;
            if (previous.tagName.toLowerCase() === "input") {
                previous.focus();
                break;
            }
        }
    }
}

listener.simple_combo("meta enter", function() {
  submitReview()
});

listener.simple_combo("r", function() {
  if ($("#resume").css("display") == "none") {
    $("#resume").css({'display': 'block'})
  } else {
    $("#resume").css({'display': 'none'})
  }
});

listener.simple_combo("esc", function() {
  $("#resume").css({'display': 'none'})
});
