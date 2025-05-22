# ECD Connect


ECD Connect is a user-centric digital platform that offers quality ECD
programmes to support community-based practitioners in South Africa.

The Platform is built as a Progressive Web Application with offline first
capabilities. The technology leverages the strengths of React and .NET and is
hosted on Azure infrastructure.

## Core Tech Stack Summary

- **Frontend PWA** = React, Redux, TypeScript
- **Admin Portal** = React and Apollo Client
- **Headless API Data Access Layer** = .NET 3.1 Core based GraphQL

## Infrastructure

- **Database** =
  [Azure PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/)
- **Storage** =
  [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
- **CDN** =
  [Azure Content Delivery Network](https://azure.microsoft.com/en-us/services/cdn/)

## 3rd Party Integrations

- [**BulkSMS**](https://www.bulksms.com/) for sending out the SMS's
- [**RapidAPI**](https://rapidapi.com/) - an API to get the South African
  Holidays for attendance tracking purposes etc
- [**Google Analytics**](https://analytics.google.com/),
  [**Google Tag Manager**](https://tagmanager.google.com/) and
  [**Google Data Studio**](https://datastudio.google.com/) - for analytics,
  event tracking and reporting

## Offline Capability for the Frontend PWA

- The App uses Service Workers and Redux to manage the offline capability

## Core Features

- Track attendance for learners
- Progress Tracking and Observation Reports
- Routine & Programme planning
- Reports - Practitioner, Children and Attendance
- User, Roles and Permission Management
- White labelling and Theming
- Multi-Language Content Management
- Document Management
- Multi-Tenant support

## Frontend PWA - Practitioner logins

- User based logins that allow any Practitioner that has been invited to the
  system to interact
- New Practitioners are invited via the Admin Portal and the practitioners
  receive a SMS with a link and code to register

## Admin Portal - Administrator logins

- User based logins that allow any Administrator to login, invite new users &
  maintain the system.

## Headless API tech stack

- [.Net Core 3.1](https://dotnet.microsoft.com/en-us/download/dotnet/3.1) API
  using the following to function:
- [Hot Chocolate](https://github.com/ChilliCream/hotchocolate) - A open-source
  GraphQL server
- [Banana Cake Pop](https://chillicream.com/) - This provides a playground and
  documentation layer for easy reading of the GraphQL end points
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-6.0&tabs=visual-studio)
  for authentication and User management

## Frontend PWA tech stack

- [Ionic React](https://ionicframework.com/docs/react) using Functional
  components, to support possible future migration to a native mobile
  application
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management with
  persistence
- [TypeScript](https://www.typescriptlang.org/) for improved syntax support
- [Tailwind UI](https://tailwindui.com/) for Form layouts, tables, modal windows
  for clean & modern look
- [heroicons](https://heroicons.com/) for SVG icons

## Frontend Admin Portal tech stack

- React using Functional components
- Using [Apollo Client](https://www.apollographql.com/docs/react/) GraphQL for
  Declarative data fetching
- [Tailwind UI](https://tailwindui.com/) for Form layouts, tables, modal windows
  for clean & modern look
- [heroicons](https://heroicons.com/) for SVG icons

## Hosting

- Hosted within Azure, (Flexible Server hosting the database, Web Apps, Blob
  storage, CDN, Application Insights)
- Frontend, Admin Portal and API are all hosted as separate
  [Azure Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/)

## Security

- SSL certificates are recommended for the respective, frontend, Admin Portal
  and API url's
- [JWT](https://jwt.io/) tokens for authorisation with refresh endpoints
- Basic Authentication for tenant creation
- [Azure App Service Access Restrictions](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions#:~:text=Sign%20in%20to%20the%20Azure,are%20defined%20for%20your%20app.) -
  rules with IP access restrictions

## Project Requirements

- [Node](https://nodejs.org/en/download/) version ^16.11.6 or up
- [Lerna](https://lerna.js.org/) installed for multiple package management,
  `npm install --global lerna`
- [Yarn](https://yarnpkg.com/) as an optional alternative to NPM,
  `npm install --global yarn`
- [.Net Core 3.1](https://dotnet.microsoft.com/en-us/download/dotnet/3.1)
- [PostgreSQL Server](https://www.postgresql.org/) - installed on your local PC
  as a database server
- Alternatively run the db from a docker container with `./run-db.sh`. After
  that's done restore the db with
  `docker exec ecdconnect-db-1 pg_restore --dbname=ecdconnect --username=postgres --schema=public /tmp/dump-public-202208171017.backup`.
  Copy the restore to the root of the project and replace the filename in above
  command.

# How to run the projects

## Front end / Admin Portal - Pre Setup

1. Please ensure you have yarn installed (e.g. brew install yarn)
2. Please ensure you have npm installed (download & install nodeJS from
   nodejs.org)

## Front end / Admin Portal - Setup

1. Firstly, install the packages. Run, `yarn` in the **root folder** to install
   the NPM packages.
2. Secondly, install the sub packages. Run `yarn bootstrap`, this will install
   all packages for the sub packages and src projects. After that it will build
   the packages for use and add them to the node modules of the projects that
   have them as dependencies.

## Front end / Admin Portal - Run

### Remember to do this before running FE or API

`npm install --global lerna && npm install --global yarn`

### Run the Frontend PWA

- `yarn app` to run the Front End

### Run the Admin Portal

- `yarn portal` to run the Admin Portal

## Headless API - Run

- Start the PostgreSQL server
- Using Visual Studio, run the solution to get the NuGet packages and build the
  solution
- To generate a tenant, make a POST to the tenant endpoint
  (`https://[domain]/api/tenancy` or `https://localhost:5001/api/tenancy`),
  using Basic Authentication (the defaults are inside the authentication seed
  file, `ECDLink.PostgresTenancy.Configuration.Setup.Seed`) with the following
  request format:
  ```
  { "SiteAddress": "{domain}",
  "ApplicationName": "{applicationName}",
  "OrganisationName": "{organizationName}",
  "ConnectionString": "{Db Connection string}",
  "DbProvider": "{postgresql}" }
  ```

## GraphQL API

- Refer to the
  [Chillicream docs](https://chillicream.com/docs/hotchocolate/get-started) for
  the GraphQL instructions
- As a guide, the API url will have an endpoint that you can use to see the
  schema and available queries. For example, `http://localhost:5001/graphql`,
  next to the Documents heading, select a new Document, then select the **Schema
  Reference**.
- To run test queries you will first require a JWT token for authentication. To
  get a JWT token make a POST request to the login API to get the JWT,
  `https://localhost:5001/api/authentication/login`.
- Refer to [this guide](https://graphql.org/learn/) that walks you through the
  basic concepts of GraphQL



## Migration Scripts that ran after Meraki handover to Swipe SQLUpgradeScripts
### The last script Amanda ran on prod was on the 26/09/2024

| Environment   | Scripts                                                                                                           | Executed |
|---------------|-------------------------------------------------------------------------------------------------------------------|----------|
| **DEV**       | - 20240927_Message_Coach.sql<br>- 20240930_SystemSettings.sql<br>- 20241002_calendar_event_types.sql<br>- 20241009_ProgrammeDay_Add_CompleteDate.sql | Yes       |
| **QA**        | - 20240927_Message_Coach.sql<br>- 20240930_SystemSettings.sql<br>- 20241002_calendar_event_types.sql<br>- 20241009_ProgrammeDay_Add_CompleteDate.sql | Yes       |
| **STAGING**   | - 20240927_Message_Coach.sql<br>- 20240930_SystemSettings.sql<br>- 20241002_calendar_event_types.sql<br>- 20241009_ProgrammeDay_Add_CompleteDate.sql | Yes       |
| **PRODUCTION**| - 20240927_Message_Coach.sql<br>- 20240930_SystemSettings.sql<br>- 20241002_calendar_event_types.sql<br>- 20241009_ProgrammeDay_Add_CompleteDate.sql | Yes       |


## Blob Storage
There are currently two storage types:  Azure Blob Storage or File System.
This is specified in the /src/api/core-api/appsettings.json file:
  "Storage": {
    "Type": "FileSystem",
    "AzureBlob": {
    },
    "FileSystem": {
      "Location": "_Storage"
    }
  },
Storage.Type can be either FileSystem or AzureBlob
Storage.FileSystem.Location is the location for the file system store.  This can be a rooted path, e.g. C:\\Storage or relative path.

If Type is FileSystem, the following configuration should also be applied:

- Tenant table
  - BlobStorageAddress should be the backend url, e.g. https://api.domain.co.za/storage or https://localhost:5001/storage
  - ThemePath (if specified) should be be the backend url, e.g. https://api.domain.co.za/storage/theme/mytheme.json
- Settings.json files
  - themeUrl should be https://api.domain.co.za/storage/theme/mytheme.json

If Type is AzureBlob:

- Tenant table
  - BlobStorageAddress should be the blob storage url, e.g. https://mystorage.blob.core.windows.net
  - ThemePath (if specified) should be be the backend url, e.g. https://mystorage.blob.core.windows.net/theme/mytheme.json
- Settings.json files
  - themeUrl should be https://mystorage.blob.core.windows.net/theme/mytheme.json

Make sure that all references for the storage url are correct:
- ContentValue table
  Check the Value column and update if necessary
- Theme file
  Make sure all urls to other files in the theme are correct.

