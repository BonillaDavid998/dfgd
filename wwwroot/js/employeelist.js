$(() => {
    const getAll = async (msg) => {
        try {
            $("#employeeList").text("Finding Employee Information...");
            let response = await fetch(`/api/employee`);
            if (response.ok) {
                let payload = await response.json();
                buildEmployeeList(payload);
                msg === "" ?
                    $("#status").text("Employees Loaded") : $("#status").text(`${msg} - Employees Loaded`);
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {
                $("#status").text("No such path on server");
            }
        } catch (error) {
            $("#status").text(error.message);
        }
    };

    const buildEmployeeList = (data) => {
        $("#employeeList").empty();
        let div = $(`<div class="list-group-item text-white bg-secondary row d-flex" id="status">Employee Info</div>
        <div class="list-group-item row d-flex text-center" id="heading">
        <div class="col-4 h4">Title</div>
        <div class="col-4 h4">First</div>
        <div class="col-4 h4">Last</div>
        </div>`);
        div.appendTo($("#employeeList"));
        sessionStorage.setItem("allemployees", JSON.stringify(data));
        data.forEach(emp => {
            let btn = $(`<button class="list-group-item row d-flex" id="${emp.id}">`);
            btn.html(`<div class="col-4" id="employeetitle${emp.id}">${emp.title}</div>
            <div class="col-4" id="employeefname${emp.id}">${emp.firstname}</div>
            <div class="col-4" id="employeelastname${emp.id}">${emp.lastname}</div>`);
            btn.appendTo($("#employeeList"));
        });
    };

    $("#actionbutton").on('click', async (e) => {
        try {
            let employeeData = sessionStorage.getItem("employee");
            if (!employeeData) {
                $("#modalstatus").text("No employee data found in session storage. Please search first.");
                return;
            }

            let emp = JSON.parse(employeeData);
            emp.title = $("#TextBoxTitle").val();
            emp.firstname = $("#TextBoxFirstName").val();
            emp.lastname = $("#TextBoxSurname").val();
            emp.email = $("#TextBoxEmail").val();
            emp.phoneno = $("#TextBoxPhone").val();

            // Log the employee data being sent
            console.log("Sending employee data: ", emp);

            let response = await fetch("/api/employee", {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(emp),
            });

            if (response.ok) {
                let payload = await response.json();
                $("#modalstatus").text(payload.msg);
                getAll(payload.msg);
                $("#employeeModal").modal("toggle");
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                console.log("Error response from server: ", problemJson);
                errorRtn(problemJson, response.status);
            } else {
                $("#modalstatus").text("No such path on server");
            }
        } catch (error) {
            console.log("Caught error: ", error);
            $("#modalstatus").text(error.message);
        }
    });

    function errorRtn(problemJson, status) {
        $("#modalstatus").text(`Problem ${status}: ${problemJson.msg}`);
    }

    getAll("");
});
