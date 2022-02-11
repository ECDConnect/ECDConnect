# Headless API

## Dependancies

- [PostgreSQL Server](https://www.postgresql.org/) - installed on your local PC as a database server
- [.Net Core 3.1](https://dotnet.microsoft.com/en-us/download/dotnet/3.1) API using the following to
  function:
- [Hot Chocolate](https://github.com/ChilliCream/hotchocolate) - A open-source GraphQL server
- [Banana Cake Pop](https://chillicream.com/) - This provides a playground and documentation layer
  for easy reading of the GraphQL end points
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-6.0&tabs=visual-studio)
  for authentication and User management
- [Azure Blob Storage](https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/implementation/key-storage-providers?view=aspnetcore-3.1&tabs=visual-studio#azure-storage) for uploading documentation

## Installation

- Start the PostgreSQL server
- Using Visual Studio, run the solution to get the NuGet packages and build the solution
- To generate a tenant, make a POST to the tenant endpoint (`https://[domain]/api/tenancy` or
  `https://localhost:5001/api/tenancy`), using Basic Authentication (the defaults are inside the
  authentication seed file, `ECDLink.PostgresTenancy.Configuration.Setup.Seed`) with the following
  request format:
  ```
  { 
    "SiteAddress": "{domain}",
    "ApplicationName": "{applicationName}",
    "OrganisationName": "{organizationName}",
    "ConnectionString": "{Db Connection string}",
    "DbProvider": "{postgresql}" 
   }
  ```

## Usage

### GraphQL
- Refer to the [Chillicream docs](https://chillicream.com/docs/hotchocolate/get-started) for the
  GraphQL instructions
- As a guide, the API url will have an endpoint that you can use to see the schema and available
  queries. For example, `http://localhost:5001/graphql`, next to the Documents heading, select a new
  Document, then select the **Schema Reference**.
- To run test queries you will first require a JWT token for authentication. To get a JWT token make
  a POST request to the login API to get the JWT, `https://localhost:5001/api/authentication/login`.
- Refer to [this guide](https://graphql.org/learn/) that walks you through the basic concepts of
  GraphQL

### EF Core + Database (Postgres)
- GraphQL will automatically generate endpoints for entities that implement the "EntityBase" class
- When making a change to or updating Entities, make sure add-migration `{migration name}` -Context "`{dbContext}`" is run
- Migrations can be run against tenant databases by making a PUT to `https://[domain]/api/tenancy/{tenantId}` or
  `https://localhost:5001/api/tenancy/{tenantId}`
- There are 3 Database contexts
    - AuthenticationDbContext : Main Tenant Database context
    - TenancyDbContext : Separate Database and context for multi-tenancy
    - ContentManagementDbContext : Separate Context, but still uses the main tenant database for separation
- Only provide the master Tenancy Database connection string in the ```appsettings.json```
- (See guide above on how to create a tenant)

### Tenancy
- The API is multi-tenant ready. This is achieved through a middleware that will assign a TenantExecutionContext for the duration of the request.
- This context is used to change the DB connection strings AND cache settings.
- For a single tenant on a single domain, seed a tenant and set their ```siteaddress``` to the domain name.
- Tenants on a develop environment will be seeded with mock data

## Security
- GraphQL API is secured through JWT
- Login APIs are open without security
- Invitations are secured through custom token validation on request
- Partially open APIs are secured through custom token validation
- To restrict data view permissions, user types have a top-down structure
    - Users can only see any other user they create or invite
    - Exceptions are users with the "Administrator" user type, they can see everything
- Make use of the ```Hierarchy Engine``` to control this aspect of the application

## Redirect
- A Small URL shortner has been incorporated into this application.
- ShortUrls can be automatically configured on the template by tagging a field with ```:shorturl```
- A short url will need to be cleaned up once satisfied with the consumption

### Jobs
- Cron jobs are available through ```IHostedService``` and can be configured on the Startup.Jobs class.
- These jobs are configured to run only when the server is in Production mode.
- As these are hosted services, the web app will need to be "ALWAYS ON". Should the web server "sleep", these jobs will not execute.

### Message Templating
- The message template uses an override to parse the message and replace anything between the tags ``[[`` and ``]]``

### Content Management
- Dynamic content generation is supported in the system
- There are only a handful of types we currently support, this can be extended.
    - See ```ContentFeildType``` for full list
- Content Models are described in the ContentManagementDbContext through 
    - ContentType Describes the object
    - ContentTypeFeilds Describes the ```properties``` of the object
- Content is describe through
    - Content contains the reference to the ContentType
    - ContentValue contains the reference to ContentFields and the values for each of the fields
- Content is supported in multiple languages by flagging the ContentValue in a specific langauge

## Future Features
- Refresh cache when settings are updated through graph API (i.e system settings)
- Add pipeline to graph save that can be intercept to add above
- Update Content Management to allow reference of in DB table items
- Add Content Items to a cache for faster object creation and querying
- Unit Tests
- Extend Hierarchy to allow for custom role usage

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)