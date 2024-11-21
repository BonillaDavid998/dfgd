$(() => {
    const getAllEmployees = async (msg) => {
        try {
            $("#employeeList").text("Finding Employee Information...");
            let response = await fetch("/api/employee");
            if (response.ok) {
                let employees = await response.json();
                buildEmployeeList(employees);
                $("#status").text(msg || "Employees Loaded");
            } else {
                $("#status").text("Failed to load employee data.");
            }
        } catch (error) {
            $("#status").text("Error: " + error.message);
        }
    };

    const buildEmployeeList = (employees) => {
        $("#employeeList").empty();
        employees.forEach(emp => {
            const row = $(`<div class="row">
                <div class="col">${emp.title} ${emp.firstname} ${emp.lastname}</div>
                <button class="update btn btn-warning" data-id="${emp.id}">Update</button>
                <button class="delete btn btn-danger" data-id="${emp.id}">Delete</button>
            </div>`);
            $("#employeeList").append(row);
        });
    };

    // Setup for add
    $("#addEmployeeButton").on("click", () => {
        $("#employeeModal").modal("show");
        $("#actionbutton").text("Add").off("click").on("click", addEmployee);
    });

    // Add Employee
    const addEmployee = async () => {
        const employee = getEmployeeFormData();
        try {
            const response = await fetch("/api/employee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
            if (response.ok) {
                await getAllEmployees("Employee added successfully.");
                $("#employeeModal").modal("hide");
            } else {
                $("#modalstatus").text("Failed to add employee.");
            }
        } catch (error) {
            $("#modalstatus").text("Error: " + error.message);
        }
    };

    // Update Employee
    $("#employeeList").on("click", ".update", async function () {
        const id = $(this).data("id");
        try {
            const response = await fetch(`/api/employee/${id}`);
            if (response.ok) {
                const employee = await response.json();
                setEmployeeFormData(employee);
                $("#employeeModal").modal("show");
                $("#actionbutton").text("Update").off("click").on("click", () => updateEmployee(id));
            } else {
                console.error("Failed to fetch employee data.");
            }
        } catch (error) {
            console.error("Error fetching employee data: " + error.message);
        }
    });

    const updateEmployee = async (id) => {
        const employee = getEmployeeFormData();
        try {
            const response = await fetch(`/api/employee`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...employee })
            });
            if (response.ok) {
                await getAllEmployees("Employee updated successfully.");
                $("#employeeModal").modal("hide");
            } else {
                $("#modalstatus").text("Failed to update employee.");
            }
        } catch (error) {
            $("#modalstatus").text("Error: " + error.message);
        }
    };

    // Delete Employee
    $("#employeeList").on("click", ".delete", async function () {
        const id = $(this).data("id");
        try {
            const response = await fetch(`/api/employee/${id}`, { method: "DELETE" });
            if (response.ok) {
                await getAllEmployees("Employee deleted successfully.");
            } else {
                console.error("Failed to delete employee.");
            }
        } catch (error) {
            console.error("Error deleting employee: " + error.message);
        }
    });

    const getEmployeeFormData = () => ({
        title: $("#TextBoxTitle").val(),
        firstname: $("#TextBoxFirstName").val(),
        lastname: $("#TextBoxSurname").val(),
        email: $("#TextBoxEmail").val(),
        phoneno: $("#TextBoxPhone").val(),
        departmentId: 100  // Update with the department dropdown if needed
    });

    const setEmployeeFormData = (employee) => {
        $("#TextBoxTitle").val(employee.title);
        $("#TextBoxFirstName").val(employee.firstname);
        $("#TextBoxSurname").val(employee.lastname);
        $("#TextBoxEmail").val(employee.email);
        $("#TextBoxPhone").val(employee.phoneno);
    };

    getAllEmployees();
});
