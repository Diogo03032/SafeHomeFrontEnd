import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as authService from '@services/authService';
import type { GeneroValue } from '@services/authService';
import type { RootStackParamList } from '@navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const OPCOES_GENERO: { label: string; value: GeneroValue }[] = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Outro', value: 'OUTRO' },
    { label: 'Prefiro não informar', value: 'NAO_INFORMADO' },
];

export function useRegisterVM() {
    const navigation = useNavigation<Navigation>();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [genero, setGenero] = useState<GeneroValue | ''>('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const [erros, setErros] = useState<{
        nome?: string;
        email?: string;
        genero?: string;
        senha?: string;
        confirmaSenha?: string;
    }>({});

    const validar = (): boolean => {
        const novosErros: typeof erros = {};

        if (!nome.trim()) {
            novosErros.nome = 'Informe seu nome.';
        } else if (nome.trim().length < 2) {
            novosErros.nome = 'Nome muito curto.';
        }

        if (!email.trim()) {
            novosErros.email = 'Informe seu e-mail.';
        } else if (!email.includes('@') || !email.includes('.')) {
            novosErros.email = 'E-mail inválido.';
        }

        if (!genero) {
            novosErros.genero = 'Selecione uma opção.';
        }

        if (!senha) {
            novosErros.senha = 'Informe uma senha.';
        } else if (senha.length < 6) {
            novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
        }

        if (!confirmaSenha) {
            novosErros.confirmaSenha = 'Confirme sua senha.';
        } else if (senha !== confirmaSenha) {
            novosErros.confirmaSenha = 'As senhas não conferem.';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const cadastrar = async () => {
        if (!validar()) return;

        setCarregando(true);
        try {
            const resp = await authService.register({
                name: nome.trim(),
                email: email.trim(),
                password: senha,
                genero: genero as GeneroValue,
                is_patient: true, 
            });

            Alert.alert(
                'Conta criada com sucesso!',
                `Bem-vindo(a) ao SafeHome, ${nome.split(' ')[0]}! Faça login pra continuar.`,
                [
                    {
                        text: 'Ir para login',
                        onPress: () => navigation.replace('Login'),
                    },
                ]
            );

            setNome('');
            setEmail('');
            setGenero('');
            setSenha('');
            setConfirmaSenha('');
        } catch (error: any) {
            const status = error?.response?.status;
            const apiError = error?.response?.data?.error;

            if (status === 409) {
                setErros({ email: 'Este e-mail já está cadastrado.' });
            } else if (status === 400) {
                Alert.alert(
                    'Dados inválidos',
                    apiError || 'Verifique os campos e tente novamente.'
                );
            } else if (error?.code === 'ECONNABORTED') {
                Alert.alert('Sem conexão', 'A API demorou pra responder.');
            } else {
                Alert.alert(
                    'Erro inesperado',
                    apiError || 'Não foi possível criar sua conta agora.'
                );
            }

            console.log('[useRegisterVM] Erro:', {
                status,
                data: error?.response?.data,
                message: error?.message,
            });
        } finally {
            setCarregando(false);
        }
    };

    const irParaLogin = () => {
        navigation.goBack();
    };

    return {
        nome,
        email,
        genero,
        senha,
        confirmaSenha,
        carregando,
        erros,
        opcoesGenero: OPCOES_GENERO,
        setNome,
        setEmail,
        setGenero,
        setSenha,
        setConfirmaSenha,
        cadastrar,
        irParaLogin,
    };
}