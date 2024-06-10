rem @echo off
setlocal
SET TEST_NUMBER_OF_USERS=%2
SET TEST_DURATION=600
set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%
set timestamp=%timestamp%-%TEST_NUMBER_OF_USERS%

set filename=%1
set filename=%filename:~0,-4%

echo Results in runs\%filename%-%timestamp%

if not exist ./runs md runs

md ".\runs\%filename%-%timestamp%"
SET TEST_RESPONSE_FAILED_FOLDER=".\runs\%filename%-%timestamp%\failed_responses"
md %TEST_RESPONSE_FAILED_FOLDER%


call "\Programs\apache-jmeter-5.6.3\bin\jmeter" -n -t %1 -l "runs\%filename%-%timestamp%\results.jtl" -e -o "runs\%filename%-%timestamp%\report"
