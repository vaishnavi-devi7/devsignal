const fs = require('fs');
const path = './frontend/src/contexts/AuthContext.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const loginWithToken = async (token) => {",
  "const exchangeAuthCode = async (code) => {\n    try {\n      const res = await axios.post(`${process.env.VITE_API_URL || 'http://localhost:5005/api'}/github/exchange-code`, { code });\n      const token = res.data.token;\n      localStorage.setItem('token', token);\n      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;\n      const userRes = await api.get('/auth/me');\n      setUser(userRes.data);\n      localStorage.setItem('userInfo', JSON.stringify(userRes.data));\n      return true;\n    } catch (error) {\n      console.error(error);\n      return false;\n    }\n  };\n\n  const loginWithToken = async (token) => {"
);

content = content.replace(
  "loginWithToken,",
  "loginWithToken,\n    exchangeAuthCode,"
);

fs.writeFileSync(path, content);
console.log('Patched AuthContext.jsx');
