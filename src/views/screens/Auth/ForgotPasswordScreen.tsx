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
import { useForgotPasswordVM } from '@viewmodels/useForgotPasswordVM';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function ForgotPasswordScreen() {
    const vm = useForgotPasswordVM();
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
                        <TouchableOpacity
                            onPress={vm.voltarParaLogin}
                            style={styles.backButton}
                            accessibilityLabel="Voltar"
                            accessibilityRole="button"
                        >
                            <Text style={[styles.backIcon, { color: colors.primaryDark }]}>←</Text>
                        </TouchableOpacity>

                        {/* Ícone temático */}
                        <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                            <Text style={styles.iconText}>🔑</Text>
                        </View>

                        <Text style={[styles.title, { color: colors.primaryDark }]}>
                            Recuperar senha
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Informe seu e-mail e defina uma nova senha pra acessar sua conta.
                        </Text>
                    </View>

                    {/* FORMULÁRIO */}
                    <View style={styles.form}>
                        <Input
                            label="E-mail cadastrado"
                            placeholder="seu@email.com"
                            value={vm.email}
                            onChangeText={vm.setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            error={vm.erros.email}
                            editable={!vm.carregando}
                        />

                        <Input
                            label="Nova senha"
                            placeholder="Mínimo 6 caracteres"
                            value={vm.novaSenha}
                            onChangeText={vm.setNovaSenha}
                            secureTextEntry
                            error={vm.erros.novaSenha}
                            editable={!vm.carregando}
                        />

                        <Input
                            label="Confirme a nova senha"
                            placeholder="Digite a nova senha de novo"
                            value={vm.confirmaSenha}
                            onChangeText={vm.setConfirmaSenha}
                            secureTextEntry
                            error={vm.erros.confirmaSenha}
                            editable={!vm.carregando}
                        />

                        {/* Dica de segurança */}
                        <View style={[styles.tipBox, { backgroundColor: colors.primaryLight }]}>
                            <Text style={styles.tipIcon}>💡</Text>
                            <Text style={[styles.tipText, { color: colors.primaryDark }]}>
                                Use uma senha forte: misture letras, números e símbolos.
                            </Text>
                        </View>

                        <Button
                            title="ALTERAR SENHA"
                            onPress={vm.recuperarSenha}
                            loading={vm.carregando}
                            style={{ marginTop: SPACING.lg }}
                        />
                    </View>

                    {/* RODAPÉ — voltar pro login */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Lembrei minha senha!{' '}
                        </Text>
                        <TouchableOpacity onPress={vm.voltarParaLogin} accessibilityRole="link">
                            <Text style={[styles.footerLink, { color: colors.primary }]}>
                                Voltar pro login
                            </Text>
                        </TouchableOpacity>
                    </View>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: SPACING.sm,
        marginLeft: -SPACING.sm,
        marginBottom: SPACING.md,
    },
    backIcon: { fontSize: 28, fontWeight: '500' },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: BORDER_RADIUS.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    iconText: { fontSize: 32 },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        marginTop: SPACING.sm,
        paddingHorizontal: SPACING.md,
        lineHeight: 22,
    },
    form: { marginBottom: SPACING.lg },
    tipBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    tipIcon: { fontSize: 16 },
    tipText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    footerText: { fontSize: FONT_SIZES.sm },
    footerLink: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
});