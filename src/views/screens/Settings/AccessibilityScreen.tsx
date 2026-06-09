import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAccessibilityVM } from '@viewmodels/useAccessibilityVM';
import type { FontSize } from '@viewmodels/useAccessibilityVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function AccessibilityScreen() {
    const vm = useAccessibilityVM();

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Acessibilidade</Text>
                <Text style={styles.subtitle}>
                    Ajustes para deixar o app mais confortável pra você
                </Text>

                {/* TAMANHO DA FONTE */}
                <Text style={styles.sectionLabel}>TAMANHO DA FONTE</Text>
                <GlassCard tint="dark" intensity={60} padding="md">
                    <View style={styles.fontGrid}>
                        {([1, 2, 3, 4] as FontSize[]).map((size) => {
                            const selecionado = vm.fontSize === size;
                            return (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() => vm.setFontSize(size)}
                                    style={[
                                        styles.fontOption,
                                        selecionado && styles.fontSelected,
                                    ]}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: selecionado }}
                                >
                                    <Text style={[
                                        styles.fontOptionText,
                                        { fontSize: 12 + (size * 3) },
                                        { color: selecionado ? '#fff' : 'rgba(255,255,255,0.85)' },
                                    ]}>
                                        Aa
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Text style={styles.fontLabel}>{vm.fontSizeLabel}</Text>
                </GlassCard>

                {/* PRÉVIA */}
                <GlassCard tint="dark" intensity={60} padding="md" style={{ marginTop: SPACING.sm }}>
                    <Text style={styles.previewLabel}>Prévia:</Text>
                    <Text style={[styles.previewText, { fontSize: 11 + (vm.fontSize * 3) }]}>
                        Essa é uma prévia de como o texto vai aparecer no app.
                    </Text>
                </GlassCard>

                {/* NARRAÇÃO */}
                <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>
                    NARRAÇÃO
                </Text>
                <GlassCard tint="dark" intensity={60} padding="md">
                    <ToggleRow
                        icon="mic"
                        label="Narração de emergência"
                        hint="O app vai falar em voz alta quando o pânico for acionado"
                        value={vm.emergencyNarration}
                        onValueChange={vm.setEmergencyNarration}
                    />
                </GlassCard>

                {/* VISUAL */}
                <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>VISUAL</Text>
                <GlassCard tint="dark" intensity={60} padding="md">
                    <ToggleRow
                        icon="eye"
                        label="Reduzir animações"
                        hint="Diminui as transições suaves e movimentos"
                        value={vm.reduceMotion}
                        onValueChange={vm.setReduceMotion}
                    />
                    <View style={styles.divider} />
                    <ToggleRow
                        icon="alert"
                        label="Modo alto contraste"
                        hint="Aumenta o contraste pra facilitar leitura"
                        value={vm.highContrast}
                        onValueChange={vm.setHighContrast}
                    />
                    <View style={styles.divider} />
                    <ToggleRow
                        icon="palette"
                        label="Modo daltônico"
                        hint="Ajusta cores pra daltonismo (em breve)"
                        value={vm.colorBlindMode}
                        onValueChange={vm.setColorBlindMode}
                    />
                </GlassCard>

                {/* INFO */}
                <GlassCard tint="dark" intensity={60} padding="md" style={{ marginTop: SPACING.md }}>
                    <View style={styles.infoRow}>
                        <Icon name="info" size={18} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.infoText}>
                            Essas preferências ficam salvas no aparelho e funcionam mesmo offline.
                        </Text>
                    </View>
                </GlassCard>
            </ScrollView>
        </ScreenContainer>
    );
}

function ToggleRow({
    icon,
    label,
    hint,
    value,
    onValueChange,
}: {
    icon: 'mic' | 'eye' | 'alert' | 'palette';
    label: string;
    hint: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
}) {
    return (
        <View style={styles.toggleRow}>
            <View style={styles.toggleIconWrap}>
                <Icon name={icon} size={18} color="rgba(255,255,255,0.85)" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>{label}</Text>
                <Text style={styles.toggleHint}>{hint}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#1d9e75' }}
                thumbColor="#fff"
            />
        </View>
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
    fontGrid: {
        flexDirection: 'row',
        gap: SPACING.sm,
        justifyContent: 'space-around',
    },
    fontOption: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
    },
    fontSelected: {
        backgroundColor: '#1d9e75',
        borderColor: '#1d9e75',
    },
    fontOptionText: {
        fontWeight: '700',
    },
    fontLabel: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.85)',
        marginTop: SPACING.sm,
        fontStyle: 'italic',
    },
    previewLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: FONT_SIZES.xs,
        marginBottom: SPACING.xs,
    },
    previewText: {
        color: '#fff',
        lineHeight: 24,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        gap: SPACING.md,
    },
    toggleIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleLabel: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    toggleHint: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: FONT_SIZES.xs,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.sm,
    },
    infoText: {
        flex: 1,
        color: 'rgba(255,255,255,0.85)',
        fontSize: FONT_SIZES.sm,
        lineHeight: 20,
    },
});
