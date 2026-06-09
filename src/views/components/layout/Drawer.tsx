import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { useAppStore } from '@store/useAppStore';
import { Icon, IconName } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

interface MenuItem {
    icone: IconName;
    titulo: string;
    rota: string;
    tipo: 'tab' | 'drawer';
}

const MENU_ITEMS: MenuItem[] = [
    // Tabs
    { icone: 'home',        titulo: 'Início',         rota: 'Home',     tipo: 'tab' },
    { icone: 'calendar',    titulo: 'Agenda',         rota: 'Agenda',   tipo: 'tab' },
    { icone: 'smart-home',  titulo: 'Dispositivos',   rota: 'IoT',      tipo: 'tab' },
    { icone: 'users',       titulo: 'Meus contatos',  rota: 'Contacts', tipo: 'tab' },
    { icone: 'user',        titulo: 'Perfil',         rota: 'Profile',  tipo: 'tab' },

    // Drawer
    { icone: 'chart-line',  titulo: 'Estatísticas',   rota: 'Stats',    tipo: 'drawer' },
    { icone: 'palette',     titulo: 'Temas',          rota: 'Themes',   tipo: 'drawer' },
    { icone: 'settings',    titulo: 'Configurações',  rota: 'Settings', tipo: 'drawer' },
    { icone: 'shield',      titulo: 'Permissões',     rota: 'Permissions', tipo: 'drawer' },
    { icone: 'eye',         titulo: 'Acessibilidade', rota: 'Accessibility', tipo: 'drawer' },
    { icone: 'info',        titulo: 'Sobre',          rota: 'About',    tipo: 'drawer' },
];

export default function DrawerMenu(props: DrawerContentComponentProps) {
    const user = useAppStore((s) => s.user);
    const logout = useAppStore((s) => s.logout);

    const primeiraLetra = user?.nome?.charAt(0).toUpperCase() ?? '?';
    const primeiroNome = user?.nome?.split(' ')[0] ?? 'usuário';

    const navegar = (item: MenuItem) => {
        if (item.tipo === 'tab') {
            // @ts-ignore
            props.navigation.navigate('TabRoot', { screen: item.rota });
        } else {
            // @ts-ignore
            props.navigation.navigate(item.rota);
        }
        props.navigation.closeDrawer();
    };

    const handleLogout = async () => {
        await logout();
        props.navigation.reset({
            index: 0,
            // @ts-ignore
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <BlurView
                intensity={Platform.OS === 'ios' ? 90 : 100}
                tint="dark"
                style={StyleSheet.absoluteFill}
            />

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollContent}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{primeiraLetra}</Text>
                    </View>
                    <Text style={styles.nome}>{primeiroNome}</Text>
                    <Text style={styles.email}>{user?.email ?? ''}</Text>
                </View>

                {/* SEÇÃO NAVEGAÇÃO */}
                <Text style={styles.sectionLabel}>NAVEGAÇÃO</Text>
                {MENU_ITEMS.filter(i => i.tipo === 'tab').map((item) => (
                    <TouchableOpacity
                        key={item.rota}
                        onPress={() => navegar(item)}
                        style={styles.menuItem}
                    >
                        <Icon name={item.icone} size={22} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.menuTitulo}>{item.titulo}</Text>
                    </TouchableOpacity>
                ))}

                {/* SEÇÃO CONFIGURAÇÕES */}
                <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>CONFIGURAÇÕES</Text>
                {MENU_ITEMS.filter(i => i.tipo === 'drawer').map((item) => (
                    <TouchableOpacity
                        key={item.rota}
                        onPress={() => navegar(item)}
                        style={styles.menuItem}
                    >
                        <Icon name={item.icone} size={22} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.menuTitulo}>{item.titulo}</Text>
                    </TouchableOpacity>
                ))}

                {/* DIVISOR */}
                <View style={styles.divider} />

                {/* LOGOUT */}
                <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                    <Icon name="log-out" size={22} color="#ff8478" />
                    <Text style={[styles.menuTitulo, { color: '#ff8478', fontWeight: '600' }]}>
                        Sair da conta
                    </Text>
                </TouchableOpacity>

                {/* RODAPÉ */}
                <Text style={styles.versao}>SafeHome v1.0.0</Text>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingTop: SPACING.md, paddingHorizontal: SPACING.sm },
    header: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.lg,
        marginBottom: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: BORDER_RADIUS.pill,
        backgroundColor: '#1d9e75',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    nome: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    email: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
        marginLeft: SPACING.md,
        marginBottom: SPACING.xs,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.md,
    },
    menuTitulo: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium as any,
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginVertical: SPACING.md,
        marginHorizontal: SPACING.md,
    },
    versao: {
        textAlign: 'center',
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.5)',
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
        fontStyle: 'italic',
    },
});
