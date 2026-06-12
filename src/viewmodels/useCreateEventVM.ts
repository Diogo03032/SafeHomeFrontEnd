import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as agendaService from '@services/agendaService';
import type { AgendaEventType, CreateTemplatePayload } from '@services/agendaService';
import { useAppStore } from '@store/useAppStore';



// Opções pro seletor de tipo na tela .
export const TIPOS_EVENTO: { label: string; value: AgendaEventType }[] = [
    { label: 'Medicamento', value: 'MEDICAMENTO' },
    { label: 'Consulta', value: 'CONSULTA' },
    { label: 'Sono', value: 'SONO' },
    { label: 'Hidratação', value: 'HIDRATACAO' },
    { label: 'Meditação', value: 'MEDITACAO' },
    { label: 'Evento', value: 'EVENTO' },
    { label: 'Geral', value: 'GERAL' },
];

// Pega a data de hoje no formato YYYY-MM-DD 
const hojeISO = (): string => {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

const REGEX_HORA = /^\d{2}:\d{2}$/;         
const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;   

export function useCreateEventVM() {
    const navigation = useNavigation<any>();
    const user = useAppStore((s) => s.user);


    // ===== Estados dos campos =====
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState<AgendaEventType>('GERAL');
    const [hora, setHora] = useState('');          
    const [dataInicio, setDataInicio] = useState(hojeISO());
    const [dataFim, setDataFim] = useState('');      
    const [salvando, setSalvando] = useState(false);

    // ===== Erros por campo =====
    const [erros, setErros] = useState<{
        titulo?: string;
        hora?: string;
        dataInicio?: string;
        dataFim?: string;
    }>({});

    // Validação antes de chamar a API.
    const validar = (): boolean => {
        const novos: typeof erros = {};

        if (!titulo.trim()) {
            novos.titulo = 'Dê um nome pro evento.';
        } else if (titulo.trim().length > 100) {
            novos.titulo = 'O título está muito longo.';
        }

        if (!hora.trim()) {
            novos.hora = 'Informe o horário.';
        } else if (!REGEX_HORA.test(hora.trim())) {
            novos.hora = 'Use o formato HH:mm (ex: 08:30).';
        }

        if (!dataInicio.trim()) {
            novos.dataInicio = 'Informe a data de início.';
        } else if (!REGEX_DATA.test(dataInicio.trim())) {
            novos.dataInicio = 'Use o formato AAAA-MM-DD.';
        }

      
        if (dataFim.trim()) {
            if (!REGEX_DATA.test(dataFim.trim())) {
                novos.dataFim = 'Use o formato AAAA-MM-DD.';
            } else if (dataFim.trim() < dataInicio.trim()) {
                novos.dataFim = 'A data final não pode ser antes do início.';
            }
        }

        setErros(novos);
        return Object.keys(novos).length === 0;
    };

    // Ação principal — cria o template e volta pra agenda.
    const salvar = async () => {
        
        if (!user) {
            Alert.alert('Ops', 'Você precisa estar logado.');
            return;
        }
        if (!validar()) return;

        const payload: CreateTemplatePayload = {
            id_paciente: user.id_usuario,
            titulo: titulo.trim(),
            descricao: descricao.trim() || null,
            data_hora: hora.trim(),
            data_inicio: dataInicio.trim(),
            data_fim: dataFim.trim() || null,
            tipo,
        };

        setSalvando(true);
        try {

            await agendaService.createTemplate(payload);
            Alert.alert('Pronto!', 'Seu evento foi criado e já aparece na agenda.');
            navigation.goBack();
        } catch (error: any) {
            const status = error?.response?.status;

            if (status === 400) {
                Alert.alert(
                    'Dados inválidos',
                    error?.response?.data?.error || 'Verifique os campos e tente novamente.'
                );
            } else if (status === 403) {
                Alert.alert(
                    'Sem permissão',
                    'Você não tem permissão para criar eventos para este paciente.'
                );
            } else {
                Alert.alert('Erro', 'Não foi possível criar o evento agora.');
            }

            console.warn('[useCreateEventVM] Erro ao criar template:', {
                status,
                data: error?.response?.data,
                message: error?.message,
            });
        } finally {
            setSalvando(false);
        }
    };

    // Cancela e volta (avisa se houver alterações não salvas)
    const cancelar = () => {
        const temAlteracoes =
            titulo.trim() || descricao.trim() || hora.trim() || dataFim.trim();

        if (temAlteracoes) {
            Alert.alert(
                'Descartar evento?',
                'Você começou a preencher o evento. Quer mesmo sair sem salvar?',
                [
                    { text: 'Continuar editando', style: 'cancel' },
                    {
                        text: 'Descartar',
                        style: 'destructive',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    return {
        titulo,
        descricao,
        tipo,
        hora,
        dataInicio,
        dataFim,
        salvando,
        erros,
        opcoesTipo: TIPOS_EVENTO,
        setTitulo,
        setDescricao,
        setTipo,
        setHora,
        setDataInicio,
        setDataFim,
        salvar,
        cancelar,
    };
}
