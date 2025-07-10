const express = require('express');
const axios = require('axios');
const app = express();


app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


app.post('/inbound', async (req, res) => {
  try {
    const tooljetWebhook = process.env.webhook_url;
    const bearerToken = process.env.token;

    const response = await axios.post(tooljetWebhook, req.body, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Forwarded:', response.status);
    res.status(200).send('Forwarded successfully');
  } catch (err) {
    console.error('❌ Error forwarding:', err.message);
    res.status(500).send('Forwarding failed');
  }
});

app.post('/sendgrid', async (req, res) => {
  try {
    const tooljetWebhook = process.env.TOOLJET_WEBHOOK_URL;
    const bearerToken = process.env.BEARER_TOKEN;

    console.log('📨 Incoming from SendGrid:', Object.keys(req.body));

    const response = await axios.post(tooljetWebhook, req.body, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Forwarded to ToolJet:', response.status);
    res.status(200).send('Received and forwarded');
  } catch (error) {
    console.error('❌ Error forwarding:', error.message);
    res.status(500).send('Error forwarding request');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));