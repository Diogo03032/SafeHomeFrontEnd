import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useStatsVM } from "@viewmodels/useStatsVM";
import { getThemeColors } from "@theme/colors";
import { SPACING, BORDER_RADIUS } from "@theme/spacing";
import { FONT_SIZES, FONT_WEIGHTS } from "@theme/typography";

interface AnelProps {
  porcentagem: number;
  cor: string;
  corFundo: string;
  tamanho?: number;
  espessura?: number;
}

function AnelDeProgresso({
  porcentagem,
  cor,
  corFundo,
  tamanho = 180,
  espessura = 16,
}: AnelProps) {
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const preenchimento = (porcentagem / 100) * circunferencia;
  const vazio = circunferencia - preenchimento;

  return (
    <Svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`}>
      <Circle
        cx={tamanho / 2}
        cy={tamanho / 2}
        r={raio}
        stroke={corFundo}
        strokeWidth={espessura}
        fill="none"
      />
      <Circle
        cx={tamanho / 2}
        cy={tamanho / 2}
        r={raio}
        stroke={cor}
        strokeWidth={espessura}
        fill="none"
        strokeDasharray={`${preenchimento} ${vazio}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
      />
    </Svg>
  );
}

export default function StatsScreen() {
  const vm = useStatsVM();
  const colors = getThemeColors("forest");

  // Loading inicial
  if (vm.carregando) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Calculando suas estatísticas...
        </Text>
      </SafeAreaView>
    );
  }

  //Erro ao carregar
  if (vm.erro || !vm.stats) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ fontSize: 48, marginBottom: SPACING.md }}>📊</Text>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          {vm.erro || "Sem dados pra mostrar agora."}
        </Text>
        <TouchableOpacity
          onPress={() => vm.carregar()}
          style={styles.retryButton}
        >
          <Text style={[styles.retryText, { color: colors.primary }]}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={vm.atualizando}
            onRefresh={() => vm.carregar(true)}
            colors={[colors.primary]}
          />
        }
      >
        <Text style={[styles.title, { color: colors.primaryDark }]}>
          Estatísticas
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Acompanhe sua jornada de autocuidado
        </Text>

        <View
          style={[
            styles.card,
            styles.cardCentered,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Consistência da rotina
          </Text>
          <Text style={[styles.cardSublabel, { color: colors.textSecondary }]}>
            Últimos 7 dias
          </Text>

          <View style={styles.anelContainer}>
            <AnelDeProgresso
              porcentagem={vm.stats.consistencia_rotina}
              cor={vm.corConsistencia}
              corFundo={colors.borderSubtle}
            />

            <View style={styles.anelTextoContainer}>
              <Text style={[styles.anelNumero, { color: vm.corConsistencia }]}>
                {vm.stats.consistencia_rotina}%
              </Text>
              <Text style={[styles.anelLabel, { color: colors.textSecondary }]}>
                {vm.labelConsistencia}
              </Text>
            </View>
          </View>

          <View style={styles.metasRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaNumero, { color: colors.primaryDark }]}>
                {vm.stats.metas_concluidas_semana}
              </Text>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Concluídas
              </Text>
            </View>
            <View
              style={[
                styles.metaDivider,
                { backgroundColor: colors.borderSubtle },
              ]}
            />
            <View style={styles.metaItem}>
              <Text style={[styles.metaNumero, { color: colors.primaryDark }]}>
                {vm.stats.metas_totais_semana}
              </Text>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Total da semana
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.estabilidadeRow}>
            <View style={styles.estabilidadeNumeroCol}>
              <Text
                style={[
                  styles.estabilidadeNumero,
                  { color: colors.status.success },
                ]}
              >
                {vm.stats.dias_estabilidade}
              </Text>
              <Text
                style={[
                  styles.estabilidadeLabel,
                  { color: colors.textSecondary },
                ]}
              >
                {vm.stats.dias_estabilidade === 1 ? "dia" : "dias"}
              </Text>
            </View>

            <View style={styles.estabilidadeInfo}>
              <Text
                style={[
                  styles.estabilidadeTitulo,
                  { color: colors.primaryDark },
                ]}
              >
                {vm.diasEstabilidadeLabel}
              </Text>
              <Text
                style={[
                  styles.estabilidadeDetalhe,
                  { color: colors.textSecondary },
                ]}
              >
                {vm.ultimoAlertaFormatado}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            styles.motivacionalCard,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          <Text style={styles.motivacionalIcone}>💚</Text>
          <Text
            style={[styles.motivacionalText, { color: colors.primaryDark }]}
          >
            {vm.stats.mensagem_motivacional}
          </Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.primaryDark }]}>
            Como calculamos
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Consistência: % de compromissos concluídos nos últimos 7 dias
            {"\n"}• Dias de estabilidade: tempo sem alerta crítico desde o
            último evento{"\n"}• Mensagem motivacional: gerada com base na sua
            faixa de consistência
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { alignItems: 'center', justifyContent: 'center' },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
    },
    errorText: {
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.md,
    },
    retryButton: { padding: SPACING.md },
    retryText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    scrollContent: {
        padding: SPACING.xl,
        paddingBottom: SPACING.xxl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        marginBottom: SPACING.xl,
    },

    card: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardCentered: { alignItems: 'center' },
    cardLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    cardSublabel: {
        fontSize: FONT_SIZES.xs,
        marginTop: 2,
        marginBottom: SPACING.lg,
    },

    //Anel de progresso
    anelContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    anelTextoContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    anelNumero: {
        fontSize: 42,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    anelLabel: {
        fontSize: FONT_SIZES.sm,
        marginTop: 2,
        fontWeight: FONT_WEIGHTS.medium as any,
    },

    // Metas (concluídas / totais) 
    metasRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: SPACING.sm,
    },
    metaItem: { alignItems: 'center', flex: 1 },
    metaNumero: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    metaLabel: {
        fontSize: FONT_SIZES.xs,
        marginTop: 2,
    },
    metaDivider: {
        width: 1,
        height: 32,
    },

    //Dias de estabilidade
    estabilidadeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    estabilidadeNumeroCol: {
        alignItems: 'center',
        marginRight: SPACING.lg,
        minWidth: 70,
    },
    estabilidadeNumero: {
        fontSize: 52,
        fontWeight: FONT_WEIGHTS.bold as any,
        lineHeight: 56,
    },
    estabilidadeLabel: {
        fontSize: FONT_SIZES.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    estabilidadeInfo: { flex: 1 },
    estabilidadeTitulo: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold as any,
        marginBottom: SPACING.xs,
    },
    estabilidadeDetalhe: {
        fontSize: FONT_SIZES.sm,
        lineHeight: 18,
    },

    //Mensagem motivacional
    motivacionalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    motivacionalIcone: { fontSize: 36 },
    motivacionalText: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium as any,
        lineHeight: 22,
    },

    //Info box
    infoBox: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginTop: SPACING.lg,
    },
    infoTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.bold as any,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.sm,
    },
    infoText: {
        fontSize: FONT_SIZES.sm,
        lineHeight: 22,
    },
});
