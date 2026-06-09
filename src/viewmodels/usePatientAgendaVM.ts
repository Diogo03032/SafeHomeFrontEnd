import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import * as agendaService from '@services/agendaService';
import type { AgendaOccurrence } from '@services/agendaService';

// Params vindos da PatientView (aba Agenda -> "ABRIR AGENDA")
interface PatientAgendaParams {
    idPaciente: number;
    nomePaciente: string;
    podeEditar: boolean;
}

export function usePatientAgendaVM() {
    const route = useRoute();
    const { idPaciente, nomePaciente, podeEditar } = route.params as PatientAgendaParams;

    const [dataSelecionada, setDataSelecionada] = useState<string>(
        () => new Date().toISOString().split('T')[0]
    );
    const [ocorrencias, setOcorrencias] = useState<AgendaOccurrence[]>([]);
    const [diasComEvento, setDiasComEvento] = useState<string[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // Carrega as ocorrências do paciente no dia selecionado
    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const ocs = await agendaService.listOccurrencesByDate(idPaciente, dataSelecionada);
            setOcorrencias(ocs);
        } catch (error: any) {
            const status = error?.response?.status;
            if (status === 403) setErro('Você não tem permissão para ver a agenda deste paciente.');
            else setErro('Não foi possível carregar a agenda.');
            console.warn('[usePatientAgendaVM] Erro:', error?.message);
            setOcorrencias([]);
        } finally {
            setCarregando(false);
        }
    }, [idPaciente, dataSelecionada]);

    // Marca os dias do mês que têm compromisso (bolinha no calendário)
    const carregarMarcacoesDoMes = useCallback(async () => {
        try {
            const todas = await agendaService.listOccurrences(idPaciente);
            const mesRef = dataSelecionada.slice(0, 7);
            const datas = todas
                .filter((o) => o.data_ocorrencia.startsWith(mesRef))
                .map((o) => o.data_ocorrencia);
            setDiasComEvento([...new Set(datas)]);
        } catch (error: any) {
            console.warn('[usePatientAgendaVM] Falha nas marcações:', error?.message);
            setDiasComEvento([]);
        }
    }, [idPaciente, dataSelecionada]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
            carregarMarcacoesDoMes();
        }, [carregarDados, carregarMarcacoesDoMes])
    );

    const alternarConcluido = async (ocorrencia: AgendaOccurrence) => {
        if (!podeEditar) return;

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
            // Reverte
            setOcorrencias((prev) =>
                prev.map((o) =>
                    o.id_ocorrencia === ocorrencia.id_ocorrencia
                        ? { ...o, status_concluido: !novoStatus }
                        : o
                )
            );
            Alert.alert('Erro', 'Não foi possível atualizar o status.');
        }
    };

    const mudarData = (novaData: string) => setDataSelecionada(novaData);

    const totalConcluidas = ocorrencias.filter((o) => o.status_concluido).length;
    const totalOcorrencias = ocorrencias.length;

    return {
        idPaciente,
        nomePaciente,
        podeEditar,
        dataSelecionada,
        ocorrencias,
        diasComEvento,
        carregando,
        erro,
        totalConcluidas,
        totalOcorrencias,
        mudarData,
        carregarMarcacoesDoMes,
        alternarConcluido,
    };
}
