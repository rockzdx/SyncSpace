$url = "http://localhost:8080/api/teams"
$maxRetries = 60
$retryCount = 0
$started = $false

Write-Host "Waiting for Spring Boot to start on port 8080..."

while (-not $started -and $retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/teams?userId=999" -Method Get -ErrorAction Stop
        $started = $true
        Write-Host "Spring Boot is UP!"
    } catch {
        Start-Sleep -Seconds 10
        $retryCount++
        Write-Host "Still waiting... ($retryCount/$maxRetries)"
    }
}

if (-not $started) {
    Write-Host "Backend failed to start after 10 minutes."
    exit 1
}

Write-Host "`n--- STARTING API TESTS ---`n"

$results = ""

try {
    # 1. Register User
    $userResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/register?username=bauhaus_admin&password=securepass&email=admin@bauhaus.design"
    $results += "### Test 1: Register User`n"
    $results += "```json`n" + ($userResponse | ConvertTo-Json -Depth 5) + "`n````n`n"
    
    # 2. Create Team
    $teamResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/teams?name=Design+System+Team&description=Implementing+Bauhaus&creatorId=$($userResponse.id)"
    $results += "### Test 2: Create Team`n"
    $results += "```json`n" + ($teamResponse | ConvertTo-Json -Depth 5) + "`n````n`n"

    # 3. Create Task
    $taskResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/teams/$($teamResponse.id)/tasks?creatorId=$($userResponse.id)&title=Setup+React+Colors&description=Add+Red+Blue+Yellow+hex+codes&priority=HIGH"
    $results += "### Test 3: Create Task`n"
    $results += "```json`n" + ($taskResponse | ConvertTo-Json -Depth 5) + "`n````n`n"

    # 4. Check Activity Log
    $activityResponse = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/teams/$($teamResponse.id)/activity"
    $results += "### Test 4: Verify Automatic Activity Log`n"
    $results += "```json`n" + ($activityResponse | ConvertTo-Json -Depth 5) + "`n````n`n"

    Out-File -FilePath "API_TEST_RESULTS.md" -InputObject $results -Encoding utf8
    Write-Host "Tests completed! Results written to API_TEST_RESULTS.md"

} catch {
    Write-Host "An API test failed: $_"
}
