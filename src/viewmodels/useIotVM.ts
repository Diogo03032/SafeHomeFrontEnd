import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as iotService from '@services/iotService';
import type { IoTDevice, DeviceCategory } from '@services/iotService';

export function useIotVM() {
    const [dispositivos, setDispositivos] = useState<IoTDevice[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const carregar = useCallback(async (modoAtualizacao = false) => {
        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);
        setErro(null);

        try {
            const data = await iotService.listDevices();
            setDispositivos(data);
        } catch (error: any) {
            console.warn('[useIotVM] Erro ao carregar:', error?.message);
            setErro('Não foi possível carregar os dispositivos.');
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );


    const alternarStatus = async (dispositivo: IoTDevice) => {
        const novoStatus = !dispositivo.status_ativo;

        setDispositivos((prev) =>
            prev.map((d) =>
                d.id_dispositivo === dispositivo.id_dispositivo
                    ? { ...d, status_ativo: novoStatus }
                    : d
            )
        );

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

    // Remove um dispositivo (com confirmação)
    const removerDispositivo = (dispositivo: IoTDevice) => {
        Alert.alert(
            'Remover dispositivo?',
            `"${dispositivo.nome}" será removido da sua lista.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await iotService.deleteDevice(dispositivo.id_dispositivo);
                            setDispositivos((prev) =>
                                prev.filter((d) => d.id_dispositivo !== dispositivo.id_dispositivo)
                            );
                        } catch {
                            Alert.alert('Erro', 'Não foi possível remover agora.');
                        }
                    },
                },
            ]
        );
    };

    // Agrupa por categoria pra exibição
    const agrupar = () => {
        const seguranca = dispositivos.filter((d) =>
            (['GAS', 'PORTA', 'MOVIMENTO'] as DeviceCategory[]).includes(d.categoria)
        );
        const ambiente = dispositivos.filter((d) =>
            (['LUMINOSIDADE', 'RUIDO', 'LUZ_RGB'] as DeviceCategory[]).includes(d.categoria)
        );
        return { seguranca, ambiente };
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
        removerDispositivo,
    };
}
