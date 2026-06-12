import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as userService from '@services/userService';
import type { UserProfile } from '@services/userService';
import type { ContactRelation } from '@services/userService';
import type { RootStackParamList } from '@navigation/AppNavigator';
import { useAppStore } from '@store/useAppStore';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'AddContact'>;

export const RELACOES: { label: string; value: ContactRelation }[] = [
    { label: 'Familiar', value: 'FAMILIAR' },
    { label: 'Amigo(a)', value: 'AMIGO' },
    { label: 'Profissional', value: 'PROFISSIONAL' },
    { label: 'Outro', value: 'OUTRO' },
];

export function useAddContactVM() {
    const navigation = useNavigation<Navigation>();
    const user = useAppStore((s) => s.user);

    const [email, setEmail] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [usuarioEncontrado, setUsuarioEncontrado] = useState<UserProfile | null>(null);
    const [erroBusca, setErroBusca] = useState<string | null>(null);

    const [relacao, setRelacao] = useState<ContactRelation>('FAMILIAR');
    const [podeAlertarEmergencia, setPodeAlertarEmergencia] = useState(true);
    const [adicionando, setAdicionando] = useState(false);

    // Busca usuário pelo email
    const buscar = async () => {
        if (!email.trim() || !email.includes('@')) {
            setErroBusca('Digite um email válido.');
            return;
        }

        setBuscando(true);
        setErroBusca(null);
        setUsuarioEncontrado(null);

        try {
            const encontrado = await userService.searchUser(email.trim());
            if (encontrado) {
                setUsuarioEncontrado(encontrado);
            } else {
                setErroBusca('Nenhum usuário cadastrado com esse email.');
            }
        } catch (error: any) {
            setErroBusca('Erro ao buscar. Tente novamente.');
        } finally {
            setBuscando(false);
        }
    };

    // Adiciona como contato
    const adicionar = async () => {
        if (!usuarioEncontrado) return;
        if (!user) {
            Alert.alert('Ops', 'Você precisa estar logado.');
            return;
        }

        console.log('[AddContact] user.id_usuario:', user?.id_usuario);

        setAdicionando(true);
        try {
            await userService.addContact({
                id_paciente: user.id_usuario,             
                id_contato: usuarioEncontrado.id_usuario, 
                relacao,
                whatsapp_numero: '11999999999',
                pode_alertar_emergencia: podeAlertarEmergencia,
            });

            Alert.alert(
                'Adicionado!',
                `${usuarioEncontrado.nome} agora faz parte da sua rede de apoio.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            const status = error?.response?.status;
            if (status === 409) {
                Alert.alert('Já é seu contato', 'Esse usuário já está na sua lista de contatos.');
            } else if (status === 403) {
                Alert.alert('Erro', 'Você só pode adicionar contatos para si mesmo.');
            } else if (status === 404) {
                Alert.alert('Erro', 'Usuário não encontrado.');
            } else {
                Alert.alert('Erro', 'Não foi possível adicionar agora.');
            }
            console.warn('[useAddContactVM] Erro ao adicionar:', status, error?.response?.data);
        } finally {
            setAdicionando(false);
        }
    };

    const limparBusca = () => {
        setUsuarioEncontrado(null);
        setEmail('');
        setErroBusca(null);
    };

    const voltar = () => navigation.goBack();

    return {
        email,
        buscando,
        usuarioEncontrado,
        erroBusca,
        relacao,
        podeAlertarEmergencia,
        adicionando,
        relacoes: RELACOES,
        setEmail,
        setRelacao,
        setPodeAlertarEmergencia,
        buscar,
        adicionar,
        limparBusca,
        voltar,
    };
}
