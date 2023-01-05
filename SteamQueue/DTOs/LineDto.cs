using SteamQueue.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SteamQueue.DTOs
{
    public class LineDto
    {
       [Key]
        public Guid Id { get; set; }

        public string LineName { get; set; }
        
        public string LineType { get; set; }

        public long PositionPeriod { get; set; }

        public DateTimeOffset LineStart { get; set; }

        public DateTimeOffset LineFinish { get; set; }

        public DateTimeOffset RegistrationTime { get; set; } = DateTime.Now;

        public bool IsSteamAccount { get; set; }

        public IList<Position> Positions { get; set; }
    }
}