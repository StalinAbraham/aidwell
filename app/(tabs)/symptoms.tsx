import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleAlert as AlertCircle, X, Plus } from 'lucide-react-native';
import { format } from 'date-fns';
import useStore from '@/store/useStore';

const SYMPTOMS = [
  'Headache',
  'Fever',
  'Cough',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Chest Pain',
  'Shortness of Breath',
  'Back Pain',
  '+ Add your own'
];

export default function SymptomsScreen() {
  const { symptoms, addSymptom, removeSymptom } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [description, setDescription] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  const handleSymptomPress = (symptom: string) => {
    if (symptom === '+ Add your own') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSelectedSymptom(symptom);
    }
    setDescription('');
    setIsEmergency(false);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    const symptomName = isCustom ? customSymptom : selectedSymptom;
    if ((isCustom && customSymptom.trim()) || (!isCustom && selectedSymptom)) {
      addSymptom({
        name: symptomName,
        description,
        isEmergency,
        severity: isEmergency ? 5 : 3,
      });
      setIsModalVisible(false);
      setCustomSymptom('');
      setDescription('');
      setIsEmergency(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Symptom Tracker</Text>
          <Text style={styles.subtitle}>Choose a symptom or add your own. Your doctor will be notified of any symptoms you record.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Symptoms</Text>
          <View style={styles.symptomsGrid}>
            {SYMPTOMS.map((symptom) => (
              <TouchableOpacity 
                key={symptom} 
                style={[
                  styles.symptomButton,
                  symptom === '+ Add your own' && styles.addCustomButton
                ]}
                onPress={() => handleSymptomPress(symptom)}
              >
                {symptom === '+ Add your own' ? (
                  <View style={styles.addCustomContainer}>
                    <Plus size={20} color="#2c346b" />
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </View>
                ) : (
                  <Text style={styles.symptomText}>{symptom}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Symptoms</Text>
          {symptoms.length === 0 ? (
            <Text style={styles.noSymptoms}>No symptoms recorded yet</Text>
          ) : (
            symptoms.map((symptom) => (
              <View key={symptom.id} style={styles.recentSymptom}>
                <View style={styles.symptomHeader}>
                  <View style={styles.symptomTitleContainer}>
                    <Text style={styles.recentSymptomName}>{symptom.name}</Text>
                    {symptom.isEmergency && (
                      <View style={styles.emergencyBadge}>
                        <AlertCircle size={16} color="#DC2626" />
                        <Text style={styles.emergencyText}>Emergency</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.recentSymptomTime}>
                    {format(new Date(symptom.timestamp), 'MMM d, yyyy h:mm a')}
                  </Text>
                </View>
                <Text style={styles.recentSymptomDescription}>{symptom.description}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeSymptom(symptom.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                  {!symptom.isEmergency && (
                    <TouchableOpacity 
                      style={styles.emergencyButton}
                      onPress={() => {
                        removeSymptom(symptom.id);
                        addSymptom({
                          ...symptom,
                          isEmergency: true,
                          severity: 5,
                        });
                      }}
                    >
                      <Text style={styles.emergencyButtonText}>Mark as Emergency</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isCustom ? 'Add Custom Symptom' : selectedSymptom}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <X size={24} color="#2c346b" />
              </TouchableOpacity>
            </View>

            {isCustom && (
              <TextInput
                style={styles.input}
                placeholder="Enter symptom name"
                value={customSymptom}
                onChangeText={setCustomSymptom}
                placeholderTextColor="rgba(44, 52, 107, 0.5)"
              />
            )}

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe how you feel..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="rgba(44, 52, 107, 0.5)"
            />

            <TouchableOpacity
              style={[styles.emergencyToggle, isEmergency && styles.emergencyToggleActive]}
              onPress={() => setIsEmergency(!isEmergency)}
            >
              <AlertCircle size={20} color={isEmergency ? '#FFFFFF' : '#DC2626'} />
              <Text style={[styles.emergencyToggleText, isEmergency && styles.emergencyToggleTextActive]}>
                Mark as Emergency
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, (!description || (isCustom && !customSymptom)) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!description || (isCustom && !customSymptom)}
              >
                <Text style={styles.saveButtonText}>Save Symptom</Text>
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#2c346b',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
    opacity: 0.7,
    lineHeight: 22,
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
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  symptomButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addCustomButton: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#2c346b',
    backgroundColor: 'transparent',
  },
  addCustomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symptomText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2c346b',
  },
  noSymptoms: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 20,
  },
  recentSymptom: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  recentSymptomName: {
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
  recentSymptomTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2c346b',
    opacity: 0.7,
  },
  recentSymptomDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#2c346b',
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#2c346b',
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#DC2626',
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
    padding: 20,
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#2c346b',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2c346b',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  emergencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
  },
  emergencyToggleActive: {
    backgroundColor: '#DC2626',
  },
  emergencyToggleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#DC2626',
  },
  emergencyToggleTextActive: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c346b',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2c346b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});