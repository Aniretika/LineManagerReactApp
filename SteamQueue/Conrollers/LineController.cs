using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SteamQueue.Context;
using SteamQueue.DTOs;
using SteamQueue.Entities;

namespace SteamQueue.Conrollers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LineController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public LineController(IMapper mapper, DatabaseContext context)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<List<LineDto>>> GetAll()
        {
            var lines = await _context
               .Lines
               .Include(line => line.SteamAccount)
               .ToListAsync();
            
               
            List<LineDto> resultList = new();
            foreach(var line in lines)
                {
                    var currentLine = _mapper.Map<LineDto>(line);
                    
                    currentLine.IsSteamAccount = (line.SteamAccount != null);
                    resultList.Add(currentLine);
                }
            return resultList;
        }


        [HttpGet("GetInfo/{lineId}")]
        public async Task<ActionResult<LineDto>> GetInfo(Guid lineId)
        {
            var lineInfo = await _context
                !.Lines
                !.Where(line => line.Id == lineId)
                .Include(line => line.SteamAccount)
                .Include(line => line.Positions)
                .FirstOrDefaultAsync();
            
            if (lineInfo is null)
                return NotFound();
            
            var resultLine = _mapper.Map<LineDto>(lineInfo);
            resultLine.IsSteamAccount = (lineInfo.SteamAccount != null);

            return Ok(resultLine);
        }

        [HttpPost("Add/{isSteamAccount}")]
        public async Task<ActionResult<LineDto>> Add(bool isSteamAccount, [FromBody] AddLineDto line)
        {
           
            var lineToAdd = _mapper.Map<Line>(line);
            lineToAdd.Id = Guid.NewGuid();
            lineToAdd.LineStart = lineToAdd.LineStart.ToUniversalTime();
            lineToAdd.LineStart = lineToAdd.LineStart.ToUniversalTime();
            
             if (isSteamAccount)
             {
                var steamAccount = _context
                .Accounts
                //.Where(acc => acc.LineId == null)
                .Where(acc => acc.Line == null)
                .FirstOrDefault();
                if(steamAccount is null)
                {
                    return NotFound();
                }
                lineToAdd.SteamAccount = steamAccount;
                steamAccount.LineId = lineToAdd.Id;
                steamAccount.Line = lineToAdd;
             }
            await _context
                .Lines
                .AddAsync(lineToAdd);

            await _context.SaveChangesAsync();

            return Ok(lineToAdd);
        }

         [HttpPost("Add/{lineId}/{accountId}")]
        public async Task<ActionResult<Line>> AddAccountToLine(Guid lineId, Guid accountId)
        {
                var account = await _context
                    .Accounts
                    .Where(acc => acc.Id == accountId)
                    .FirstOrDefaultAsync();
                    if(account is null)
                    {
                        return NotFound();
                    }
                //account.LineId = lineId;
                var lineAccount = await _context
                .Lines
                .Where(l => l.Id == lineId)
                .FirstOrDefaultAsync();
                if(lineAccount is null)
                    {
                        return NotFound();
                    }
                lineAccount.SteamAccount = account;
                _context.Update(lineAccount);
                account.Line = lineAccount;
                _context.Update(account);
                await _context.SaveChangesAsync();
                return Ok();
           
        }

        [HttpPost("Update/{lineId}")]
        public async Task<ActionResult<int>> UpdateLine(Guid lineId, UpdateLineDto updateLineDto)
        {
            var line = _context
                .Lines
                .Where(l => l.Id == lineId)
                .FirstOrDefault();

            if (line is null)
            {
                return NotFound();
            }
            _mapper.Map(updateLineDto, line);
            _context!.Update(line);
            var status = await _context.SaveChangesAsync();
            if(status == 0)
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpPost("Delete/{lineId}")]
        //TODO: How to use rest api
        public async Task<ActionResult> DeleteLine(Guid lineId)
        {
            var line = _context
                .Lines
                .Include(l => l.Positions)
                .Where(l => l.Id == lineId)
                .FirstOrDefault();

            if (line is null)
            {
                return NotFound();
            }

            var account = await _context
                .Accounts
                //.Where(acc => acc.LineId == null)
                .Where(acc => acc.LineId == lineId)
                .FirstOrDefaultAsync();
            if(account is not null)
            {
                account.LineId = null;
                account.Line = null;
                _context.Accounts.Update(account);
            }

            _context!.Remove(line!);

            var status = await _context.SaveChangesAsync();
            if(status == 0)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
