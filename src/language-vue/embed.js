"use strict";

const docBuilders = require("../doc").builders;
const concat = docBuilders.concat;
const hardline = docBuilders.hardline;

function embed(path, print, textToDoc, options) {
  const node = path.getValue();
  const parent = path.getParentNode();
  if (!parent || parent.tag !== "root") {
    return null;
  }

  let parser;

  if (node.tag === "style") {
    const langAttr = node.attrs.find(attr => attr.name === "lang");
    if (!langAttr) {
      parser = "css";
    } else if (langAttr.value === "scss") {
      parser = "scss";
    } else if (langAttr.value === "less") {
      parser = "less";
    } else if (langAttr.value === "postcss") {
      parser = "css";
    }
  }

  if (node.tag === "script") {
    const langAttr = node.attrs.find(attr => attr.name === "lang");
    if (!langAttr) {
      parser = "babylon";
    } else if (langAttr.value === "ts") {
      parser = "typescript";
    }
  }

  if (!parser) {
    return null;
  }

  return concat([
    options.originalText.slice(node.start, node.contentStart),
    hardline,
    textToDoc(options.originalText.slice(node.contentStart, node.contentEnd), {
      parser
    }),
    options.originalText.slice(node.contentEnd, node.end)
  ]);
}

module.exports = embed;
