const fs = require('fs');
const path = './frontend/src/contexts/AuthContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldExchange = `  const exchangeAuthCode = async (code) => {
    try {
      const res = await api.post('/github/exchange-code', { code });
      const token = res.data.token;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      localStorage.setItem('userInfo', JSON.stringify(userRes.data));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };`;

const newExchange = `  const exchangeAuthCode = async (code) => {
    try {
      const res = await api.post('/github/exchange-code', { code });
      const token = res.data.token;
      
      // Temporarily store just the token in userInfo so api.js interceptor picks it up
      // for the /auth/me call
      localStorage.setItem('userInfo', JSON.stringify({ token }));
      
      const userRes = await api.get('/auth/me');
      
      // Now store the full userInfo with the token
      const fullUserInfo = { ...userRes.data, token };
      setUser(fullUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(fullUserInfo));
      
      return true;
    } catch (error) {
      console.error(error);
      localStorage.removeItem('userInfo');
      return false;
    }
  };`;

content = content.replace(oldExchange, newExchange);

fs.writeFileSync(path, content);
console.log('Fixed AuthContext.jsx session mechanism');
