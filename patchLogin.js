const fs = require('fs');
const path = './frontend/src/pages/Login.jsx';
let content = fs.readFileSync(path, 'utf8');

// Imports
content = content.replace("import { Link, useNavigate } from 'react-router-dom';", "import { Link, useNavigate, useSearchParams } from 'react-router-dom';\nimport { useEffect } from 'react';\nimport api from '../lib/api';");

// Inside Component
const useEffectStr = `
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      let errorMsg = 'GitHub login failed';
      if (error === 'no_email') errorMsg = 'Your GitHub account must have a verified email.';
      setErrors({ email: errorMsg });
      searchParams.delete('error');
      setSearchParams(searchParams);
    }

    if (token) {
      setIsLoading(true);
      loginWithToken(token)
        .then(() => navigate('/dashboard'))
        .catch(err => {
          setErrors({ email: 'Failed to authenticate with GitHub token' });
          setIsLoading(false);
          searchParams.delete('token');
          setSearchParams(searchParams);
        });
    }
  }, [searchParams, loginWithToken, navigate, setSearchParams]);

  const handleGithubAuth = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/github/login');
      window.location.href = res.data.url;
    } catch (err) {
      setErrors({ email: 'Failed to initiate GitHub login' });
      setIsLoading(false);
    }
  };
`;

content = content.replace("const [errors, setErrors] = useState({});", "const [errors, setErrors] = useState({});\n  const { loginWithToken } = useAuth();\n" + useEffectStr);

content = content.replace("onClick={() => {}}", "onClick={handleGithubAuth}");

fs.writeFileSync(path, content);
console.log('Patched Login.jsx');
