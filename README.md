# lambda-crawler-template

## how to use

1. Clone and build this Lambda application and make zip package.
2. Deploy `lambda-crawler.zip` from AWS Management Console.
3. Create DynamoDB table `lambda-crawler`. HashKey is { S: title }

## how to make zip package

```
git clone https://github.com/yustam/lambda-crawler-template.git
cd lambda-crawler
npm install
npm run build
# lambda-crawler.zip
```
