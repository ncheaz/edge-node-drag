const { Parser } = require('json2csv');

const generateCSVFiles = (knowledgeAssets) => {
  try {
    if (knowledgeAssets.length === 0) {
      return null;
    }

    const fields = Object.keys(knowledgeAssets[0]);
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(knowledgeAssets);

    return csv;
  } catch (err) {
    console.error('Error generating CSV file:', err);
    throw err;
  }
};

module.exports = {
  generateCSVFiles
};