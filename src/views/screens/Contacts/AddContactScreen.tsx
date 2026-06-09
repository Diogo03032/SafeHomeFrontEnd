import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAddContactVM } from '@viewmodels/useAddContactVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function AddContactScreen() {
    const vm = useAddContactVM();

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {/* Header com voltar */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={vm.voltar} style={styles.backBtn}>
                            <Icon name="arrow-left" size={26} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Adicionar contato</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Busque um usuário do SafeHome pelo email pra adicionar à sua rede de apoio.
                    </Text>

                    {/* Campo de busca */}
                    <GlassCard tint="dark" intensity={60}>
                        <Input
                            label="E-mail do contato"
                            placeholder="exemplo@email.com"
                            value={vm.email}
                            onChangeText={vm.setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!vm.buscando && !vm.usuarioEncontrado}
                        />

                        {!vm.usuarioEncontrado && (
                            <Button
                                title="BUSCAR"
                                onPress={vm.buscar}
                                loading={vm.buscando}
                                disabled={!vm.email.trim()}
                            />
                        )}

                        {vm.erroBusca && <Text style={styles.erroText}>{vm.erroBusca}</Text>}
                    </GlassCard>

                    {/* Card do usuário encontrado */}
                    {vm.usuarioEncontrado && (
                        <>
                            <Text style={styles.secao}>USUÁRIO ENCONTRADO</Text>
                            <GlassCard tint="dark" intensity={60}>
                                <View style={styles.userRow}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>
                                            {vm.usuarioEncontrado.nome.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.userName}>{vm.usuarioEncontrado.nome}</Text>
                                        <Text style={styles.userEmail}>{vm.usuarioEncontrado.email}</Text>
                                    </View>
                                </View>
                            </GlassCard>

                            {/* Tipo de relação */}
                            <Text style={styles.secao}>TIPO DE RELAÇÃO</Text>
                            <GlassCard tint="dark" intensity={60}>
                                <View style={styles.relacoesGrid}>
                                    {vm.relacoes.map((r) => {
                                        const selecionado = vm.relacao === r.value;
                                        return (
                                            <TouchableOpacity
                                                key={r.value}
                                                onPress={() => vm.setRelacao(r.value)}
                                                style={[styles.relacaoOption, selecionado && styles.relacaoSelected]}
                                            >
                                                <Text style={[
                                                    styles.relacaoText,
                                                    { color: selecionado ? '#fff' : 'rgba(255,255,255,0.8)' },
                                                ]}>
                                                    {r.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </GlassCard>

                            {/* Permissão de emergência */}
                            <GlassCard tint="dark" intensity={60} style={{ marginTop: SPACING.md }}>
                                <View style={styles.permRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.permLabel}>Pode receber alertas de emergência?</Text>
                                        <Text style={styles.permHint}>
                                            Quando você acionar o pânico, esse contato será notificado
                                        </Text>
                                    </View>
                                    <Switch
                                        value={vm.podeAlertarEmergencia}
                                        onValueChange={vm.setPodeAlertarEmergencia}
                                        trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#1d9e75' }}
                                        thumbColor="#fff"
                                    />
                                </View>
                            </GlassCard>

                            {/* Botões */}
                            <View style={styles.btnRow}>
                                <Button title="Cancelar" variant="ghost" onPress={vm.limparBusca} style={{ flex: 1 }} />
                                <Button
                                    title="ADICIONAR"
                                    onPress={vm.adicionar}
                                    loading={vm.adicionando}
                                    style={{ flex: 1, marginLeft: SPACING.sm }}
                                />
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.xxl },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    backBtn: { padding: SPACING.sm, marginLeft: -SPACING.sm },
    title: { fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold as any, color: '#fff', marginLeft: SPACING.sm },
    subtitle: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.lg, lineHeight: 20 },
    erroText: { color: '#ffb478', fontSize: FONT_SIZES.sm, textAlign: 'center', marginTop: SPACING.sm },
    secao: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginTop: SPACING.md, marginBottom: SPACING.sm, marginLeft: SPACING.sm },
    userRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    avatar: { width: 48, height: 48, borderRadius: BORDER_RADIUS.pill, backgroundColor: '#1d9e75', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
    userName: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.semibold as any },
    userEmail: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZES.xs, marginTop: 2 },
    relacoesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    relacaoOption: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', minWidth: '45%', alignItems: 'center' },
    relacaoSelected: { backgroundColor: '#1d9e75', borderColor: '#1d9e75' },
    relacaoText: { fontSize: FONT_SIZES.sm, fontWeight: '500' },
    permRow: { flexDirection: 'row', alignItems: 'center' },
    permLabel: { color: '#fff', fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.medium as any },
    permHint: { color: 'rgba(255,255,255,0.6)', fontSize: FONT_SIZES.xs, marginTop: 2, lineHeight: 16 },
    btnRow: { flexDirection: 'row', marginTop: SPACING.lg },
});
