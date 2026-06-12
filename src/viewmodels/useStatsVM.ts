import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as statsService from "@services/statsService";
import type { UserStats } from "@services/statsService";
import { useAppStore } from "@store/useAppStore";


export function useStatsVM() {
  const user = useAppStore((s) => s.user);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);


  const carregar = useCallback(async (modoAtualizacao = false) => {
        if (!user) return;

        if (modoAtualizacao) setAtualizando(true);
        else setCarregando(true);
        setErro(null);

        try {
            const data = await statsService.getUserStats(user.id_usuario);
            setStats(data);
        } catch (error: any) {

            const status = error?.response?.status;

            if (status === 403) setErro('Você não tem permissão para ver essas estatísticas.');

            else if (status === 404) setErro('Paciente não encontrado.');

            else setErro('Não foi possível carregar as estatísticas agora.');
            
            console.warn('[useStatsVM] Erro:', error?.message);
            setStats(null);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    const getCorConsistencia = (): string => {
        if (!stats) return '#999';
        if (stats.consistencia_rotina >= 80) return '#2e8b57';
        if (stats.consistencia_rotina >= 50) return '#d4a647';
        return '#e07d6b';
    };

    // texto de consistencia de rotina
    const getLabelConsistencia = (): string => {
        if (!stats) return '';
        if (stats.consistencia_rotina >= 80) return 'Excelente';
        if (stats.consistencia_rotina >= 50) return 'Bom';
        if (stats.consistencia_rotina >= 20) return 'Pode melhorar';
        return 'Vamos começar?';
    };

    // Formata a data do último alerta
    const getUltimoAlertaFormatado = (): string => {
        if (!stats?.ultimo_alerta_critico) {
            return 'Nenhum alerta crítico até agora 🌟';
        }
        const data = new Date(stats.ultimo_alerta_critico);
        return `Último alerta em ${data.toLocaleDateString('pt-BR')}`;
    };

    // Texto pros dias de estabilidade
    const getDiasEstabilidadeLabel = (): string => {
        if (!stats) return '';
        const d = stats.dias_estabilidade;
        if (d === 0) return 'Acabamos de começar';
        if (d === 1) return '1 dia de estabilidade';
        return `${d} dias de estabilidade`;
    };

    return {
        user,
        stats,
        carregando,
        atualizando,
        erro,
        corConsistencia: getCorConsistencia(),
        labelConsistencia: getLabelConsistencia(),
        diasEstabilidadeLabel: getDiasEstabilidadeLabel(),
        ultimoAlertaFormatado: getUltimoAlertaFormatado(),
        carregar,
    };
}
