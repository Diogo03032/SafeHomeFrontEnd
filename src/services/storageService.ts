import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '@constants/storage';

const isWeb = Platform.OS === 'web';

// ===== Helpers internos que decidem qual storage usar =====

const secureSet = async (key: string, value: string): Promise<void> => {
    if (isWeb) {
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

const secureGet = async (key: string): Promise<string | null> => {
    if (isWeb) {
        return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
};

const secureDelete = async (key: string): Promise<void> => {
    if (isWeb) {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

export const saveAuthToken = async (token: string): Promise<void> => {
    await secureSet(STORAGE_KEYS.SECURE.AUTH_TOKEN, token);
};

export const getAuthToken = async (): Promise<string | null> => {
    return secureGet(STORAGE_KEYS.SECURE.AUTH_TOKEN);
};

export const saveUserId = async (userId: number): Promise<void> => {
    await secureSet(STORAGE_KEYS.SECURE.USER_ID, String(userId));
};

export const getUserId = async (): Promise<number | null> => {
    const id = await secureGet(STORAGE_KEYS.SECURE.USER_ID);
    return id ? parseInt(id, 10) : null;
};

export const clearAuth = async (): Promise<void> => {
    await secureDelete(STORAGE_KEYS.SECURE.AUTH_TOKEN);
    await secureDelete(STORAGE_KEYS.SECURE.USER_ID);
};

export const setPreference = async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
};

export const getPreference = async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
};

export const setBoolPreference = async (key: string, value: boolean): Promise<void> => {
    await AsyncStorage.setItem(key, value ? 'true' : 'false');
};

export const getBoolPreference = async (key: string, defaultValue: boolean = false): Promise<boolean> => {
    const v = await AsyncStorage.getItem(key);
    if (v === null) return defaultValue;
    return v === 'true';
};
