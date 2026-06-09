import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as userService from '@services/userService';
import type { UserProfile } from '@services/userService';
import type { ContactRelation } from '@services/userService';
import type { RootStackParamList } from '@navigation/AppNavigator';

// Exemplo de como deve ficar o seu arquivo de tipos:
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string }; // Exemplo de tela que recebe parâmetro
  AddContact: undefined;       // <-- ADICIONE ISSO AQUI
};

type Navigation = NativeStackNavigationProp<RootStackParamList, 'AddContact'>;

export const RELACOES: { label: string; value: ContactRelation }[] = [
    { label: 'Familiar', value: 'FAMILIAR' },
    { label: 'Amigo(a)', value: 'AMIGO' },
    { label: 'Profissional', value: 'PROFISSIONAL' },
    { label: 'Outro', value: 'OUTRO' },
];

export function useAddContactVM() {
    const navigation = useNavigation<Navigation>();

    const [email, setEmail] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [usuarioEncontrado, setUsuarioEncontrado] = useState<UserProfile | null>(null);
    const [erroBusca, setErroBusca] = useState<string | null>(null);

    const [relacao, setRelacao] = useState<ContactRelation>('FAMILIAR');
    const [podeAlertarEmergencia, setPodeAlertarEmergencia] = useState(true);
    const [adicionando, setAdicionando] = useState(false);

    const buscar = async () => {
        if (!email.trim() || !email.includes('@')) {
            setErroBusca('Digite um email válido.');
            return;
        }

        setBuscando(true);
        setErroBusca(null);
        setUsuarioEncontrado(null);

        try {
            const user = await userService.searchUser(email.trim());
            if (user) {
                setUsuarioEncontrado(user);
            } else {
                setErroBusca('Nenhum usuário cadastrado com esse email.');
            }
        } catch (error: any) {
            setErroBusca('Erro ao buscar. Tente novamente.');
        } finally {
            setBuscando(false);
        }
    };

    const adicionar = async () => {
        if (!usuarioEncontrado) return;

        setAdicionando(true);
        try {
            await userService.addContact({
                id_usuario_contato: usuarioEncontrado.id_usuario,
                relacao,
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
            } else {
                Alert.alert('Erro', 'Não foi possível adicionar agora.');
            }
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