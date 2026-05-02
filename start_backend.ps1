Write-Host "Cleaning up corrupted JDK..."
Remove-Item -Path "c:\Hackathon repo\SyncSpace\.tools" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "c:\Hackathon repo\SyncSpace\.tools" | Out-Null

Write-Host "Downloading fresh JDK 17. Please wait..."
Invoke-WebRequest -Uri "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse" -OutFile "c:\Hackathon repo\SyncSpace\.tools\jdk17.zip"

Write-Host "Extracting JDK..."
Expand-Archive -Path "c:\Hackathon repo\SyncSpace\.tools\jdk17.zip" -DestinationPath "c:\Hackathon repo\SyncSpace\.tools\" -Force

$javaExe = Get-ChildItem -Path "c:\Hackathon repo\SyncSpace\.tools" -Recurse -Filter "java.exe" | Select-Object -First 1
$jdkPath = $javaExe.Directory.Parent.FullName
Write-Host "Extracted JDK to: $jdkPath"

$env:JAVA_HOME = $jdkPath
$env:Path = "$jdkPath\bin;" + $env:Path

Write-Host "Starting Spring Boot Backend..."
Set-Location "c:\Hackathon repo\SyncSpace\backend"
.\mvnw clean spring-boot:run
