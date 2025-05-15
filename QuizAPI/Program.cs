using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using QuizAPI.Models;


var builder = WebApplication.CreateBuilder(args);

// Dynamic connection string switching
string connectionString = builder.Environment.IsDevelopment()
    ? builder.Configuration.GetConnectionString("DevConnection")
    : builder.Configuration.GetConnectionString("DatabaseConnection");


// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<QuizDbContext>(options => 
    options.UseSqlServer(connectionString));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder
            .WithOrigins("http://localhost:3000", "https://quizapi20250513160244.azurewebsites.net/")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors("CorsPolicy");

// Serve static files from wwwroot (this will serve React's build output)
app.UseStaticFiles();

//app.UseCors(options => options
//    .WithOrigins("http://localhost:3000")
//    .AllowAnyMethod()
//    .AllowAnyHeader());

// allow the API to use static files (images)
app.UseStaticFiles(new StaticFileOptions
{
    // pass in the directory where we saved the images
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "Images")), 
    RequestPath = "/Images" // the path for accessing the images
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseAuthorization();

app.MapControllers();

// fallback to index.html for React Router routes (Azure safe)
app.MapFallbackToFile("index.html");

app.Run();
