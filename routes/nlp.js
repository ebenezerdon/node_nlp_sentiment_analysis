const express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = require('natural');
const SW = require('stopword');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/s-analyzer', function(req, res, next) {
  /* NORMALIZATION */

  // negation handling
  // convert apostrophe=connecting words to lex form
  const lexedReview = aposToLexForm(req.body.review);

  // casing
  const casedReview = lexedReview.toLowerCase();

  // removing
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  // tokenize review
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  // remove stopwords
  const filteredReview = SW.removeStopwords(tokenizedReview);

  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

  const analysis = analyzer.getSentiment(filteredReview);

  console.log('------------------------------------');
  console.log(analysis);
  console.log('------------------------------------');

  // console.log('------------------------------------');
  // console.log(analyzer.getSentiment(['I', 'feel', 'good']));
  // console.log('------------------------------------');
  res.status(200).json({
    review: filteredReview.join(' ').toLowerCase(),
    analysis,
    error: 'none'
  });
});

module.exports = router;
