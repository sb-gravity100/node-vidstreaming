@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "./bin/dist/index.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node "./bin/dist/index.js" %*
)
