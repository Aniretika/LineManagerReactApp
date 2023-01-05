using System.ComponentModel.DataAnnotations;

namespace SteamQueue.Entities
{
    public class AddAccountDto
    {
        public string Login { get; set; }

        public string Password { get; set; }
    }
}
