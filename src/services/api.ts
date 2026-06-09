import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '@constants/api';
import { STORAGE_KEYS } from '@constants/storage';



const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
});

// Antes de toda request sair daqui, esse código roda:
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync(STORAGE_KEYS.SECURE.AUTH_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('[api] Falha ao ler token do storage:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Quando a API responde, esse código roda antes do código que chamou:
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync(STORAGE_KEYS.SECURE.AUTH_TOKEN);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.SECURE.USER_ID);
            console.warn('[api] Token inválido ou expirado.');
        }
        return Promise.reject(error);
    }
);

export default api;
