$(document).ready(function () {
    $('#getbutton').click(function () {
        var email = $('#TextBoxEmail').val().trim();

        if (email.length === 0) {
            $('#status').text("Please enter a valid email.");
            return;
        }

        $.getJSON(`/api/Employee/${email}`)
            .done(function (data) {
                $('#title').text(data.title);
                $('#firstname').text(data.firstname);
                $('#lastname').text(data.lastname);
                $('#phoneno').text(data.phoneno);
                $('#email').text(data.email);
                $('#status').text("Employee found.");
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $('#status').text("Employee not found. Error: " + textStatus);
            });
    });

    // Fetch the employee list

});
