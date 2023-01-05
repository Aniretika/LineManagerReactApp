using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SteamQueue.Entities
{
    public class Position
    {
        //PK properties
        [Key]
        public Guid Id { get; set; }

        public long TelegramRequesterId { get; set; }

        public long? BotId { get; set; }

        public int NumberInTheQueue { get; set; }

        [Required]
        public string? Requester { get; set; }

        public DateTimeOffset RegistrationTime { get; set; } = DateTime.Now;

        public DateTimeOffset TimelineStart { get; set; }

        public DateTimeOffset TimelineFinish { get; set; }

        public string? DescriptionText { get; set; }

        //Navigation Properties
        [JsonIgnore]
        public Line? Line { get; set; }
    }
}
