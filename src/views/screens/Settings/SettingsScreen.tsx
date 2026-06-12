import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettingsVM } from '@viewmodels/useSettingsVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon, IconName } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function SettingsScreen() {
    const vm = useSettingsVM();

    const ICONES: Record<string, IconName> = {
        themes: 'palette',
        accessibility: 'eye',
        permissions: 'shield',
        about: 'info',
    };

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Configurações</Text>
                <Text style={styles.subtitle}>
                    Personalize sua experiência no SafeHome
                </Text>

                <GlassCard tint="dark" intensity={60} padding="md">
                    {vm.itens.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <TouchableOpacity
                                onPress={() => vm.irPara(item.rota)}
                                style={styles.row}
                                accessibilityRole="button"
                                accessibilityLabel={item.titulo}
                                accessibilityHint={item.descricao}
                            >
                                <View style={styles.iconWrap}>
                                    <Icon
                                        name={ICONES[item.id] ?? 'settings'}
                                        size={22}
                                        color="rgba(255,255,255,0.9)"
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitulo}>{item.titulo}</Text>
                                    <Text style={styles.itemDescricao}>{item.descricao}</Text>
                                </View>

                                <Icon
                                    name="chevron-right"
                                    size={20}
                                    color="rgba(255,255,255,0.5)"
                                />
                            </TouchableOpacity>

                            {index < vm.itens.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </GlassCard>

                {/* Info card */}
                <GlassCard tint="dark" intensity={60} padding="md" style={{ marginTop: SPACING.md }}>
                    <View style={styles.infoRow}>
                        <Icon name="info" size={18} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.infoText}>
                            Suas configurações são salvas localmente no aparelho e ficam
                            disponíveis mesmo offline.
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        gap: SPACING.md,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTitulo: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    itemDescricao: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
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
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 20,
    },
});
