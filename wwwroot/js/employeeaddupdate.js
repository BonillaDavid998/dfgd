$(() => {
    // Main jQuery routine - executes on page load

    // Validation rules
    $("#EmployeeModalForm").validate({
        rules: {
            TextBoxTitle: { maxlength: 4, required: true, validTitle: true },
            TextBoxFirstName: { maxlength: 25, required: true },
            TextBoxSurname: { maxlength: 25, required: true },
            TextBoxEmail: { maxlength: 40, required: true, email: true },
            TextBoxPhone: { maxlength: 15, required: true }
        },
        messages: {
            TextBoxTitle: {
                required: "Title is required.",
                maxlength: "Max length is 4 characters.",
                validTitle: "Valid titles: Mr., Ms., Mrs., Dr."
            },
            TextBoxFirstName: { required: "First name is required.", maxlength: "Max length is 25 characters." },
            TextBoxSurname: { required: "Last name is required.", maxlength: "Max length is 25 characters." },
            TextBoxEmail: {
                required: "Email is required.",
                maxlength: "Max length is 40 characters.",
                email: "Enter a valid email address."
            },
            TextBoxPhone: { required: "Phone number is required.", maxlength: "Max length is 15 characters." }
        }
    });

    // Custom validator for title
    $.validator.addMethod("validTitle", (value) => {
        return ["Mr.", "Ms.", "Mrs.", "Dr."].includes(value);
    }, "Enter a valid title (Mr., Ms., Mrs., Dr.).");

    // Disable/enable submit button based on validation
    document.addEventListener("keyup", () => {
        if ($("#EmployeeModalForm").valid()) {
            $("#actionbutton").prop("disabled", false); // Enable
        } else {
            $("#actionbutton").prop("disabled", true); // Disable
        }
    });

    // Get all employees
    const getAll = async (msg) => {
        try {
            $("#employeeList").text("Finding Employee Information...");
            let response = await fetch("/api/employee");
            if (response.ok) {
                let payload = await response.json();
                buildEmployeeList(payload);
                $("#status").text(msg === "" ? "Employees Loaded" : `${msg} - Employees Loaded`);
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

    // Build employee list
    const buildEmployeeList = (data) => {
        $("#employeeList").empty();
        let div = $(`<div class="list-group-item text-white bg-secondary row d-flex" id="status">Employee Info</div>
        <div class="list-group-item row d-flex text-center" id="heading">
        <div class="col-4 h4">Title</div>
        <div class="col-4 h4">First</div>
        <div class="col-4 h4">Last</div>
        </div>`);
        div.appendTo($("#employeeList"));

        let btn = $(`<button class="list-group-item row d-flex" id="0">...click to add employee</button>`);
        btn.appendTo($("#employeeList"));

        sessionStorage.setItem("allemployees", JSON.stringify(data));
        data.forEach(emp => {
            let btn = $(`<button class="list-group-item row d-flex" id="${emp.id}">`);
            btn.html(`<div class="col-4" id="employeetitle${emp.id}">${emp.title}</div>
            <div class="col-4" id="employeefname${emp.id}">${emp.firstname}</div>
            <div class="col-4" id="employeelastname${emp.id}">${emp.lastname}</div>`);
            btn.appendTo($("#employeeList"));
        });
    };

    // Event handler for employee list click
    $("#employeeList").on('click', (e) => {
        if (!e) e = window.event;
        let id = e.target.closest('.list-group-item').id;
        if (id !== "status" && id !== "heading") {
            let data = JSON.parse(sessionStorage.getItem("allemployees"));
            id === "0" ? setupForAdd() : setupForUpdate(id, data);
        } else {
            return false;
        }
    });

    // Error handling
    function errorRtn(problemJson, status) {
        $("#modalstatus").text(`Problem ${status}: ${problemJson.msg}`);
    }

    // Clear modal fields
    const clearModalFields = () => {
        $("#TextBoxTitle").val("");
        $("#TextBoxFirstName").val("");
        $("#TextBoxSurname").val("");
        $("#TextBoxEmail").val("");
        $("#TextBoxPhone").val("");
        let validator = $("#EmployeeModalForm").validate();
        validator.resetForm();
        sessionStorage.removeItem("employee");
        $("#employeeModal").modal("toggle");
    };

    // Setup for add
    const setupForAdd = () => {
        $("#actionbutton").val("add");
        $("#modaltitle").html("<h4>Add Employee</h4>");
        $("#employeeModal").modal("toggle");
        $("#modalstatus").text("Add new employee");
        clearModalFields();
    };

    // Setup for update
    const setupForUpdate = (id, data) => {
        $("#actionbutton").val("update");
        $("#modaltitle").html("<h4>Update Employee</h4>");
        clearModalFields();
        data.forEach(employee => {
            if (employee.id === parseInt(id)) {
                $("#TextBoxTitle").val(employee.title);
                $("#TextBoxFirstName").val(employee.firstname);
                $("#TextBoxSurname").val(employee.lastname);
                $("#TextBoxEmail").val(employee.email);
                $("#TextBoxPhone").val(employee.phoneno);
                sessionStorage.setItem("employee", JSON.stringify(employee));
                $("#modalstatus").text("Update data");
                $("#employeeModal").modal("toggle");
                $("#theModalLabel").text("Update");
            }
        });
    };

    // Add new employee
    const add = async () => {
        if (!$("#EmployeeModalForm").valid()) {
            $("#modalstatus").text("Please fix validation errors.");
            return;
        }
        try {
            let emp = {
                title: $("#TextBoxTitle").val(),
                firstname: $("#TextBoxFirstName").val(),
                lastname: $("#TextBoxSurname").val(),
                email: $("#TextBoxEmail").val(),
                phoneno: $("#TextBoxPhone").val(),
                departmentId: 100,
                id: -1,
                timer: null,
                istech: true,
                staffpicture: null
            };

            let response = await fetch("/api/employee", {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(emp),
            });

            if (response.ok) {
                let data = await response.json();
                getAll(data.msg);
                $("#status").text(`Employee ${emp.lastname} added!`);
            } else if (response.status !== 404) {
                let problemJson = await response.json();
                errorRtn(problemJson, response.status);
            } else {
                $("#status").text("No such path on server");
            }
        } catch (error) {
            $("#status").text(error.message);
        }
        $("#employeeModal").modal("toggle");
    };

    // Update employee
    const update = async () => {
        if (!$("#EmployeeModalForm").valid()) {
            $("#modalstatus").text("Please fix validation errors.");
            return;
        }
        try {
            let emp = JSON.parse(sessionStorage.getItem("employee"));
            emp.title = $("#TextBoxTitle").val();
            emp.firstname = $("#TextBoxFirstName").val();
            emp.lastname = $("#TextBoxSurname").val();
            emp.email = $("#TextBoxEmail").val();
            emp.phoneno = $("#TextBoxPhone").val();

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
                errorRtn(problemJson, response.status);
            } else {
                $("#modalstatus").text("No such path on server");
            }
        } catch (error) {
            $("#modalstatus").text(error.message);
        }
    };

    // Action button click handler
    $("#actionbutton").on("click", () => {
        $("#actionbutton").val() === "update" ? update() : add();
    });

    // Initial call to get all employees
    getAll("");
});
