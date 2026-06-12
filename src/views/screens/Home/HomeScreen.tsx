import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useHomeVM } from '@viewmodels/useHomeVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function HomeScreen() {
    const vm = useHomeVM();

    const getCorDoStatus = (): string => {
        if (!vm.status) return 'rgba(255,255,255,0.6)';
        switch (vm.status.status) {
            case 'Estável':  return '#5cd99e';
            case 'Atenção':  return '#ffd485';
            case 'Crítico':  return '#ff8478';
            default:         return 'rgba(255,255,255,0.6)';
        }
    };

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.atualizando}
                        onRefresh={() => vm.carregarStatus(true)}
                        tintColor="#fff"
                    />
                }
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.saudacao}>{vm.saudacao},</Text>
                        <Text style={styles.nome}>{vm.primeiroNome}!</Text>
                    </View>

                    <TouchableOpacity onPress={vm.irParaPerfil} style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {vm.primeiroNome.charAt(0).toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CARD DE STATUS */}
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <Text style={styles.cardLabel}>Status do dia</Text>

                    {vm.carregando ? (
                        <ActivityIndicator color="#fff" style={{ marginVertical: SPACING.lg }} />
                    ) : vm.status ? (
                        <>
                            <View style={styles.statusRow}>
                                <View style={[styles.statusDot, { backgroundColor: getCorDoStatus() }]} />
                                <Text style={[styles.statusText, { color: getCorDoStatus() }]}>
                                    {vm.status.status}
                                </Text>
                            </View>
                            <Text style={styles.statusDetail}>
                                Consistência da rotina: {vm.status.consistencia_rotina}%
                            </Text>
                            <Text style={styles.statusDetail}>
                                {vm.status.dias_estabilidade} dia{vm.status.dias_estabilidade !== 1 ? 's' : ''} de estabilidade
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.statusDetail}>
                            Não foi possível carregar seu status.{'\n'}Puxe pra baixo pra tentar novamente.
                        </Text>
                    )}
                </GlassCard>

                {/* CARD DE ROTINA */}
                <GlassCard tint="dark" intensity={60}>
                    <Text style={styles.cardLabel}>Rotina de hoje</Text>
                    <View style={styles.rotinaEmpty}>
                        <Icon name="calendar" size={24} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.emptyText}>Veja seus compromissos na aba Agenda</Text>
                    </View>
                </GlassCard>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: SPACING.xl, paddingTop: 110 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    saudacao: { fontSize: FONT_SIZES.md, color: 'rgba(255,255,255,0.9)' },
    nome: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.pill,
        backgroundColor: '#1d9e75',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold as any, color: '#fff' },
    cardLabel: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: FONT_WEIGHTS.medium as any,
        marginBottom: SPACING.sm,
    },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.sm },
    statusDot: { width: 12, height: 12, borderRadius: BORDER_RADIUS.pill, marginRight: SPACING.sm },
    statusText: { fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold as any },
    statusDetail: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.85)',
        marginTop: SPACING.xs,
    },
    rotinaEmpty: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xs },
    emptyText: { fontSize: FONT_SIZES.md, color: 'rgba(255,255,255,0.85)', flex: 1 },

});
