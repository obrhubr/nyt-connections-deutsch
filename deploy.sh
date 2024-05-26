#!/bin/bash

# Define file paths
JSON_FILE="./.env"
JS_FILE="./scripts/db.js"

# Use sed to replace 'let hosted = false;' with 'let hosted = true;'
sed -i 's/let hosted = false;/let hosted = true;/g' "$JS_FILE"

# Read JSON content from the JSON file
JSON_CONTENT=$(cat "$JSON_FILE")
SCRIPT_CONTENT=$(cat "$JS_FILE")

# Write the JSON content into the JavaScript file as a variable
echo "$JSON_CONTENT" > "$JS_FILE"
echo "$SCRIPT_CONTENT" >> "$JS_FILE"

# execute the hosting command
firebase deploy

# rewrite the script without the keys
echo "$SCRIPT_CONTENT" > "$JS_FILE"

# Use sed to replace 'let hosted = true;' with 'let hosted = false;'
sed -i 's/let hosted = true;/let hosted = false;/g' "$JS_FILE"