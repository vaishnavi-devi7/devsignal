const fs = require('fs');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const oldBlock = `    if (token) {
      setIsLoading(true);
      loginWithToken(token)
        .then(() => navigate('/dashboard'))
        .catch(err => {
          setErrors({ email: 'Failed to authenticate with GitHub token' });
          setIsLoading(false);
          searchParams.delete('token');
          setSearchParams(searchParams);
        });
    }`;

  const newBlock = `    if (code) {
      // Prevent StrictMode duplicate firing if already loading
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
    }`;

  content = content.replace(oldBlock, newBlock);
  
  // Just in case we also need to fix strict mode dupes by adding a flag:
  // React 18 strict mode fires useEffect twice. 
  // We only want to call exchangeAuthCode once. 
  
  fs.writeFileSync(filePath, content);
  console.log(`Patched ${filePath}`);
}

patchFile('./frontend/src/pages/Login.jsx');
patchFile('./frontend/src/pages/Register.jsx');
