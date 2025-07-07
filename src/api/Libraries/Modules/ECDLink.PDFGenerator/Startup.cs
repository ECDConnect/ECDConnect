using ECDLink.PDFGenerator.FormFields;
using ECDLink.PDFGenerator.FormFields.Interfaces;
using ECDLink.PDFGenerator.Services;
using ECDLink.PDFGenerator.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECDLink.PDFGenerator
{
    public static class PdfGeneratorStartup
    {

        public static void ConfigurePdfGeneratorServices(IServiceCollection services, IConfiguration Configuration)
        {
            services.AddTransient<IFieldFactory, FieldFactory>();
            services.AddTransient<IFillableFieldService, FillableFieldService>();
        }
    }
}
