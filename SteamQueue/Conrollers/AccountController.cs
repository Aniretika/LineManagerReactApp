using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SteamQueue.Context;
using SteamQueue.Entities;
using Microsoft.EntityFrameworkCore;
using SteamQueue.DTOs;

namespace SteamQueue.Conrollers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public AccountController(IMapper mapper, DatabaseContext context)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("IsSpareAccounts")]
        public async Task<ActionResult<Boolean>> GetAccounts()
        {
            var accounts = await _context
                          !.Accounts
                          !.ToListAsync();
            var isSpareAccounts = accounts.Any(acc => acc.LineId == null); 
            return isSpareAccounts;
        }
    }

}