import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { SPACING } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';


export default function AboutScreen() {
    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Logo / Identidade */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>🏠</Text>
                    <Text style={styles.appName}>SafeHome</Text>
                    <Text style={styles.versao}>Versão 1.0.0</Text>
                </View>

                {/* Manifesto */}
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <Text style={styles.manifesto}>
                        SafeHome não é mais uma rede social.{'\n'}
                        É uma rede de apoio.
                    </Text>
                    <Text style={styles.manifestoSub}>
                        Cuidado, acessibilidade e segurança pra quem precisa de uma
                        rede que se importa de verdade.
                    </Text>
                </GlassCard>

                {/* Equipe */}
                <Text style={styles.secao}>EQUIPE</Text>
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <Text style={styles.equipeItem}>👨‍💻 Gil Alberice</Text>
                    <Text style={styles.equipeItem}>👨‍💻 João Vitor</Text>
                    <Text style={styles.equipeItem}>👨‍💻 Diogo Maranhão</Text>
                    <Text style={styles.equipeItem}>👨‍💻 Pedro Henrique</Text>
                </GlassCard>

                {/* Mentores */}
                <Text style={styles.secao}>MENTORES</Text>
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <Text style={styles.equipeItem}>👨‍🏫 Prof. Thiago</Text>
                    <Text style={styles.equipeItem}>👨‍🏫 Prof. William</Text>
                </GlassCard>

                {/* Links */}
                <Text style={styles.secao}>LINKS</Text>
                <GlassCard tint="dark" intensity={60}>
                    <LinkRow
                        label="Termos de uso"
                        url="https://safehome.app/termos"
                    />
                    <View style={styles.divider} />
                    <LinkRow
                        label="Política de privacidade"
                        url="https://safehome.app/privacidade"
                    />
                    <View style={styles.divider} />
                    <LinkRow
                        label="Repositório no GitHub"
                        url="https://github.com/GilsonVII/SafeHomeFrontEnd"
                    />
                </GlassCard>

                {/* Rodapé */}
                <Text style={styles.footer}>
                    © 2026 SafeHome.{'\n'}
                    Feito com 💚 em Espera Feliz, MG.
                </Text>
            </ScrollView>
        </ScreenContainer>
    );
}

function LinkRow({ label, url }: { label: string; url: string }) {
    const abrir = async () => {
        const podeAbrir = await Linking.canOpenURL(url);
        if (podeAbrir) Linking.openURL(url);
    };

    return (
        <TouchableOpacity onPress={abrir} style={styles.linkRow} accessibilityRole="link">
            <Text style={styles.linkText}>{label}</Text>
            <Text style={styles.chevron}>↗</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: SPACING.xl },
    logoContainer: { alignItems: 'center', marginBottom: SPACING.xl },
    logoIcon: { fontSize: 56, marginBottom: SPACING.sm },
    appName: {
        fontSize: 32,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
        letterSpacing: 1,
    },
    versao: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.xs,
    },
    manifesto: {
        fontSize: FONT_SIZES.lg,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.semibold as any,
        textAlign: 'center',
        lineHeight: 26,
    },
    manifestoSub: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginTop: SPACING.sm,
        lineHeight: 20,
    },
    secao: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.sm,
    },
    equipeItem: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        paddingVertical: SPACING.xs,
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    linkText: { color: '#fff', fontSize: FONT_SIZES.md },
    chevron: { color: 'rgba(255,255,255,0.6)', fontSize: 18 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
        fontSize: FONT_SIZES.xs,
        marginTop: SPACING.xl,
        lineHeight: 18,
    },
});
