# Charger les variables d'environnement depuis le fichier .env
Get-Content "$PSScriptRoot\..\.env" | ForEach-Object {
    if ($_ -notmatch '^#' -and $_ -match '(.+)=(.+)') {
        $name = $matches[1]
        $value = $matches[2]
        [System.Environment]::SetEnvironmentVariable($name, $value)
    }
}

# Vérifier que le port NGINX est défini
if (-not $env:NGINX_PORT) {
    Write-Host "Le port NGINX n'est pas défini dans le fichier .env"
    exit 1
} else {
    Write-Host "NGINX va écouter sur le port $env:NGINX_PORT"

    if (-not (Test-Path "$PSScriptRoot\Temp")) {
        New-Item -ItemType Directory -Path "$PSScriptRoot\Temp"
    }

    # Copier le fichier de configuration
    Copy-Item -Path "$PSScriptRoot\nginx.conf" -Destination "$PSScriptRoot\Temp\nginx.conf"

    if (-not (Test-Path "$PSScriptRoot\conf")) {
        New-Item -ItemType Directory -Path "$PSScriptRoot\conf"
    }

    if (-not (Test-Path "$PSScriptRoot\logs")) {
        New-Item -ItemType Directory -Path "$PSScriptRoot\logs"
    }

    # Remplacer LISTEN_PORT dans le fichier temporaire
    (Get-Content "$PSScriptRoot\Temp\nginx.conf") -replace "LISTEN_PORT", $env:NGINX_PORT | Set-Content "$PSScriptRoot\conf\nginx.conf"
}

# Lancer NGINX
Start-Process -FilePath "$PSScriptRoot\nginx.exe" -ArgumentList "-g", "`"daemon off;`"" -NoNewWindow -Wait
