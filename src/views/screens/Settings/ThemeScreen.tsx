import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeVM } from '@viewmodels/useThemeVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function ThemesScreen() {
    const vm = useThemeVM();

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Temas</Text>
                <Text style={styles.subtitle}>Personalize a aparência do app</Text>

                {/* MODO DE EXIBIÇÃO */}
                <Text style={styles.sectionLabel}>MODO DE EXIBIÇÃO</Text>
                <GlassCard tint="dark" intensity={60} padding="md">
                    <View style={styles.modosRow}>
                        {vm.modos.map((modo) => {
                            const selecionado = vm.themeMode === modo.value;
                            return (
                                <TouchableOpacity
                                    key={modo.value}
                                    onPress={() => vm.escolherModo(modo.value)}
                                    style={[
                                        styles.modoCard,
                                        selecionado && styles.modoCardSelected,
                                    ]}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: selecionado }}
                                >
                                    <Text style={styles.modoIcone}>{modo.icone}</Text>
                                    <Text style={[
                                        styles.modoLabel,
                                        { color: selecionado ? '#fff' : 'rgba(255,255,255,0.85)' },
                                    ]}>
                                        {modo.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Text style={styles.hint}>
                        {vm.modos.find((m) => m.value === vm.themeMode)?.descricao}
                    </Text>
                </GlassCard>

                {/* COR PRINCIPAL */}
                <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>
                    COR PRINCIPAL
                </Text>
                <Text style={styles.sectionDescription}>
                    Define a cor dos botões, status e destaques
                </Text>

                <GlassCard tint="dark" intensity={60} padding="md">
                    <View style={styles.paletasGrid}>
                        {vm.paletas.map((paleta) => {
                            const selecionado = vm.themePalette === paleta.value;
                            return (
                                <TouchableOpacity
                                    key={paleta.value}
                                    onPress={() => vm.escolherPaleta(paleta.value)}
                                    style={styles.paletaItem}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: selecionado }}
                                >
                                    <View style={[
                                        styles.paletaSwatch,
                                        {
                                            backgroundColor: paleta.cor,
                                            borderColor: selecionado ? '#fff' : 'transparent',
                                            borderWidth: selecionado ? 3 : 0,
                                        },
                                    ]}>
                                        {selecionado && (
                                            <Icon name="check" size={24} color="#fff" strokeWidth={3} />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.paletaLabel,
                                        {
                                            color: selecionado ? '#fff' : 'rgba(255,255,255,0.85)',
                                            fontWeight: selecionado ? '700' : '500',
                                        },
                                    ]}>
                                        {paleta.label}
                                    </Text>
                                    <Text style={styles.paletaDesc}>
                                        {paleta.descricao}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </GlassCard>

                {/* PRÉVIA */}
                <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>PRÉVIA</Text>

                <GlassCard tint="dark" intensity={60} padding="md">
                    <View style={styles.previaStatusRow}>
                        <View style={[styles.previaDot, {
                            backgroundColor: vm.paletas.find(p => p.value === vm.themePalette)?.cor,
                        }]} />
                        <Text style={styles.previaStatusText}>Status: Estável</Text>
                    </View>

                    <View style={styles.previaButtons}>
                        <View style={[styles.previaPrimary, {
                            backgroundColor: vm.paletas.find(p => p.value === vm.themePalette)?.cor,
                        }]}>
                            <Text style={styles.previaPrimaryText}>Botão principal</Text>
                        </View>
                        <View style={[styles.previaSecondary, {
                            borderColor: vm.paletas.find(p => p.value === vm.themePalette)?.cor,
                        }]}>
                            <Text style={[styles.previaSecondaryText, {
                                color: vm.paletas.find(p => p.value === vm.themePalette)?.cor,
                            }]}>
                                Secundário
                            </Text>
                        </View>
                    </View>
                </GlassCard>

                {/* RESTAURAR PADRÃO */}
                <TouchableOpacity onPress={vm.restaurarPadrao} style={styles.restaurarBtn}>
                    <Icon name="x" size={16} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.restaurarText}>Restaurar tema padrão</Text>
                </TouchableOpacity>

                {/* INFO */}
                <GlassCard tint="dark" intensity={60} padding="md" style={{ marginTop: SPACING.md }}>
                    <View style={styles.infoRow}>
                        <Icon name="info" size={18} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.infoText}>
                            Sua preferência fica salva no aparelho e é aplicada automaticamente
                            toda vez que você abrir o app.
                        </Text>
                    </View>
                </GlassCard>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: 100,
        paddingBottom: 100,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: SPACING.xl,
    },
    sectionLabel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.sm,
    },
    sectionDescription: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: SPACING.sm,
        marginLeft: SPACING.sm,
    },
    modosRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    modoCard: {
        flex: 1,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    modoCardSelected: {
        backgroundColor: '#1d9e75',
        borderColor: '#1d9e75',
    },
    modoIcone: {
        fontSize: 28,
        marginBottom: SPACING.xs,
    },
    modoLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    hint: {
        fontSize: FONT_SIZES.xs,
        fontStyle: 'italic',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.xs,
    },
    paletasGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        justifyContent: 'center',
    },
    paletaItem: {
        width: '28%',
        alignItems: 'center',
    },
    paletaSwatch: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    paletaLabel: {
        fontSize: FONT_SIZES.sm,
    },
    paletaDesc: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
    },
    previaStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    previaDot: {
        width: 12,
        height: 12,
        borderRadius: BORDER_RADIUS.pill,
        marginRight: SPACING.sm,
    },
    previaStatusText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: '#fff',
    },
    previaButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    previaPrimary: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    previaPrimaryText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: '#fff',
    },
    previaSecondary: {
        flex: 1,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    previaSecondaryText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    restaurarBtn: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.lg,
        padding: SPACING.sm,
    },
    restaurarText: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        textDecorationLine: 'underline',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.sm,
    },
    infoText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 20,
    },
});
