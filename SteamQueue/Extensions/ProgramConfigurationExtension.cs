using Microsoft.OpenApi.Models;
using AutoMapper.EquivalencyExpression;
using AutoMapper.Extensions.ExpressionMapping;

namespace SteamQueue.Extensions
{
    public static class SwaggerConfigurationExtension
    {
        public static void AddSwaggerConfig(this IServiceCollection services)
        {
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Steam Account Line",
                    Version = "v1"
                });
            });
        }

        public static void AddCorsConfig(this IServiceCollection services, string frontendUrl)
        {
            services.AddCors(
               options =>
               {
                   options.AddPolicy("CorsPolicy", policy =>
                   {
                       policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                   });
               });
        }
       

        public static void AddMapperConfig(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddExpressionMapping();
                cfg.AddCollectionMappers();
                //cfg.CreateMap<AddPositionDtoBase, Position>().ReverseMap();
                //cfg.CreateMap<GetPositionDto, Position>().ReverseMap();
            });
        }

        public static void UseCustomSwaggerConfig(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Line API V1");
            });
        }
    }
}
