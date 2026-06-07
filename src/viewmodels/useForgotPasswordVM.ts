import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as authService from '@services/authService';
import type { RootStackParamList } from '@navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export function useForgotPasswordVM() {
    const navigation = useNavigation<Navigation>();


    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

  
    const [erros, setErros] = useState<{
        email?: string;
        novaSenha?: string;
        confirmaSenha?: string;
    }>({});

    
    const validar = (): boolean => {
        const novosErros: typeof erros = {};

        if (!email.trim()) {
            novosErros.email = 'Informe seu e-mail.';
        } else if (!email.includes('@') || !email.includes('.')) {
            novosErros.email = 'E-mail inválido.';
        }

        if (!novaSenha) {
            novosErros.novaSenha = 'Informe uma nova senha.';
        } else if (novaSenha.length < 6) {
            novosErros.novaSenha = 'A senha deve ter pelo menos 6 caracteres.';
        }

        if (!confirmaSenha) {
            novosErros.confirmaSenha = 'Confirme sua nova senha.';
        } else if (novaSenha !== confirmaSenha) {
            novosErros.confirmaSenha = 'As senhas não conferem.';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };


    const recuperarSenha = async () => {
        if (!validar()) return;

        setCarregando(true);
        try {
            await authService.resetPassword({
                email: email.trim(),
                new_password: novaSenha,
            });

          
            Alert.alert(
                'Senha alterada!',
                'Sua nova senha foi salva com sucesso. Faça login pra continuar.',
                [
                    {
                        text: 'Ir para login',
                        onPress: () => navigation.replace('Login'),
                    },
                ]
            );

           
            setEmail('');
            setNovaSenha('');
            setConfirmaSenha('');
        } catch (error: any) {
            const status = error?.response?.status;
            const apiError = error?.response?.data?.error;

            if (status === 404) {
                
                setErros({ email: 'Não encontramos uma conta com esse e-mail.' });

            } else if (status === 400) {

                Alert.alert('Dados inválidos', apiError || 'Verifique os campos.');

            } else if (error?.code === 'ECONNABORTED') {

                Alert.alert('Sem conexão', 'A API demorou pra responder.');

            } else {

                Alert.alert(
                    'Erro inesperado',
                    apiError || 'Não foi possível recuperar sua senha agora.'
                );

            }

            console.log('[useForgotPasswordVM] Erro:', {
                status,
                data: error?.response?.data,
            });

        } finally {
            setCarregando(false);
        }
    };


    const voltarParaLogin = () => {
        navigation.goBack();
    };

    return {
        email,
        novaSenha,
        confirmaSenha,
        carregando,
        erros,
        setEmail,
        setNovaSenha,
        setConfirmaSenha,
        recuperarSenha,
        voltarParaLogin,
    };
}
