import Constants from 'expo-constants';

// URL da API no render
const getApiUrl = (): string => {
    return Constants.expoConfig?.extra?.apiUrl || 'https://safehome-api.onrender.com';
};

export const API_CONFIG = {
    BASE_URL: getApiUrl(),
    TIMEOUT: 15000,
} as const;
