using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SteamQueue.Context;
using SteamQueue.DTOs;
using SteamQueue.Entities;


[Route("api/[controller]")]
[ApiController]
public class PositionController : ControllerBase
{
    private readonly DatabaseContext _context;
    private readonly IMapper _mapper;

    public PositionController(IMapper mapper, DatabaseContext context)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("GetList/{lineId}")]
    public async Task<ActionResult<List<Position>>> GetPositionList(Guid lineId)
    {
        var positionList = await _context
            .Positions
            .Where(pos => pos.Line.Id == lineId)
            .ToListAsync();

        return positionList;
    }

    //public async DateTimeOffset TimeLineResult

    [HttpPost("Add")]
    public async Task<ActionResult<Position>> Add([FromBody] AddPositionDtoBase position)
    {
        var positionToAdd = _mapper.Map<Position>(position);
        positionToAdd.Id = Guid.NewGuid();
        positionToAdd.RegistrationTime = DateTimeOffset.Now;
        var line = await _context
            .Lines
            .Where(line => line.Id == position.LineId)
            .FirstOrDefaultAsync();

        if (line.LineType == "timeslot")
        {
            
            positionToAdd.TimelineFinish = positionToAdd.TimelineStart + line.ValidityPeriod;
        }
        positionToAdd.Line = line;
        var lastNumberInLine = await GetLastNumberInQueue(position.LineId);
        positionToAdd.NumberInTheQueue = ++lastNumberInLine;

        _context
            .Positions
            .Add(positionToAdd);

        _context!.Positions!.Add(positionToAdd);

        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("Update/{lineId}")]
    public async Task<ActionResult<Position>> Update(Guid lineId, [FromBody] Position position)
    {
         var oldPosition = await _context
                .Positions
                .Include(pos => pos.Line)
                .Where(pos => pos.Id == position.Id)
                .FirstOrDefaultAsync();

         int oldNumberPosition = oldPosition.NumberInTheQueue;
         int newNumberPosition = position.NumberInTheQueue;
        _context.Entry(oldPosition).CurrentValues.SetValues(position);

         List<Position> positionsOffset =  await _context
                                            .Positions
                                            .Include(pos => pos.Line)
                                            .Where(pos => pos.Line.Id == lineId
                                                    && pos.Id != oldPosition.Id)
                                            .ToListAsync();

        if (oldNumberPosition < newNumberPosition)
        {
            positionsOffset = positionsOffset.Where(pos => pos.NumberInTheQueue >= oldNumberPosition
                                    && pos.NumberInTheQueue <= newNumberPosition).ToList();
            positionsOffset.ForEach(pos => pos.NumberInTheQueue--);
        }
        else if (oldNumberPosition > newNumberPosition)
        {
            positionsOffset = positionsOffset.Where(pos => pos.NumberInTheQueue <= oldNumberPosition
                            && pos.NumberInTheQueue >= newNumberPosition).ToList();
            positionsOffset.ForEach(pos => pos.NumberInTheQueue++);
        }

        if (positionsOffset.Count() != 0)
        {
            foreach (var pos in positionsOffset)
            {
                _context.Positions.Update(pos);
            }
        }
 
        await _context.SaveChangesAsync();

        return Ok();
    }

     [HttpPost("Delete/{positionId}")]
    public async Task<ActionResult<Position>> Delete(Guid positionId)
    {
        var positionToDelete = _context
                !.Positions
                !.Where(p => p.Id == positionId)
                !.Include(p => p.Line)
                .ThenInclude(l => l!.Positions)
                .FirstOrDefault();

            var line = positionToDelete
                ?.Line;

            _context!.Positions!.Remove(positionToDelete!);

            var positionsToUpdate = line
                !.Positions
                !.Where(pos => pos.NumberInTheQueue > positionToDelete!.NumberInTheQueue)
                .ToList();

            foreach(var position in positionsToUpdate)
            {
                --position.NumberInTheQueue;
            }

            int result = await _context.SaveChangesAsync();
            return Ok(result);
    }

    private async Task<int> GetLastNumberInQueue(Guid lineId)
    {
        var positionsList = await _context
           .Positions
           .Where(pos => pos.Line.Id == lineId)
           .ToListAsync();

        if (positionsList == null)
            return -1;

        if (positionsList.Count() == 0)
            return 0;
        var lastNumber = positionsList
            .Select(p => p.NumberInTheQueue)
            .Max();
        return lastNumber;
    }

    [HttpPost]
    [Route("DeletePosition/{positionId}")]
    public async Task<ActionResult<int>> DeletePosition(Guid positionId)
    {
        var positionToDelete = _context
            !.Positions
            !.Where(p => p.Id == positionId)
            !.Include(p => p.Line)
            .ThenInclude(l => l!.Positions)
            .FirstOrDefault();

        var line = positionToDelete
            ?.Line;

        _context!.Positions!.Remove(positionToDelete!);

        var positionsToUpdate = line
            !.Positions
            !.Where(pos => pos.NumberInTheQueue > positionToDelete!.NumberInTheQueue)
            .ToList();

        foreach (var position in positionsToUpdate)
        {
            --position.NumberInTheQueue;
        }

        int result = await _context.SaveChangesAsync();
        return result;
    }
}