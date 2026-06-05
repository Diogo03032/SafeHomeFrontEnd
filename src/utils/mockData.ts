import type { UserProfile, UserStatus } from '@services/userService';
import type { IoTDevice } from '@services/iotService';

// ===== PERFIL FAKE =====
export const MOCK_PROFILE: UserProfile = {
    id_usuario: 999,
    nome: 'Gil Alberice',
    email: 'gilAlberice@safehome.com',
    genero: 'MASCULINO',
    bio: 'Conta de demonstração do SafeHome — neurodivergente, cuida da rotina com apoio.',
    is_patient: true,
    data_criacao: '2025-08-15T10:30:00.000Z',
} as any;  // cast pra não brigar com campos opcionais

// ===== STATUS FAKE (pra HomeScreen) =====
export const MOCK_STATUS: UserStatus = {
    status: 'Estável',
    consistencia_rotina: 78,
    dias_estabilidade: 12,
    ultimo_alerta_critico: null,
} as any;

// ===== STATS FAKE (pra StatsScreen) =====
export const MOCK_STATS = {
    consistencia_rotina: 78,
    metas_concluidas_semana: 18,
    metas_totais_semana: 23,
    dias_estabilidade: 12,
    ultimo_alerta_critico: null,
    mensagem_motivacional: 'Você está indo muito bem! Manter a consistência é uma vitória diária. 💚',
};

// ===== DISPOSITIVOS FAKE (pra IoT) =====
export const MOCK_DEVICES: IoTDevice[] = [
    {
        id_dispositivo: 1,
        id_usuario: 999,
        nome: 'Sensor de Gás - Cozinha',
        tipo: 'GAS_SENSOR',
        local: 'Cozinha',
        status_ativo: true,
        api_endpoint: null,
        data_criacao: '2025-09-01T14:00:00.000Z',
    },
    {
        id_dispositivo: 2,
        id_usuario: 999,
        nome: 'Sensor de Porta - Entrada',
        tipo: 'DOOR_SENSOR',
        local: 'Sala',
        status_ativo: true,
        api_endpoint: null,
        data_criacao: '2025-09-01T14:05:00.000Z',
    },
    {
        id_dispositivo: 3,
        id_usuario: 999,
        nome: 'Luz Inteligente - Quarto',
        tipo: 'SMART_LIGHT',
        local: 'Quarto',
        status_ativo: false,
        api_endpoint: null,
        data_criacao: '2025-09-15T18:30:00.000Z',
    },
    {
        id_dispositivo: 4,
        id_usuario: 999,
        nome: 'Detector de Movimento',
        tipo: 'MOTION_SENSOR',
        local: 'Corredor',
        status_ativo: true,
        api_endpoint: null,
        data_criacao: '2025-10-02T09:15:00.000Z',
    },
];

// ===== OCORRÊNCIAS DA AGENDA FAKE =====
export const MOCK_AGENDA_OCCURRENCES = [
    {
        id_ocorrencia: 101,
        id_evento: 1,
        id_paciente: 999,
        titulo: 'Remédio da manhã',
        categoria: 'MEDICAMENTO' as const,
        data_ocorrencia: new Date().toISOString().split('T')[0],
        hora: '08:00',
        status_concluido: true,
    },
    {
        id_ocorrencia: 102,
        id_evento: 2,
        id_paciente: 999,
        titulo: 'Beber água',
        categoria: 'HIDRATACAO' as const,
        data_ocorrencia: new Date().toISOString().split('T')[0],
        hora: '10:30',
        status_concluido: true,
    },
    {
        id_ocorrencia: 103,
        id_evento: 3,
        id_paciente: 999,
        titulo: 'Caminhada leve',
        categoria: 'EXERCICIO' as const,
        data_ocorrencia: new Date().toISOString().split('T')[0],
        hora: '16:00',
        status_concluido: false,
    },
];

export const MOCK_AGENDA_NOTES = [
    {
        id_nota: 1,
        id_paciente: 999,
        id_autor: 999,
        autor_nome: 'Gil Demo',
        texto: 'Esta semana consegui manter a rotina certinha. Me senti com mais energia.',
        mes_referencia: new Date().toISOString().slice(0, 7),
        data_criacao: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
        id_nota: 2,
        id_paciente: 999,
        id_autor: 100,
        autor_nome: 'Maria (mãe)',
        texto: 'Notei que você tem dormido melhor. Continue assim! 💚',
        mes_referencia: new Date().toISOString().slice(0, 7),
        data_criacao: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
];

// ===== CONTATOS FAKE =====
export const MOCK_CONTACTS = [
    {
        id_contato: 1,
        id_usuario: 999,
        id_usuario_contato: 100,
        nome_contato: 'Maria Silva',
        email_contato: 'maria@email.com',
        telefone: '(33) 99999-0001',
        relacao: 'FAMILIAR' as const,
        pode_alertar_emergencia: true,
        data_criacao: '2025-08-20T12:00:00.000Z',
    },
    {
        id_contato: 2,
        id_usuario: 999,
        id_usuario_contato: 101,
        nome_contato: 'Pedro Santos',
        email_contato: 'pedro@email.com',
        telefone: '(33) 99999-0002',
        relacao: 'AMIGO' as const,
        pode_alertar_emergencia: true,
        data_criacao: '2025-09-05T15:30:00.000Z',
    },
    {
        id_contato: 3,
        id_usuario: 999,
        id_usuario_contato: 102,
        nome_contato: 'Dra. Ana Costa',
        email_contato: 'dra.ana@clinica.com',
        telefone: '(33) 99999-0003',
        relacao: 'PROFISSIONAL' as const,
        pode_alertar_emergencia: false,
        data_criacao: '2025-09-10T09:00:00.000Z',
    },
];
