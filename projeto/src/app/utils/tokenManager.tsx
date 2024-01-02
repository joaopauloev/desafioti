import axios from 'axios';

interface Tokens {
  access_token: string;
  refresh_token: string;
}

export const setTokens = (tokens: Tokens): void => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

export const getAccessToken = (): string | undefined => {
  const tokens = JSON.parse(localStorage.getItem('tokens') || '{}') as Tokens;
  return tokens.access_token;
};

export const getRefreshToken = (): string | undefined => {
  const tokens = JSON.parse(localStorage.getItem('tokens') || '{}') as Tokens;
  return tokens.refresh_token;
};

export const updateAccessToken = async (): Promise<string | undefined> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post('https://api.escuelajs.co/api/v1/auth/refresh-token', { refreshToken });
    setTokens(response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Error updating access token:', error);
    return undefined;
  }
};
