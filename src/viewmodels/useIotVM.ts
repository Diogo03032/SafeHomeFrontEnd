import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as iotService from '@services/iotService';
import type { IoTDevice } from '@services/iotService';

//=================== MOCK APAGAR DEPOIS==================
import { useDemoMode } from '@hooks/useDemoMode';
import { MOCK_DEVICES } from '@utils/mockData';
//======================================================

export function useIotVM() {
    const [dispositivos, setDispositivos] = useState<IoTDevice[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

//==========================MOCK=======================
    const isDemoMode = useDemoMode();

    const carregar = useCallback(async (modoAtualizacao = false) => {
        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);
        setErro(null);

        try {
            // Modo demo: usa mock e pula API
            if (isDemoMode) {
                await new Promise((r) => setTimeout(r, 300));
                setDispositivos(MOCK_DEVICES);
                return;
            }

            const data = await iotService.listDevices();
            setDispositivos(data);
        } catch (error: any) {
            console.warn('[useIotVM] Erro ao carregar:', error?.message);
            if (isDemoMode) {
                setDispositivos(MOCK_DEVICES);
            } else {
                setErro('Não foi possível carregar os dispositivos.');
            }
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [isDemoMode]);
//==================================================    

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    // Toggle de um dispositivo com atualização otimista
    //==================== MOCK MUDAR DEPOIS ======================
    const alternarStatus = async (dispositivo: IoTDevice) => {
    const novoStatus = !dispositivo.status_ativo;

        setDispositivos((prev) =>
            prev.map((d) =>
                d.id_dispositivo === dispositivo.id_dispositivo
                    ? { ...d, status_ativo: novoStatus }
                    : d
        )
    );

        // Em modo demo, não chama API
        if (isDemoMode) return;

        try {
            await iotService.toggleDevice(dispositivo.id_dispositivo, novoStatus);
        } catch (error) {
            setDispositivos((prev) =>
                prev.map((d) =>
                    d.id_dispositivo === dispositivo.id_dispositivo
                        ? { ...d, status_ativo: !novoStatus }
                        : d
                )
            );
            Alert.alert('Erro', 'Não foi possível alterar o status. Tente novamente.');
        }
    };
    //=============================================================

    // Agrupa dispositivos em categorias pra exibição
    const agrupar = () => {
        const seguranca = dispositivos.filter((d) =>
            ['GAS_SENSOR', 'DOOR_SENSOR', 'MOTION_SENSOR', 'PANIC_BUTTON'].includes(d.tipo)
        );
        const ambiente = dispositivos.filter((d) =>
            ['SMART_LIGHT', 'NOISE_SENSOR'].includes(d.tipo)
        );
        const outros = dispositivos.filter((d) => d.tipo === 'OTHER');

        return { seguranca, ambiente, outros };
    };

    const totalAtivos = dispositivos.filter((d) => d.status_ativo).length;
    const totalInativos = dispositivos.filter((d) => !d.status_ativo).length;

    return {
        dispositivos,
        grupos: agrupar(),
        carregando,
        atualizando,
        erro,
        totalAtivos,
        totalInativos,
        carregar,
        alternarStatus,
    };
}
