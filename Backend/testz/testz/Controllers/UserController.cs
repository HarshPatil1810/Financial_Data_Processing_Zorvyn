using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using testz.Models;
using testz.Services;


namespace testz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserServices _service;

        public UserController(UserServices service)
        {
            _service = service;
        }

        [HttpPost("create-user")]
        public IActionResult CreateUser([FromBody] UserModel user)
        {
            _service.CreateUser(user);
            return Ok("User Created");
        }

        [HttpGet("byemail")]
        [Authorize] // Only authorized users can call
        public IActionResult GetByEmail([FromQuery] string email)
        {
            var user = _service.GetUserByEmail(email);
            if (user == null)
                return NotFound("User not found");

            // Don't return password hash
            user.PasswordHash = null;
            return Ok(user);
        }

        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            var users = _service.GetAllUsers();
            return Ok(users);
        }

        [HttpPut("update-user/{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserModel updatedUser)
        {
            // Optional: validate input
            

            try
            {
                // Call service to update user
                bool result = _service.UpdateUser(id, updatedUser);

                if (!result)
                    return NotFound("User not found");

                return Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                // log error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("delete/{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                // Call service to soft delete
                var result = _service.SoftDeleteUser(id);

                if (!result)
                    return NotFound("User not found");

                return Ok("User marked as inactive");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }






    }
}
