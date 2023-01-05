using System.ComponentModel.DataAnnotations;

namespace SteamQueue.DTOs
{
    public class AddPositionDtoBase
    {
        //PK properties
        [Key]

        public Guid LineId { get; set; }

        public long? TelegramRequesterId { get; set; }

        public long? BotId { get; set; }

        public string Requester { get; set; }

        public DateTimeOffset? TimelineStart { get; set; }

        public string DescriptionText { get; set; }
    }
}
