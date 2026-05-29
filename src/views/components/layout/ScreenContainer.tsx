import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    overlayOpacity = 0.35,
    style,
    safeArea = true,
}: Props) {
    if (variant === 'plain') {
        const Wrapper = safeArea ? SafeAreaView : View;
        return (
            <Wrapper style={[styles.plainContainer, style]}>
                {children}
            </Wrapper>
        );
    }

    // Tela com imagem de fundo
    const imageSource = variant === 'auth'
        ? require('@assets/images/bg-auth.jpg')
        : require('@assets/images/bg-app.png');

    const content = (
        <>
            {/* Overlay escuro pra dar contraste */}
            <View
                style={[
                    styles.overlay,
                    { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` },
                ]}
                pointerEvents="none"
            />

            {/* Conteúdo da tela */}
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
