import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    useNavigation,
    CompositeNavigationProp,
} from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import * as userService from '@services/userService';
import type { UserProfile } from '@services/userService';
import type { GeneroValue } from '@services/authService';
import { useAppStore } from '@store/useAppStore';
import { getGenderLabel } from '@models/User';

import type {
    RootStackParamList,
    DrawerParamList,
} from '@navigation/AppNavigator';

type Navigation = CompositeNavigationProp<
    DrawerNavigationProp<DrawerParamList, 'Profile'>,
    NativeStackNavigationProp<RootStackParamList>
>;

export const OPCOES_GENERO: {
    label: string;
    value: GeneroValue;
}[] = [
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Outro', value: 'OUTRO' },
    { label: 'Prefiro não informar', value: 'NAO_INFORMADO' },
];

export function useProfileVM() {
    const navigation = useNavigation<Navigation>();

    const userFromStore = useAppStore((s) => s.user);

    const setUserStore = useAppStore((s) => s.setUser);

    const [perfil, setPerfil] = useState<UserProfile | null>(null);

    const [carregando, setCarregando] = useState(true);

    const [salvando, setSalvando] = useState(false);

    const [editando, setEditando] = useState(false);

    const [nomeEdit, setNomeEdit] = useState('');

    const [generoEdit, setGeneroEdit] = useState<GeneroValue | ''>('');

    const [bioEdit, setBioEdit] = useState('');

    const [erros, setErros] = useState<{ nome?: string; bio?: string }>({});

    const carregarPerfil = async () => {
        setCarregando(true);
        try {
            const data = await userService.getProfile();
            setPerfil(data);
        } catch (error: any) {
            console.warn('[useProfileVM] Erro ao buscar perfil:', error?.message);
            Alert.alert('Erro', 'Não foi possível carregar seu perfil.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarPerfil();
    }, []);

    const iniciarEdicao = () => {
        if (!perfil) return;
        setNomeEdit(perfil.nome);
        setGeneroEdit(perfil.genero || '');
        setBioEdit(perfil.bio || '');
        setErros({});
        setEditando(true);
    };

    const cancelarEdicao = () => {
        setEditando(false);
        setErros({});
    };

    const validar = (): boolean => {
        const novosErros: typeof erros = {};

        if (!nomeEdit.trim()) {
            novosErros.nome = 'O nome é obrigatório.';
        } else if (nomeEdit.trim().length < 2) {
            novosErros.nome = 'Nome muito curto.';
        }

        if (bioEdit.length > 200) {
            novosErros.bio =
                'A bio pode ter no máximo 200 caracteres.';
        }

        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    const salvarEdicao = async () => {
        if (!validar()) return;

        setSalvando(true);

        try {
            const payload: any = {};

            if (perfil) {
                if (nomeEdit.trim() !== perfil.nome)
                    payload.nome = nomeEdit.trim();

                if (
                    generoEdit &&
                    generoEdit !== perfil.genero
                )
                    payload.genero = generoEdit;

                if (bioEdit !== (perfil.bio || ''))
                    payload.bio = bioEdit;
            }

            if (Object.keys(payload).length === 0) {
                setEditando(false);
                setSalvando(false);
                return;
            }

            await userService.updateProfile(payload);

            const perfilAtualizado: UserProfile = {
                ...perfil!,
                nome: payload.nome ?? perfil!.nome,
                genero:
                    payload.genero ?? perfil!.genero,
                bio: payload.bio ?? perfil!.bio,
            };

            setPerfil(perfilAtualizado);
            setUserStore(perfilAtualizado as any);

            setEditando(false);

            Alert.alert(
                'Pronto!',
                'Seu perfil foi atualizado.'
            );
        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 400) {
                Alert.alert(
                    'Dados inválidos',
                    error?.response?.data?.error ||
                        'Verifique os campos.'
                );
            } else {
                Alert.alert(
                    'Erro',
                    'Não foi possível salvar agora.'
                );
            }
        } finally {
            setSalvando(false);
        }
    };

    const voltar = () => {
        if (editando) {
            Alert.alert(
                'Descartar alterações?',
                'Você fez mudanças que ainda não foram salvas.',
                [
                    {
                        text: 'Continuar editando',
                        style: 'cancel',
                    },
                    {
                        text: 'Descartar',
                        style: 'destructive',
                        onPress: () =>
                            navigation.goBack(),
                    },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    return {
        perfil,
        carregando,
        salvando,
        editando,
        nomeEdit,
        generoEdit,
        bioEdit,
        erros,
        opcoesGenero: OPCOES_GENERO,
        getGeneroLabel: getGenderLabel,
        primeiroNome:
            userFromStore?.nome?.split(' ')[0] ||
            perfil?.nome?.split(' ')[0] ||
            '?',
        setNomeEdit,
        setGeneroEdit,
        setBioEdit,
        iniciarEdicao,
        cancelarEdicao,
        salvarEdicao,
        voltar,
    };
}