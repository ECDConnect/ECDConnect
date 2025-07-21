# ECD Connect

ECD Connect supports practitioners and organizations to scale and deliver professional, high quality services to young children and caregivers in their communities.

ECD Connect is a license-free, customisable digital application designed with the support of behavioural scientists and ECD gurus.  

It is a crucial tool for the scale-up early childhood development programmers as per the government's stated goal of achieving universal access by 2030. The platform supports ECD practitioners in navigating some of the more cumbersome aspects of their jobs as identified by them through user research.

It can be used by independent, stand alone early childhood education practitioners and principals, or by organizations working in the broader ECD sector.

The platform is built as a Progressive Web Application with offline first capabilities. The technology leverages the strengths of React and .NET. It can be hosted in the cloud or on-prem.

## Core Tech Stack Summary

-   **Frontend PWA**: React, Redux, TypeScript
-   **Admin Portal Website**: React and Apollo Client
-   **Backend**: .NET 9 Core, GraphQL (Hot Chocolate), Entity Framework, PostgreSQL.

## 3rd Party Integrations

-   Training: [Moodle](https://moodle.org/) - see below for details on the training module
-   SMS Sending:  [BulkSMS](https://www.bulksms.com/),  [iTouch](https://itouch.co.za/), or [SMSPortal] ([https://smsportal.com/](https://smsportal.com/))
-   Holidays:  [RapidAPI](https://rapidapi.com/)  - an API to get the South African Holidays for attendance tracking purposes etc
-   Analytics:  [Google Analytics](https://analytics.google.com/),  [Google Tag Manager](https://tagmanager.google.com/)  and  [Google Data Studio](https://datastudio.google.com/)  - for analytics, event tracking and reporting

## Offline Capability for the Frontend PWA

-   The App uses Service Workers and Redux to manage the offline capability.

## Core Features

-   "Offline first" PWA, allowing a large portion of functionality to be used when offline
-   Configure site / center
-   Register Children and capture caregiver information
-   Create classrooms and assign children  
-   Track attendance for learners
-   Progress Tracking and Observation Reports - shared with caregivers
-   Routine & Programme planning (Curriculum)
-   Reports - Practitioner, Children and Attendance
-   Capture Income & Expenses and generate income statements
-   User, Roles and Permission Management
-   White labelling and Theming
-   Multi-Language Content Management
-   Document Management

## Frontend PWA - Practitioner logins

-   User based logins that allow any Practitioner to sign up to the system using the Frontend PWA.

## Admin Portal - Administrator logins

-   User based logins that allow any Administrator to login, invite new users & maintain the system.

## Backend tech stack

-   [.NET 9](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)  using the following to function:
-   [Hot Chocolate](https://github.com/ChilliCream/hotchocolate)  - A open-source GraphQL server
-   [Banana Cake Pop](https://chillicream.com/)  - This provides a playground and documentation layer for easy reading of the GraphQL end points
-   [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
-   [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-9.0&tabs=visual-studio)  for authentication and User management
-   [PostgreSQL](https://www.postgresql.org/)  for the database

## Frontend PWA tech stack

-   [Ionic React](https://ionicframework.com/docs/react)  using Functional components, to support possible future migration to a native mobile application
-   [Redux Toolkit](https://redux-toolkit.js.org/)  for state management with persistence
-   [TypeScript](https://www.typescriptlang.org/)  for improved syntax support
-   [Tailwind UI](https://tailwindui.com/)  for Form layouts, tables, modal windows for clean & modern look
-   [heroicons](https://heroicons.com/)  for SVG icons

## Admin Portal website tech stack

-   React using Functional components
-   Using  [Apollo Client](https://www.apollographql.com/docs/react/)  GraphQL for declarative data fetching
-   [Tailwind UI](https://tailwindui.com/)  for Form layouts, tables, modal windows for clean & modern look
-   [heroicons](https://heroicons.com/)  for SVG icons

## Hosting

### Azure
The system was developed making use of Azure hosting.
Azure resources that are used:
-   [PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/)
-   [Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/)
-   [Storage Accounts (Blob)](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)
-   [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

The Frontend, Admin Portal and API are all hosted on separate [Azure Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/).   
More details about the Azure setup can be found further below in the [example setup](#setting-up-a-basic-system-in-azure).

### Other Cloud Providers, e.g. Amazon Web Services (AWS), Google Cloud Platform (GCP)
The system can be hosted in other cloud providers as long as they provide PostgreSQL resources and the capability of running .NET code on Linux.
Both AWS and GCP are capable.  Currently the file storage for the system makes use of file system or Azure Storage.  There isn't provision for AWS S3 or GCP storage but it is a relatively simple task to extend the system to support one or both of them.

### On-Prem
The system can be hosted on-prem using PostgreSQL, IIS or Apache, and file system for storage.

## Security

-   SSL certificates are recommended for the respective, frontend, Admin Portal and API url's
-   [JWT](https://jwt.io/)  tokens for authorisation with refresh endpoints

## Training
*Please note this is not a requirement to run the system.*  

The app has a training module that can display Moodle training courses within an iframe.  
In order to enable this functionality, the requirements are:
-   Moodle 4.9.4 or later
-   Cohort enrolment enabled
-   The Moodle database must be on PostgreSQL 13 or later
-   The Moodle database must be accessible from the backend with read/insert/delete permission
-   The Moodle UI theme needs to be as minimal as possible as it will be displayed within an iframe

When the Training module of the frontend is accessed, the backend is queried to create/update the current user in the Moodle database and enroll the user, using cohort enrolment, in the courses.
The frontend then logs into Moodle in the iframe using the user's Moodle credentials and the courses assigned to the user will be display on the Moodle landing page.

Configuration of the backend for Moodle is discussed below.

## Project Requirements

-   [Node](https://nodejs.org/en/download/)  version ^20.19.2 or up
-   [Lerna](https://lerna.js.org/)  installed for multiple package management,  
    `npm install --global lerna@4.0.0`
-   [Yarn](https://yarnpkg.com/)  as an optional alternative to NPM,  
    `npm install --global yarn@1.22.22`
-   [.NET 9.0](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
-   [PostgreSQL Server](https://www.postgresql.org/)  - version 13 or later.
-   [Visual Studio Code](https://code.visualstudio.com/)  for frontend development.
-   [Visual Studio 2022 Community Edition](https://visualstudio.microsoft.com/vs/community/)  for backend development.

## Development Setup

### Frontend
1.  Install VS Code
2.  Clone the repo.
3.  Install node 20.19.2 or later.
4.  In the  **root folder**:  
    `npm install --global lerna@4.0.0`  
    `npm install --global yarn@1.22.22`
5.  Run  `yarn`  to update/install the packages.
6.  Run  `yarn fixmodules`  to correct modules using unsupported syntax
7.  Run  `yarn bootstrap`. This will install all packages for the sub packages and src projects. After that it will build the packages for use and add them to the node modules of the projects have them as dependencies.

### Backend
1.  Install PostgreSQL and create a database, e.g. ecdconnect. Run the  **sqlscripts/database.sql**  to create the initial database.
2.  Install VS 2022 Community Edition.
3.  VS solution file can be found in src/api.
4.  Update src/api/core-api/appsettings.json with the correct values for the database connection string.

## Run

### Backend

-   Start the PostgreSQL server
-   Using Visual Studio run the solution. Verify that the browser page opens with the GraphQL schema.

### Frontend PWA

-   Ensure the backend is running
-   `yarn app`  to run the Front End

### Admin Portal Website

-   Ensure the backend is running
-   `yarn portal`  to run the Admin Portal
-   Default username is  _Admin_  and password is  _Pass@123_

## System Configuration

### Blob Storage

There are currently two storage types: Azure Blob Storage or File System.  
This is specified in the /src/api/core-api/appsettings.json file:

```
"Storage": {  
  "Type": "FileSystem",  
  "AzureBlob": {  
  },  
  "FileSystem": {  
    "Location": "\_Storage"  
  }  
},  
```

Storage.Type can be either FileSystem or AzureBlob  
Storage.FileSystem.Location is the location for the file system store. This can be a rooted path, e.g. C:\Storage or relative path.

If Type is FileSystem, the following configuration should also be applied:

-   Tenant table
    -   BlobStorageAddress should be the backend url, e.g.  [https://api.domain.co.za/storage](https://api.domain.co.za/storage)  or  [https://localhost:5001/storage](https://localhost:5001/storage)
    -   ThemePath (if specified) should be be the backend url, e.g.  [https://api.domain.co.za/storage/theme/mytheme.json](https://api.domain.co.za/storage/theme/mytheme.json)
-   Settings.json files
    -   themeUrl should be  [https://api.domain.co.za/storage/theme/mytheme.json](https://api.domain.co.za/storage/theme/mytheme.json)

If Type is AzureBlob:

-   Tenant table
    -   BlobStorageAddress should be the blob storage url, e.g.  [https://mystorage.blob.core.windows.net](https://mystorage.blob.core.windows.net/)
    -   ThemePath (if specified) should be be the backend url, e.g.  [https://mystorage.blob.core.windows.net/theme/mytheme.json](https://mystorage.blob.core.windows.net/theme/mytheme.json)
-   Settings.json files
    -   themeUrl should be  [https://mystorage.blob.core.windows.net/theme/mytheme.json](https://mystorage.blob.core.windows.net/theme/mytheme.json)

Make sure that all references for the storage url are correct:

-   ContentValue table  
    Check the Value column and update if necessary
-   Theme file  
    Make sure all urls to other files in the theme are correct.

### Moodle (optional)
Make the following changes if you will be using Moodle:
-   Tenant table
    -   MoodleUrl = the url for the Moodle instance, e.g. https://moodle.mydomain.co.za
    -   MoodleConfig = json string as below, replacing as required:
        ```json
        {   
            "userTypes": [{
               "userType": "*",
               "cohorts": ["course cohort name", "ui cohort name"]
            }],
            "database": {
               "type": "postgres",
               "connectionString": "Server=myserver.com;Database=moodle;Port=5432;User Id=admin@myserver;Password=123456;Ssl Mode=VerifyFull;"
            },
            "site": {
               "address": "https://moodle.mydomain.co.za",
               "defaultPassword": "abc@1234",
               "emailFormatString": "{0}@mydomain.co.za"
            }
         }

### SMS Sending

The platform sends smses for certain notifications. To configure SMS capability values in the SystemSetting table need to be set.

#### BulkSMS
-   Update  `Notifications.SMSProviders.Sms.Provider`  to  `Notifications.SMSProviders.BulkSms`
-   Update the following rows:  
    `Notifications.SMSProviders.BulkSms.BasicAuthToken`  
    `Notifications.SMSProviders.BulkSms.Name`  
    `Notifications.SMSProviders.BulkSms.TokenId`  
    `Notifications.SMSProviders.BulkSms.TokenSecret`

#### SMSPortal
-   Update  `Notifications.SMSProviders.Sms.Provider`  to  `Notifications.SMSProviders.SMSPortal`
-   Update the following rows:  
    `Notifications.SMSProviders.SMSPortal.ApiKey`   
    `Notifications.SMSProviders.SMSPortal.ApiSecret`

#### iTouch
-   Update  `Notifications.SMSProviders.Sms.Provider`  to  `Notifications.SMSProviders.iTouch`
-   Update the following rows:  
    `Notifications.SMSProviders.iTouch.Password`    
    `Notifications.SMSProviders.iTouch.Username`

### SMTP Email Sending

To configure the system to allow for the sending of emails, edit the  `Notifications.EmailProviders.Smtp.%`  rows in SystemSetting table as required.


# Setting up a basic system in Azure

-   Create a Resource Group, e.g. rg-myapp
    
-   Create a Storage Account resource, e.g. stgmyapp, in rg-myapp.
    -   Allow Blob anonymous access: Enabled
    -   Allow storage account key access: Enabled
    -   Blob access tier: Hot
    -   Setup CORS to allow GET for Blob service.
-   Upload data to stgmyapp storage account.
    -   Create a  _content-image_  container with Anonymous access Level = Blob Upload all the files in  _src/api/core-api/_Storage/content-image_  to the container
    -   Create a  _theme_  container with Anonymous access Level = Blob Upload all the files, sub folders included, in  _src/api/core-api/_Storage/theme_  to the container

-   Create a PostgreSQL Flexible Server resource, e.g. sql-myapp, in rg-myapp.
    -   Add a database.
    -   Use pgAdmin or another tool to restore the database using your own backup or sqlscripts/database.sql.

-   Create an App Service Plan, e.g. asp-myapp, in rg-myapp.
    -   Operating System: Linux
    -   Pricing Plan: For dev/test B1 should be sufficient initially.

-   Create backend App Service (Web App), e.g. api-myapp, in rg-myapp.
    -   Basics:
        -   Publish: Code
        -   Runtime Stack: .NET 9
        -   Linux Plan: select your app service plan created above, asp-myapp
    -   Deployment:
        -   Select options to suit your requirements
    -   Networking:
        -   Enable public access: On
        -   Enable virtual network integration: Off
    -   Monitor & Secure:
        -   Enable Application Insights: Yes

-   Configure api-myapp:
    -   Settings - Environment Variables
        -   DOTNET_ENVIRONMENT = Development (or as required)
    -   Settings - Configuration
        -   Always on: On
    -   API - Cors
        -   Enable Access-Control-Allow-Credentials: Yes
        -   Allowed Origins:  [http://localhost:3000](http://localhost:3000/),  [http://localhost:3003](http://localhost:3003/), https://*.azurewebsites.net
    -   Monitoring - App Service logs
        -   Application Logging: File System
        -   Quote: 100
        -   Retention Period: 7

-   Create portal App Service (Web App), e.g. portal-myapp, in rg-myapp
    -   Basics:
        -   Publish: Code
        -   Runtime Stack: Node 22
        -   Linux Plan: select your app service plan created above, asp-myapp
    -   Deployment:
        -   Select options to suit your requirements
    -   Networking:
        -   Enable public access: On
        -   Enable virtual network integration: Off
    -   Monitor & Secure:
        -   Enable Application Insights: No

-   Configure portal-myapp:
    -   Settings - Configuration
        -   Startup Command:  `npm i -g http-server && node --max-http-header-size=80000 /usr/local/lib/node_modules/http-server/bin/http-server --proxy http://127.0.0.1:8080?`

-   Create PWA app App Service (Web App), e.g. app-myapp, in rg-myapp
    -   Basics:
        -   Publish: Code
        -   Runtime Stack: Node 22
        -   Linux Plan: select your app service plan created above, asp-myapp
    -   Deployment:
        -   Select options to suit your requirements
    -   Networking:
        -   Enable public access: On
        -   Enable virtual network integration: Off
    -   Monitor & Secure:
        -   Enable Application Insights: No

-   Configure app-myapp:
    -   Settings - Configuration
        -   Startup Command:  `npm i -g http-server && node --max-http-header-size=80000 /usr/local/lib/node_modules/http-server/bin/http-server --proxy http://127.0.0.1:8080?`

-   Database Configuration
    -   Tenant table:
        -   Where SiteAddress = localhost:3000, update as follows:
            -   SiteAddress =  [https://app-myapp.azurewebsites.net](https://app-myapp.azurewebsites.net/)
            -   AdminSiteAddress =  [https://portal-myapp.azurewebsites.net](https://portal-myapp.azurewebsites.net/)
            -   BlobStorageAddress =  [https://stgmyapp.blob.core.windows.net](https://stgmyapp.blob.core.windows.net/)
        -   Where SiteAddress = localhost:5001:
            -   SiteAddress =  [https://api-myapp.azurewebsites.net](https://api-myapp.azurewebsites.net/)
            -   BlobStorageAddress =  [https://stgmyapp.blob.core.windows.net](https://stgmyapp.blob.core.windows.net/)
    -   SystemSetting table:
        -   Where FullPath = General.Azure.BlobStorageConnection
            -   Value =  _set to the connection string from the storage account > Security + networking > Access keys_
        -   Run the following script, updating the values as required:  
            `UPDATE "SystemSetting" SET "Value" = REPLACE("Value",'http://localhost:3000','https://app-myapp.azurewebsites.net') WHERE "Value" ILIKE '%http://localhost:3000%';`  
            `UPDATE "SystemSetting" SET "Value" = REPLACE("Value",'http://localhost:3003','https://portal-myapp.azurewebsites.net') WHERE "Value" ILIKE '%http://localhost:3000%';`

-   Deploy Code  
    Deploy the code for the backend, portal, and app to the respective app services.
    -   When deploying the backend remember to update/replace values in appsettings.json as required, e.g. database connection string.
    -   When deploying the portal and app, remember to update all the settings.json files:
        -   graphQlApi =  [https://api-myapp.azurewebsites.net/graphql/](https://api-myapp.azurewebsites.net/graphql/)
        -   authApi =  [https://api-myapp.azurewebsites.net](https://api-myapp.azurewebsites.net/)
        -   themeUrl =  [https://stgmyapp.blob.core.windows.net/](https://stgmyapp.blob.core.windows.net/)....

-   Is it running?
    -   backend - navigate to  [https://api-myapp.azurewebsites.net/graphql](https://api-myapp.azurewebsites.net/graphql). If you're shown the GraphQL Playground and shown the schema then all is running fine.
    -   app & portal - should be shown the login screen. View the network calls to confirm requests to the backend are succeeding. There will be an "onlinecheck" call every few minutes.
