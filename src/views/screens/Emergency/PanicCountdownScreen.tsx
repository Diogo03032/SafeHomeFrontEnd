import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePanicVM } from '@viewmodels/usePanicVM';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function PanicCountdownScreen() {
    const vm = usePanicVM();

    // Pânico acionado com sucesso
    if (vm.acionado) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#1a4d3a' }]}>
                <View style={styles.content}>
                    <Icon name="check" size={80} color="#fff" strokeWidth={3} />
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

    if (vm.acionando) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#c83333' }]}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.acionandoText}>Avisando seus contatos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#c83333' }]}>
            <View style={styles.content}>
                <Icon name="siren" size={48} color="#fff" />
                <Text style={styles.title}>ACIONANDO PÂNICO</Text>
                <Text style={styles.subtitle}>
                    Seus contatos de emergência serão notificados em:
                </Text>

                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownNumber}>{vm.contador}</Text>
                    <Text style={styles.countdownLabel}>segundos</Text>
                </View>

                <View style={styles.locationInfo}>
                    <Icon
                        name={vm.temLocalizacao ? 'location' : 'location'}
                        size={18}
                        color="#fff"
                    />
                    <Text style={styles.locationText}>
                        {vm.temLocalizacao ? 'Localização capturada' : 'Capturando localização...'}
                    </Text>
                </View>

                <TouchableOpacity onPress={vm.cancelar} style={styles.cancelBtn}>
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
    content: { flex: 1, padding: SPACING.xl, alignItems: 'center', justifyContent: 'space-around', paddingVertical: 48 },
    title: { color: '#fff', fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold as any, letterSpacing: 2, textAlign: 'center', marginTop: SPACING.md },
    subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: FONT_SIZES.md, textAlign: 'center', marginTop: SPACING.sm, paddingHorizontal: SPACING.lg, lineHeight: 22 },
    countdownContainer: { alignItems: 'center' },
    countdownNumber: { color: '#fff', fontSize: 160, fontWeight: '900', lineHeight: 170 },
    countdownLabel: { color: 'rgba(255,255,255,0.85)', fontSize: FONT_SIZES.lg, textTransform: 'uppercase', letterSpacing: 2 },
    locationInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md },
    locationText: { color: '#fff', fontSize: FONT_SIZES.sm },
    cancelBtn: { backgroundColor: '#fff', paddingHorizontal: 48, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.pill, elevation: 8 },
    cancelBtnText: { color: '#c83333', fontSize: FONT_SIZES.lg, fontWeight: '900', letterSpacing: 2 },
    hint: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZES.xs, textAlign: 'center', fontStyle: 'italic' },
    successTitle: { color: '#fff', fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold as any, marginTop: SPACING.lg },
    successText: { color: 'rgba(255,255,255,0.9)', fontSize: FONT_SIZES.md, textAlign: 'center', marginTop: SPACING.md, lineHeight: 24 },
    backBtn: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.pill, marginTop: 48 },
    backBtnText: { color: '#1a4d3a', fontSize: FONT_SIZES.md, fontWeight: '700' },
    acionandoText: { color: '#fff', fontSize: FONT_SIZES.lg, marginTop: SPACING.lg, textAlign: 'center' },
});
