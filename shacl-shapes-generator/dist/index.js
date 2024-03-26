"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const n3_1 = __importDefault(require("n3"));
const got_cjs_1 = __importDefault(require("got-cjs"));
async function main() {
    const parser = new n3_1.default.StreamParser();
    const store = new n3_1.default.Store();
    const shape = fs.createReadStream("../shape.ttl");
    shape.pipe(parser);
    store.addQuads(await (0, arrayify_stream_1.default)(parser));
    // Check for owl:imports and add the imported quads to the store
    let imports = store.getQuads(null, "http://www.w3.org/2002/07/owl#imports", null, null);
    while (imports.length > 0) {
        for (const quad of imports) {
            // Import the file
            const importUrl = quad.object.value;
            const importParser = new n3_1.default.StreamParser();
            got_cjs_1.default.stream(importUrl).pipe(importParser);
            store.addQuads(await (0, arrayify_stream_1.default)(importParser));
            // Remove that owl:imports quad
            store.removeQuad(quad);
        }
        imports = store.getQuads(null, "http://www.w3.org/2002/07/owl#imports", null, null);
    }
    // Add all quads to the writer
    const writer = new n3_1.default.Writer(fs.createWriteStream('../shape.ttl'), {
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
//# sourceMappingURL=index.js.map