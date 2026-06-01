import api from '@services/api';

export type DeviceType = 'GAS_SENSOR' | 'DOOR_SENSOR' | 'MOTION_SENSOR' | 'SMART_LIGHT' | 'NOISE_SENSOR' | 'PANIC_BUTTON' | 'OTHER';

export interface IoTDevice {
    id_dispositivo: number;
    id_usuario: number;
    nome: string;
    tipo: DeviceType;
    local: string;
    status_ativo: boolean;
    api_endpoint?: string | null;
    data_criacao: string;
}

export interface Telemetry {
    id_telemetria: number;
    id_dispositivo: number;
    valor: string;
    unidade?: string | null;
    timestamp: string;
}

export interface UpdateDevicePayload {
    nome?: string;
    local?: string;
    status_ativo?: boolean;
}

// Lista todos os dispositivos IoT do usuário logado.
export const listDevices = async (): Promise<IoTDevice[]> => {
    const { data } = await api.get<IoTDevice[]>('/v1/iot/devices');
    return data;
};

// Busca um dispositivo específico.
export const getDevice = async (id: number): Promise<IoTDevice> => {
    const { data } = await api.get<IoTDevice>(`/v1/iot/devices/${id}`);
    return data;
};

// Atualiza um dispositivo (nome, local, status_ativo).
export const updateDevice = async (id: number, payload: UpdateDevicePayload): Promise<{ message: string }> => {
    const { data } = await api.patch(`/v1/iot/devices/${id}`, payload);
    return data;
};

// Toggle on/off de um dispositivo (atalho de updateDevice).
export const toggleDevice = async (id: number, ativo: boolean): Promise<{ message: string }> => {
    return updateDevice(id, { status_ativo: ativo });
};

// Remove um dispositivo.
export const deleteDevice = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/v1/iot/devices/${id}`);
    return data;
};

// Busca a última telemetria de um dispositivo (ex: nível de gás atual).
export const getLatestTelemetry = async (deviceId: number): Promise<Telemetry | null> => {
    try {
        const { data } = await api.get<Telemetry>(`/v1/iot/telemetry/${deviceId}/latest`);
        return data;
    } catch (error: any) {
        if (error?.response?.status === 404) return null;
        throw error;
    }
};

export const DEVICE_ICONS: Record<DeviceType, string> = {
    GAS_SENSOR: '🔥',
    DOOR_SENSOR: '🚪',
    MOTION_SENSOR: '📡',
    SMART_LIGHT: '💡',
    NOISE_SENSOR: '🔊',
    PANIC_BUTTON: '🆘',
    OTHER: '🔌',
};

export const DEVICE_LABELS: Record<DeviceType, string> = {
    GAS_SENSOR: 'Sensor de Gás',
    DOOR_SENSOR: 'Sensor de Porta',
    MOTION_SENSOR: 'Detector de Movimento',
    SMART_LIGHT: 'Luz Inteligente',
    NOISE_SENSOR: 'Sensor de Ruído',
    PANIC_BUTTON: 'Botão de Pânico Físico',
    OTHER: 'Outro Dispositivo',
};
