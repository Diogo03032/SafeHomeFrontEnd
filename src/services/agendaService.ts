import api from '@services/api';

export type EventCategory = 'MEDICAMENTO' | 'CONSULTA' | 'HIDRATACAO' | 'ALIMENTACAO' | 'EXERCICIO' | 'OUTRO';

export interface AgendaTemplate {
    id_evento: number;
    id_paciente: number;
    titulo: string;
    descricao?: string;
    categoria: EventCategory;
    hora: string;            // HH:mm
    dias_semana: number[];   // 0-6 (domingo a sábado)
    data_inicio: string;
    data_fim?: string | null;
}

export interface AgendaOccurrence {
    id_ocorrencia: number;
    id_evento: number;
    id_paciente: number;
    titulo: string;
    categoria: EventCategory;
    data_ocorrencia: string;
    hora: string;
    status_concluido: boolean;
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

// ----- Funções -----

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
): Promise<{ message: string }> => {
    const { data } = await api.patch(`/v1/agenda/ocorrencias/${occurrenceId}/status`, {
        status_concluido: concluido,
    });
    return data;
};

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

// Adiciona uma nota mensal.
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
