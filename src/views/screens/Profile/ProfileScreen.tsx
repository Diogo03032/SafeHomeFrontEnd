import React from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useProfileVM } from '@viewmodels/useProfileVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function ProfileScreen() {
    const vm = useProfileVM();

    if (vm.carregando) {
        return (
            <ScreenContainer variant="app" safeArea={false}>
                <View style={styles.centerLoading}>
                    <ActivityIndicator color="#fff" size="large" />
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* AVATAR + NOME + EMAIL */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarBig}>
                            <Text style={styles.avatarBigText}>
                                {vm.primeiroNome.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.nomeBig}>
                            {vm.perfil?.nome ?? 'Carregando...'}
                        </Text>
                        <Text style={styles.emailSubtle}>
                            {vm.perfil?.email ?? ''}
                        </Text>
                    </View>

                    {/* CARD PRINCIPAL */}
                    <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                        {vm.editando ? (
                            // ===== MODO EDIÇÃO =====
                            <View>
                                <Text style={styles.sectionLabel}>EDITAR PERFIL</Text>

                                <Input
                                    label="Nome"
                                    value={vm.nomeEdit}
                                    onChangeText={vm.setNomeEdit}
                                    error={vm.erros.nome}
                                />

                                <Text style={styles.fieldLabel}>Gênero</Text>
                                <View style={styles.generoRow}>
                                    {vm.opcoesGenero.map((opcao) => {
                                        const selecionado = vm.generoEdit === opcao.value;
                                        return (
                                            <TouchableOpacity
                                                key={opcao.value}
                                                onPress={() => vm.setGeneroEdit(opcao.value)}
                                                style={[
                                                    styles.generoOption,
                                                    selecionado && styles.generoSelected,
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.generoText,
                                                    { color: selecionado ? '#fff' : 'rgba(255,255,255,0.7)' },
                                                ]}>
                                                    {opcao.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <Input
                                    label="Bio"
                                    value={vm.bioEdit}
                                    onChangeText={vm.setBioEdit}
                                    multiline
                                    maxLength={200}
                                    error={vm.erros.bio}
                                />

                                <View style={styles.btnRow}>
                                    <Button
                                        title="Cancelar"
                                        variant="ghost"
                                        onPress={vm.cancelarEdicao}
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        title="Salvar"
                                        onPress={vm.salvarEdicao}
                                        loading={vm.salvando}
                                        style={{ flex: 1, marginLeft: SPACING.sm }}
                                    />
                                </View>
                            </View>
                        ) : (
                            // ===== MODO VISUALIZAÇÃO =====
                            <View>
                                <InfoRow
                                    icon="user"
                                    label="Gênero"
                                    value={vm.getGeneroLabel(vm.perfil?.genero || 'NAO_INFORMADO')}
                                />
                                <View style={styles.divider} />
                                <InfoRow
                                    icon="heart"
                                    label="Sobre você"
                                    value={vm.perfil?.bio || 'Sem bio ainda'}
                                />

                                <TouchableOpacity onPress={vm.iniciarEdicao} style={styles.editBtn}>
                                    <Icon name="pencil" size={16} color="#fff" />
                                    <Text style={styles.editText}>Editar perfil</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </GlassCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: 'user' | 'heart' | 'bell' | 'lock';
    label: string;
    value: string;
}) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
                <Icon name={icon} size={18} color="rgba(255,255,255,0.85)" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    centerLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: 100, // espaço pro header glass transparente
        paddingBottom: 100, // espaço pra TabBar
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarBig: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1d9e75',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarBigText: {
        fontSize: 42,
        color: '#fff',
        fontWeight: '700',
    },
    nomeBig: {
        fontSize: FONT_SIZES.xxl,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    emailSubtle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 4,
    },
    sectionLabel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    infoIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoLabel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginVertical: SPACING.xs,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    editText: {
        color: '#fff',
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    fieldLabel: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: SPACING.xs,
        marginTop: SPACING.sm,
    },
    generoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
        marginBottom: SPACING.md,
    },
    generoOption: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    generoSelected: {
        backgroundColor: '#1d9e75',
        borderColor: '#1d9e75',
    },
    generoText: {
        fontSize: FONT_SIZES.sm,
    },
    btnRow: {
        flexDirection: 'row',
        marginTop: SPACING.md,
    },
});
