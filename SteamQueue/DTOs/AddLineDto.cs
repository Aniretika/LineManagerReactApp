using System.ComponentModel.DataAnnotations;

namespace SteamQueue.DTOs
{
    public class AddLineDto
    {
        public string LineName { get; set; }
        
        public string? LineType { get; set; }

        public long PositionPeriod { get; set; }

        public DateTimeOffset LineStart { get; set; }

        public DateTimeOffset LineFinish { get; set; }

        //public DateTimeOffset RegistrationTime { get; set; } = DateTime.Now;
    }
}
