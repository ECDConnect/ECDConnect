#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Libraries/Modules/ECDLink.IntegrationAPI/ECDLink.IntegrationAPI.csproj", "Libraries/Modules/ECDLink.IntegrationAPI/"]
RUN dotnet restore "Libraries/Modules/ECDLink.IntegrationAPI/ECDLink.IntegrationAPI.csproj"
COPY . .
WORKDIR "/src/Libraries/Modules/ECDLink.IntegrationAPI"
RUN dotnet build "ECDLink.IntegrationAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ECDLink.IntegrationAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ECDLink.IntegrationAPI.dll"]