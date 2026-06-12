import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';

// ============================================================
// Botão de pânico FLUTUANTE GLOBAL
// ============================================================

export default function PanicButton() {
    const navigation = useNavigation<any>();

    const acionar = () => {
        navigation.navigate('PanicCountdown');
    };

    return (
        <TouchableOpacity
            onPress={acionar}
            style={styles.panicButton}
            activeOpacity={0.85}
            accessibilityLabel="Acionar botão de pânico"
            accessibilityRole="button"
        >
            <View style={styles.panicGlow} />
            <Icon name="siren" size={32} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    panicButton: {
        position: 'absolute',
        bottom: 125,          
        right: SPACING.xl,
        width: 64,
        height: 64,
        borderRadius: BORDER_RADIUS.pill,
        backgroundColor: '#c83333',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 12,
        shadowColor: '#c83333',
        shadowOpacity: 0.6,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 0 },
        borderWidth: 2,
        borderColor: 'rgba(255,180,180,0.5)',
        zIndex: 999,         
    },
    panicGlow: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.pill,
        backgroundColor: '#c83333',
        opacity: 0.3,
    },
});
