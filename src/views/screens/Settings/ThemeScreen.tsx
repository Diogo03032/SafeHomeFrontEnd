import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeVM } from '@viewmodels/useThemeVM';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

// Tela de Temas.
//
// Estrutura:
//   1. Modo de exibição: 3 botões (Claro / Escuro / Sistema)
//   2. Cor principal: grid 3x2 de paletas
//   3. Prévia ao vivo: mostra como vai ficar
//   4. Botão "Restaurar padrão"

export default function ThemesScreen() {
    const vm = useThemeVM();

    // Usa a paleta ATUAL do store pra colorir a própria tela de temas
    // (assim o usuário vê a mudança ao vivo)
    const colors = getThemeColors(vm.themePalette);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: colors.primaryDark }]}>Temas</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Personalize a aparência do app
                </Text>

                {/* ===== SEÇÃO MODO DE EXIBIÇÃO ===== */}
                <Text style={[styles.sectionTitle, { color: colors.primaryDark }]}>
                    Modo de exibição
                </Text>

                <View style={styles.modosRow}>
                    {vm.modos.map((modo) => {
                        const selecionado = vm.themeMode === modo.value;
                        return (
                            <TouchableOpacity
                                key={modo.value}
                                onPress={() => vm.escolherModo(modo.value)}
                                style={[
                                    styles.modoCard,
                                    {
                                        backgroundColor: selecionado ? colors.primaryLight : colors.surface,
                                        borderColor: selecionado ? colors.primary : colors.border,
                                        borderWidth: selecionado ? 2 : 1,
                                    },
                                ]}
                                accessibilityRole="radio"
                                accessibilityState={{ selected: selecionado }}
                                accessibilityLabel={modo.label}
                            >
                                <Text style={styles.modoIcone}>{modo.icone}</Text>
                                <Text style={[
                                    styles.modoLabel,
                                    { color: selecionado ? colors.primaryDark : colors.textPrimary },
                                ]}>
                                    {modo.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                    {vm.modos.find((m) => m.value === vm.themeMode)?.descricao}
                </Text>

                {/* ===== SEÇÃO COR PRINCIPAL ===== */}
                <Text style={[styles.sectionTitle, { color: colors.primaryDark, marginTop: SPACING.xl }]}>
                    Cor principal
                </Text>
                <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                    Define a cor dos botões, status e destaques
                </Text>

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
                                accessibilityLabel={`${paleta.label} - ${paleta.descricao}`}
                            >
                                <View style={[
                                    styles.paletaSwatch,
                                    {
                                        backgroundColor: paleta.cor,
                                        borderColor: selecionado ? colors.primaryDark : 'transparent',
                                        borderWidth: selecionado ? 3 : 0,
                                    },
                                ]}>
                                    {selecionado && (
                                        <Text style={styles.paletaCheck}>✓</Text>
                                    )}
                                </View>
                                <Text style={[
                                    styles.paletaLabel,
                                    {
                                        color: selecionado ? colors.primaryDark : colors.textPrimary,
                                        fontWeight: selecionado ? '700' : '500',
                                    },
                                ]}>
                                    {paleta.label}
                                </Text>
                                <Text style={[styles.paletaDesc, { color: colors.textSecondary }]}>
                                    {paleta.descricao}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ===== PRÉVIA AO VIVO ===== */}
                <Text style={[styles.sectionTitle, { color: colors.primaryDark, marginTop: SPACING.xl }]}>
                    Prévia
                </Text>

                <View style={[styles.previaCard, { backgroundColor: colors.surface }]}>
                    {/* Status atual com cor do tema */}
                    <View style={styles.previaStatusRow}>
                        <View style={[styles.previaDot, { backgroundColor: colors.primary }]} />
                        <Text style={[styles.previaStatusText, { color: colors.primaryDark }]}>
                            Status: Estável
                        </Text>
                    </View>

                    {/* Botões de exemplo */}
                    <View style={styles.previaButtons}>
                        <View style={[styles.previaPrimary, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.previaPrimaryText, { color: colors.textOnPrimary }]}>
                                Botão principal
                            </Text>
                        </View>
                        <View style={[styles.previaSecondary, { borderColor: colors.primary }]}>
                            <Text style={[styles.previaSecondaryText, { color: colors.primaryDark }]}>
                                Secundário
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ===== RESTAURAR PADRÃO ===== */}
                <TouchableOpacity
                    onPress={vm.restaurarPadrao}
                    style={styles.restaurarLink}
                    accessibilityRole="button"
                >
                    <Text style={[styles.restaurarText, { color: colors.textSecondary }]}>
                        Restaurar tema padrão
                    </Text>
                </TouchableOpacity>

                {/* INFORMAÇÃO TÉCNICA — pra banca */}
                <View style={[styles.infoBox, { backgroundColor: colors.primaryLight }]}>
                    <Text style={styles.infoIcone}>💾</Text>
                    <Text style={[styles.infoText, { color: colors.primaryDark }]}>
                        Sua preferência fica salva no aparelho e é aplicada automaticamente
                        toda vez que você abrir o app.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        padding: SPACING.xl,
        paddingBottom: SPACING.xxl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold as any,
        marginBottom: SPACING.xs,
    },
    sectionDescription: {
        fontSize: FONT_SIZES.sm,
        marginBottom: SPACING.md,
    },

    // ----- Modos -----
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
        marginTop: SPACING.xs,
    },

    // ----- Paletas -----
    paletasGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        justifyContent: 'center',
    },
    paletaItem: {
        width: '30%',
        alignItems: 'center',
    },
    paletaSwatch: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    paletaCheck: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '900',
    },
    paletaLabel: {
        fontSize: FONT_SIZES.sm,
    },
    paletaDesc: {
        fontSize: FONT_SIZES.xs,
        textAlign: 'center',
    },

    // ----- Prévia -----
    previaCard: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginTop: SPACING.sm,
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

    // ----- Restaurar -----
    restaurarLink: {
        alignSelf: 'center',
        marginTop: SPACING.lg,
        padding: SPACING.sm,
    },
    restaurarText: {
        fontSize: FONT_SIZES.sm,
        textDecorationLine: 'underline',
    },

    // ----- Info box -----
    infoBox: {
        flexDirection: 'row',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginTop: SPACING.lg,
        gap: SPACING.sm,
        alignItems: 'flex-start',
    },
    infoIcone: { fontSize: 18 },
    infoText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        lineHeight: 18,
    },
});