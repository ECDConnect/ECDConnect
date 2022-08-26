# Developer machine setup
These instructions are confirmed to work on a Mac OS, Linux and Windows. 

## Software reuqirements
- Docker Desktop
- pgAdmin 4
- Visual Studio Code / Visual Studio Community Edition (both are free)
- Insomnia / Postman API / Rest Client (a VS Code extension)
- Git 
- dotnet core sdk 3.1
After installing the above software the following configuration is required
### VS Code
On a Mac the `code` application is not in the PATH but if you press `Shift-Command-P`, and type `shell` into the command menu select `Install code in the PATH` command and this should do it for you.
### dotnet core sdk 3.1
You must install this specific version (make sure it's the SDK, and make sure it's the 3.1 version)

### dotnet-ef
The `dotnet-ef` tool is required for migrations. Install it with `dotnet tool install --global dotnet-ef`. This should add it to the PATH on windows.

It installs to `~/.dotnet/tools/dotnet-ef` so on a Linux/Mac machine you'll need to create a symlink if you don't want to type out this long name. Use the command `sudo ln -s ~/.dotnet/tools/dotnet-ef /usr/local/bin`. Test that it works!

### Docker
We will use a docker image for the postgres database server functionality.
- In the API folder of this repo find a file `docker-compose.yml`
- From the terminal while in this folder run command `docker-compose -f docker-compose.yml up`, this should give some messages about pulling images. When that's completed you should have a postgres server listening on port 5432, and an instance of adminer listening on port 8080. Adminer is a tool like PHPAdmin except it lets you manage more kinds of database serves. If you have something listening on port 8080 already, edit the docker-compose.yml file changing the applicable part to `<your-port>:8080`
- The docker compose file uses `postgres/admin` as the username and password combination. Do not change it.
- When the images are running go to http://localhost:8080 (your adminer instance) and use `172.18.0.1` as the address of the Postgres server. Other than the username/password you can leave everything else as is. Be sure to change the System to Postgress (by default it is MySQL)
- Confirming that all is good by establishing a succesful connection with the server through adminer.
- You may also use pgAdmin 4 instead of adminer.

### SSH keys
We suggest you use ssh keys to authenticate yourself to the bitbucket repo.
### Git
After cloning the repo in the root folder of the repo set
- `git config user.name "Your Name"`
- `git config user.email "Your bitbucket login email"`
### Visual Studio Code
There are number of recommended VS Code extensions. These are listed in the `api/.vscode/extensions.json` file but as VS Code sees this file it will prompt you to install them.
- REST Client - this extension let's you write http requests within the IDE in the form of text files you can then check in and share with your colleages.
- Docker - You'll only need this to check the earlier `docker-compose.yml` file if you ever make changes to it.
- VS Code solution Explorer - Not really required but it is useful if you want to view the .NET solution and project files logically and have access to special features to make working with these types of files easier.

### Insomnia /Postman/REST Client
The purpose of these tools are to enable you to make calls to the API. Note that some calls require you to generate a JWT and use this JWT to authenticate to protected calls.

## Startup
After installing the required software (and making sure the postgres server is avaialble) you need to make sure you have a working database with data in it. 

Go to the `src/api` folder. From here open VS Code, or open this folder in VS Code. Note that this folder becomes your workSpaceFolder.

Press `F5` and run the API (the tasks.json and lauch.json files have been included for this purpose). The purpose of this intial run is to trigger a migration which will create and seed the AspNet* tables as well as the Tenant table in the database `config-db`. Your browser should display a blank page at this point, use adminer and check that `config-db` exists on the server.

Now you must create the actual tenant database.

From the api folder run the following command `dotnet-ef database update  --project ./core-api/EcdLink.Api.CoreApi.csproj --content=AuthenticationDbContext`  
Then run
`dotnet ef database update --verbose --project ./core-api/EcdLink.Api.CoreApi.csproj --context=ContentManagementDbContext`
Alternatively run the attached sql file that inserts the CMS tables and seed data.

If you look now, you will see an `ecdconnect` database which contains a lot of domain-familiar tables. These tables are empty, so we need to seed them with test data.

If you look at `TenancyController` you'll see we have created a method called `seedTenant` which is triggered by the `GET` verb. The method is also anonymous. THIS METHOD MUST NOT BE AVAILABLE IN PRODUCTION!

As it is a `GET` method use either Insominia or such client or your browser to execute `localhost:5001/api/tenancy/seedTenant`. This will seed the database with test data. * Note, remember to comment out the [BasicAuth] on the TenancyController, Line 28

You can now confirm that all is good with the API by POSTing payload
```
{
	"username":"admin",
	"password":"Hello123!"
}
```
to http://localhost:5001/api/authentication/login This should return with a JWT, telling you that at least a test user with these credentials have been created.

Congrats. You may now run the react applications. 