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
import { useRegisterVM } from '@viewmodels/useRegisterVM';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function RegisterScreen() {
    const vm = useRegisterVM();
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
                            onPress={vm.irParaLogin}
                            style={styles.backButton}
                            accessibilityLabel="Voltar"
                            accessibilityRole="button"
                        >
                            <Text style={[styles.backIcon, { color: colors.primaryDark }]}>←</Text>
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: colors.primaryDark }]}>Criar conta</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Junte-se ao SafeHome
                        </Text>
                    </View>

                    {/* FORMULÁRIO */}
                    <View style={styles.form}>
                        <Input
                            label="Nome completo"
                            placeholder="Como devemos te chamar?"
                            value={vm.nome}
                            onChangeText={vm.setNome}
                            autoCapitalize="words"
                            error={vm.erros.nome}
                            editable={!vm.carregando}
                        />

                        <Input
                            label="E-mail"
                            placeholder="seu@email.com"
                            value={vm.email}
                            onChangeText={vm.setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            error={vm.erros.email}
                            editable={!vm.carregando}
                        />

                        {/* ===== SELETOR DE GÊNERO — BOTÕES, NÃO TEXTO LIVRE! ===== */}
                        <View style={styles.generoSection}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>
                                Gênero
                            </Text>
                            <View style={styles.generoGrid}>
                                {vm.opcoesGenero.map((opcao) => {
                                    const selecionado = vm.genero === opcao.value;
                                    return (
                                        <TouchableOpacity
                                            key={opcao.value}
                                            onPress={() => vm.setGenero(opcao.value)}
                                            style={[
                                                styles.generoOpcao,
                                                {
                                                    backgroundColor: selecionado ? colors.primary : colors.surface,
                                                    borderColor: selecionado ? colors.primary : colors.border,
                                                },
                                            ]}
                                            disabled={vm.carregando}
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected: selecionado }}
                                        >
                                            <Text
                                                style={[
                                                    styles.generoTexto,
                                                    {
                                                        color: selecionado ? colors.textOnPrimary : colors.textPrimary,
                                                        fontWeight: selecionado ? '600' : '400',
                                                    },
                                                ]}
                                            >
                                                {opcao.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            {vm.erros.genero && (
                                <Text style={[styles.error, { color: colors.status.danger }]}>
                                    {vm.erros.genero}
                                </Text>
                            )}
                        </View>

                        <Input
                            label="Senha"
                            placeholder="Mínimo 6 caracteres"
                            value={vm.senha}
                            onChangeText={vm.setSenha}
                            secureTextEntry
                            error={vm.erros.senha}
                            editable={!vm.carregando}
                        />

                        <Input
                            label="Confirme sua senha"
                            placeholder="Digite a senha novamente"
                            value={vm.confirmaSenha}
                            onChangeText={vm.setConfirmaSenha}
                            secureTextEntry
                            error={vm.erros.confirmaSenha}
                            editable={!vm.carregando}
                        />

                        <Button
                            title="CADASTRAR"
                            onPress={vm.cadastrar}
                            loading={vm.carregando}
                            style={{ marginTop: SPACING.lg }}
                        />
                    </View>

                    {/* RODAPÉ */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Já tem uma conta?{' '}
                        </Text>
                        <TouchableOpacity onPress={vm.irParaLogin} accessibilityRole="link">
                            <Text style={[styles.footerLink, { color: colors.primary }]}>
                                Faça login
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
        paddingTop: SPACING.lg,
    },
    header: { marginBottom: SPACING.xl },
    backButton: {
        alignSelf: 'flex-start',
        padding: SPACING.sm,
        marginBottom: SPACING.md,
        marginLeft: -SPACING.sm,
    },
    backIcon: { fontSize: 28, fontWeight: '500' },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        marginTop: SPACING.xs,
    },
    form: { marginBottom: SPACING.xl },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    generoSection: { marginBottom: SPACING.md },
    generoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    generoOpcao: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
        minWidth: '45%',
        alignItems: 'center',
    },
    generoTexto: { fontSize: FONT_SIZES.sm },
    error: {
        fontSize: FONT_SIZES.xs,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
    },
    footerText: { fontSize: FONT_SIZES.sm },
    footerLink: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
});