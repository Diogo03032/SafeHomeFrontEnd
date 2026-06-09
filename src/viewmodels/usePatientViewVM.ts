import { useCallback, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import * as statsService from '@services/statsService';
import * as iotService from '@services/iotService';
import * as panicService from '@services/panicService';
import type { UserStats, UserStatusData } from '@services/statsService';
import type { IoTDevice } from '@services/iotService';
import type { PanicEvent } from '@services/panicService';
import type { NivelPermissao } from '@services/userService';

interface PatientViewParams {
    idPaciente: number;
    nomePaciente: string;
    nivelPermissao: NivelPermissao;
}

export function usePatientViewVM() {
    const route = useRoute();
    const { idPaciente, nomePaciente, nivelPermissao } = route.params as PatientViewParams;

    const podeVerPainel = nivelPermissao === 'TOTAL' || nivelPermissao === 'MODERADO';
    const podeVerAgenda = nivelPermissao === 'TOTAL' || nivelPermissao === 'MODERADO';
    const podeEditar = nivelPermissao === 'TOTAL';

    // ===== Estado do painel =====
    const [status, setStatus] = useState<UserStatusData | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [dispositivos, setDispositivos] = useState<IoTDevice[]>([]);
    const [ultimoAlerta, setUltimoAlerta] = useState<PanicEvent | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const carregarPainel = useCallback(async () => {
        if (!podeVerPainel) {
            setCarregando(false);
            return;
        }

        setCarregando(true);
        setErro(null);

        try {
            
            const [statusRes, statsRes, devicesRes, logsRes] = await Promise.allSettled([
                statsService.getUserStatus(idPaciente),
                statsService.getUserStats(idPaciente),
                iotService.listDevicesForPatient(idPaciente),
                panicService.listLogsByPatient(idPaciente),
            ]);

            if (statusRes.status === 'fulfilled') setStatus(statusRes.value);
            if (statsRes.status === 'fulfilled') setStats(statsRes.value);
            if (devicesRes.status === 'fulfilled') setDispositivos(devicesRes.value);

            if (logsRes.status === 'fulfilled' && logsRes.value.length > 0) {
                setUltimoAlerta(logsRes.value[0]);
            }

            if (
                statusRes.status === 'rejected' &&
                statsRes.status === 'rejected' &&
                devicesRes.status === 'rejected'
            ) {
                setErro('Não foi possível carregar os dados deste paciente.');
            }
        } catch (e: any) {
            console.warn('[usePatientViewVM] Erro:', e?.message);
            setErro('Não foi possível carregar os dados deste paciente.');
        } finally {
            setCarregando(false);
        }
    }, [idPaciente, podeVerPainel]);

    useFocusEffect(
        useCallback(() => {
            carregarPainel();
        }, [carregarPainel])
    );

    const corStatus = (): string => {
        if (!status) return 'rgba(255,255,255,0.5)';
        if (status.status === 'Estável') return '#5cd99e';
        if (status.status === 'Atenção') return '#d4a647';
        return '#e07d6b'; // Crítico
    };

    const labelNivel = (): string => {
        switch (nivelPermissao) {
            case 'TOTAL': return 'Acesso total';
            case 'MODERADO': return 'Acesso moderado';
            case 'SOMENTE_EMERGENCIA': return 'Só emergência';
            default: return nivelPermissao;
        }
    };

    return {
        idPaciente,
        nomePaciente,
        nivelPermissao,
        podeVerPainel,
        podeVerAgenda,
        podeEditar,
        status,
        stats,
        dispositivos,
        ultimoAlerta,
        carregando,
        erro,
        carregarPainel,
        corStatus,
        labelNivel,
    };
}
