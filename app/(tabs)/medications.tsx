import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Pill, FlaskRound as Flask, X, Check } from 'lucide-react-native';
import useStore from '@/store/useStore';

type MedicationType = 'pill' | 'syrup';
type FoodTiming = 'before' | 'with' | 'after';
type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export default function MedicationsScreen() {
  const { medications, addMedication, toggleMedicationTaken } = useStore();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);
  
  // Form state
  const [medicationType, setMedicationType] = useState<MedicationType | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [strength, setStrength] = useState('');
  const [foodTiming, setFoodTiming] = useState<FoodTiming | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);

  const resetForm = () => {
    setMedicationType(null);
    setName('');
    setQuantity('');
    setStrength('');
    setFoodTiming(null);
    setTimeOfDay(null);
  };

  const handleSave = () => {
    if (!medicationType || !name || !quantity || !strength || !foodTiming || !timeOfDay) {
      return;
    }

    addMedication({
      name,
      type: medicationType,
      quantity: parseFloat(quantity),
      strength: parseFloat(strength),
      foodTiming,
      timeOfDay,
      withFood: foodTiming === 'with',
      frequency: 'daily',
      time: timeOfDay,
    });

    setIsAddModalVisible(false);
    resetForm();
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
          <Text style={styles.title}>Medications</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
            <View key={time} style={styles.timeBlock}>
              <Text style={styles.timeTitle}>{time}</Text>
              {medications
                .filter(med => med.timeOfDay === time && !med.taken)
                .map(medication => (
                  <View key={medication.id} style={styles.medicationCard}>
                    {medication.type === 'pill' ? (
                      <Pill size={24} color="#2c346b" />
                    ) : (
                      <Flask size={24} color="#2c346b" />
                    )}
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
                ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Medication Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medication</Text>
              <TouchableOpacity 
                onPress={() => {
                  setIsAddModalVisible(false);
                  resetForm();
                }}
              >
                <X size={24} color="#2c346b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.formLabel}>Type</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity 
                  style={[
                    styles.typeButton,
                    medicationType === 'pill' && styles.typeButtonSelected
                  ]}
                  onPress={() => setMedicationType('pill')}
                >
                  <Pill size={24} color={medicationType === 'pill' ? '#FFFFFF' : '#2c346b'} />
                  <Text style={[
                    styles.typeButtonText,
                    medicationType === 'pill' && styles.typeButtonTextSelected
                  ]}>Pills</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.typeButton,
                    medicationType === 'syrup' && styles.typeButtonSelected
                  ]}
                  onPress={() => setMedicationType('syrup')}
                >
                  <Flask size={24} color={medicationType === 'syrup' ? '#FFFFFF' : '#2c346b'} />
                  <Text style={[
                    styles.typeButtonText,
                    medicationType === 'syrup' && styles.typeButtonTextSelected
                  ]}>Syrup</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Medication name"
                placeholderTextColor="rgba(44, 52, 107, 0.5)"
              />

              <Text style={styles.formLabel}>Quantity ({medicationType === 'pill' ? 'pills' : 'ml'})</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder={`Amount in ${medicationType === 'pill' ? 'pills' : 'ml'}`}
                placeholderTextColor="rgba(44, 52, 107, 0.5)"
              />

              <Text style={styles.formLabel}>Strength (mg)</Text>
              <TextInput
                style={styles.input}
                value={strength}
                onChangeText={setStrength}
                keyboardType="numeric"
                placeholder="Amount in mg"
                placeholderTextColor="rgba(44, 52, 107, 0.5)"
              />

              <Text style={styles.formLabel}>Food Timing</Text>
              <View style={styles.optionsContainer}>
                {(['before', 'with', 'after'] as FoodTiming[]).map((timing) => (
                  <TouchableOpacity
                    key={timing}
                    style={[
                      styles.optionButton,
                      foodTiming === timing && styles.optionButtonSelected
                    ]}
                    onPress={() => setFoodTiming(timing)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      foodTiming === timing && styles.optionButtonTextSelected
                    ]}>
                      {timing.charAt(0).toUpperCase() + timing.slice(1)} food
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Time of Day</Text>
              <View style={styles.optionsContainer}>
                {(['Morning', 'Afternoon', 'Evening', 'Night'] as TimeOfDay[]).map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.optionButton,
                      timeOfDay === time && styles.optionButtonSelected
                    ]}
                    onPress={() => setTimeOfDay(time)}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      timeOfDay === time && styles.optionButtonTextSelected
                    ]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  (!medicationType || !name || !quantity || !strength || !foodTiming || !timeOfDay) && 
                  styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!medicationType || !name || !quantity || !strength || !foodTiming || !timeOfDay}
              >
                <Text style={styles.saveButtonText}>Save Medication</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#2c346b',
  },
  addButton: {
    backgroundColor: '#2c346b',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#2c346b',
    marginBottom: 16,
  },
  timeBlock: {
    marginBottom: 24,
  },
  timeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c346b',
    opacity: 0.7,
    marginBottom: 8,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#2c346b',
  },
  modalScroll: {
    padding: 20,
  },
  formLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c346b',
    marginBottom: 8,
    marginTop: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2c346b',
    gap: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#2c346b',
  },
  typeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c346b',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2c346b',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2c346b',
  },
  optionButtonSelected: {
    backgroundColor: '#2c346b',
  },
  optionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#2c346b',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#2c346b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(44, 52, 107, 0.5)',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
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