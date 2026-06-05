import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as iotService from '@services/iotService';
import type { DeviceCategory, CreateDevicePayload } from '@services/iotService';

export const CATEGORIAS: { label: string; value: DeviceCategory }[] = [
    { label: 'Sensor de Gás', value: 'GAS' },
    { label: 'Luminosidade', value: 'LUMINOSIDADE' },
    { label: 'Ruído', value: 'RUIDO' },
    { label: 'Porta', value: 'PORTA' },
    { label: 'Movimento', value: 'MOVIMENTO' },
    { label: 'Luz Inteligente', value: 'LUZ_RGB' },
];

export function useAddDeviceVM() {
    const navigation = useNavigation<any>();

    const [idDispositivo, setIdDispositivo] = useState('');
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState<DeviceCategory>('GAS');
    const [salvando, setSalvando] = useState(false);
    const [erros, setErros] = useState<{ id?: string; nome?: string }>({});

    const validar = (): boolean => {
        const novos: typeof erros = {};
        if (!idDispositivo.trim()) {
            novos.id = 'Informe o ID do dispositivo (ex: ESP32-A4).';
        }
        if (!nome.trim()) {
            novos.nome = 'Dê um nome pro dispositivo.';
        }
        setErros(novos);
        return Object.keys(novos).length === 0;
    };

    const salvar = async () => {
        if (!validar()) return;

        const payload: CreateDevicePayload = {
            id_dispositivo: idDispositivo.trim(),
            nome: nome.trim(),
            categoria,
            status_ativo: true,
        };

        setSalvando(true);
        try {
            await iotService.createDevice(payload);
            Alert.alert('Pronto!', 'Dispositivo cadastrado com sucesso.');
            navigation.goBack();
        } catch (error: any) {
            const status = error?.response?.status;
            if (status === 409) {
                Alert.alert('ID já existe', 'Já existe um dispositivo com esse ID.');
            } else if (status === 400) {
                Alert.alert('Dados inválidos', 'Verifique os campos e tente novamente.');
            } else {
                Alert.alert('Erro', 'Não foi possível cadastrar agora.');
            }
            console.warn('[useAddDeviceVM] Erro:', status, error?.response?.data);
        } finally {
            setSalvando(false);
        }
    };

    const cancelar = () => navigation.goBack();

    return {
        idDispositivo,
        nome,
        categoria,
        salvando,
        erros,
        categorias: CATEGORIAS,
        setIdDispositivo,
        setNome,
        setCategoria,
        salvar,
        cancelar,
    };
}
