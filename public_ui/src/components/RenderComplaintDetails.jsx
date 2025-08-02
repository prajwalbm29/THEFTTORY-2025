import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import moment from 'moment';

const RenderComplaintDetails = ({ complaint, complaintType, update }) => {
    if (!complaint || !complaintType) {
        return (
            <View style={styles.detailsContainer}>
                <Text style={{ alignSelf: 'center', color: '#ff0000' }}>Complaint for the provided data Not Found</Text>
            </View>
        );
    }
    return (
        <View style={styles.detailsContainer}>
            {/* Complaint Details */}
            <Text style={[styles.sectionTitle, { alignSelf: 'center' }]}>Complaint Details</Text>
            <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Verified:</Text>
                    <Text style={styles.detailValue}>{complaint.isVerified ? 'Yes' : 'No'}</Text>
                </View>

                {/* If phone display the fallowing */}
                {complaintType === 'phone' && <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>IMEI:</Text>
                    <Text style={styles.detailValue}>{complaint.imei}</Text>
                </View>}
                {/* If laptop display the fallowing */}
                {complaintType === 'laptop' && <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Serial Number:</Text>
                    <Text style={styles.detailValue}>{complaint.serialNo}</Text>
                </View>}
                {/* If Bike or Car display the fallowing */}
                {complaintType === 'bike' || complaintType === 'car' && <>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Registration Number:</Text>
                        <Text style={styles.detailValue}>{complaint.registrationNo}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Chassis Number:</Text>
                        <Text style={styles.detailValue}>{complaint.chasisNo}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Engine Number:</Text>
                        <Text style={styles.detailValue}>{complaint.engineNo}</Text>
                    </View>
                </>}
                {/* If Gold display the fallowing */}
                {complaintType === 'gold' && <>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Gold Weight:</Text>
                        <Text style={styles.detailValue}>{complaint.weight} grams</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Unique Feature:</Text>
                        <Text style={styles.detailValue}>{complaint.uniqueFeature}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Witness details:</Text>
                        <Text style={styles.detailValue}>{complaint.witness}</Text>
                    </View>
                </>}


                {complaintType === 'gold' ? null : <>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Brand:</Text>
                        <Text style={styles.detailValue}>{complaint.brand}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Model:</Text>
                        <Text style={styles.detailValue}>{complaint.model}</Text>
                    </View>
                </>}
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Lost Location:</Text>
                    <Text style={styles.detailValue}>{complaint.lostLocation}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Lost Description:</Text>
                    <Text style={styles.detailValue}>{complaint.lostDescription}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Lost Date:</Text>
                    <Text style={styles.detailValue}>{moment(complaint.lostDate).format('DD MMM YYYY')}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Complaint Date:</Text>
                    <Text style={styles.detailValue}>{moment(complaint.createdAt).format('DD MMM YYYY')}</Text>
                </View>
            </View>

            {/* Complaint Status */}
            <ComplaintStatus update={update} />
        </View>
    );
};

const ComplaintStatus = ({ update }) => {
    if (!update || !update.status) {
        return (
            <View style={styles.statusPendingContainer}>
                <View style={styles.statusPendingCard}>
                    <Text style={styles.statusPendingText}>Working on your complaint</Text>
                    <Text style={styles.statusPendingSubText}>We will update you soon...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Complaint Status</Text>

            <View style={styles.detailsCard}>
                {update?.status.map((status, index) => {
                    return (
                        <View key={index} style={styles.statusItem}>
                            {/* Status indicator */}
                            <View style={[
                                styles.statusIndicator, styles.statusIndicatorCompleted,
                            ]}>
                                <View style={styles.statusCheckmark}>
                                    <Text style={styles.statusCheckmarkText}>✓</Text>
                                </View>
                            </View>

                            {/* Status content */}
                            <View style={styles.statusContent}>
                                <Text style={[
                                    styles.statusName, styles.statusNameCompleted,
                                ]}>
                                    {status}
                                </Text>
                                <Text style={styles.statusDescription}>
                                    {update?.description[index]}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default RenderComplaintDetails;

const styles = StyleSheet.create({
    detailsContainer: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        marginTop: 20,
    },
    detailsCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    detailLabel: {
        color: '#7f8c8d',
        fontWeight: '500',
    },
    detailValue: {
        color: '#2c3e50',
        fontWeight: '600',
        textAlign: 'right',
        flexShrink: 1,
        maxWidth: '60%',
    },
    statusContainer: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    statusPendingContainer: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    statusPendingCard: {
        backgroundColor: '#FFF6E6',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#FFA500',
    },
    statusPendingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E67E22',
        marginBottom: 4,
    },
    statusPendingSubText: {
        fontSize: 14,
        color: '#95a5a6',
    },
    statusTimeline: {
        marginLeft: 10,
    },
    statusItem: {
        flexDirection: 'row',
        marginBottom: 16,
        position: 'relative',
    },
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#bdc3c7',
        backgroundColor: '#fff',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIndicatorCompleted: {
        backgroundColor: '#2ecc71',
        borderColor: '#2ecc71',
    },
    statusCheckmark: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusCheckmarkText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    statusContent: {
        flex: 1,
    },
    statusName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 4,
    },
    statusNameCompleted: {
        color: '#27ae60',
    },
    statusDescription: {
        fontSize: 14,
        color: '#34495e',
        marginBottom: 4,
    },
})