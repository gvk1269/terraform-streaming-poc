import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import stream from "stream";
import util from "util";

const pipeline = util.promisify(stream.pipeline);

const s3 = new S3Client({ region: "us-east-1" });

export const handler = awslambda.streamifyResponse(
  async (event, responseStream, _context) => {
    const key = event.pathParameters?.key || "files/a.pdf";

    console.log("Streaming PDF from S3:", key);

    const s3Response = await s3.send(
      new GetObjectCommand({
        Bucket: "gvk-gcp-bucket-s3",
        Key: key
      })
    );

    const metadata = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`
      }
    };

    const httpResponseStream =
      awslambda.HttpResponseStream.from(responseStream, metadata);

    await pipeline(s3Response.Body, httpResponseStream);
  }
);
