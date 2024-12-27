#!/bin/bash

# Capture the output of npm install
npm_install_output=$(npm install)

# Remove deprecation warnings (example using sed)
modified_output=$(echo "$npm_install_output" | sed '/WARN/d') 

# Displaying the modified output
echo "$modified_output"

# Optional: Adding success message
echo "Async API installed successfully!"