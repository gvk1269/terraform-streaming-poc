export const handler = async (event, responseStream) => {
  const encoder = new TextEncoder();
  responseStream.write(encoder.encode("Streaming test\n"));
  responseStream.end();
};