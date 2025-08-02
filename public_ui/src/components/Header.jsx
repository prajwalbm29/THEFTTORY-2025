import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native-animatable'

const Header = ({ title = 'Your Safety, Our Priority' }) => {
    return (
        <View style={styles.header}>
            <Image
                source={require('../assets/thefttory-logo.png')}
                style={styles.logo}
            />
            <Text style={styles.headerText}>{title}</Text>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 15,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
})