# kodama

Google Home へ google-home-nitifier を利用して読み上げを行うツールです。

# kodama-sqs

AWS SQS を介してメッセージを受け取り読み上げます　、
Slack の Outbound Webhook に SQS を指定して利用します。

## Settings

### config.json

SQS の Queue の URL を指定します。

```
cat <<EOF >> config`u``.json
{
  "sqs_url": "https://sqs.us-east-1.amazonaws.com/************/slack-messages"
}
```

### credential.json

SQS を利用するための aws credential を記載します。

```
cat <<EOF >> credential.json
{
  "accessKeyId": "********************",
  "secretAccessKey": "****************************************"
}
EOF
```

## forever を利用して起動

```
node /usr/local/bin/forever start -p /home/pi/kodama/kodama-sqs.pid -l /home/pi/kodama/kodama-sqs.log -a -d /home/pi/kodama/kodama-sqs.js
```
