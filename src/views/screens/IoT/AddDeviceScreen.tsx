import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAddDeviceVM } from '@viewmodels/useAddDeviceVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function AddDeviceScreen() {
    const vm = useAddDeviceVM();

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
                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={vm.cancelar} style={styles.backBtn}>
                            <Icon name="arrow-left" size={26} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Novo dispositivo</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Cadastre um sensor ou dispositivo. O ID deve ser o mesmo
                        gravado no hardware (ESP32).
                    </Text>

                    <GlassCard tint="dark" intensity={60}>
                        <Input
                            label="ID do dispositivo"
                            placeholder="Ex: ESP32-A4"
                            value={vm.idDispositivo}
                            onChangeText={vm.setIdDispositivo}
                            autoCapitalize="characters"
                            error={vm.erros.id}
                            editable={!vm.salvando}
                        />

                        <Input
                            label="Nome"
                            placeholder="Ex: Sensor de Gás - Cozinha"
                            value={vm.nome}
                            onChangeText={vm.setNome}
                            error={vm.erros.nome}
                            editable={!vm.salvando}
                        />

                        {/* SELETOR DE CATEGORIA */}
                        <Text style={styles.label}>Categoria</Text>
                        <View style={styles.catGrid}>
                            {vm.categorias.map((opcao) => {
                                const selecionado = vm.categoria === opcao.value;
                                return (
                                    <TouchableOpacity
                                        key={opcao.value}
                                        onPress={() => vm.setCategoria(opcao.value)}
                                        style={[
                                            styles.catOpcao,
                                            selecionado && styles.catOpcaoSelected,
                                        ]}
                                        disabled={vm.salvando}
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected: selecionado }}
                                    >
                                        <Text style={[
                                            styles.catTexto,
                                            { color: selecionado ? '#fff' : 'rgba(255,255,255,0.75)' },
                                        ]}>
                                            {opcao.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </GlassCard>

                    {/* AÇÕES */}
                    <View style={styles.btnRow}>
                        <Button
                            title="Cancelar"
                            variant="ghost"
                            onPress={vm.cancelar}
                            style={{ flex: 1 }}
                        />
                        <Button
                            title="Cadastrar"
                            onPress={vm.salvar}
                            loading={vm.salvando}
                            disabled={!vm.idDispositivo.trim() || !vm.nome.trim()}
                            style={{ flex: 1, marginLeft: SPACING.sm }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: 60,
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: FONT_WEIGHTS.medium as any,
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    catGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    catOpcao: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.pill,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    catOpcaoSelected: {
        backgroundColor: '#1d9e75',
        borderColor: '#1d9e75',
    },
    catTexto: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    btnRow: {
        flexDirection: 'row',
        marginTop: SPACING.xl,
    },
});
