import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AddStatus = ({ setStatus, setDescription, complaintId, complaintType }) => {
    const [statusInput, setStatusInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');

    const { user } = useContext(AuthContext);

    const sendMail = async (id, status, description, type) => {
        try {
            const { data } = await axios.post('/api/v1/complaint/update-mail', {
                complaintId: id,
                status,
                description,
                type,
            });
            if (data?.success) {
                Toast.show({
                    type: 'success',
                    text1: data?.message,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: data?.message,
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: error?.response?.data?.message || 'Failed to send mail',
            });
        }
    };
    const handleUpdate = async () => {
        if (!statusInput.trim() || !descriptionInput.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Status and its description are required.',
            });
            return;
        }

        try {
            const { data } = await axios.put('/api/v1/police/change-complaint-status', {
                complaintId,
                status: statusInput,
                description: descriptionInput,
            });

            if (data?.success) {
                Toast.show({
                    type: 'success',
                    text1: data?.message || 'Status updated successfully.',
                });
                setStatus(prev => [...(Array.isArray(prev) ? prev : []), statusInput]);
                setDescription(prev => [...(Array.isArray(prev) ? prev : []), descriptionInput]);
                sendMail(complaintId, statusInput, descriptionInput, complaintType);
                setStatusInput('');
                setDescriptionInput('');
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: error?.response?.data?.message || 'Failed to update',
            });
        }
    };

    const handleResolveComplaint = async () => {
        try {
            const { data } = await axios.put('/api/v1/police/resolved-complaint', {
                policeId: user?.policeId,
                complaintId,
                type: complaintType,
            });
            if (data?.success) {
                Toast.show({
                    type: 'success',
                    text1: data?.message,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: data?.message,
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                message: error?.response?.data?.message || 'Error in Resolving complaint.',
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Complaint Status</Text>

            <Text style={styles.label}>Status</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter status (e.g., Investigation Started)"
                value={statusInput}
                onChangeText={setStatusInput}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Enter description"
                multiline
                value={descriptionInput}
                onChangeText={setDescriptionInput}
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update Status</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { marginTop: 20, backgroundColor: "#4caf50" }]} onPress={handleResolveComplaint}>
                <Text style={styles.buttonText}>Complaint Resolved</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddStatus;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginHorizontal: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#dcdcdc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        fontSize: 14,
        color: '#2c3e50',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
