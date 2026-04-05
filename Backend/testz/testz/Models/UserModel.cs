namespace testz.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string? PasswordHash { get; set; }
        public int RoleId { get; set; }
        //public bool? IsActive { get; set; }
        public string? CreatedBy { get; set; }
    }
}
