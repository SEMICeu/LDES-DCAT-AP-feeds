import * as fs from 'fs';
import arrayifyStream from "arrayify-stream";
import N3 from "n3";
import got from "got-cjs";

async function main() {
  const parser = new N3.StreamParser();
  const store = new N3.Store();
  const shape = fs.createReadStream("../shape.ttl");
  shape.pipe(parser);
  store.addQuads(await arrayifyStream(parser));

  // Check for owl:imports and add the imported quads to the store
  let imports = store.getQuads(null, "http://www.w3.org/2002/07/owl#imports", null, null);
  while (imports.length > 0) {
    for (const quad of imports) {
      // Import the file
      const importUrl = quad.object.value;
      const importParser = new N3.StreamParser();
      got.stream(importUrl).pipe(importParser);
      store.addQuads(await arrayifyStream(importParser));

      // Remove that owl:imports quad
      store.removeQuad(quad);
    }
    imports = store.getQuads(null, "http://www.w3.org/2002/07/owl#imports", null, null);
  }


  // Add all quads to the writer
  const writer = new N3.Writer(fs.createWriteStream('../shape.ttl'), {
    prefixes: {
      dcatapfeeds: "https://semiceu.github.io/LDES-DCAT-AP-feeds/shape.ttl#",
      sh: "http://www.w3.org/ns/shacl#",
      owl: "http://www.w3.org/2002/07/owl#",
      as: "https://www.w3.org/ns/activitystreams#",
      dcatap: "http://data.europa.eu/r5r/shacl_shapes#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      vcard: "http://www.w3.org/2006/vcard/ns#",
    }
  });
  for (const quad of store) {
    writer.addQuad(quad);
  }
  writer.end();
}

main().catch(console.error);
