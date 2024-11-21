using HelpdeskViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Reflection;

namespace HelpdeskWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        // Get employee by email
        [HttpGet("{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            EmployeeViewModel viewmodel = new() { Email = email };
            var employeeViewModel = await viewmodel.GetByEmail();  // Correct return value

            // If no employee is found, return 404
            if (employeeViewModel == null)
            {
                return NotFound(new { message = "Employee not found" });
            }

            return Ok(employeeViewModel);  // Return the employee details if found
        }

        // Get all employees
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                EmployeeViewModel viewModel = new();
                List<EmployeeViewModel> allEmployees = await viewModel.GetAll();
                return Ok(allEmployees);  // Return all employees
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);  // Handle errors
            }
        }

        //Post function
        //Post function
        [HttpPost]
        public async Task<ActionResult> Post(EmployeeViewModel viewmodel)
        {
            try
            {
                await viewmodel.Add();
                return viewmodel.Id > 1
                ? Ok(new { msg = "Employee " + viewmodel.Lastname + " added!" })
                : Ok(new { msg = "Employee " + viewmodel.Lastname + " not added!" });
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }




        // Delete employee by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                EmployeeViewModel viewmodel = new() { Id = id };
                return await viewmodel.Delete() == 1
                    ? Ok(new { msg = "Employee " + id + " deleted!" })
                    : Ok(new { msg = "Employee " + id + " not deleted!" });
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " +
                                MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        // Get employee by phone number
        [HttpGet("phone/{phoneNumber}")]
        public async Task<IActionResult> GetByPhoneNumber(string phoneNumber)
        {
            EmployeeViewModel viewmodel = new() { Phoneno = phoneNumber };
            var employeeViewModel = await viewmodel.GetByPhoneNumber();

            // If no employee is found, return 404
            if (employeeViewModel == null)
            {
                return NotFound(new { message = "Employee not found by phone number" });
            }

            return Ok(employeeViewModel);  // Return the employee details if found
        }

        [HttpPut]
        public async Task<ActionResult> Put(EmployeeViewModel viewModel)
        {
            try
            {
                int retVal = await viewModel.Update();
                return retVal switch
                {
                    1 => Ok(new { msg = "Employee updated!" }),
                    -1 => Ok(new { msg = "Employee not updated!" }),
                    _ => Ok(new { msg = "Employee not updated!" })
                };
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Problem in " + GetType().Name + " " + MethodBase.GetCurrentMethod()!.Name + " " + ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }


    }
}
