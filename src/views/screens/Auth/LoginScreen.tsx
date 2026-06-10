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
import { useLoginVM } from '@viewmodels/useLoginVM';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { SPACING } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';

export default function LoginScreen() {
    const vm = useLoginVM();

    return (
        <ScreenContainer variant="auth">
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
                        <Text style={styles.appName}>SafeHome</Text>
                        <Text style={styles.subtitle}>
                            Bem-vindo de volta!
                        </Text>
                    </View>

                    {/* FORMULÁRIO DENTRO DO GLASSCARD */}
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
                            <Text style={styles.forgotText}>
                                Esqueci minha senha
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="ENTRAR"
                            onPress={vm.fazerLogin}
                            loading={vm.carregando}
                            style={{ marginTop: SPACING.md }}
                        />
                    </GlassCard>

                    {/* RODAPÉ */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Não tem uma conta?{' '}
                        </Text>
                        <TouchableOpacity onPress={vm.irParaRegistro}>
                            <Text style={styles.footerLink}>
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
        color: '#fff',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: 'rgba(255,255,255,0.85)',
        marginTop: SPACING.xs,
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginTop: -SPACING.xs,
        marginBottom: SPACING.sm,
        padding: SPACING.xs,
    },
    forgotText: {
        color: '#1d9e75',
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
        color: 'rgba(255,255,255,0.85)',
        fontSize: FONT_SIZES.sm,
    },
    footerLink: {
        color: '#fff',
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold as any,
        textDecorationLine: 'underline',
    },
    demoButton: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
        marginTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    demoText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: FONT_SIZES.sm,
    },
});

