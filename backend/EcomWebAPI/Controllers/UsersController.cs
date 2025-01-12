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

        public UsersController (AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }


        // APIs here

        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if(user == null)
            {
                return NotFound("User not found!");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Incorrect password!");
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
            return Ok(response);
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (request == null)
            {
                return BadRequest();
            }
            if(existingUser != null)
            {
                return Conflict("User already exists!");
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
            return Ok("User registered successfully!");
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
