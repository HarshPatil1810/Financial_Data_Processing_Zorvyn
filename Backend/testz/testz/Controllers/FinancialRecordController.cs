using Microsoft.AspNetCore.Mvc;
using testz.Models;
using testz.Services;

namespace testz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinancialRecordController : ControllerBase
    {
        private readonly FinancialRecordService _service;

        public FinancialRecordController(FinancialRecordService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] FinancialRecordModel record)
        {
            try
            {
                if (record == null)
                    return BadRequest("Invalid record data");

                int recordId = _service.CreateRecord(record);
                return Ok(new { Message = "Record created successfully", RecordId = recordId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("get-all")]
        public IActionResult GetAll(
        int page = 1,
        int pageSize = 5,
        string type = null,
        string category = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        string sortField = "RecordDate",
        string sortOrder = "desc")
        {
            try
            {
                var records = _service.GetFinancialRecords(
                    page, pageSize, type, category, dateFrom, dateTo, sortField, sortOrder, out int totalRecords);

                return Ok(new { records, totalRecords });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateFinancialRecord(int id, [FromBody] UpdateFinancialRecordModel record)
        {
            if (id != record.RecordId)
                return BadRequest("Record ID mismatch");

            try
            {
                var updatedRecord = await _service.UpdateFinancialRecord(record);
                if (updatedRecord == null)
                    return NotFound("Record not found");

                return Ok(updatedRecord);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("delete/{recordId}")]
        public IActionResult Delete(int recordId)
        {
            try
            {
                bool deleted = _service.DeleteFinancialRecord(recordId);
                if (!deleted)
                    return NotFound(new { Message = "Record not found or already deleted" });

                return Ok(new { Message = "Record deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }








    }
}
