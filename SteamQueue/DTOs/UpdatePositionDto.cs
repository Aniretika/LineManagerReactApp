using System.ComponentModel.DataAnnotations;

namespace SteamQueue.DTOs
{
    public class UpdatePositionDto
    {
        [Key]
        public Guid Id { get; set; }

        public int NumberInTheQueue { get; set; }

        [Required]
        public string Requester { get; set; }

        public DateTimeOffset TimelineStart { get; set; }

        public DateTimeOffset TimelineFinish { get; set; }

        public string DescriptionText { get; set; }

    }
}
