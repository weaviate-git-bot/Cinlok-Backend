import wv from "weaviate-ts-client";

const weaviate = wv.client({
  scheme: "http",
  host: process.env.WEAVIATE_HOST || "localhost:8080",
});

export default weaviate;