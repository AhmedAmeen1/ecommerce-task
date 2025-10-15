using EcommerceApi.DTO;
using EcommerceApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EcommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthenticationController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var UserExist = await _userManager.FindByNameAsync(model.UserName);
            if(UserExist != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User already exists!" });
            }
            var EmailExist = await _userManager.FindByEmailAsync(model.Email);
            if(EmailExist != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "Email already exists!" });
            }

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email,
                LastLoginTime = DateTime.MinValue
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded) { 
            return Ok(new { Status = "Success", Message = "User created successfully!" });
            }
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User creation failed! Please check user details and try again." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
                return Unauthorized("Invalid credentials");

            // Update last login time
            user.LastLoginTime = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var authClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = GenerateJwtToken(authClaims);
            var refreshToken = GenerateRefreshToken();


            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                refreshToken = refreshToken
            });
        }

        [HttpPost("refresh")]
        public IActionResult Refresh(TokenDTO tokenModel)
        {
            if (tokenModel is null)
                return BadRequest("Invalid client request");

         
            var principal = GetPrincipalFromExpiredToken(tokenModel.AccessToken);
            var username = principal.Identity.Name;
            // Validate username and refresh token (omitted)

            var newJwtToken = GenerateJwtToken(principal.Claims);
            var newRefreshToken = GenerateRefreshToken();

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(newJwtToken),
                expiration = newJwtToken.ValidTo,
                refreshToken = newRefreshToken
            });
        }

        private JwtSecurityToken GenerateJwtToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds);

            return token;
        }

        private string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString().Replace("-", "");
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = false // we want to get claims from expired token
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (!(securityToken is JwtSecurityToken jwtSecurityToken) ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }

}

