import React from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { usePermissionsVM } from '@viewmodels/usePermissionsVM';
import type { PermissionStatus } from '@viewmodels/usePermissionsVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon, IconName } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

const STATUS_INFO: Record<PermissionStatus, { label: string; cor: string }> = {
    granted:      { label: 'Permitida',      cor: '#5cd99e' },
    denied:       { label: 'Bloqueada',      cor: '#ff8478' },
    undetermined: { label: 'Não pedida',     cor: '#ffd485' },
    unsupported:  { label: 'Não suportada',  cor: 'rgba(255,255,255,0.5)' },
};

const ICON_MAP: Record<string, IconName> = {
    notifications: 'bell',
    location:      'location',
    camera:        'camera',
    mic:           'mic',
};

export default function PermissionsScreen() {
    const vm = usePermissionsVM();

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.verificando}
                        onRefresh={vm.verificarTodas}
                        tintColor="#fff"
                    />
                }
            >
                <Text style={styles.title}>Permissões</Text>
                <Text style={styles.subtitle}>
                    Veja e gerencie o que o SafeHome pode acessar no seu aparelho
                </Text>

                {vm.permissoes.map((perm) => (
                    <GlassCard
                        key={perm.id}
                        tint="dark"
                        intensity={60}
                        padding="md"
                        style={{ marginBottom: SPACING.sm }}
                    >
                        <View style={styles.permRow}>
                            <View style={styles.permIconWrap}>
                                <Icon
                                    name={ICON_MAP[perm.id] ?? 'lock'}
                                    size={22}
                                    color="rgba(255,255,255,0.9)"
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.permTitulo}>{perm.titulo}</Text>
                                <Text style={styles.permDesc}>{perm.descricao}</Text>

                                <View style={styles.statusRow}>
                                    <View style={[
                                        styles.statusDot,
                                        { backgroundColor: STATUS_INFO[perm.status].cor },
                                    ]} />
                                    <Text style={[
                                        styles.statusText,
                                        { color: STATUS_INFO[perm.status].cor },
                                    ]}>
                                        {STATUS_INFO[perm.status].label}
                                    </Text>
                                </View>
                            </View>

                            {perm.status !== 'granted' && (
                                <TouchableOpacity
                                    onPress={() => vm.acionar(perm.id)}
                                    style={styles.acaoBtn}
                                >
                                    <Text style={styles.acaoText}>Permitir</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </GlassCard>
                ))}

                {/* Atalho pra abrir configurações */}
                <TouchableOpacity onPress={vm.abrirConfiguracoes} style={styles.configBtn}>
                    <Icon name="settings" size={18} color="#fff" />
                    <Text style={styles.configText}>Abrir Configurações do sistema</Text>
                </TouchableOpacity>

                {/* INFO */}
                <GlassCard tint="dark" intensity={60} padding="md" style={{ marginTop: SPACING.md }}>
                    <View style={styles.infoRow}>
                        <Icon name="info" size={18} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.infoText}>
                            As permissões marcadas como "Alta" são essenciais pro botão de pânico
                            funcionar corretamente.
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
        lineHeight: 22,
    },
    permRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    permIconWrap: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    permTitulo: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    permDesc: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
        gap: SPACING.xs,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '500',
    },
    acaoBtn: {
        backgroundColor: '#1d9e75',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    acaoText: {
        color: '#fff',
        fontWeight: FONT_WEIGHTS.semibold as any,
        fontSize: FONT_SIZES.sm,
    },
    configBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    configText: {
        color: '#fff',
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
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
