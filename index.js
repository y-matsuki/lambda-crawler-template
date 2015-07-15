var cheerio = require('cheerio-httpcli');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

var url = "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/ReleaseHistory.html";

exports.handler = function(event, context) {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  cheerio.setBrowser('chrome');
  cheerio.fetch(url, function (err, $, res) {
    var summary = {
      'header': res.headers,
      'doc-info': $.documentInfo(),
      'title': $('title').text(),
      'size': $('table').find('tbody').children().length
    }
    var changes = [];
    $('table').find('tbody').children().each(function (idx) {
      var apiVersion = $(this).children().eq(3).text().trim();
      if (apiVersion === "") {
        apiVersion = "-";
      }
      var change = {
        'change': $(this).children().eq(0).text().trim(),
        'release-date': $(this).children().eq(1).text().trim(),
        'api-version': apiVersion
      }
      changes.push(change);
    });
    summary.changes = changes;
    console.log(summary);

    var params = {};
    params.TableName = "lambda-crawler";
    params.Item = summary;
    dynamo.putItem(params, function(err, data){
      if (err) {
        context.fail(err);
      } else {
        delete params.Item;
        dynamo.scan(params, context.done);
      }
    });
  });
};
