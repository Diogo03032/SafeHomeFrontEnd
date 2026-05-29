import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginVM } from '@viewmodels/useLoginVM';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { getThemeColors } from '@theme/colors';
import { SPACING } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function LoginScreen() {
    // Pega TUDO o que precisamos do ViewModel
    const vm = useLoginVM();
    const colors = getThemeColors('forest');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={[styles.appName, { color: colors.primaryDark }]}>SafeHome</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Bem-vindo de volta!
                        </Text>
                    </View>

                    {/* FORMULÁRIO */}
                    <View style={styles.form}>
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

                        {/* Link "Esqueci a senha" */}
                        <TouchableOpacity
                            onPress={vm.esqueciSenha}
                            style={styles.forgotLink}
                            accessibilityRole="link"
                        >
                            <Text style={[styles.forgotText, { color: colors.primary }]}>
                                Esqueci minha senha
                            </Text>
                        </TouchableOpacity>

                        {/* Botão principal */}
                        <Button
                            title="ENTRAR"
                            onPress={vm.fazerLogin}
                            loading={vm.carregando}
                            style={{ marginTop: SPACING.lg }}
                        />
                    </View>

                    {/* RODAPÉ — Link pro registro */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Não tem uma conta?{' '}
                        </Text>
                        <TouchableOpacity onPress={vm.irParaRegistro} accessibilityRole="link">
                            <Text style={[styles.footerLink, { color: colors.primary }]}>
                                Cadastre-se
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* ===== MODO DEMO (remover antes de publicar!) ===== */}
                    <TouchableOpacity
                        onPress={vm.entrarModoDemo}
                        style={{
                            alignItems: 'center',
                            paddingVertical: 16,
                            marginTop: 24,
                            borderTopWidth: 1,
                            borderTopColor: colors.borderSubtle,
                        }}
                    >
                        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                            🧪 Entrar sem conta (Demo)
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
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
        alignSelf: 'flex-end',
        marginTop: -SPACING.xs,
        marginBottom: SPACING.sm,
        padding: SPACING.xs,
    },
    forgotText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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