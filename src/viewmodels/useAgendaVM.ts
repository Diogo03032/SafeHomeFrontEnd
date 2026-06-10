import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as agendaService from '@services/agendaService';
import type { AgendaOccurrence, MonthlyNote } from '@services/agendaService';
import { useAppStore } from '@store/useAppStore';


export function useAgendaVM() {
    const user = useAppStore((s) => s.user);

    // Estado da data selecionada (default: hoje)
    const [dataSelecionada, setDataSelecionada] = useState<string>(() => {
        const d = new Date();
        const ano = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`; 
    });

    // Dados
    const [ocorrencias, setOcorrencias] = useState<AgendaOccurrence[]>([]);
    const [notas, setNotas] = useState<MonthlyNote[]>([]);

    // Dias do mês que têm compromisso (pra marcar a bolinha no calendário)
    const [diasComEvento, setDiasComEvento] = useState<string[]>([]);

    // Loading flags
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    // Estado pra adicionar nova nota
    const [novaNota, setNovaNota] = useState('');
    const [salvandoNota, setSalvandoNota] = useState(false);


    // Carrega as ocorrências do dia + notas do mês
  const carregarDados = useCallback(async (modoAtualizacao = false) => {
        if (!user) return;

        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);

        try {
            const mesRef = dataSelecionada.slice(0, 7);
            const [ocs, ntas] = await Promise.all([
                agendaService.listOccurrencesByDate(user.id_usuario, dataSelecionada),
                agendaService.listMonthlyNotes(user.id_usuario, mesRef).catch(() => []),
            ]);

            setOcorrencias(ocs);
            setNotas(ntas);
        } catch (error: any) {
            console.warn('[useAgendaVM] Erro ao carregar:', error?.message);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [user, dataSelecionada]);

    // Carrega as marcações do mês (quais dias têm compromisso).
    const carregarMarcacoesDoMes = useCallback(async () => {
        if (!user) return;

        try {
            const todas = await agendaService.listOccurrences(user.id_usuario);
            const mesRef = dataSelecionada.slice(0, 7); // YYYY-MM

            const datasDoMes = todas
                .filter((o) => o.data_ocorrencia.startsWith(mesRef))
                .map((o) => o.data_ocorrencia);

            setDiasComEvento([...new Set(datasDoMes)]);
        } catch (error: any) {
            console.warn('[useAgendaVM] Falha ao carregar marcações do mês:', error?.message);
            setDiasComEvento([]);
        }
    }, [user, dataSelecionada]);

    // Recarrega sempre que a tela ganha foco OU a data muda
    useFocusEffect(
        useCallback(() => {
            carregarDados();
            carregarMarcacoesDoMes();
        }, [carregarDados, carregarMarcacoesDoMes])
    );

    // Marca ocorrência como concluída (ou desmarca)
    const alternarConcluido = async (ocorrencia: AgendaOccurrence) => {
        const novoStatus = !ocorrencia.status_concluido;

        setOcorrencias((prev) =>
            prev.map((o) =>
                o.id_ocorrencia === ocorrencia.id_ocorrencia
                    ? { ...o, status_concluido: novoStatus }
                    : o
            )
        );

        try {
            await agendaService.markOccurrenceAsDone(ocorrencia.id_ocorrencia, novoStatus);
        } catch (error) {
            setOcorrencias((prev) =>
                prev.map((o) =>
                    o.id_ocorrencia === ocorrencia.id_ocorrencia
                        ? { ...o, status_concluido: !novoStatus }
                        : o
                )
            );
            Alert.alert('Erro', 'Não foi possível atualizar o status. Tente novamente.');
        }
    };

    // Exclui um evento e TODAS as suas ocorrências
    const excluirEvento = (ocorrencia: AgendaOccurrence) => {
        Alert.alert(
            'Excluir evento',
            `"${ocorrencia.titulo ?? 'Este compromisso'}" será removido de todos os dias da agenda. Tem certeza?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        
                        const backup = ocorrencias;
                        setOcorrencias((prev) =>
                            prev.filter((o) => o.id_evento !== ocorrencia.id_evento)
                        );
                        try {
                            await agendaService.deleteTemplate(ocorrencia.id_evento);
                           
                            await carregarMarcacoesDoMes();
                        } catch (error) {
                            
                            setOcorrencias(backup);
                            Alert.alert('Erro', 'Não foi possível excluir o evento agora.');
                        }
                    },
                },
            ]
        );
    };

const excluirNota = (nota: MonthlyNote) => {
    Alert.alert(
        'Excluir nota',
        'Tem certeza que quer excluir esta nota?',
        [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    const backup = notas;
                   
                    setNotas((prev) => prev.filter((n) => n.id_nota !== nota.id_nota));
                    try {
                        await agendaService.deleteMonthlyNote(nota.id_nota);
                    } catch (error) {
                        setNotas(backup); 
                        Alert.alert('Erro', 'Não foi possível excluir a nota agora.');
                    }
                },
            },
        ]
    );
};

    // Adiciona uma nova nota mensal
    const adicionarNota = async () => {
        if (!user) return;
        if (!novaNota.trim()) {
            Alert.alert('Atenção', 'Escreva algo na nota antes de salvar.');
            return;
        }
        if (novaNota.length > 500) {
            Alert.alert('Atenção', 'A nota pode ter no máximo 500 caracteres.');
            return;
        }

        setSalvandoNota(true);
        try {
            const mesRef = dataSelecionada.slice(0, 7);
            await agendaService.addMonthlyNote(user.id_usuario, mesRef, novaNota.trim());
            setNovaNota('');
            await carregarDados();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar sua nota agora.');
        } finally {
            setSalvandoNota(false);
        }
    };

    // Muda o dia selecionado
    const mudarData = (novaData: string) => {
        setDataSelecionada(novaData);
    };

    // Helpers
    const totalConcluidas = ocorrencias.filter((o) => o.status_concluido).length;
    const totalOcorrencias = ocorrencias.length;
    const percentualConcluido = totalOcorrencias > 0
        ? Math.round((totalConcluidas / totalOcorrencias) * 100)
        : 0;

    return {
        user,
        dataSelecionada,
        ocorrencias,
        notas,
        diasComEvento,
        carregando,
        atualizando,
        novaNota,
        salvandoNota,
        totalConcluidas,
        totalOcorrencias,
        percentualConcluido,
        setNovaNota,
        mudarData,
        carregarDados,
        carregarMarcacoesDoMes,
        alternarConcluido,
        excluirEvento,
        adicionarNota,
        excluirNota,
    };
}
