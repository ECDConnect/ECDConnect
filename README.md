# ECD Connect

ECD Connect supports practitioners and organizations to scale and deliver professional, high quality services to young children and caregivers in their communities.

ECD Connect is a license-free, customisable digital application designed with the support of behavioural scientists and ECD gurus.  
It is a crucial tool for the scale-up early childhood development programmers as per the government's stated goal of achieving universal access by 2030. The platform supports ECD practitioners in navigating some of the more cumbersome aspects of their jobs as identified by them through user research.

It can be used by independent, stand alone early childhood education practitioners and principals, or by organizations working in the broader ECD sector.

The platform is built as a Progressive Web Application with offline first capabilities.  The technology leverages the strengths of React and .NET.  It can be hosted in the cloud or on-prem.

## Core Tech Stack Summary

*   **Frontend PWA**: React, Redux, TypeScript
*   **Admin Portal Website**: React and Apollo Client
*   **Backend**: .NET 9 Core, GraphQL (Hot Chocolate), Entity Framework, PostgreSQL.

## 3rd Party Integrations

*   SMS Sending: [BulkSMS](https://www.bulksms.com/), [iTouch](https://itouch.co.za/), or [SMSPortal] (https://smsportal.com/)
*   Holidays: [RapidAPI](https://rapidapi.com/) - an API to get the South African Holidays for attendance tracking purposes etc
*   Analytics: [Google Analytics](https://analytics.google.com/),  [Google Tag Manager](https://tagmanager.google.com/) and [Google Data Studio](https://datastudio.google.com/) - for analytics, event tracking and reporting

## Offline Capability for the Frontend PWA

*   The App uses Service Workers and Redux to manage the offline capability.

## Core Features

*   Track attendance for learners
*   Progress Tracking and Observation Reports
*   Routine & Programme planning
*   Reports - Practitioner, Children and Attendance
*   User, Roles and Permission Management
*   White labelling and Theming
*   Multi-Language Content Management
*   Document Management

## Frontend PWA - Practitioner logins

*   User based logins that allow any Practitioner to sign up to the system using the Frontend PWA.

## Admin Portal - Administrator logins

*   User based logins that allow any Administrator to login, invite new users & maintain the system.

## Backend tech stack

*   [.NET 9](https://dotnet.microsoft.com/en-us/download/dotnet/9.0) using the following to function:
*   [Hot Chocolate](https://github.com/ChilliCream/hotchocolate) - A open-source GraphQL server
*   [Banana Cake Pop](https://chillicream.com/) - This provides a playground and documentation layer for easy reading of the GraphQL end points
*   [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
*   [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-9.0&tabs=visual-studio) for authentication and User management
*   [PostgreSQL](https://www.postgresql.org/) for the database

## Frontend PWA tech stack

*   [Ionic React](https://ionicframework.com/docs/react) using Functional components, to support possible future migration to a native mobile application
*   [Redux Toolkit](https://redux-toolkit.js.org/) for state management with persistence
*   [TypeScript](https://www.typescriptlang.org/) for improved syntax support
*   [Tailwind UI](https://tailwindui.com/) for Form layouts, tables, modal windows for clean & modern look
*   [heroicons](https://heroicons.com/) for SVG icons

## Admin Portal website tech stack

*   React using Functional components
*   Using [Apollo Client](https://www.apollographql.com/docs/react/) GraphQL for declarative data fetching
*   [Tailwind UI](https://tailwindui.com/) for Form layouts, tables, modal windows for clean & modern look
*   [heroicons](https://heroicons.com/) for SVG icons

## Hosting - Azure

*   Can be hosted with Azure using: PostgreSQL Flexible Server, Web Apps, Storage Accounts (Blob) and Application Insights.
*   Frontend, Admin Portal and API are all hosted as separate [Azure Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/)

## Hosting - On-prem

*   Can be hosted on-prem using PostgreSQL, IIS or Apache, File system for storage

## Security

*   SSL certificates are recommended for the respective, frontend, Admin Portal and API url's
*   [JWT](https://jwt.io/) tokens for authorisation with refresh endpoints

## Project Requirements

*   [Node](https://nodejs.org/en/download/) version ^20.19.2 or up
*   [Lerna](https://lerna.js.org/) installed for multiple package management,  
    `npm install --global lerna`
*   [Yarn](https://yarnpkg.com/) as an optional alternative to NPM,  
    `npm install --global yarn`
*   [.NET 9.0](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
*   [PostgreSQL Server](https://www.postgresql.org/) - version 13 or later.
*   [Visual Studio Code](https://code.visualstudio.com/) for frontend development.
*   [Visual Studio 2022 Community Edition](https://visualstudio.microsoft.com/vs/community/) for backend development.

## Development Setup

### Frontend
1.  Install VS Code
2.  Clone the repo.
3.  Install node 20.19.2 or later.
4.  In the **root folder**:   
    `npm install --global lerna`   
    `npm install --global yarn`
5.  Run `yarn` to update/install the packages.
6.  Run `yarn fixmodules` to correct modules using unsupported syntax
7.  Run `yarn bootstrap`.  This will install all packages for the sub packages and src projects.  After that it will  build the packages for use and add them to the node modules of the projects have them as dependencies.

### Backend 
1.  Install PostgreSQL and create a database, e.g. ecdconnect.  Run the **sqlscripts/database.sql** to create the initial database.
2.  Install VS 2022 Community Edition.
3.  VS solution file can be found in src/api.
4.  Update src/api/core-api/appsettings.json with the correct values for the database connection string.

## Run

### Backend
*   Start the PostgreSQL server
*   Using VS Studio run the solution. Verify that the browser page opens with the GraphQL schema.

### Frontend PWA

*   Ensure the backend is running
*   `yarn app` to run the Front End

### Admin Portal Website

*   Ensure the backend is running
*   `yarn portal` to run the Admin Portal


## Blob Storage

There are currently two storage types: Azure Blob Storage or File System.  
This is specified in the /src/api/core-api/appsettings.json file:  

    "Storage": {  
      "Type": "FileSystem",  
      "AzureBlob": {  
      },  
      "FileSystem": {  
        "Location": "\_Storage"  
      }  
    },  

Storage.Type can be either FileSystem or AzureBlob  
Storage.FileSystem.Location is the location for the file system store. This can be a rooted path, e.g. C:\\Storage or relative path.

If Type is FileSystem, the following configuration should also be applied:

*   Tenant table
    *   BlobStorageAddress should be the backend url, e.g. https://api.domain.co.za/storage or https://localhost:5001/storage
    *   ThemePath (if specified) should be be the backend url, e.g. https://api.domain.co.za/storage/theme/mytheme.json
*   Settings.json files
    *   themeUrl should be https://api.domain.co.za/storage/theme/mytheme.json

If Type is AzureBlob:

*   Tenant table
    *   BlobStorageAddress should be the blob storage url, e.g. https://mystorage.blob.core.windows.net
    *   ThemePath (if specified) should be be the backend url, e.g. https://mystorage.blob.core.windows.net/theme/mytheme.json
*   Settings.json files
    *   themeUrl should be https://mystorage.blob.core.windows.net/theme/mytheme.json

Make sure that all references for the storage url are correct:

*   ContentValue table  
    Check the Value column and update if necessary
*   Theme file  
    Make sure all urls to other files in the theme are correct.


## SMS Configuration

The platform sends smses for certain notifications.  To configure SMS capability values in the SystemSetting table need to be set.

### BulkSMS
*  Update `Notifications.SMSProviders.Sms.Provider` to `Notifications.SMSProviders.BulkSms`
*  Update the following rows:  
`Notifications.SMSProviders.BulkSms.BasicAuthToken`  
`Notifications.SMSProviders.BulkSms.Name`  
`Notifications.SMSProviders.BulkSms.TokenId`  
`Notifications.SMSProviders.BulkSms.TokenSecret`  

### SMSPortal
*  Update `Notifications.SMSProviders.Sms.Provider` to `Notifications.SMSProviders.SMSPortal`
*  Update the following rows:  
`Notifications.SMSProviders.SMSPortal.ApiKey`
`Notifications.SMSProviders.SMSPortal.ApiSecret`

### iTouch
*  Update `Notifications.SMSProviders.Sms.Provider` to `Notifications.SMSProviders.iTouch`
*  Update the following rows:  
`Notifications.SMSProviders.iTouch.Password`
`Notifications.SMSProviders.iTouch.Username`


## SMTP Configuration
To configure the system to allow for the sending of emails, edit the `Notifications.EmailProviders.Smtp.%` rows in SystemSetting table as required.


# Setting up the system in Azure
TODO

# Using the System
## Creating practitioner?
TODO

## Creating principal?
TODO
