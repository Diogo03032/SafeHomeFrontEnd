import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginVM } from "@viewmodels/useLoginVM";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import { getThemeColors } from "@theme/colors";
import { SPACING } from "@theme/spacing";
import { FONT_SIZES, FONT_WEIGHTS } from "@theme/typography";
import ScreenContainer from "@components/layout/ScreenContainer";
import GlassCard from "@components/ui/GlassCard";

export default function LoginScreen() {
  const vm = useLoginVM();
  const colors = getThemeColors("forest");

  return (
    <ScreenContainer variant="auth">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.appName, { color: "#fff" }]}>SafeHome</Text>
            <Text
              style={[styles.subtitle, { color: "rgba(255,255,255,0.85)" }]}
            >
              Bem-vindo de volta!
            </Text>
          </View>

          <GlassCard tint="light" intensity={80}>
            <Input
              label="E-mail"
              placeholder="seu@email.com"
              value={vm.email}
              onChangeText={vm.setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={vm.emailError}
              editable={!vm.carregando}
            />
            <Input
              label="Senha"
              placeholder="Sua senha"
              value={vm.senha}
              onChangeText={vm.setSenha}
              secureTextEntry
              autoComplete="password"
              error={vm.senhaError}
              editable={!vm.carregando}
            />

            <TouchableOpacity
              onPress={vm.esqueciSenha}
              style={styles.forgotLink}
            >
              <Text style={[styles.forgotText, { color: "#1d9e75" }]}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            <Button
              title="ENTRAR"
              onPress={vm.fazerLogin}
              loading={vm.carregando}
              style={{ marginTop: 16 }}
            />
          </GlassCard>

          {/* RODAPÉ */}
          <View style={styles.footer}>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>
              Não tem uma conta?{" "}
            </Text>
            <TouchableOpacity onPress={vm.irParaRegistro}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: "600",
                  textDecorationLine: "underline",
                }}
              >
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xxxl,
  },
  appName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold as any,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
    padding: SPACING.xs,
  },
  forgotText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium as any,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
  },
  footerLink: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold as any,
  },
});
