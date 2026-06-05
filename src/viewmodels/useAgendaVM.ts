import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as agendaService from '@services/agendaService';
import type { AgendaOccurrence, MonthlyNote } from '@services/agendaService';
import { useAppStore } from '@store/useAppStore';
 
//==========================MOCK APAGAR DEPOIS=====================
import { useDemoMode } from '@hooks/useDemoMode';
import { MOCK_AGENDA_OCCURRENCES, MOCK_AGENDA_NOTES } from '@utils/mockData';
//===============================================================
 
export function useAgendaVM() {
    const user = useAppStore((s) => s.user);
 
    // Estado da data selecionada (default: hoje)
    const [dataSelecionada, setDataSelecionada] = useState<string>(() => {
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
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
 
    //============================== MOCK MUDAR DEPOIS ======================
    const isDemoMode = useDemoMode();
 
    // Carrega as ocorrências do dia + notas do mês
    const carregarDados = useCallback(async (modoAtualizacao = false) => {
        if (!user) return;
 
        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);
 
        try {
            // Modo demo
            if (isDemoMode) {
                await new Promise((r) => setTimeout(r, 200));
                setOcorrencias(MOCK_AGENDA_OCCURRENCES);
                setNotas(MOCK_AGENDA_NOTES);
                return;
            }
 
            const mesRef = dataSelecionada.slice(0, 7);
            const [ocs, ntas] = await Promise.all([
                agendaService.listOccurrencesByDate(user.id_usuario, dataSelecionada),
                agendaService.listMonthlyNotes(user.id_usuario, mesRef).catch(() => []),
            ]);
 
            setOcorrencias(ocs);
            setNotas(ntas);
        } catch (error: any) {
            console.warn('[useAgendaVM] Erro ao carregar:', error?.message);
            if (isDemoMode) {
                setOcorrencias(MOCK_AGENDA_OCCURRENCES);
                setNotas(MOCK_AGENDA_NOTES);
            }
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [user, dataSelecionada, isDemoMode]);
    //=======================================================================
 
    // Carrega as marcações do mês (quais dias têm compromisso).
    // Busca todas as ocorrências do paciente e filtra pelo mês atual.
    const carregarMarcacoesDoMes = useCallback(async () => {
        if (!user) return;
 
        try {
            // Modo demo: marca os próprios dias que vieram no mock
            if (isDemoMode) {
                const datas = MOCK_AGENDA_OCCURRENCES.map((o) => o.data_ocorrencia);
                setDiasComEvento([...new Set(datas)]);
                return;
            }
 
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
    }, [user, dataSelecionada, isDemoMode]);
 
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
        adicionarNota,
    };
}
