import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useContactsVM } from '@viewmodels/useContactsVM.patch';
import type { Contact } from '@services/userService';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';
import InviteContactSheet from '@components/domain/InviteContactSheet';

const RELACAO_LABELS: Record<string, string> = {
    FAMILIAR: 'Familiar',
    AMIGO: 'Amigo(a)',
    PROFISSIONAL: 'Profissional',
    OUTRO: 'Outro',
};

export default function ContactsListScreen() {
    const vm = useContactsVM();

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
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Meus Contatos</Text>
                        <Text style={styles.subtitle}>
                            {vm.totalContatos} {vm.totalContatos === 1 ? 'contato' : 'contatos'} · {vm.totalEmergencia} de emergência
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={vm.abrirSheet}
                        style={styles.addBtn}
                        accessibilityLabel="Adicionar contato"
                        accessibilityRole="button"
                    >
                        <Icon name="plus" size={26} color="#fff" strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>

                {vm.carregando ? (
                    <ActivityIndicator color="#fff" style={{ marginVertical: 32 }} />
                ) : vm.erro ? (
                    <GlassCard tint="dark" intensity={60}>
                        <Text style={styles.erroText}>{vm.erro}</Text>
                    </GlassCard>
                ) : vm.contatos.length === 0 ? (
                    <GlassCard tint="dark" intensity={60}>
                        <View style={styles.emptyCard}>
                            <Icon name="users" size={40} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.emptyTitle}>Sem contatos ainda</Text>
                            <Text style={styles.emptyText}>
                                Adicione familiares e amigos que poderão receber alertas em emergências.
                            </Text>
                            <TouchableOpacity onPress={vm.abrirSheet} style={styles.emptyBtn}>
                                <Text style={styles.emptyBtnText}>Adicionar primeiro contato</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>
                ) : (
                    vm.contatos.map((contato) => (
                        <ContactCard
                            key={contato.id_contato}
                            contato={contato}
                            onToggleEmergencia={() => vm.alternarEmergencia(contato)}
                            onRemove={() => vm.removerContato(contato)}
                        />
                    ))
                )}
            </ScrollView>
            <InviteContactSheet
                visivel={vm.sheetVisivel}
                onFechar={vm.fecharSheet}
                onConvidar={vm.convidarContato}
                onAdicionarExistente={vm.irParaAdicionar}
            />
        </ScreenContainer>
    );
}

function ContactCard({
    contato,
    onToggleEmergencia,
    onRemove,
}: {
    contato: Contact;
    onToggleEmergencia: () => void;
    onRemove: () => void;
}) {
    const iniciais = contato.nome_contato.charAt(0).toUpperCase();

    return (
        <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.sm }}>
            <View style={styles.cardRow}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{iniciais}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{contato.nome_contato}</Text>
                    <Text style={styles.contactRel}>
                        {RELACAO_LABELS[contato.relacao] || contato.relacao} · {contato.email_contato}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={onRemove}
                    style={styles.removeBtn}
                    accessibilityLabel={`Remover ${contato.nome_contato}`}
                >
                    <Icon name="trash" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
            </View>

            <View style={styles.emergencyRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.emergencyLabel}>Alertar em emergência</Text>
                    <Text style={styles.emergencyHint}>
                        {contato.pode_alertar_emergencia
                            ? 'Receberá notificação quando você acionar o pânico'
                            : 'Não receberá alertas'}
                    </Text>
                </View>
                <Switch
                    value={contato.pode_alertar_emergencia}
                    onValueChange={onToggleEmergencia}
                    trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#1d9e75' }}
                    thumbColor="#fff"
                />
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: SPACING.lg,
        paddingTop: 100,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.pill,
        backgroundColor: '#1d9e75',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.pill,
        backgroundColor: '#1d9e75',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
    contactName: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    contactRel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    removeBtn: { padding: SPACING.sm },
    emergencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.md,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    emergencyLabel: { color: '#fff', fontSize: FONT_SIZES.sm },
    emergencyHint: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: FONT_SIZES.xs,
        marginTop: 2,
    },
    emptyCard: { alignItems: 'center', paddingVertical: SPACING.md },
    emptyTitle: {
        fontSize: FONT_SIZES.lg,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.bold as any,
        marginTop: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: SPACING.xs,
        lineHeight: 20,
    },
    emptyBtn: {
        marginTop: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        backgroundColor: '#1d9e75',
        borderRadius: BORDER_RADIUS.md,
    },
    emptyBtnText: { color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    erroText: { color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
});
