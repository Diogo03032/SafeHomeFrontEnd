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
import { useContactsVM } from '@viewmodels/useContactsVM.patch';
import type { Contact, MonitoredPatient, NivelPermissao } from '@services/userService';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import InviteContactSheet from '@components/domain/InviteContactSheet';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

const NIVEL_LABELS: Record<string, string> = {
    TOTAL: 'Acesso total',
    MODERADO: 'Acesso moderado',
    SOMENTE_EMERGENCIA: 'Só emergência',
};

const NIVEIS: { value: NivelPermissao; label: string }[] = [
    { value: 'TOTAL', label: 'Total' },
    { value: 'MODERADO', label: 'Moderado' },
    { value: 'SOMENTE_EMERGENCIA', label: 'Só emerg.' },
];

export default function ContactsListScreen() {
    const vm = useContactsVM();
    const naEmergencia = vm.abaSelecionada === 'emergencia';

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.atualizando}
                        onRefresh={() => {
                            vm.carregar(true);
                            vm.carregarMonitorados();
                        }}
                        tintColor="#fff"
                    />
                }
            >
                <Text style={styles.title}>Contatos</Text>

                {/* ABAS */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tab, naEmergencia && styles.tabActive]}
                        onPress={() => vm.setAbaSelecionada('emergencia')}
                    >
                        <Text style={[styles.tabText, naEmergencia && styles.tabTextActive]}>
                            Seus contatos de Emergência
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, !naEmergencia && styles.tabActive]}
                        onPress={() => vm.setAbaSelecionada('monitoro')}
                    >
                        <Text style={[styles.tabText, !naEmergencia && styles.tabTextActive]}>
                            Contatos que você monitora
                        </Text>
                    </TouchableOpacity>
                </View>

                {naEmergencia ? (
                    <>
                        <View style={styles.addRow}>
                            <TouchableOpacity
                                onPress={vm.abrirSheet}
                                style={styles.addBtnWide}
                                accessibilityLabel="Adicionar contato"
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
                                    key={contato.id_relacao}
                                    contato={contato}
                                    onMudarNivel={(nivel) => vm.mudarNivelPermissao(contato, nivel)}
                                    onRemove={() => vm.removerContato(contato)}
                                />
                            ))
                        )}
                    </>
                ) : (
                    <>
                        {vm.carregandoMonitorados ? (
                            <ActivityIndicator color="#fff" style={{ marginVertical: 32 }} />
                        ) : vm.monitorados.length === 0 ? (
                            <GlassCard tint="dark" intensity={60}>
                                <View style={styles.emptyCard}>
                                    <Icon name="heart" size={40} color="rgba(255,255,255,0.6)" />
                                    <Text style={styles.emptyTitle}>Você não monitora ninguém</Text>
                                    <Text style={styles.emptyText}>
                                        Quando alguém te adicionar como contato de emergência, essa pessoa
                                        aparece aqui e você poderá acompanhar a rotina dela.
                                    </Text>
                                </View>
                            </GlassCard>
                        ) : (
                            vm.monitorados.map((paciente) => (
                                <MonitoredCard
                                    key={paciente.id_relacao}
                                    paciente={paciente}
                                    onVerPerfil={() => vm.verPerfilPaciente(paciente)}
                                />
                            ))
                        )}
                    </>
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

// ===================== CARD DE CONTATO (EMERGENCIA) =====================
function ContactCard({
    contato,
    onMudarNivel,
    onRemove,
}: {
    contato: Contact;
    onMudarNivel: (nivel: NivelPermissao) => void;
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
                    <Text style={styles.contactRel}>{contato.email_contato}</Text>
                </View>
                <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
                    <Icon name="trash" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
            </View>

            <View style={styles.nivelSection}>
                <Text style={styles.nivelLabel}>Nível de acesso à sua rotina</Text>
                <View style={styles.chipsRow}>
                    {NIVEIS.map((nivel) => {
                        const ativo = contato.nivel_permissao === nivel.value;
                        return (
                            <TouchableOpacity
                                key={nivel.value}
                                onPress={() => onMudarNivel(nivel.value)}
                                style={[styles.chip, ativo && styles.chipAtivo]}
                                accessibilityRole="radio"
                                accessibilityState={{ selected: ativo }}
                            >
                                <Text style={[styles.chipText, ativo && styles.chipTextAtivo]}>
                                    {nivel.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <Text style={styles.nivelHint}>
                    {contato.nivel_permissao === 'TOTAL'
                        ? 'Vê e edita sua rotina, e recebe alertas.'
                        : contato.nivel_permissao === 'MODERADO'
                        ? 'Vê sua rotina (sem editar) e recebe alertas.'
                        : 'Recebe só os alertas de emergência.'}
                </Text>
            </View>
        </GlassCard>
    );
}

// ===================== CARD DE PACIENTE MONITORADO =====================
function MonitoredCard({
    paciente,
    onVerPerfil,
}: {
    paciente: MonitoredPatient;
    onVerPerfil: () => void;
}) {
    const iniciais = paciente.nome_paciente.charAt(0).toUpperCase();

    return (
        <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.sm }}>
            <View style={styles.cardRow}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{iniciais}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{paciente.nome_paciente}</Text>
                    <Text style={styles.contactRel}>
                        {NIVEL_LABELS[paciente.nivel_permissao] || paciente.nivel_permissao}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.verPerfilBtn} onPress={onVerPerfil}>
                <Text style={styles.verPerfilText}>VER PERFIL</Text>
            </TouchableOpacity>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: SPACING.lg, paddingTop: 100, paddingBottom: 100 },
    title: { fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold as any, color: '#fff', marginBottom: SPACING.md },
    tabBar: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
    tab: { flex: 1, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
    tabActive: { backgroundColor: 'rgba(29,158,117,0.3)', borderWidth: 1, borderColor: 'rgba(92,217,158,0.5)' },
    tabText: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
    tabTextActive: { color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    addRow: { alignItems: 'center', marginBottom: SPACING.md },
    addBtnWide: { width: 120, height: 44, borderRadius: BORDER_RADIUS.pill, backgroundColor: '#1d9e75', alignItems: 'center', justifyContent: 'center' },
    cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    avatar: { width: 44, height: 44, borderRadius: BORDER_RADIUS.pill, backgroundColor: '#1d9e75', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
    contactName: { fontSize: FONT_SIZES.md, color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    contactRel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    removeBtn: { padding: SPACING.sm },
    nivelSection: { marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
    nivelLabel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginBottom: SPACING.sm },
    chipsRow: { flexDirection: 'row', gap: SPACING.xs },
    chip: { flex: 1, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
    chipAtivo: { backgroundColor: 'rgba(29,158,117,0.35)', borderColor: '#5cd99e' },
    chipText: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)' },
    chipTextAtivo: { color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    nivelHint: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.6)', marginTop: SPACING.sm, lineHeight: 16 },
    verPerfilBtn: { marginTop: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: '#1d9e75', alignItems: 'center' },
    verPerfilText: { color: '#fff', fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.bold as any, letterSpacing: 0.5 },
    erroText: { color: '#ffb478', fontSize: FONT_SIZES.sm, textAlign: 'center' },
    emptyCard: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg },
    emptyTitle: { fontSize: FONT_SIZES.lg, color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    emptyText: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 20 },
    emptyBtn: { marginTop: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: 'rgba(29,158,117,0.85)' },
    emptyBtnText: { color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
});
