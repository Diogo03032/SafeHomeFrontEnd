import React from 'react';
import { Platform, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { BORDER_RADIUS, SPACING } from '@theme/spacing';

interface Props extends ViewProps {
    children: React.ReactNode;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    style?: ViewStyle;
    padding?: keyof typeof SPACING;
}
export default function GlassCard({
    children,
    intensity = 70,
    tint = 'light',
    style,
    padding = 'lg',
    ...rest
}: Props) {

    return (
        <BlurView
            intensity={intensity}
            tint={tint}
            style={[
                styles.container,
                { padding: SPACING[padding] },
                style,
            ]}
            {...rest}
        >
            {children}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        ...Platform.select({
            android: {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
            },
        }),
    },
});
