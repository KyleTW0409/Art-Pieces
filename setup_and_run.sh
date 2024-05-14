if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi

# Install dependencies
echo 'Installing dependencies...'
npm install

# Run the application
echo 'Running the application...'
npm start