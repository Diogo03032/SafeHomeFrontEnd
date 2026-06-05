import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as userService from '@services/userService';
import type { Contact } from '@services/userService';
import type { TabParamList } from '@navigation/AppNavigator';

//================== MOCK APAGAR DEPOIS ============================
import { useDemoMode } from '@hooks/useDemoMode';
import { MOCK_CONTACTS } from '@utils/mockData';
//==================================================================

// VM da lista de contatos.

type Navigation = BottomTabNavigationProp<TabParamList, 'Contacts'>;

export function useContactsVM() {
    const navigation = useNavigation<Navigation>();

    const [contatos, setContatos] = useState<Contact[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
//==================== MOCK APAGAR DEPOIS =================================
    const isDemoMode = useDemoMode();
//=====================================================================
//==================== MOCK MUDAR DEPOIS ==============================
    const carregar = useCallback(async (modoAtualizacao = false) => {
        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);
        setErro(null);

        try {
            // Modo demo
            if (isDemoMode) {
                await new Promise((r) => setTimeout(r, 300));
                setContatos(MOCK_CONTACTS);
                return;
            }

            const data = await userService.listContacts();
            setContatos(data);
        } catch (error: any) {
            console.warn('[useContactsVM] Erro:', error?.message);
            if (isDemoMode) {
                setContatos(MOCK_CONTACTS);
            } else {
                setErro('Não foi possível carregar seus contatos.');
            }
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [isDemoMode]);
//=======================================================================
    useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

    // Navega pra tela de adicionar contato (rota no Stack pai)
    const irParaAdicionar = () => {
        // @ts-ignore
        navigation.navigate('AddContact');
    };

    // Toggle de "pode alertar em emergência"
    const alternarEmergencia = async (contato: Contact) => {
        const novo = !contato.pode_alertar_emergencia;

        // Otimista
        setContatos((prev) => prev.map((c) =>
            c.id_contato === contato.id_contato
                ? { ...c, pode_alertar_emergencia: novo }
                : c
        ));

        try {
            await userService.updateContact(contato.id_contato, { pode_alertar_emergencia: novo });
        } catch (error) {
            // Reverte em caso de erro
            setContatos((prev) => prev.map((c) =>
                c.id_contato === contato.id_contato
                    ? { ...c, pode_alertar_emergencia: !novo }
                    : c
            ));
            Alert.alert('Erro', 'Não foi possível atualizar agora.');
        }
    };

    const removerContato = (contato: Contact) => {
        Alert.alert(
            'Remover contato',
            `Tem certeza que quer remover ${contato.nome_contato} dos seus contatos?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await userService.removeContact(contato.id_contato);
                            setContatos((prev) => prev.filter((c) => c.id_contato !== contato.id_contato));
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível remover.');
                        }
                    },
                },
            ]
        );
    };

    const totalContatos = contatos.length;
    const totalEmergencia = contatos.filter((c) => c.pode_alertar_emergencia).length;

    return {
        contatos,
        carregando,
        atualizando,
        erro,
        totalContatos,
        totalEmergencia,
        carregar,
        irParaAdicionar,
        alternarEmergencia,
        removerContato,
    };
}