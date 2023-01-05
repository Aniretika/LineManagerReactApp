using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SteamQueue.Entities
{
    public class SteamAccount
    {
        [Key]
        public Guid Id { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }
        [NotMapped]
        [JsonIgnore]
        
        public Line Line { get; set; }
        [ForeignKey("AccountId")]

        public Guid? LineId { get; set; }
    }
}
