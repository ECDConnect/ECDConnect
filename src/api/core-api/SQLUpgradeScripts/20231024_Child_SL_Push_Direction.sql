UPDATE public."IntegrationColumnMapping"
	SET "UpdateDirection"='Both'
	AND "ColumnValidationLimit" = 13
	WHERE  "LocalColumn" = 'DateOfBirth' and "RemapEntity" = 'Child';