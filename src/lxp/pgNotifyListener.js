const { Client } = require('pg');
const axios = require('axios');

// One entry per pg_notify channel this listener handles: which webhook to post
// to, and how to turn that channel's payload shape into a Slack message.
const CHANNELS = [
  {
    name: process.env.SLACK_CHANNEL || 'errors_ecdconnect',
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
    buildMessage: buildErrorMessage,
    shouldSkip: payload => payload.type === '',
  },
  {
    name: process.env.SLACK_CHANNEL_RESOURCES || 'user_resource_problem_report',
    webhookUrl: process.env.SLACK_WEBHOOK_URL_RESOURCES,
    buildMessage: buildResourceProblemMessage,
  },
];

let client;
let reconnectDelay = 1000; // starts at 1s, backs off up to 30s

function startListener() {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    // Azure Postgres usually requires SSL
    ssl: { rejectUnauthorized: false },
  });

  client.connect(err => {
    if (err) {
      console.error('pg-notify: connection failed', err);
      return scheduleReconnect();
    }
    reconnectDelay = 1000; // reset backoff on success
    CHANNELS.forEach(({ name }) => {
      console.log('pg-notify: connected, listening on', name);
      client.query(`LISTEN ${name}`);
    });
  });

  client.on('notification', async msg => {
    try {
      const channel = CHANNELS.find(c => c.name === msg.channel);
      if (!channel) {
        return;
      }
      const payload = JSON.parse(msg.payload);
      if (channel.shouldSkip && channel.shouldSkip(payload)) {
        return;
      }
      await sendToSlack(channel.webhookUrl, channel.buildMessage(payload));
    } catch (err) {
      console.error('pg-notify: failed to handle notification', err);
    }
  });

  // Azure will occasionally drop idle connections — always be ready to reconnect
  client.on('error', err => {
    console.error('pg-notify: client error, reconnecting...', err.message);
    scheduleReconnect();
  });

  client.on('end', () => {
    console.warn('pg-notify: connection ended, reconnecting...');
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  setTimeout(() => {
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
    startListener();
  }, reconnectDelay);
}

function buildErrorMessage(payload) {
  const emoji = payload.severity === 'HIGH' && payload.message !== '' && payload.message !== 'Not Authorised' ? '🔴' : '🟠';
  const onlineStatus = payload.is_online === true ? '🟢 Online'
    : payload.is_online === false ? '🔌 Offline'
    : null;

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${emoji} *${payload.severity}* — \`${payload.type}\`${payload.endpoint ? ` — \`${payload.endpoint}\`` : ''}\n${payload.message}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: [
              payload.client_url ? `*URL:* ${payload.client_url}` : null,
              payload.app_version ? `*Version:* ${payload.app_version}` : null,
              onlineStatus ? `*Status:* ${onlineStatus}` : null,
              payload.user_id ? `*User:* ${payload.user_id}` : null,
              `*Time:* ${payload.event_date}`,
            ].filter(Boolean).join('  •  '),
          },
        ],
      },
    ],
  };
}

function buildResourceProblemMessage(payload) {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🚩 *Resource Problem Report* — \`${payload.problemType}\`${payload.contentId ? ` — \`${payload.contentId}\`` : ''}${payload.additionalDetails ? `\n${payload.additionalDetails}` : ''}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: [
              payload.userId ? `*User:* ${payload.userId}` : null,
              payload.tenantId ? `*Tenant:* ${payload.tenantId}` : null,
              payload.dataFreeAtReport !== null && payload.dataFreeAtReport !== undefined ? `*Data Free:* ${payload.dataFreeAtReport}` : null,
              payload.linkAtReport ? `*Link:* ${payload.linkAtReport}` : null,
              `*Time:* ${payload.insertedDate}`,
            ].filter(Boolean).join('  •  '),
          },
        ],
      },
    ],
  };
}

async function sendToSlack(webhookUrl, message) {
  if (!webhookUrl) {
    console.warn('pg-notify: no webhook URL configured for this channel, skipping send');
    return;
  }
  await axios.post(webhookUrl, message, { timeout: 5000 });
}



module.exports = { startListener };