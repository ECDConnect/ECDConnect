FROM mcr.microsoft.com/dotnet/aspnet:3.1
RUN apt-get update && apt-get -y install nano p7zip p7zip-full unzip
WORKDIR /app
EXPOSE 5000

COPY api_artifacts/drop/a.zip /
RUN unzip /a.zip -d /app

ENV ASPNETCORE_URLS=http://+:5000
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser
ENTRYPOINT ["dotnet", "EcdLink.Api.CoreApi.dll"]
#ENTRYPOINT ["tail", "-f", "/dev/null"]
