#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/runtime:3.1 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["Jobs/ECDLink.AutomatedServiceWorkers/ECDLink.AutomatedServiceWorkers.csproj", "Jobs/ECDLink.AutomatedServiceWorkers/"]
RUN dotnet restore "Jobs/ECDLink.AutomatedServiceWorkers/ECDLink.AutomatedServiceWorkers.csproj"
COPY . .
WORKDIR "/src/Jobs/ECDLink.AutomatedServiceWorkers"
RUN dotnet build "ECDLink.AutomatedServiceWorkers.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ECDLink.AutomatedServiceWorkers.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ECDLink.AutomatedServiceWorkers.dll"]