import { useCallback, useState } from 'react';
import { Alert, Share } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as userService from '@services/userService';
import type { Contact, MonitoredPatient, NivelPermissao } from '@services/userService';
import type { TabParamList } from '@navigation/AppNavigator';

type Navigation = BottomTabNavigationProp<TabParamList, 'Contacts'>;

export function useContactsVM() {
    const navigation = useNavigation<Navigation>();

    const LINK_DOWNLOAD = 'https://safehome.app/baixar'; // <-- PLACEHOLDER TEMPORARIO

    // ===== Sheet de convite =====
    const [sheetVisivel, setSheetVisivel] = useState(false);
    const abrirSheet = () => setSheetVisivel(true);
    const fecharSheet = () => setSheetVisivel(false);

    // ===== Aba ativa: emergencia (meus contatos) | monitoro (pacientes) =====
    const [abaSelecionada, setAbaSelecionada] = useState<'emergencia' | 'monitoro'>('emergencia');

    // ===== Contatos (quem cuida de mim) =====
    const [contatos, setContatos] = useState<Contact[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    // ===== Monitorados (de quem eu cuido) =====
    const [monitorados, setMonitorados] = useState<MonitoredPatient[]>([]);
    const [carregandoMonitorados, setCarregandoMonitorados] = useState(true);

    // Carrega os contatos de emergência (quem cuida de mim)
    const carregar = useCallback(async (modoAtualizacao = false) => {
        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);
        setErro(null);

        try {
            const data = await userService.listContacts();
            setContatos(data);
        } catch (error: any) {
            console.warn('[useContactsVM] Erro:', error?.message);
            setErro('Não foi possível carregar seus contatos.');
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, []);

    // Carrega os pacientes que EU monitoro (sou contato deles)
    const carregarMonitorados = useCallback(async () => {
        setCarregandoMonitorados(true);
        try {
            const data = await userService.listMonitored();
            setMonitorados(data);
        } catch (error: any) {
            console.warn('[useContactsVM] Erro ao carregar monitorados:', error?.message);
            setMonitorados([]);
        } finally {
            setCarregandoMonitorados(false);
        }
    }, []);

    const convidarContato = async () => {
        try {
            const mensagem =
                `Oi! Quero te adicionar como meu contato de emergência no SafeHome 💚\n\n` +
                `Baixe o app e crie sua conta pra fazer parte da minha rede de apoio:\n${LINK_DOWNLOAD}`;

            await Share.share({
                message: mensagem,
                title: 'Convite para o SafeHome',
            });
        } catch (error: any) {
            console.warn('[useContactsVM] Share cancelado/erro:', error?.message);
        }
    };

    // Recarrega os dois lados quando a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            carregar();
            carregarMonitorados();
        }, [carregar, carregarMonitorados])
    );

    // Navega pra tela de adicionar contato (rota no Stack pai)
    const irParaAdicionar = () => {
        // @ts-ignore
        navigation.navigate('AddContact');
    };

    // Navega pra visão do paciente monitorado (rota no Stack pai)
    const verPerfilPaciente = (paciente: MonitoredPatient) => {
        // @ts-ignore
        navigation.navigate('PatientView', {
            idPaciente: paciente.id_paciente,
            nomePaciente: paciente.nome_paciente,
            nivelPermissao: paciente.nivel_permissao,
        });
    };

    // Muda o nível de permissão de um contato (TOTAL / MODERADO / SOMENTE_EMERGENCIA).
    // Atualização otimista: muda na UI na hora, reverte se a API falhar.
    const mudarNivelPermissao = async (contato: Contact, novoNivel: NivelPermissao) => {
        if (contato.nivel_permissao === novoNivel) return; // já está nesse nível

        const backup = contatos;
        setContatos((prev) =>
            prev.map((c) =>
                c.id_relacao === contato.id_relacao
                    ? { ...c, nivel_permissao: novoNivel }
                    : c
            )
        );

        try {
            await userService.updateContactPermission(contato.id_relacao, novoNivel);
        } catch (error) {
            setContatos(backup); // reverte
            Alert.alert('Erro', 'Não foi possível alterar a permissão agora.');
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
                            await userService.removeContact(contato.id_relacao);
                            setContatos((prev) => prev.filter((c) => c.id_relacao !== contato.id_relacao));
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível remover.');
                        }
                    },
                },
            ]
        );
    };

    const totalContatos = contatos.length;
    // Conta quantos NÃO são "somente emergência" (ou seja, têm algum acesso a mais)
    const totalEmergencia = contatos.filter((c) => c.nivel_permissao !== 'SOMENTE_EMERGENCIA').length;

    return {
        // contatos (emergencia)
        contatos,
        carregando,
        atualizando,
        erro,
        totalContatos,
        totalEmergencia,
        carregar,
        mudarNivelPermissao,
        removerContato,
        // monitorados
        abaSelecionada,
        setAbaSelecionada,
        monitorados,
        carregandoMonitorados,
        carregarMonitorados,
        verPerfilPaciente,
        // navegação / sheet
        irParaAdicionar,
        sheetVisivel,
        abrirSheet,
        fecharSheet,
        convidarContato,
    };
}
