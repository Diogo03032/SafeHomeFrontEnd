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

  // Carrega as estatísticas da API
  const carregar = useCallback(
    async (modoAtualizacao = false) => {
      if (!user) return;

      if (modoAtualizacao) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }
      setErro(null);

      try {
        const data = await statsService.getUserStats(user.id_usuario);
        setStats(data);
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 403) {
          setErro("Você não tem permissão para ver essas estatísticas.");
        } else if (status === 404) {
          setErro("Paciente não encontrado.");
        } else {
          setErro("Não foi possível carregar as estatísticas agora.");
        }
        console.warn("[useStatsVM] Erro:", error?.message);
        setStats(null);
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [user],
  );
}
