const PDFParser = require('pdf2json')
const sw = require('stopword')
const natural = require('natural')
const tokenizer = new natural.WordTokenizer()
const TfIdf = natural.TfIdf
const tfidf = new TfIdf()
const latinize = require('latinize')
const fs = require('fs')
const files = fs.readdirSync('./data')

async function main () {
  files.forEach(file => {
    let pdfParser = new PDFParser(this, 1);

    pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError) );
    pdfParser.on('pdfParser_dataReady', async pdfData => {
      console.log(`File ${file}...`)
      // Get raw content
      const content = pdfParser.getRawTextContent()

      // Tokenize the text
      let words = tokenizer.tokenize(latinize(content).toLowerCase())

      // Remove stopwords
      words = sw.removeStopwords(words, sw.pt)

      // Word content used to tf-idf
      tfidf.addDocument(words.join(' '))

      // Count the words
      words = words.reduce((acc, item) => {
        if (!acc[item]) {
          acc[item] = 1
        } else {
          acc[item] += 1
        }

        return acc
      }, {})

      // Convert object to array
      words = Object.keys(words).reduce((acc, item) => {
        acc.push([item, words[item]])

        return acc
      }, [])

      words = words.sort((a, b) => b[1] - a[1])

      console.log(words.splice(0, 10))
    });

    pdfParser.loadPDF('./data/' + file);
  })
}

main()