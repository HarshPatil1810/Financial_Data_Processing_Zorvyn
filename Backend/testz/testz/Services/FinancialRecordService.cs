using System.Data;
using System.Data.SqlClient;
using testz.Data;
using testz.Models;
using Dapper;


namespace testz.Services
{
    public class FinancialRecordService
    {
        private readonly DbHelper _db;

        public FinancialRecordService(DbHelper db)
        {
            _db = db;
        }

        public int CreateRecord(FinancialRecordModel record)
        {
            using (SqlConnection con = _db.GetConnection())
            {
                SqlCommand cmd = new SqlCommand("sp_CreateFinancialRecord", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Amount", record.Amount);
                cmd.Parameters.AddWithValue("@Type", record.Type);
                cmd.Parameters.AddWithValue("@Category", record.Category);
                cmd.Parameters.AddWithValue("@RecordDate", record.RecordDate);
                cmd.Parameters.AddWithValue("@Notes", record.Notes ?? "");
                cmd.Parameters.AddWithValue("@CreatedBy", record.CreatedBy ?? "");

                con.Open();

                var result = cmd.ExecuteScalar();

                if (result != null)
                    return Convert.ToInt32(result);

                return 0;
            }
        }

        public List<FinancialRecordViewModel> GetFinancialRecords(
    int page,
    int pageSize,
    string type,
    string category,
    DateTime? dateFrom,
    DateTime? dateTo,
    string sortField,
    string sortOrder,
    out int totalRecords)
        {
            var list = new List<FinancialRecordViewModel>();
            totalRecords = 0;

            using (SqlConnection con = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_GetFinancialRecords", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Page", page);
                    cmd.Parameters.AddWithValue("@PageSize", pageSize);
                    cmd.Parameters.AddWithValue("@Type", (object)type ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Category", (object)category ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DateFrom", (object)dateFrom ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DateTo", (object)dateTo ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@SortField", string.IsNullOrEmpty(sortField) ? "RecordDate" : sortField);
                    cmd.Parameters.AddWithValue("@SortOrder", string.IsNullOrEmpty(sortOrder) ? "DESC" : sortOrder);

                    con.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list.Add(new FinancialRecordViewModel
                            {
                                RecordId = reader.GetInt32(reader.GetOrdinal("RecordId")),
                                Amount = reader.GetDecimal(reader.GetOrdinal("Amount")),
                                Type = reader.GetString(reader.GetOrdinal("Type")),
                                Category = reader.GetString(reader.GetOrdinal("Category")),
                                RecordDate = reader.GetDateTime(reader.GetOrdinal("RecordDate")),
                                Notes = reader["Notes"] == DBNull.Value ? "" : reader.GetString(reader.GetOrdinal("Notes")),
                                CreatedBy = reader.GetString(reader.GetOrdinal("CreatedBy"))
                            });
                        }

                        // Move to second result set for total records
                        if (reader.NextResult() && reader.Read())
                        {
                            totalRecords = reader.GetInt32(0);
                        }
                    }
                }
            }

            return list;
        }

        public async Task<UpdateFinancialRecordModel> UpdateFinancialRecord(UpdateFinancialRecordModel record)
        {
            using (SqlConnection con = _db.GetConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@RecordId", record.RecordId);
                parameters.Add("@Amount", record.Amount);
                parameters.Add("@Type", record.Type);
                parameters.Add("@Category", record.Category);
                parameters.Add("@RecordDate", record.RecordDate);
                parameters.Add("@Notes", record.Notes);

                var updatedRecord = await con.QueryFirstOrDefaultAsync<UpdateFinancialRecordModel>(
                    "sp_UpdateFinancialRecord",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return updatedRecord;
            }
        }

        public bool DeleteFinancialRecord(int recordId)
        {
            using (SqlConnection con = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("sp_DeleteFinancialRecord", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@RecordId", recordId);

                    con.Open();
                    var result = cmd.ExecuteScalar();

                    return Convert.ToInt32(result) == 1; // true if deleted, false otherwise
                }
            }
        }



    }
}
