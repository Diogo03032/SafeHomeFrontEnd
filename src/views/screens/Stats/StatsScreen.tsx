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
import Svg, { Circle } from 'react-native-svg';
import { useStatsVM } from '@viewmodels/useStatsVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

interface AnelProps {
    porcentagem: number;
    cor: string;
    tamanho?: number;
    espessura?: number;
}

function AnelDeProgresso({
    porcentagem,
    cor,
    tamanho = 180,
    espessura = 16,
}: AnelProps) {
    const raio = (tamanho - espessura) / 2;
    const circunferencia = 2 * Math.PI * raio;
    const preenchimento = (porcentagem / 100) * circunferencia;
    const vazio = circunferencia - preenchimento;

    return (
        <Svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`}>
            <Circle
                cx={tamanho / 2}
                cy={tamanho / 2}
                r={raio}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={espessura}
                fill="none"
            />
            <Circle
                cx={tamanho / 2}
                cy={tamanho / 2}
                r={raio}
                stroke={cor}
                strokeWidth={espessura}
                fill="none"
                strokeDasharray={`${preenchimento} ${vazio}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
            />
        </Svg>
    );
}

export default function StatsScreen() {
    const vm = useStatsVM();

    if (vm.carregando) {
        return (
            <ScreenContainer variant="app" safeArea={false}>
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Calculando suas estatísticas...</Text>
                </View>
            </ScreenContainer>
        );
    }

    if (vm.erro || !vm.stats) {
        return (
            <ScreenContainer variant="app" safeArea={false}>
                <View style={styles.centerLoading}>
                    <Icon name="chart-line" size={48} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.errorText}>
                        {vm.erro || 'Sem dados pra mostrar agora.'}
                    </Text>
                    <TouchableOpacity onPress={() => vm.carregar()} style={styles.retryButton}>
                        <Text style={styles.retryText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.atualizando}
                        onRefresh={() => vm.carregar(true)}
                        tintColor="#fff"
                    />
                }
            >
                <Text style={styles.title}>Estatísticas</Text>
                <Text style={styles.subtitle}>Acompanhe sua jornada de autocuidado</Text>

                {/* ANEL DE CONSISTÊNCIA */}
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.cardLabel}>Consistência da rotina</Text>
                        <Text style={styles.cardSublabel}>Últimos 7 dias</Text>

                        <View style={styles.anelContainer}>
                            <AnelDeProgresso
                                porcentagem={vm.stats.consistencia_rotina}
                                cor={vm.corConsistencia}
                            />
                            <View style={styles.anelTextoContainer}>
                                <Text style={[styles.anelNumero, { color: vm.corConsistencia }]}>
                                    {vm.stats.consistencia_rotina}%
                                </Text>
                                <Text style={styles.anelLabel}>{vm.labelConsistencia}</Text>
                            </View>
                        </View>

                        <View style={styles.metasRow}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaNumero}>
                                    {vm.stats.metas_concluidas_semana}
                                </Text>
                                <Text style={styles.metaLabel}>Concluídas</Text>
                            </View>
                            <View style={styles.metaDivider} />
                            <View style={styles.metaItem}>
                                <Text style={styles.metaNumero}>
                                    {vm.stats.metas_totais_semana}
                                </Text>
                                <Text style={styles.metaLabel}>Total da semana</Text>
                            </View>
                        </View>
                    </View>
                </GlassCard>

                {/* DIAS DE ESTABILIDADE */}
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <View style={styles.estabilidadeRow}>
                        <View style={styles.estabilidadeNumeroCol}>
                            <Text style={styles.estabilidadeNumero}>
                                {vm.stats.dias_estabilidade}
                            </Text>
                            <Text style={styles.estabilidadeLabel}>
                                {vm.stats.dias_estabilidade === 1 ? 'dia' : 'dias'}
                            </Text>
                        </View>

                        <View style={styles.estabilidadeInfo}>
                            <Text style={styles.estabilidadeTitulo}>
                                {vm.diasEstabilidadeLabel}
                            </Text>
                            <Text style={styles.estabilidadeDetalhe}>
                                {vm.ultimoAlertaFormatado}
                            </Text>
                        </View>
                    </View>
                </GlassCard>

                {/* MENSAGEM MOTIVACIONAL */}
                <GlassCard
                    tint="dark"
                    intensity={60}
                    style={{ borderColor: 'rgba(92,217,158,0.4)', borderWidth: 1 }}
                >
                    <View style={styles.motivacionalRow}>
                        <Icon name="heart" size={32} color="#5cd99e" />
                        <Text style={styles.motivacionalText}>
                            {vm.stats.mensagem_motivacional}
                        </Text>
                    </View>
                </GlassCard>

                {/* INFO TÉCNICA */}
                <GlassCard tint="dark" intensity={60} style={{ marginTop: SPACING.md }}>
                    <Text style={styles.infoTitle}>Como calculamos</Text>
                    <Text style={styles.infoText}>
                        • Consistência: % de compromissos concluídos nos últimos 7 dias{'\n'}
                        • Dias de estabilidade: tempo sem alerta crítico{'\n'}
                        • Mensagem motivacional: gerada com base na sua faixa de consistência
                    </Text>
                </GlassCard>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    centerLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: 'rgba(255,255,255,0.85)',
    },
    errorText: {
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
        marginVertical: SPACING.md,
        color: 'rgba(255,255,255,0.9)',
    },
    retryButton: {
        padding: SPACING.md,
        marginTop: SPACING.sm,
    },
    retryText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: '#5cd99e',
    },
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
    cardLabel: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    cardSublabel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
        marginBottom: SPACING.lg,
    },
    anelContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    anelTextoContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    anelNumero: {
        fontSize: 42,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    anelLabel: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    metasRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: SPACING.sm,
    },
    metaItem: {
        alignItems: 'center',
        flex: 1,
    },
    metaNumero: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    metaLabel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    metaDivider: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    estabilidadeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    estabilidadeNumeroCol: {
        alignItems: 'center',
        marginRight: SPACING.lg,
        minWidth: 70,
    },
    estabilidadeNumero: {
        fontSize: 52,
        fontWeight: FONT_WEIGHTS.bold as any,
        lineHeight: 56,
        color: '#5cd99e',
    },
    estabilidadeLabel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    estabilidadeInfo: {
        flex: 1,
    },
    estabilidadeTitulo: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: '#fff',
        marginBottom: SPACING.xs,
    },
    estabilidadeDetalhe: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 18,
    },
    motivacionalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    motivacionalText: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium as any,
        color: '#fff',
        lineHeight: 22,
    },
    infoTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: 'rgba(255,255,255,0.85)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SPACING.sm,
    },
    infoText: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 22,
    },
});
