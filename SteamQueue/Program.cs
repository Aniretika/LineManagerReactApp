using AutoMapper.EquivalencyExpression;
using AutoMapper.Extensions.ExpressionMapping;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.EntityFrameworkCore;
using SteamQueue.Context;
using SteamQueue.DTOs;
using SteamQueue.Entities;
using SteamQueue.Extensions;
using SteamQueue.Services.DatabaseInitialization;
using SteamQueue.AuthorizationPolicies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                  .AddMicrosoftIdentityWebApi(options =>
                  {
                      builder.Configuration.Bind("AzureAdB2C", options);

                      options.TokenValidationParameters.NameClaimType = "name";
                  },
          options => { builder.Configuration.Bind("AzureAdB2C", options); });

builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
               options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
string sqlConnectionString = builder.Configuration["ConnectionString"];
builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseSqlServer(sqlConnectionString,
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure();
        });
});

builder.Services.AddAutoMapper(cfg => {
                cfg.AddExpressionMapping();
                cfg.AddCollectionMappers();
                cfg.CreateMap<AddPositionDtoBase, Position>().ReverseMap();
                cfg.CreateMap<AddAccountDto, SteamAccount>().ReverseMap();
                cfg.CreateMap<UpdateLineDto, Line>().ReverseMap();
                cfg.CreateMap<AddLineDto, Line>().ReverseMap();
                cfg.CreateMap<LineDto, Line>().ReverseMap();
            });

builder.Services.AddScoped<IDbInitializer, DbInitializer>();
builder.Services.AddSwaggerConfig();

 builder.Services.AddCorsConfig(builder.Configuration["FrontendUrl"]);

builder.Services.AddAuthorization(options =>
{
    // Create policy to check for the scope 'read'
    options.AddPolicy("PositionReadScope",
        policy => policy.Requirements.Add(
            new ScopesRequirement(
                "https://linemanagergroup.onmicrosoft.com/essential/api/position.read"))
        );

    // check for write
    options.AddPolicy("PositionWriteScope",
        policy => policy.Requirements.Add(
            new ScopesRequirement(
                "https://linemanagergroup.onmicrosoft.com/essential/api/position.write"))
        );
    // Create policy to check for the scope 'read'
    options.AddPolicy("LinesWriteScope",
        policy => policy.Requirements.Add(
            new ScopesRequirement(
                "https://linemanagergroup.onmicrosoft.com/essential/api/lines.write"))
        );

    // check for write
    options.AddPolicy("LinesReadScope",
        policy => policy.Requirements.Add(
            new ScopesRequirement(
                "https://linemanagergroup.onmicrosoft.com/essential/api/lines.read"))
        );
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

var scopeFactory = app.Services.GetRequiredService<IServiceScopeFactory>();
using (var scope = scopeFactory.CreateScope())
{
    var dbInitializer = scope.ServiceProvider.GetService<IDbInitializer>();
    dbInitializer!.Initialize();
    dbInitializer.SeedData();
}
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("CorsPolicy");

app.UseCustomSwaggerConfig();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
