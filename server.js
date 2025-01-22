const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

// Variáveis de ambiente (substitua pelos seus valores reais no Render)
const CLIENT_ID = process.env.CLIENT_ID || 'SEU_CLIENT_ID';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'SEU_CLIENT_SECRET';
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://SEU-BACKEND-NO-RENDER.com/oauth/callback';

// Endpoint para autenticar com Instagram
app.get('/oauth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
                code,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
            res.send('<h1>Acesso liberado! Aproveite o Wi-Fi.</h1>');
        } else {
            res.send('<h1>Erro ao autenticar no Instagram. Tente novamente.</h1>');
        }
    } catch (error) {
        console.error('Erro na autenticação:', error);
        res.status(500).send('<h1>Erro interno. Tente novamente.</h1>');
    }
});

// Endpoint para validar WhatsApp
app.post('/api/validate', (req, res) => {
    const { whatsapp } = req.body;

    if (!whatsapp || !/^\(\d{2}\) \d{5}-\d{4}$/.test(whatsapp)) {
        return res.status(400).json({ success: false, message: 'WhatsApp inválido!' });
    }

    res.json({ success: true, message: 'WhatsApp validado com sucesso!' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
