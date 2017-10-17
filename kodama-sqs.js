//モジュールの読み込み
var googlehome = require('google-home-notifier');
var aws = require('aws-sdk');

// AWS Settings 
aws.config.loadFromPath('credentials.json');
aws.config.update({region: 'ap-northeast-1'});

// 外部設定ファイル
var ini = require('./config.json');
var url = ini.sqs_url

var sqs = new aws.SQS();

// 取得するメッセージの上限
var limit = 100;

// Google Home Settings
googlehome.device('Google Home', 'ja');
googlehome.ip('192.168.10.4');
googlehome.accent('ja');

console.log('start');

//メイン処理
exports.handler = function (event) {
  var cnt = 0;
  var params = {
        QueueUrl: url,
        MaxNumberOfMessages: 10
      };

  sqs.receiveMessage(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else if (data.Messages) {
      const promises = data.Messages.map((message) => {
        console.log(message);
        console.log(message.Body);

        // Slack のメッセージを取り出し
        json = JSON.parse(message.Body);

        // Google Home 呼び出し
        googlehome.notify(json.text, function(res) {
         console.log(res);
        });

        // Queue からの削除
        var params = {
            QueueUrl: url,
            ReceiptHandle: message["ReceiptHandle"]
        };
        sqs.deleteMessage(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
      });
    };
  });
};

setInterval(function() {
  exports.handler();
}, 60000);
