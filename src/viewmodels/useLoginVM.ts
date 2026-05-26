import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as authService from '@services/authService';
import * as userService from '@services/userService';
import { useAppStore } from '@store/useAppStore';
import type { RootStackParamList } from '@navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function useLoginVM() {
    const navigation = useNavigation<Navigation>();
    const loginStore = useAppStore((s) => s.login);

    // ===== Estados dos campos =====
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    // ===== Erros por campo (mostrados embaixo dos inputs) =====
    const [emailError, setEmailError] = useState<string | null>(null);
    const [senhaError, setSenhaError] = useState<string | null>(null);

    // Validação simples antes de chamar a API.
    const validar = (): boolean => {
        let valido = true;

        setEmailError(null);
        setSenhaError(null);

        if (!email.trim()) {
            setEmailError('Informe seu e-mail.');
            valido = false;
        } else if (!email.includes('@') || !email.includes('.')) {
            setEmailError('E-mail inválido.');
            valido = false;
        }

        if (!senha.trim()) {
            setSenhaError('Informe sua senha.');
            valido = false;
        } else if (senha.length < 6) {
            setSenhaError('A senha deve ter pelo menos 6 caracteres.');
            valido = false;
        }

        return valido;
    };

    // Ação principal — chama a API e navega.
    const fazerLogin = async () => {
        if (!validar()) return;

        setCarregando(true);
        try {
            // 1. Tenta fazer login na API
            const resp = await authService.login({ email: email.trim(), password: senha });

            // 2. Monta um User parcial com o que o login devolveu
            const userBasic = {
                id_usuario: resp.userId,
                nome: resp.name,
                email: email.trim(),
                genero: null,
                is_patient: true,
                data_criacao: new Date().toISOString(),
            };

            // 3. Salva token + user na store (também salva no SecureStore)
            await loginStore(userBasic, resp.token);

            // 4. Agora que o token está no SecureStore, busca o perfil completo
            try {
                const perfilCompleto = await userService.getProfile();
                useAppStore.getState().setUser(perfilCompleto as any);
            } catch (e) {
                console.warn('[useLoginVM] Falha ao buscar perfil completo:', e);
            }

            // 5. Navega pra Home (substituindo Login no histórico)
            navigation.replace('DrawerRoot');
        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 401) {
                Alert.alert('Login falhou', 'E-mail ou senha incorretos.');
            } else if (status === 400) {
                Alert.alert('Dados inválidos', 'Verifique os campos e tente novamente.');
            } else if (error?.code === 'ECONNABORTED') {
                Alert.alert('Sem conexão', 'A API demorou pra responder.');
            } else {
                Alert.alert(
                    'Erro inesperado',
                    error?.response?.data?.error || 'Não foi possível conectar ao servidor.'
                );
            }

            console.log('[useLoginVM] Erro no login:', {
                status,
                data: error?.response?.data,
                message: error?.message,
            });
        } finally {
            setCarregando(false);
        }
    };

    // Navega pra tela de cadastro.
    const irParaRegistro = () => {
        navigation.navigate('Register');
    };

     // Navega pra tela de recuperação de senha
    const esqueciSenha = () => {
        navigation.navigate('ForgotPassword');
    };

    // Retorna TUDO o que a View precisa
    return {
        email,
        senha,
        carregando,
        emailError,
        senhaError,
        setEmail,
        setSenha,
        fazerLogin,
        irParaRegistro,
        esqueciSenha,
    };
}