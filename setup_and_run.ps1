# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error 'Error: npm is not installed.'
    exit 1
}

# Install dependencies
Write-Output 'Installing dependencies...'
npm install

# Run the application
Write-Output 'Running the application...'
npm start