import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';


export default function LocationSearchScreen() {
    const [selectedLocation, setSelectedLocation] = useState('');

    const GOOGLE_MAPS_API_KEY = "";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test Location Lookup</Text>

            <GooglePlacesAutocomplete
                placeholder="Search location"
                fetchDetails={true}
                onPress={(data, details = null) => {
                    const address = data.description;
                    const lat = details?.geometry?.location?.lat;
                    const lng = details?.geometry?.location?.lng;

                    setSelectedLocation(`📍 ${address}\n🗺️ Lat: ${lat}, Lng: ${lng}`);
                    console.log("Selected Location:", address, lat, lng);
                }}
                query={{
                    key: GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                styles={{
                    textInput: styles.input,
                    listView: styles.listView,
                }}
                enablePoweredByContainer={false}
            />

            <Text style={styles.result}>{selectedLocation}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
        backgroundColor: '#f0f0f0'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
        height: 44,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    listView: {
        backgroundColor: '#fff'
    },
    result: {
        marginTop: 20,
        fontSize: 16
    }
});
