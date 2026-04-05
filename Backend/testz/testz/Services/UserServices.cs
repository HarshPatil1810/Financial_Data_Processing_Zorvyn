using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using testz.Data;
using testz.Models;
namespace testz.Services
{
    public class UserServices
    {
        private readonly DbHelper _db;

        public UserServices(DbHelper db)
        {
            _db = db;
        }


    public string CreateUser(UserModel user)
     {
        using (SqlConnection con = _db.GetConnection())
        {
            using (SqlCommand cmd = new SqlCommand("sp_CreateUser", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // ✅ Parameters
                cmd.Parameters.AddWithValue("@Username", user.Username);
                cmd.Parameters.AddWithValue("@Email", user.Email);
                cmd.Parameters.AddWithValue("@PasswordHash", BCrypt.Net.BCrypt.HashPassword(user.PasswordHash));
                cmd.Parameters.AddWithValue("@FullName", user.FullName);
                cmd.Parameters.AddWithValue("@RoleId", user.RoleId);
                cmd.Parameters.AddWithValue("@CreatedBy", user.CreatedBy);

                try
                {
                    con.Open();

                    // ✅ Execute SP (no result expected)
                    cmd.ExecuteNonQuery();

                    return "User created successfully";
                }
                catch (SqlException ex)
                {
                    // ✅ Handle RAISERROR from SP
                    return ex.Message;
                }
            }
        }
    }

        public UserModel GetUserByEmail(string email)
        {
            using (SqlConnection con = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetUserByEmail", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Email", email);

                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new UserModel
                            {
                               
                                Username = reader["Username"].ToString(),
                                FullName = reader["FullName"].ToString(),
                                Email = reader["Email"].ToString(),
                                PasswordHash = reader["PasswordHash"].ToString(),
                                RoleId = (int)reader["RoleId"],
                                //IsActive = (bool)reader["IsActive"]
                            };
                        }
                    }
                }
            }

            return null; // User not found
        }

        public List<ExpandoObject> GetAllUsers()
        {
            var users = new List<ExpandoObject>();

            using (SqlConnection con = _db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_GetAllUsers", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        dynamic user = new ExpandoObject();
                        user.UserId = (int)reader["UserId"];
                        user.Username = reader["Username"].ToString();
                        user.FullName = reader["FullName"].ToString();
                        user.Email = reader["Email"].ToString();
                        user.RoleId = (int)reader["RoleId"];
                        user.RoleName = reader["RoleName"].ToString();
                        user.IsActive = (bool)reader["IsActive"];
                       
                        users.Add(user);
                    }
                }
            }

            return users;
        }

        public bool UpdateUser(int id, UserModel user)
        {
            using (SqlConnection con = _db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_UpdateUser", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                // Add parameters
                cmd.Parameters.AddWithValue("@UserId", id);
                cmd.Parameters.AddWithValue("@Username", user.Username);
                cmd.Parameters.AddWithValue("@FullName", user.FullName);
                cmd.Parameters.AddWithValue("@Email", user.Email);

                // Only update password if it's not blank
                if (!string.IsNullOrEmpty(user.PasswordHash))
                    cmd.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);
                else
                    cmd.Parameters.AddWithValue("@PasswordHash", DBNull.Value); // indicate "don't change"

                cmd.Parameters.AddWithValue("@RoleId", user.RoleId);
                cmd.Parameters.AddWithValue("@ModifiedBy", user.CreatedBy ?? "system");

                con.Open();
                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }


        public bool SoftDeleteUser(int id)
        {
            using (SqlConnection con = _db.GetConnection())
            {
                string query = "UPDATE Users SET IsActive = 0, UpdatedAt = GETDATE() WHERE UserId = @UserId";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@UserId", id);

                con.Open();
                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0; // returns true if a row was updated
            }
        }


    }
}
