using Microsoft.OpenApi;
//using Microsoft.OpenApi.Models;
using testz.Data;
using testz.Services;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add services
builder.Services.AddSingleton<DbHelper>();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<FinancialRecordService>();


builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // your React app
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "User Management API",
        Version = "v1",
        Description = "API for User & Role Management"
    });
});

var app = builder.Build();
app.UseCors("AllowReactApp");

// ✅ Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();          // generate swagger.json
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "User API V1");
        options.RoutePrefix = "swagger"; // URL: /swagger
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
