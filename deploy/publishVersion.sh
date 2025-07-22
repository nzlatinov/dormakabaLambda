#!/bin/bash
set -eu
export $(cat .env | xargs)

ZIP_FILE="function.zip"

# Build zip
cd dist
zip -r "../$ZIP_FILE" index.js ../node_modules > /dev/null
cd ..

echo "Updating Lambda"
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file "fileb://$ZIP_FILE" \
  --region "$REGION" \
  --output text >/dev/null

rm "$ZIP_FILE"

aws lambda wait function-updated \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION"

echo "Publishing version"
VERSION=$(aws lambda publish-version \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --query 'Version' \
  --output text)

echo "Updating alias"
aws lambda update-alias \
  --function-name "$FUNCTION_NAME" \
  --name latest \
  --function-version "$VERSION" \
  --region "$REGION" \
  --output text >/dev/null

echo "Alias 'latest' uses v: $VERSION"