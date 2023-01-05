using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SteamQueue.DTOs
{
    public class UpdateLineDto
    {
        public string LineName { get; set; }

        public long PositionPeriod { get; set; }

        [NotMapped]
        [JsonIgnore]
        public TimeSpan ValidityPeriod
        {
            get { return TimeSpan.FromTicks(PositionPeriod); }
            set { PositionPeriod = value.Ticks; }
        }
    }
}
