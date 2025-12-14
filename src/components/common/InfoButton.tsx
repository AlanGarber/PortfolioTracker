import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface InfoButtonProps {
    title: string;
    message: string;
}

export const InfoButton = ({ title, message }: InfoButtonProps) => {
    const handlePress = () => {
        Alert.alert(title, message, [{ text: "Entendido" }]);
    };

    return (
        <TouchableOpacity onPress={handlePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
    );
};