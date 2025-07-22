# in case of errors login to console and delete s3 objects, then delete stack if exists
export $(cat .env | xargs)
set -e

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws cloudformation deploy \
  --template-file "./deploy/stackTemplate.yaml" \
  --region "$REGION" \
  --stack-name "$STACK" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    TableName="$TABLE_NAME" \
    PrivateKeyId="$PRIVATE_KEY_ID" \
    BucketName="$BUCKET_NAME" \
    RoleName="$ROLE_NAME" \
    FunctionName="$FUNCTION_NAME" \
    PolicyName="$POLICY_NAME"

echo "Write certificate file to S3"
aws s3 cp ./assets/cert.pem s3://$BUCKET_NAME/cert.pem
