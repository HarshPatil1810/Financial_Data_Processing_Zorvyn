namespace testz.Models
{
    public class FinancialRecordModel
    {
      
        public decimal Amount { get; set; }
        public string Type { get; set; }      // Income or Expense
        public string Category { get; set; }
        public DateTime RecordDate { get; set; }
        public string Notes { get; set; }
        public string CreatedBy { get; set; }
        
    }

    public class UpdateFinancialRecordModel
    {
        public int RecordId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } // Income / Expense
        public string Category { get; set; }
        public DateTime RecordDate { get; set; }
        public string Notes { get; set; }
    }

    public class FinancialRecordViewModel
    {
        public int RecordId { get; set; }       // Primary key from DB
        public decimal Amount { get; set; }
        public string Type { get; set; }        // Income or Expense
        public string Category { get; set; }
        public DateTime RecordDate { get; set; }
        public string Notes { get; set; }
        public string CreatedBy { get; set; }
    }

}
