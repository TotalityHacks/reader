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
  $("#github").html(`GitHub: <a target="_blank" href="https://github.com/${application.github}">@${application.github}</a>`)
  $("#devpost").html(`Devpost: <a target="_blank" href="https://devpost.com/${application.devpost}">@${application.devpost}</a>`)
  $("#linkedin").html(`LinkedIn: <a target="_blank" href="https://linkedin.com/in/${application.linkedin}">@${application.linkedin}</a>`)
  $("#website").html(`<a target="_blank" href="${application.personal_website}">${application.personal_website}</a>`)

  $("#name").text(`${application.first_name} ${application.last_name}`)
  $("#school").text(`${application.school}`)
  $("#year").text(`Class of ${application.college_grad_year}`)
  $("#phone").text(`${formatPhoneNumber(application.phone_number)}`)
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

function formatPhoneNumber(s) {
  var s2 = (""+s).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}

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
