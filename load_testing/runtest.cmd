@echo off
setlocal
IF x%1x==xx GOTO HELP
SET TEST_NUMBER_OF_USERS=%2
SET TEST_DURATION=%3
SET TEST_API_URL=%4
SET TEST_APP_URL=%5
SET TEST_LOOP_COUNT=%6
SET TEST_RAMP_UP_PERIOD=%7
set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%
set timestamp=%timestamp%-%TEST_NUMBER_OF_USERS%

if x%TEST_LOOP_COUNT%x==xx SET TEST_LOOP_COUNT=100000
if x%TEST_RAMP_UP_PERIOD%x==xx SET TEST_RAMP_UP_PERIOD=20

set filename=%1
set filename=%filename:~0,-4%

echo Results in runs\%filename%-%timestamp%

if not exist ./runs md runs

md ".\runs\%filename%-%timestamp%"
SET TEST_RESPONSE_FAILED_FOLDER=".\runs\%filename%-%timestamp%\failed_responses"
md %TEST_RESPONSE_FAILED_FOLDER%


call "\Programs\apache-jmeter-5.6.3\bin\jmeter" -n -t %1 -l "runs\%filename%-%timestamp%\results.jtl" -e -o "runs\%filename%-%timestamp%\report"

GOTO END

:HELP
echo.
echo USAGE:
echo %0 TESTFILE NUMBER_OF_USERS DURATION API_URL APP_URL [LOOP_COUNT [RAMP_UP_PERIOD]]
echo.
echo Example:
echo %0 test-practitioner-login-load.jmx 1 60 api.staging.ecdconnect.co.za whitelabel.staging.ecdconnect.co.za
echo.
GOTO END


:END
