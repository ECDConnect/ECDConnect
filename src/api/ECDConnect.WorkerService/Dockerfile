#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ECDConnect.WorkerService/ECDConnect.WorkerService.csproj", "ECDConnect.WorkerService/"]
COPY ["core-api/EcdLink.Api.CoreApi.csproj", "core-api/"]
COPY ["ECDLink.AzureStorage/ECDLink.AzureStorage.csproj", "ECDLink.AzureStorage/"]
COPY ["Libraries/Modules/ECDLink.Abstractrions/ECDLink.Abstractrions.csproj", "Libraries/Modules/ECDLink.Abstractrions/"]
COPY ["Libraries/Modules/ECDLink.Core/ECDLink.Core.csproj", "Libraries/Modules/ECDLink.Core/"]
COPY ["ECDLink.PostgresTenancy/ECDLink.PostgresTenancy.csproj", "ECDLink.PostgresTenancy/"]
COPY ["ECDLink.Tenancy/ECDLink.Tenancy.csproj", "ECDLink.Tenancy/"]
COPY ["Jobs/ECDLink.AutomatedJobs/ECDLink.AutomatedJobs.csproj", "Jobs/ECDLink.AutomatedJobs/"]
COPY ["Libraries/Modules/ECDLink.DataAccessLayer/ECDLink.DataAccessLayer.csproj", "Libraries/Modules/ECDLink.DataAccessLayer/"]
COPY ["Libraries/Modules/ECDLink.Security/ECDLink.Security.csproj", "Libraries/Modules/ECDLink.Security/"]
COPY ["Libraries/Modules/ECDLink.SmartStart/ECDLink.SmartStart.csproj", "Libraries/Modules/ECDLink.SmartStart/"]
COPY ["Libraries/Modules/ECDLink.GraphQL/ECDLink.EGraphQL.csproj", "Libraries/Modules/ECDLink.GraphQL/"]
COPY ["Libraries/Modules/ECDLink.PDFGenerator/ECDLink.PDFGenerator.csproj", "Libraries/Modules/ECDLink.PDFGenerator/"]
COPY ["Libraries/Modules/DataAccess/ECDLink.ContentManagement/ECDLink.ContentManagement.csproj", "Libraries/Modules/DataAccess/ECDLink.ContentManagement/"]
COPY ["Libraries/Modules/ECDLink.Development/ECDLink.Development.csproj", "Libraries/Modules/ECDLink.Development/"]
COPY ["Libraries/Modules/ECDLink.Notifications/ECDLink.Notifications.csproj", "Libraries/Modules/ECDLink.Notifications/"]
COPY ["Libraries/Modules/ECDLink.UrlShortner/ECDLink.UrlShortner.csproj", "Libraries/Modules/ECDLink.UrlShortner/"]
COPY ["ECDLink.Moodle/ECDLink.Moodle.csproj", "ECDLink.Moodle/"]
RUN dotnet restore "ECDConnect.WorkerService/ECDConnect.WorkerService.csproj"
COPY . .
WORKDIR "/src/ECDConnect.WorkerService"
RUN dotnet build "ECDConnect.WorkerService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ECDConnect.WorkerService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ECDConnect.WorkerService.dll"]