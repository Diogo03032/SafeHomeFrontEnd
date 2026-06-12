import api from '@services/api';

// ===== Tipos =====


// Não invente categorias novas aqui sem adicionar lá no backend também, senão o Zod rejeita
export type AgendaEventType =
    | 'MEDICAMENTO'
    | 'CONSULTA'
    | 'SONO'
    | 'HIDRATACAO'
    | 'MEDITACAO'
    | 'EVENTO'
    | 'GERAL';

export interface AgendaTemplate {
    id_evento: number;
    titulo: string;
    descricao?: string | null;
    data_hora: string;          
    data_inicio: string;        
    data_fim?: string | null;   
    tipo: AgendaEventType;
    id_paciente: number;
    id_criador?: number;
}

export interface CreateTemplatePayload {
    id_paciente: number;
    titulo: string;
    descricao?: string | null;
    data_hora: string;          
    data_inicio: string;        
    data_fim?: string | null;   
    tipo: AgendaEventType;
}

export interface UpdateTemplatePayload {
    titulo?: string;
    descricao?: string | null;
    data_hora?: string;
    data_fim?: string | null;
}

// Ocorrência o log diário gerado a partir do template
export interface AgendaOccurrence {
    id_ocorrencia: number;
    id_evento: number;
    usuario_id: number;
    data_ocorrencia: string;    
    status_concluido: boolean;
    titulo?: string;
    tipo?: AgendaEventType;
    data_hora?: string;
}

export interface MonthlyNote {
    id_nota: number;
    id_paciente: number;
    id_autor: number;
    autor_nome?: string;
    texto: string;
    mes_referencia: string;     
    data_criacao: string;
}

// ===== Templates (eventos base) =====

// Cria um template recorrente. O backend gera as ocorrências em batch automaticamente
export const createTemplate = async (
    payload: CreateTemplatePayload
): Promise<{ message: string; templateId: number }> => {
    const { data } = await api.post('/v1/agenda/template', payload);
    return data;
};

// Lista os templates de um paciente
export const listTemplates = async (patientId: number): Promise<AgendaTemplate[]> => {
    const { data } = await api.get<AgendaTemplate[]>(
        `/v1/agenda/template/paciente/${patientId}`
    );
    return data;
};
// edita template já existente
export const updateTemplate = async (
    eventId: number,
    payload: UpdateTemplatePayload
): Promise<{ message: string }> => {
    const { data } = await api.patch(`/v1/agenda/template/${eventId}`, payload);
    return data;
};

// Deleta um template e, por consequência no backend, suas ocorrências
export const deleteTemplate = async (
    eventId: number
): Promise<{ message: string }> => {
    const { data } = await api.delete(`/v1/agenda/template/${eventId}`);
    return data;
};

// ===== Ocorrências (log diário) =====

// Lista todas as ocorrências de um paciente
export const listOccurrences = async (
    patientId: number
): Promise<AgendaOccurrence[]> => {
    const { data } = await api.get<AgendaOccurrence[]>(
        `/v1/agenda/ocorrencias/paciente/${patientId}`
    );
    return data;
};

// Lista as ocorrências de um paciente num dia específico
export const listOccurrencesByDate = async (
    patientId: number,
    data: string                 
): Promise<AgendaOccurrence[]> => {
    const { data: resp } = await api.get<AgendaOccurrence[]>(
        `/v1/agenda/ocorrencias/paciente/${patientId}/data/${data}`
    );
    return resp;
};

// Marca uma ocorrência como concluída/não concluída
export const markOccurrenceAsDone = async (
    occurrenceId: number,
    concluido: boolean
): Promise<AgendaOccurrence> => {
    const { data } = await api.patch(
        `/v1/agenda/ocorrencias/${occurrenceId}/status`,
        { status_concluido: concluido }
    );
    return data;
};

// ===== Notas mensais =====

// Lista as notas mensais de um paciente
export const listMonthlyNotes = async (
    patientId: number,
    mes: string                 
): Promise<MonthlyNote[]> => {
    const { data } = await api.get<MonthlyNote[]>(
        `/v1/agenda/notes/${patientId}/${mes}`
    );
    return data;
};

// Adiciona uma nota mensal
export const addMonthlyNote = async (
    id_paciente: number,
    mes_referencia: string,     
    texto: string
): Promise<{ message: string; noteId: number }> => {
    const { data } = await api.post('/v1/agenda/notes', {
        id_paciente,
        mes_referencia,
        texto,
    });
    return data;
};

// deleta nota mensal 
export const deleteMonthlyNote = async (noteId: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/v1/agenda/notes/${noteId}`);
    return data;
};

// ===== Helpers de UI =====

// Labels amigáveis pra mostrar nas telas 
export const EVENT_TYPE_LABELS: Record<AgendaEventType, string> = {
    MEDICAMENTO: 'Medicamento',
    CONSULTA: 'Consulta',
    SONO: 'Sono',
    HIDRATACAO: 'Hidratação',
    MEDITACAO: 'Meditação',
    EVENTO: 'Evento',
    GERAL: 'Geral',
};

