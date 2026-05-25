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
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    });

    // Dados
    const [ocorrencias, setOcorrencias] = useState<AgendaOccurrence[]>([]);
    const [notas, setNotas] = useState<MonthlyNote[]>([]);

    // Loading flags
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    // Estado pra adicionar nova nota
    const [novaNota, setNovaNota] = useState('');
    const [salvandoNota, setSalvandoNota] = useState(false);

    // Carrega as ocorrências do dia + notas do mês
    const carregarDados = useCallback(async (modoAtualizacao = false) => {
        if (!user) return;

        if (modoAtualizacao) {
            setAtualizando(true);
        } else {
            setCarregando(true);
        }

        try {
            // Mês de referência das notas vem da data selecionada
            const mesRef = dataSelecionada.slice(0, 7); // YYYY-MM

            // Faz as duas chamadas em paralelo (mais rápido)
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

    // Recarrega sempre que a tela ganha foco OU a data muda
    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    // Marca ocorrência como concluída (ou desmarca)
    const alternarConcluido = async (ocorrencia: AgendaOccurrence) => {
        const novoStatus = !ocorrencia.status_concluido;

        // Atualização otimista: muda na UI imediatamente
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
            // Em caso de erro, reverte
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
            // Recarrega pra mostrar a nova nota
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
        alternarConcluido,
        adicionarNota,
    };
}
