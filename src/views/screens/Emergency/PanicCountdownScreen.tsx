import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePanicVM } from '@viewmodels/usePanicVM';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function PanicCountdownScreen() {
    const vm = usePanicVM();

    // ===== Estado: pânico foi acionado com sucesso =====
    if (vm.acionado) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#1a4d3a' }]}>
                <View style={styles.content}>
                    <Text style={styles.successIcon}>✓</Text>
                    <Text style={styles.successTitle}>Pânico acionado</Text>
                    <Text style={styles.successText}>
                        Seus contatos de emergência foram notificados.
                        {vm.temLocalizacao && '\n\nSua localização foi enviada.'}
                    </Text>

                    <TouchableOpacity onPress={vm.voltarParaHome} style={styles.backBtn}>
                        <Text style={styles.backBtnText}>Voltar pra Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ===== Estado: acionando (chamando API) =====
    if (vm.acionando) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#c83333' }]}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.acionandoText}>
                        Avisando seus contatos...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ===== Estado: countdown ativo =====
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#c83333' }]}>
            <View style={styles.content}>
                {/* TÍTULO */}
                <Text style={styles.title}>ACIONANDO PÂNICO</Text>
                <Text style={styles.subtitle}>
                    Seus contatos de emergência serão notificados em:
                </Text>

                {/* CONTADOR GIGANTE */}
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownNumber}>{vm.contador}</Text>
                    <Text style={styles.countdownLabel}>segundos</Text>
                </View>

                {/* INFO DE LOCALIZAÇÃO */}
                <View style={styles.locationInfo}>
                    <Text style={styles.locationIcon}>
                        {vm.temLocalizacao ? '📍' : '⏳'}
                    </Text>
                    <Text style={styles.locationText}>
                        {vm.temLocalizacao
                            ? 'Localização capturada'
                            : 'Capturando localização...'}
                    </Text>
                </View>

                {/* BOTÃO CANCELAR */}
                <TouchableOpacity
                    onPress={vm.cancelar}
                    style={styles.cancelBtn}
                    accessibilityLabel="Cancelar pânico"
                    accessibilityRole="button"
                >
                    <Text style={styles.cancelBtnText}>CANCELAR</Text>
                </TouchableOpacity>

                <Text style={styles.hint}>
                    Toque em "Cancelar" se você acionou por engano
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.xxxl,
    },
    title: {
        color: '#fff',
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold as any,
        letterSpacing: 2,
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.lg,
        lineHeight: 22,
    },
    countdownContainer: {
        alignItems: 'center',
        marginVertical: SPACING.xxl,
    },
    countdownNumber: {
        color: '#fff',
        fontSize: 180,
        fontWeight: '900',
        lineHeight: 180,
    },
    countdownLabel: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: FONT_SIZES.lg,
        marginTop: SPACING.sm,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    locationIcon: { fontSize: 18 },
    locationText: { color: '#fff', fontSize: FONT_SIZES.sm },
    cancelBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: SPACING.xxxl,
        paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.pill,
        marginTop: SPACING.xl,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    cancelBtnText: {
        color: '#c83333',
        fontSize: FONT_SIZES.lg,
        fontWeight: '900',
        letterSpacing: 2,
    },
    hint: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: FONT_SIZES.xs,
        textAlign: 'center',
        marginTop: SPACING.md,
        fontStyle: 'italic',
    },
    // Tela de sucesso
    successIcon: { fontSize: 80, color: '#fff' },
    successTitle: {
        color: '#fff',
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        marginTop: SPACING.lg,
    },
    successText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        marginTop: SPACING.md,
        lineHeight: 24,
    },
    backBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.pill,
        marginTop: SPACING.xxl,
    },
    backBtnText: {
        color: '#1a4d3a',
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    // Tela de acionando
    acionandoText: {
        color: '#fff',
        fontSize: FONT_SIZES.lg,
        marginTop: SPACING.lg,
        textAlign: 'center',
    },
});