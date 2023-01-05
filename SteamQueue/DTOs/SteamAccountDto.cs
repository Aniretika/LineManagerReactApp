using SteamQueue.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace SteamQueue.DTOs
{
    public class SteamAccountDto
    {
        public Guid Id { get; set; }

        public string Login { get; set; }
    }
}
