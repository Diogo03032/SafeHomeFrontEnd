import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function AboutScreen() {
    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* LOGO / IDENTIDADE */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Icon name="shield" size={48} color="#fff" />
                    </View>
                    <Text style={styles.appName}>SafeHome</Text>
                    <Text style={styles.versao}>Versão 1.0.0</Text>
                </View>

                {/* MANIFESTO */}
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

                {/* EQUIPE */}
                <Text style={styles.secao}>EQUIPE</Text>
                <GlassCard tint="dark" intensity={60} padding="md" style={{ marginBottom: SPACING.md }}>
                    <PersonRow nome="Gilson J Alberice" papel="Líder técnico" />
                    <View style={styles.divider} />
                    <PersonRow nome="João Vitor Façanha" papel="Desenvolvedor" />
                    <View style={styles.divider} />
                    <PersonRow nome="Diogo Maranhão" papel="Desenvolvedor" />
                    <View style={styles.divider} />
                    <PersonRow nome="Pedro Henrique Toscano" papel="Desenvolvedor" />
                </GlassCard>

                {/* MENTORES */}
                <Text style={styles.secao}>MENTORES</Text>
                <GlassCard tint="dark" intensity={60} padding="md" style={{ marginBottom: SPACING.md }}>
                    <PersonRow nome="Prof. Thiago Goldoni" papel="Orientador" />
                    <View style={styles.divider} />
                    <PersonRow nome="Prof. William Leal" papel="Orientador" />
                </GlassCard>

                {/* LINKS */}
                <Text style={styles.secao}>LINKS</Text>
                <GlassCard tint="dark" intensity={60} padding="md">
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

                {/* RODAPÉ */}
                <Text style={styles.footer}>
                    © 2026 SafeHome.{'\n'}
                    Feito com 💚 em Espera Feliz, MG.
                </Text>
            </ScrollView>
        </ScreenContainer>
    );
}

function PersonRow({ nome, papel }: { nome: string; papel: string }) {
    return (
        <View style={styles.personRow}>
            <View style={styles.personAvatar}>
                <Text style={styles.personInitial}>{nome.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.personName}>{nome}</Text>
                <Text style={styles.personRole}>{papel}</Text>
            </View>
        </View>
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
            <Icon name="chevron-right" size={18} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: 100,
        paddingBottom: 100,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1d9e75',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.25)',
    },
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
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: '#fff',
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
        marginTop: SPACING.sm,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.sm,
    },
    personRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    personAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    personInitial: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    personName: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
    },
    personRole: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    linkText: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    footer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
        fontSize: FONT_SIZES.xs,
        marginTop: SPACING.xl,
        lineHeight: 18,
    },
});
