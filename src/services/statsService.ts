import api from "@services/api";
export interface UserStats {
  consistencia_rotina: number;
  metas_concluidas_semana: number;
  metas_totais_semana: number;
  dias_estabilidade: number;
  ultimo_alerta_critico: string | null;
  mensagem_motivacional: string;
}

export interface UserStatusData {
    status: 'Estável' | 'Atenção' | 'Crítico';
    consistencia_rotina: number;
    dias_estabilidade: number;
}

export const getUserStats = async (patientId: number): Promise<UserStats> => {
  const { data } = await api.get<UserStats>(`/v1/stats/${patientId}`);
  return data;
};

export const getUserStatus = async (patientId: number): Promise<UserStatusData> => {
    const { data } = await api.get<UserStatusData>(`/v1/stats/${patientId}/status`);
    return data;
};
