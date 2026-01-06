data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "streaming_lambda" {
  function_name = "${var.project_name}-streaming-lambda"
  role          = aws_iam_role.lambda_exec_role.arn
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  filename      = data.archive_file.lambda_zip.output_path

  timeout      = 30
  memory_size = 512
}

resource "aws_lambda_function_url" "stream_url" {
  function_name      = aws_lambda_function.streaming_lambda.function_name
  authorization_type = "NONE"
  invoke_mode        = "RESPONSE_STREAM"
}

resource "aws_lambda_permission" "allow_function_url" {
  statement_id              = "AllowFunctionURL"
  action                    = "lambda:InvokeFunctionUrl"
  function_name             = aws_lambda_function.streaming_lambda.function_name
  principal                 = "*"
  function_url_auth_type    = "NONE"
}