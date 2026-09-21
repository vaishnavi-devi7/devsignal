const fs = require('fs');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add useRef import
  if (!content.includes('useRef')) {
    content = content.replace("import { useEffect } from 'react';", "import { useEffect, useRef } from 'react';");
  }

  // Add ref declaration
  if (!content.includes('exchangeAttempted')) {
    content = content.replace("const [searchParams, setSearchParams] = useSearchParams();", "const [searchParams, setSearchParams] = useSearchParams();\n  const exchangeAttempted = useRef(false);");
  }

  const oldBlock = `    if (code) {
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

  const newBlock = `    if (code && !exchangeAttempted.current) {
      exchangeAttempted.current = true;
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
  fs.writeFileSync(filePath, content);
  console.log(`Patched ${filePath}`);
}

patchFile('./frontend/src/pages/Login.jsx');
patchFile('./frontend/src/pages/Register.jsx');
