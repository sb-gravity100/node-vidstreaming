@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "./dist/bin/index.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node "./dist/bin/index.js" %*
)
