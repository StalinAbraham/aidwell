import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleAlert as AlertCircle, Bell, Clock, Pill as Pills, Check, X } from 'lucide-react-native';
import { format } from 'date-fns';
import useStore from '@/store/useStore';

const EMERGENCY_NUMBER = '80011111';

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

export default function HomeScreen() {
  const { medications, symptoms, toggleMedicationTaken } = useStore();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);
  
  const currentTimeOfDay = getTimeOfDay();
  const currentMedications = medications.filter(med => 
    med.timeOfDay === currentTimeOfDay && !med.taken
  );

  const handleEmergencyCall = async () => {
    const phoneNumber = Platform.OS === 'android' ? `tel:${EMERGENCY_NUMBER}` : `telprompt:${EMERGENCY_NUMBER}`;
    const canOpen = await Linking.canOpenURL(phoneNumber);
    
    if (canOpen) {
      await Linking.openURL(phoneNumber);
    } else {
      console.error('Cannot make phone call');
    }
  };

  const handleTakeMedication = (id: string) => {
    setSelectedMedicationId(id);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmTaken = () => {
    if (selectedMedicationId) {
      toggleMedicationTaken(selectedMedicationId);
    }
    setIsConfirmModalVisible(false);
    setSelectedMedicationId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good {currentTimeOfDay.toLowerCase()}, Godwin</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </View>

        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <AlertCircle color="#DC2626" size={24} />
          <Text style={styles.emergencyButtonText}>Emergency Assistance</Text>
          <Text style={styles.emergencyNumber}>Call {EMERGENCY_NUMBER}</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{currentTimeOfDay}'s Medications</Text>
          {currentMedications.length === 0 ? (
            <Text style={styles.noMedications}>No medications scheduled for {currentTimeOfDay.toLowerCase()}</Text>
          ) : (
            currentMedications.map(medication => (
              <View key={medication.id} style={styles.medicationCard}>
                <Pills size={24} color="#2c346b" />
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDetails}>
                    {medication.strength}mg • {medication.quantity}{medication.type === 'pill' ? ' pills' : 'ml'} • 
                    {medication.foodTiming} food
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.takeButton}
                  onPress={() => handleTakeMedication(medication.id)}
                >
                  <Text style={styles.takeButtonText}>Take</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Symptoms</Text>
          {symptoms.length === 0 ? (
            <Text style={styles.noSymptoms}>No symptoms recorded</Text>
          ) : (
            symptoms.slice(0, 3).map((symptom) => (
              <View key={symptom.id} style={styles.symptomCard}>
                <View style={styles.symptomHeader}>
                  <View style={styles.symptomTitleContainer}>
                    <Text style={styles.symptomName}>{symptom.name}</Text>
                    {symptom.isEmergency && (
                      <View style={styles.emergencyBadge}>
                        <AlertCircle size={16} color="#DC2626" />
                        <Text style={styles.emergencyText}>Emergency</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.symptomTime}>
                    {format(new Date(symptom.timestamp), 'MMM d, h:mm a')}
                  </Text>
                </View>
                <Text style={styles.symptomDescription}>{symptom.description}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Confirm Take Medication Modal */}
      <Modal
        visible={isConfirmModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Confirm Medication</Text>
            <Text style={styles.confirmModalText}>
              Did you take this medication?
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.confirmButtonCancel]}
                onPress={() => setIsConfirmModalVisible(false)}
              >
                <X size={20} color="#2c346b" />
                <Text style={[styles.confirmButtonText, styles.confirmButtonTextCancel]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.confirmButtonConfirm]}
                onPress={handleConfirmTaken}
              >
                <Check size={20} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f16b',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#2c346b',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
    opacity: 0.7,
  },
  emergencyButton: {
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  emergencyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#DC2626',
    marginLeft: 8,
    marginRight: 8,
  },
  emergencyNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#DC2626',
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#2c346b',
    marginBottom: 12,
  },
  noMedications: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 12,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  medicationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  medicationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c346b',
    marginBottom: 4,
  },
  medicationDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2c346b',
    opacity: 0.7,
  },
  takeButton: {
    backgroundColor: '#2c346b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  takeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  noSymptoms: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 12,
  },
  symptomCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  symptomHeader: {
    marginBottom: 8,
  },
  symptomTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  symptomName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c346b',
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  emergencyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#DC2626',
  },
  symptomTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2c346b',
    opacity: 0.7,
  },
  symptomDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2c346b',
    opacity: 0.7,
    lineHeight: 20,
  },
  confirmModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  confirmModalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#2c346b',
    marginBottom: 8,
  },
  confirmModalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
    opacity: 0.7,
    marginBottom: 24,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  confirmButtonConfirm: {
    backgroundColor: '#2c346b',
  },
  confirmButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  confirmButtonTextCancel: {
    color: '#2c346b',
  },
});