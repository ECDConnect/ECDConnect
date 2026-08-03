const { Client } = require('pg');
const axios = require('axios');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const CHANNEL = process.env.SLACK_CHANNEL || 'errors_ecdconnect';

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
    console.log('pg-notify: connected, listening on', CHANNEL);
    reconnectDelay = 1000; // reset backoff on success
    client.query(`LISTEN ${CHANNEL}`);
  });

  client.on('notification', async msg => {
    try {
      const payload = JSON.parse(msg.payload);
      if (payload.type === '') {
        return;
      }
      await sendToSlack(payload);
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

async function sendToSlack(payload) {
  const emoji = payload.severity === 'HIGH' && payload.message !== '' && payload.message !== 'Not Authorised' ? '🔴' : '🟠';
  const onlineStatus = payload.is_online === true ? '🟢 Online' 
    : payload.is_online === false ? '🔌 Offline' 
    : null;

  const message = {
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

  await axios.post(SLACK_WEBHOOK_URL, message, { timeout: 5000 });
}



module.exports = { startListener };