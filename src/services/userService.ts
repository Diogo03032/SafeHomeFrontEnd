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

// Nível de permissão que o paciente concedeu a este contato.
export type NivelPermissao = 'TOTAL' | 'MODERADO' | 'SOMENTE_EMERGENCIA';

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

export type ContactRelation = 'FAMILIAR' | 'AMIGO' | 'PROFISSIONAL' | 'OUTRO';

export interface Contact {
    id_relacao: number;
    id_contato: number;
    nome_contato: string;
    email_contato: string;
    whatsapp_numero?: string | null;
    nivel_permissao: NivelPermissao;
    fcm_token?: string | null;
}

export interface MonitoredPatient {
    id_relacao: number;
    id_paciente: number;
    nome_paciente: string;
    email_paciente: string;
    genero: GeneroValue | null;
    nivel_permissao: NivelPermissao;
}

export interface AddContactPayload {
    id_paciente: number;
    id_contato: number;
    whatsapp_numero?: string;
    relacao?: ContactRelation;
    nivel_permissao?: NivelPermissao;
    pode_alertar_emergencia?: boolean;
}

// ===== Funções de contato (alinhadas ao backend) =====

// Lista os contatos do usuário logado.
export const listContacts = async (): Promise<Contact[]> => {
    const { data } = await api.get<Contact[]>('/v1/users/contacts');
    return data;
};

// Lista os pacientes que o usuário logado monitora.
export const listMonitored = async (): Promise<MonitoredPatient[]> => {
    const { data } = await api.get<MonitoredPatient[]>('/v1/users/monitored');
    return data;
};

// Adiciona um contato.
export const addContact = async (payload: AddContactPayload): Promise<{ message: string }> => {
    const { data } = await api.post('/v1/users/contact', payload);
    return data;
};

// Atualiza o nível de permissão de um contato.
export const updateContactPermission = async (
    relationId: number,
    nivelPermissao: NivelPermissao
): Promise<{ message: string }> => {
    const { data } = await api.patch(`/v1/users/contact/${relationId}`, {
        nivel_permissao: nivelPermissao,
    });
    return data;
};

// Remove um contato (relação).
export const removeContact = async (id_relacao: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/v1/users/contact/${id_relacao}`);
    return data;
};
