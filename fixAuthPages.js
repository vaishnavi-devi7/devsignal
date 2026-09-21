const fs = require('fs');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the second useAuth destructuring
  content = content.replace(
    /const \{ loginWithToken \} = useAuth\(\);/,
    "const { exchangeAuthCode } = useAuth();"
  );

  // Define the new block for processing 'code'
  const newBlock = `
    if (code) {
      setIsLoading(true);
      exchangeAuthCode(code)
        .then((success) => {
          if (success) {
            // Remove code from URL using history API to prevent reload
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/dashboard');
          } else {
            setErrors({ email: 'Failed to authenticate with GitHub. Please try again.' });
            setIsLoading(false);
            searchParams.delete('code');
            setSearchParams(searchParams);
          }
        })
        .catch(err => {
          setErrors({ email: 'Failed to authenticate with GitHub token' });
          setIsLoading(false);
          searchParams.delete('code');
          setSearchParams(searchParams);
        });
    }
  `;

  // Replace the old token block
  content = content.replace(
    /if\s*\(token\)\s*\{[\s\S]*?\}\s*\}\s*\}, \[/m,
    newBlock.trim() + "\n  }, ["
  );

  // Fix useEffect dependency array
  content = content.replace(
    /\[searchParams, loginWithToken, navigate, setSearchParams\]/,
    "[searchParams, exchangeAuthCode, navigate, setSearchParams]"
  );

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${filePath}`);
}

patchFile('./frontend/src/pages/Login.jsx');
patchFile('./frontend/src/pages/Register.jsx');
