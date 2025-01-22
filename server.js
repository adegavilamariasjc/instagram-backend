const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Credenciais fornecidas
const CLIENT_ID = '613300014730651';
const CLIENT_SECRET = '8c98f5c73e66a5889bdea9a59c32328c';
const REDIRECT_URI = 'https://instagram-backend-cbpw.onrender.com/oauth/callback';

app.post('/api/validate', async (req, res) => {
  const { code } = req.body;

  try {
    // Trocar o código pelo access_token
    const tokenResponse = await axios.post('https://graph.facebook.com/v16.0/oauth/access_token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code
      }
    });

    const { access_token } = tokenResponse.data;

    // Obter informações do usuário no Instagram
    const userResponse = await axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`);
    const userId = userResponse.data.id;

    res.json({
      success: true,
      userId,
      username: userResponse.data.username,
      message: 'Acesso liberado! Aproveite o Wi-Fi.'
    });
  } catch (error) {
    console.error('Erro ao autenticar:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Erro ao processar a validação.' });
  }
});

app.listen(10000, () => console.log('Servidor rodando na porta 10000'));
