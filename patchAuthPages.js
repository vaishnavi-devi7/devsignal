const fs = require('fs');
const files = ['./frontend/src/pages/Login.jsx', './frontend/src/pages/Register.jsx'];

for (const path of files) {
  let content = fs.readFileSync(path, 'utf8');
  
  // Replace useAuth destructured methods
  content = content.replace(
    /const \{ login, loginWithToken \} = useAuth\(\);/,
    "const { login, loginWithToken, exchangeAuthCode } = useAuth();"
  );
  content = content.replace(
    /const \{ register, loginWithToken \} = useAuth\(\);/,
    "const { register, loginWithToken, exchangeAuthCode } = useAuth();"
  );

  // Replace token with code logic
  content = content.replace(
    /const token = searchParams\.get\('token'\);/,
    "const code = searchParams.get('code');"
  );

  content = content.replace(
    /if \(token\) \{[\s\S]*?loginWithToken\(token\)[\s\S]*?navigate\('\/dashboard'\);[\s\S]*?\} catch \(err\) \{[\s\S]*?setError\('GitHub authentication failed\. Please try again\.'\);[\s\S]*?\}[\s\S]*?\}/,
    `if (code) {
      const handleCode = async () => {
        const success = await exchangeAuthCode(code);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('GitHub authentication failed. Please try again.');
        }
      };
      handleCode();
    }`
  );

  fs.writeFileSync(path, content);
}
console.log('Patched auth pages');
