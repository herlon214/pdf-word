const PDFParser = require('pdf2json')
const sw = require('stopword')
var natural = require('natural')
var tokenizer = new natural.WordTokenizer()
const latinize = require('latinize')
const fs = require('fs')
const files = fs.readdirSync('./data')

async function main () {
  let pdfParser = new PDFParser(this, 1);

  pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError) );
  pdfParser.on('pdfParser_dataReady', pdfData => {
    // Get raw content
    const content = pdfParser.getRawTextContent()

    // Tokenize the text
    let words = tokenizer.tokenize(latinize(content).toLowerCase())

    // Remove stopwords
    words = sw.removeStopwords(words, sw.pt)

    // Count the words
    const count = words.reduce((acc, item) => {
      if (!acc[item]) {
        acc[item] = 1
      } else {
        acc[item] += 1
      }

      return acc
    }, {})

    console.log(count)
  });

  pdfParser.loadPDF('./data/ciro.pdf');

}

main()