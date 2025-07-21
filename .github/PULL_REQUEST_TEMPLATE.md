# Pull Request Template

## Description
Please provide a clear and concise description of the changes in this pull request. Include the purpose of the changes and any relevant context.

- **What does this PR do?** (e.g., Adds a new API endpoint for inventory management, updates Cloud SQL schema, or improves Cloud Storage file handling.)
- **Why is this change needed?** (e.g., Fixes a bug, enhances performance, or adds a feature.)

## Related Issues
Link any related GitHub issues or tickets (e.g., Closes #123).

## Changes
List the key changes made in this PR:
- Updated `.NET Core` version to 8.0 in `csproj`.
- Modified PostgreSQL queries in `DataAccessLayer.cs` for better performance.
- Added support for uploading files to GCP Cloud Storage in `FileService.cs`.
- Updated GitHub Actions workflow for deployment to Cloud Run.

## Testing
Describe how you tested these changes:
- Ran unit tests with `dotnet test` (e.g., 100% coverage for new API endpoints).
- Tested locally with PostgreSQL using `docker-compose`.
- Deployed to GCP Cloud Run staging environment and verified functionality.
- Checked Cloud Storage uploads via `gsutil` or GCP Console.

## Checklist
- [ ] Code follows project style guidelines.
- [ ] Unit tests added/updated and passed.
- [ ] Integration tests performed (e.g., PostgreSQL and Cloud Storage).
- [ ] Documentation updated (e.g., README, API docs).
- [ ] Deployed and verified in GCP staging environment.
- [ ] No sensitive information (e.g., credentials) committed.

## Additional Notes
Add any other relevant information, such as:
- Dependencies added (e.g., `Google.Cloud.Storage.V1` NuGet package).
- Potential impacts (e.g., database schema changes requiring migration).
- Screenshots or logs (if applicable, e.g., Cloud Run logs or API responses).

## Deployment Instructions (if applicable)
- Run `dotnet publish` and deploy to GCP Cloud Run using `gcloud run deploy`.
- Apply
