import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettingsVM } from '@viewmodels/useSettingsVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';


export default function SettingsScreen() {
    const vm = useSettingsVM();

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
                                <Text style={styles.icone}>{item.icone}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitulo}>{item.titulo}</Text>
                                    <Text style={styles.itemDescricao}>{item.descricao}</Text>
                                </View>
                                <Text style={styles.chevron}>›</Text>
                            </TouchableOpacity>

                            {/* divisor entre itens (menos no último) */}
                            {index < vm.itens.length - 1 && (
                                <View style={styles.divider} />
                            )}
                        </React.Fragment>
                    ))}
                </GlassCard>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: SPACING.xl },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: SPACING.xl,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        gap: SPACING.md,
    },
    icone: { fontSize: 26 },
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
    chevron: {
        fontSize: 22,
        color: 'rgba(255,255,255,0.6)',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
});
