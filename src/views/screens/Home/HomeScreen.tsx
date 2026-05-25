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
import { useHomeVM } from "@viewmodels/useHomeVM";
import { getThemeColors } from "@theme/colors";
import { SPACING, BORDER_RADIUS } from "@theme/spacing";
import { FONT_SIZES, FONT_WEIGHTS } from "@theme/typography";

export default function HomeScreen() {
  const vm = useHomeVM();
  const colors = getThemeColors("forest");

  // Decide a cor do status baseado no valor recebido da API.
  const getCorDoStatus = (): string => {
    if (!vm.status) return colors.textSecondary;
    switch (vm.status.status) {
      case "Estável":
        return colors.status.success;
      case "Atenção":
        return colors.status.warning;
      case "Crítico":
        return colors.status.danger;
      default:
        return colors.textSecondary;
    }
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={vm.atualizando}
            onRefresh={() => vm.carregarStatus(true)}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.saudacao, { color: colors.textSecondary }]}>
              {vm.saudacao},
            </Text>
            <Text style={[styles.nome, { color: colors.primaryDark }]}>
              {vm.primeiroNome}!
            </Text>
          </View>

          {/* Avatar / Botão de perfil */}
          <TouchableOpacity
            onPress={vm.irParaPerfil}
            style={[styles.avatar, { backgroundColor: colors.primary }]}
            accessibilityLabel="Ir para o perfil"
            accessibilityRole="button"
          >
            <Text style={[styles.avatarText, { color: colors.textOnPrimary }]}>
              {vm.primeiroNome.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===== CARD DE STATUS ===== */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Status do dia
          </Text>

          {vm.carregando ? (
            <ActivityIndicator
              color={colors.primary}
              style={{ marginVertical: SPACING.lg }}
            />
          ) : vm.status ? (
            <>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getCorDoStatus() },
                  ]}
                />
                <Text style={[styles.statusText, { color: getCorDoStatus() }]}>
                  {vm.status.status}
                </Text>
              </View>
              <Text
                style={[styles.statusDetail, { color: colors.textSecondary }]}
              >
                Consistência da rotina: {vm.status.consistencia_rotina}%
              </Text>
              <Text
                style={[styles.statusDetail, { color: colors.textSecondary }]}
              >
                {vm.status.dias_estabilidade} dia
                {vm.status.dias_estabilidade !== 1 ? "s" : ""} de estabilidade
              </Text>
            </>
          ) : (
            <Text
              style={[styles.statusDetail, { color: colors.textSecondary }]}
            >
              Não foi possível carregar seu status.
              {"\n"}Puxe pra baixo pra tentar novamente.
            </Text>
          )}
        </View>

        {/* ===== CARD DE ROTINA (placeholder) ===== */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
            Rotina de hoje
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            🕐 Sem compromissos por enquanto
          </Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Adicione lembretes de medicamentos, consultas e hidratação na tela
            de Agenda.
          </Text>
        </View>

        {/* ===== BOTÃO DE LOGOUT ===== */}
        <TouchableOpacity
          onPress={vm.fazerLogout}
          style={styles.logoutButton}
          accessibilityLabel="Sair da conta"
          accessibilityRole="button"
        >
          <Text style={[styles.logoutText, { color: colors.status.danger }]}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===== BOTÃO DE PÂNICO FLUTUANTE ===== */}
      <TouchableOpacity
        onPress={vm.acionarPanico}
        style={[styles.panicButton, { backgroundColor: colors.status.danger }]}
        accessibilityLabel="Acionar botão de pânico"
        accessibilityHint="Aciona alerta de emergência para seus contatos"
        accessibilityRole="button"
      >
        <Text style={styles.panicIcon}>!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: SPACING.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  saudacao: { fontSize: FONT_SIZES.md },
  nome: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold as any,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold as any,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    elevation: 1, // sombra no Android
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium as any,
    marginBottom: SPACING.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.pill,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold as any,
  },
  statusDetail: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    marginVertical: SPACING.sm,
  },
  hint: {
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },
  logoutButton: {
    alignItems: "center",
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium as any,
  },

  // Botão flutuante de pânico
  panicButton: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  panicIcon: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },
});
