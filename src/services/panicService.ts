import api from '@services/api';

export type PanicOrigin = 'MANUAL' | 'IOT_DEVICE' | 'HEALTH_MONITOR' | 'TIMEOUT';

export interface PanicTriggerPayload {
    latitude?: number | null;
    longitude?: number | null;
    origem: PanicOrigin;
    mensagem?: string;
}

export interface PanicEvent {
    id_evento: number;
    id_usuario: number;
    timestamp: string;
    latitude: number | null;
    longitude: number | null;
    origem: PanicOrigin;
    status_resolvido: boolean;
    mensagem?: string | null;
}

// Aciona o pânico — dispara push pra todos os contatos com pode_alertar_emergencia=true
export const triggerPanic = async (payload: PanicTriggerPayload): Promise<{ message: string; eventId: number }> => {
    const { data } = await api.post('/v1/panic/trigger', payload);
    return data;
};

// Cancela um pânico ativo (ainda dentro do prazo) — caso o usuário se arrependa
export const cancelPanic = async (eventId: number): Promise<{ message: string }> => {
    const { data } = await api.post(`/v1/panic/cancel`, { id_evento: eventId });
    return data;
};

// Lista histórico de eventos de pânico do usuário
export const listLogs = async (): Promise<PanicEvent[]> => {
    const { data } = await api.get<PanicEvent[]>('/v1/panic/logs');
    return data;
};