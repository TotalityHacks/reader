/*
  * Totality Application Reader
  * Written by Gautam Mittal
  * April 2018
*/

const HOST = 'https://madras-test.herokuapp.com'

function login(e) {
    if (e) e.preventDefault();
    var form = $('#login_form');
    form.children('input').prop('disabled', true);
    var params = {
        username: form.children('input[name=email]').val(),
        password: form.children('input[name=password]').val(),
    };
    $.ajax({
        type:"POST",
        url: HOST + "/login/",
        dataType: 'json',
        data: JSON.stringify(params),
        contentType: 'application/json'
    })
        .done(function(data) {
            localStorage.setItem('token', data.token);
            form.children('input').prop('disabled', false);
            window.location = "/"
        }).fail(function(data) {
            var errors = data.responseJSON;
            $('#login_email_error').text(errors.username);
            $('#login_password_error').text(errors.password);
            $('#login_error').text(errors.non_field_errors);
            form.children('input').prop('disabled', false);
        });
}

if (localStorage.getItem('token'))
  window.location = "/"
$('#login_form').submit(login);
