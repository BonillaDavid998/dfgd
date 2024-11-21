$(() => { // main jQuery routine - executes on page load
    $("#getbutton").on('click', async (e) => {
        e.preventDefault();  // Prevent form submission

        try {
            let email = $("#TextBoxEmail").val();
            $("#status").text("Please wait...");

            // Corrected URL syntax
            let response = await fetch(`/api/employee/${email}`);

            if (response.ok) {
                let data = await response.json();
                if (data.email && data.email !== "not found") {
                    // Populate the employee details
                    $("#title").text(data.title || "N/A");
                    $("#firstname").text(data.firstname || "N/A");
                    $("#lastname").text(data.lastname || "N/A");
                    $("#phone").text(data.phoneno || "N/A");
                    $("#email").text(data.email || "N/A");
                    $("#status").text("Employee found");
                } else {
                    // Handle case where no employee is found
                    $("#title").text("");
                    $("#firstname").text("not found");
                    $("#lastname").text("");
                    $("#phone").text("");
                    $("#email").text("");
                    $("#status").text("No such employee found");
                }
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                // Replace errorRtn with console error or define it somewhere
                console.error(problemJson, response.status);
            } else {
                $("#status").text("No such path on the server");
            }
        } catch (error) {
            $("#status").text("Error: " + error.message);
        }
    });
});
