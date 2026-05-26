import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppStore } from '@store/useAppStore';
import { getThemeColors } from '@theme/colors';
import { SPACING } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';
import type { RootStackParamList } from '@navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
    const navigation = useNavigation<Navigation>();
    const colors = getThemeColors('forest');
    const authStatus = useAppStore((s) => s.authStatus);

    useEffect(() => {

        if (authStatus === 'loading') return;

        const timer = setTimeout(() => {
            if (authStatus === 'logged_in') {
                navigation.replace('DrawerRoot');
            } else {
                navigation.replace('Login');
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [authStatus, navigation]);

    return (
        <View style={[styles.container, { backgroundColor: colors.primaryDark }]}>
            <View style={styles.logoContainer}>
                <Text style={[styles.logoIcon, { color: colors.textOnPrimary }]}>🏠</Text>
                <Text style={[styles.appName, { color: colors.textOnPrimary }]}>SafeHome</Text>
                <Text style={[styles.tagline, { color: colors.primaryLight }]}>
                    Sua casa, seu refúgio
                </Text>
            </View>

            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primaryLight} />
                <Text style={[styles.loadingText, { color: colors.primaryLight }]}>
                    Carregando...
                </Text>
            </View>

            <Text style={[styles.footer, { color: colors.primaryLight }]}>v1.0.0</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.xxxl,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoIcon: {
        fontSize: 80,
        marginBottom: SPACING.lg,
    },
    appName: {
        fontSize: FONT_SIZES.hero,
        fontWeight: FONT_WEIGHTS.bold as any,
        letterSpacing: 2,
    },
    tagline: {
        fontSize: FONT_SIZES.md,
        marginTop: SPACING.sm,
        fontStyle: 'italic',
    },
    loadingContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    loadingText: {
        marginTop: SPACING.sm,
        fontSize: FONT_SIZES.sm,
    },
    footer: {
        fontSize: FONT_SIZES.xs,
        opacity: 0.6,
    },
});
