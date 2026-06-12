import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@store/useAppStore';

interface Props {
    children: React.ReactNode;
    variant?: 'auth' | 'app' | 'plain';
    overlayOpacity?: number;
    style?: ViewStyle;
    safeArea?: boolean;
}

export default function ScreenContainer({
    children,
    variant = 'app',
    overlayOpacity,
    style,
    safeArea = true,
}: Props) {
    
    const themeMode = useAppStore((s) => s.themeMode);
    const systemScheme = useColorScheme(); 

    const isDark =
        themeMode === 'dark' ||
        (themeMode === 'system' && systemScheme === 'dark');

    const resolvedOpacity =
        overlayOpacity ?? (isDark ? 0.55 : 0.25);

    if (variant === 'plain') {
        const Wrapper = safeArea ? SafeAreaView : View;
        return (
            <Wrapper style={[styles.plainContainer, style]}>
                {children}
            </Wrapper>
        );
    }

    const imageSource = variant === 'auth'
        ? require('@assets/images/bg-auth.png')
        : require('@assets/images/bg-app.png');

    const content = (
        <>
            {/* Overlay: escurece o fundo. A opacidade varia com o tema. */}
            <View
                style={[
                    styles.overlay,
                    { backgroundColor: `rgba(0, 0, 0, ${resolvedOpacity})` },
                ]}
                pointerEvents="none"
            />

            {/* Conteudo da tela */}
            {safeArea ? (
                <SafeAreaView style={[styles.content, style]}>
                    {children}
                </SafeAreaView>
            ) : (
                <View style={[styles.content, style]}>
                    {children}
                </View>
            )}
        </>
    );

    return (
        <ImageBackground
            source={imageSource}
            style={styles.background}
            resizeMode="cover"
        >
            {content}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
    },
    plainContainer: {
        flex: 1,
        backgroundColor: '#f0f5f1',
    },
});
