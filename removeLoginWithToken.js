const fs = require('fs');
const path = './frontend/src/contexts/AuthContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const deadCode = `  const loginWithToken = async (token) => {
    const { data } = await api.get('/auth/me', {
      headers: { Authorization: \`Bearer \${token}\` }
    });
    const userInfo = { ...data, token };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  };`;

content = content.replace(deadCode, '');
content = content.replace("loginWithToken,", "");

fs.writeFileSync(path, content);
console.log('Removed loginWithToken');
