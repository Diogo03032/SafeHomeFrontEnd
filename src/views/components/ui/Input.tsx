import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

interface Props extends TextInputProps {
    label?: string;
    error?: string | null;
    containerStyle?: ViewStyle;
}

export default function Input({ label, error, containerStyle, style, ...rest }: Props) {
    const colors = getThemeColors('forest');

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, { color: '#fff' }]}>{label}</Text>}

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.status.danger : colors.border,
                        color: colors.textPrimary,
                    },
                    style,
                ]}
                placeholderTextColor={colors.textSecondary}
                accessibilityLabel={label}
                {...rest}
            />

            {error && (
                <Text style={[styles.error, { color: colors.status.danger }]}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    input: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        minHeight: 48,
    },
    error: {
        fontSize: FONT_SIZES.xs,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
});
