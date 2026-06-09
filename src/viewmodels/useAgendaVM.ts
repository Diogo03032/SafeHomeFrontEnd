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

    const [dataSelecionada, setDataSelecionada] = useState<string>(() => {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`; // YYYY-MM-DD no fuso LOCAL
    });

    const [ocorrencias, setOcorrencias] = useState<AgendaOccurrence[]>([]);
    const [notas, setNotas] = useState<MonthlyNote[]>([]);

    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    const [novaNota, setNovaNota] = useState('');
    const [salvandoNota, setSalvandoNota] = useState(false);

    const carregarDados = useCallback(async (modoAtualizacao = false) => {
        if (!user) return;
 
        console.log('[Agenda] pedindo data:', dataSelecionada);

        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);
 
        try {
            const mesRef = dataSelecionada.slice(0, 7); // YYYY-MM

            const [ocs, ntas] = await Promise.all([
                agendaService.listOccurrencesByDate(user.id_usuario, dataSelecionada),
                agendaService.listMonthlyNotes(user.id_usuario, mesRef).catch(() => []),
            ]);
 
            console.log('[Agenda] recebeu ocorrencias:', ocs.length);

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
    }, [user, dataSelecionada]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
            carregarMarcacoesDoMes();
        }, [carregarDados, carregarMarcacoesDoMes])
    );

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

    const mudarData = (novaData: string) => {
        setDataSelecionada(novaData);
    };

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