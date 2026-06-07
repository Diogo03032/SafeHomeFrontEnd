import api from '@services/api';
import type { GeneroValue } from '@services/authService';

export interface UserProfile {
    id_usuario: number;
    nome: string;
    email: string;
    genero: GeneroValue | null;
    bio?: string | null;
    is_patient: boolean;
    data_criacao: string;
}

export interface UserStatus {
    status: 'Estável' | 'Atenção' | 'Crítico';
    consistencia_rotina: number;
    dias_estabilidade: number;
}

export interface UpdateProfilePayload {
    nome?: string;
    genero?: GeneroValue;
    bio?: string;
}

// Busca o perfil completo do usuário logado
export const getProfile = async (): Promise<UserProfile> => {
    const { data } = await api.get<UserProfile>('/v1/users/me');
    return data;
};

// Atualiza dados do perfil (nome, gênero, bio)
export const updateProfile = async (payload: UpdateProfilePayload): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>('/v1/users/me', payload);
    return data;
};

// Busca o "status atual" do usuário (Estável / Atenção / Crítico)
export const getStatus = async (): Promise<UserStatus> => {
    const { data } = await api.get<UserStatus>('/v1/users/me/status');
    return data;
};

// Salva o FCM token (push notifications) no usuário logado
export const updateFcmToken = async (fcm_token: string): Promise<{ message: string }> => {
    const { data } = await api.patch<{ message: string }>('/v1/users/fcm-token', { fcm_token });
    return data;
};

// Busca um usuário por email (usado pra adicionar contato)
export const searchUser = async (email: string): Promise<UserProfile | null> => {
    try {
        const { data } = await api.get<UserProfile>('/v1/users/search', { params: { email } });
        return data;
    } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
    }
};

export const listMonitored = async (): Promise<MonitoredPatient[]> => {
    const { data } = await api.get<MonitoredPatient[]>('/v1/users/monitored');
    return data;
};

export type ContactRelation = 'FAMILIAR' | 'AMIGO' | 'PROFISSIONAL' | 'OUTRO';

export type NivelPermissao = 'TOTAL' | 'MODERADO' | 'SOMENTE_EMERGENCIA';

export interface Contact {
    id_contato: number;
    id_usuario: number;          
    id_usuario_contato: number;  
    nome_contato: string;
    email_contato: string;
    telefone?: string | null;
    relacao: ContactRelation;
    pode_alertar_emergencia: boolean;
    data_criacao: string;
}

export interface AddContactPayload {
    id_usuario_contato: number;
    relacao: ContactRelation;
    pode_alertar_emergencia: boolean;
}

export interface MonitoredPatient {
    id_relacao: number;
    id_paciente: number;
    nome_paciente: string;
    email_paciente: string;
    genero: GeneroValue | null;
    nivel_permissao: NivelPermissao;
}

// ===== Funções =====

// Lista todos os contatos do usuário logado.
export const listContacts = async (): Promise<Contact[]> => {
    const { data } = await api.get<Contact[]>('/v1/users/me/contacts');
    return data;
};

// Adiciona um contato 
export const addContact = async (payload: AddContactPayload): Promise<{ message: string }> => {
    const { data } = await api.post('/v1/users/me/contacts', payload);
    return data;
};

// Atualiza um contato 
export const updateContact = async (
    id_contato: number,
    payload: Partial<Pick<Contact, 'relacao' | 'pode_alertar_emergencia'>>
): Promise<{ message: string }> => {
    const { data } = await api.patch(`/v1/users/me/contacts/${id_contato}`, payload);
    return data;
};

// Remove um contato.
export const removeContact = async (id_contato: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/v1/users/me/contacts/${id_contato}`);
    return data;
};
