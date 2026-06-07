import api from '@services/api';

// Enum do backend 
export type DeviceCategory =
    | 'GAS'
    | 'LUMINOSIDADE'
    | 'RUIDO'
    | 'PORTA'
    | 'MOVIMENTO'
    | 'LUZ_RGB';

export interface IoTDevice {
    id_dispositivo: string;
    id_usuario: number;
    nome: string;
    categoria: DeviceCategory;
    status_ativo: boolean;
}

export interface Telemetry {
    id_telemetria: number;
    id_dispositivo: string;
    tipo_sensor: string;
    valor: string;
    timestamp: string;
}

// Payload pra criar 
export interface CreateDevicePayload {
    id_dispositivo: string;
    nome: string;
    categoria: DeviceCategory;
    status_ativo?: boolean;
}

// Backend só aceita nome e/ou status_ativo no update
export interface UpdateDevicePayload {
    nome?: string;
    status_ativo?: boolean;
}

// Lista todos os dispositivos do usuário logado
export const listDevices = async (): Promise<IoTDevice[]> => {
    const { data } = await api.get<IoTDevice[]>('/v1/iot/devices');
    return data;
};

export const listDevicesForPatient = async (patientId: number): Promise<IoTDevice[]> => {
    const { data } = await api.get<IoTDevice[]>(`/v1/iot/devices/patient/${patientId}`);
    return data;
}

// Cadastra um novo dispositivo
export const createDevice = async (
    payload: CreateDevicePayload
): Promise<{ deviceId: string; status: string }> => {
    const { data } = await api.post('/v1/iot/devices', payload);
    return data;
};

// Atualiza um dispositivo
export const updateDevice = async (
    id: string,
    payload: UpdateDevicePayload
): Promise<{ deviceId: string; status: string }> => {
    const { data } = await api.patch(`/v1/iot/devices/${id}`, payload);
    return data;
};

// Liga/desliga 
export const toggleDevice = async (
    id: string,
    ativo: boolean
): Promise<{ deviceId: string; status: string }> => {
    return updateDevice(id, { status_ativo: ativo });
};

// Remove um dispositivo
export const deleteDevice = async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/v1/iot/devices/${id}`);
    return data;
};

// Última telemetria de um dispositivo
export const getLatestTelemetry = async (
    deviceId: string
): Promise<Telemetry | null> => {
    try {
        const { data } = await api.get<Telemetry>(`/v1/iot/telemetry/${deviceId}/latest`);
        return data;
    } catch (error: any) {
        if (error?.response?.status === 404) return null;
        throw error;
    }
};

// Label pra cada categoria
export const CATEGORY_LABELS: Record<DeviceCategory, string> = {
    GAS: 'Sensor de Gás',
    LUMINOSIDADE: 'Sensor de Luminosidade',
    RUIDO: 'Sensor de Ruído',
    PORTA: 'Sensor de Porta',
    MOVIMENTO: 'Detector de Movimento',
    LUZ_RGB: 'Luz Inteligente',
};
