/**
 * Remove TOC from the given specification in the website repo
 *
 * @param {string} givenSpec 
 */
module.exports = (givenSpec) => {
  const fs = require("fs");

  const startingLine = "## Table of Contents\n";
  const endingLine = "<!-- /TOC -->\n";

  const specFile = fs.readFileSync(`./website/pages/docs/reference/specification/${givenSpec}.md`);

  const startingIndex = specFile.indexOf(startingLine);
  const endingIndex = specFile.indexOf(endingLine);

  if (startingIndex === -1 || endingIndex === -1) {
    console.log("TOC not found");
    return;
  }
  const firstHalf = specFile.slice(0, startingIndex);
  const secondHalf = specFile.slice(endingIndex + endingLine.length);
  const specWithoutToc = `${firstHalf}${secondHalf}`;
  fs.writeFileSync(`./website/pages/docs/reference/specification/${givenSpec}.md`, specWithoutToc);
}
