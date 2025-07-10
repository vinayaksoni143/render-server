const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json({ limit: '10mb' }));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));