@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script configured for JDK 17
@REM ----------------------------------------------------------------------------

@if "%DEBUG%" == "" @echo off

set "JAVA_HOME=C:\Users\Dung2\.jdks\ms-17.0.19"
set "PATH=%JAVA_HOME%\bin;%PATH%"

set MAVEN_CMD_LINE_ARGS=%*
set MAVEN_EXECUTABLE=C:\Users\Dung2\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd

if exist "%MAVEN_EXECUTABLE%" (
  "%MAVEN_EXECUTABLE%" %MAVEN_CMD_LINE_ARGS%
) else (
  mvn %MAVEN_CMD_LINE_ARGS%
)
