using System.Security.Claims;
using EcomWebAPI.DTOs;
using EcomWebAPI.Models;
using EcomWebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcomWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;
        private readonly ILogger<UsersController> _logger;

        public UsersController (AppDbContext context, TokenService tokenService, ILogger<UsersController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
        }


        // APIs here

        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if(user == null)
            {
                return NotFound(new { success = false, message = "User not found!" });

            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized(new {success=false, message = "Incorrect password!"});
            }

            var token = _tokenService.GenerateToken(user);

            var response = new AuthResponse
            {
                UserId = user.UserId,
                Token = token,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                Cart = user.Cart
            };
            return Ok(new {success = true, data = response});

        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (request == null)
            {
                return BadRequest(new {success=false, message="Invalid request!"});
            }
            if(existingUser != null)
            {
                return Conflict(new {success = false, message = "User already exists!"});
            }
            request.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Password = request.Password,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new {success = true, message = "User registered successfully!"});
        }


        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetUserData()
        {
            // Get the user's ID from the token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            _logger.LogInformation("Extracted userIdClaim: {UserIdClaim}", userId);


            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                return Unauthorized(new { success = false, message = "Invalid user ID!" });
            }

            //if (userId == null)
            //{
            //    return Unauthorized(new {success = false, message = "Unauthorized user!"});
            //}

            // Fetch user details from the database using the userId
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == parsedUserId);
            if (user == null)
            {
                return NotFound(new {success = false, message = "User not found!"});
            }

            var response = new AuthResponse
            {
                UserId = user.UserId,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                Cart = user.Cart
            };
            return Ok(new { success = true, data = response });
        }

        // API to get all users
        [HttpGet]
        [Authorize(Roles= "Admin")]
        public async Task<IActionResult>GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

    }
}
