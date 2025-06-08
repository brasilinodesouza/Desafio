using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Minha API",
        Description = "Uma API Web de exemplo para buscar CEP",
        TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact
        {
            Name = "Seu Nome",
            Email = "seu.email@example.com"
        },
        License = new OpenApiLicense
        {
            Name = "Licença de Exemplo",
            Url = new Uri("https://example.com/license")
        }
    });
});

// ---------------------------------------------------
builder.Services.AddControllers();
// ---------------------------------------------------

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowFrontend",
                      policy =>
                      {
                          policy.WithOrigins("http://127.0.0.1:5500" , "https://127.0.0.1:5500")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});


var app = builder.Build();

app.UseCors("AllowFrontend"); 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API .NET 9 v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); // Agora deve funcionar porque AddControllers() foi chamado

app.Run();