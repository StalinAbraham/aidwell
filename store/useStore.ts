import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  withFood: boolean;
  taken: boolean;
}

interface Symptom {
  id: string;
  name: string;
  severity: number;
  description: string;
  timestamp: string;
  isEmergency: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AppState {
  medications: Medication[];
  symptoms: Symptom[];
  chatMessages: ChatMessage[];
  geminiApiKey: string | null;
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  addSymptom: (symptom: Omit<Symptom, 'id' | 'timestamp'>) => void;
  removeSymptom: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setGeminiApiKey: (key: string) => void;
  toggleMedicationTaken: (id: string) => void;
}

const useStore = create<AppState>((set) => ({
  medications: [],
  symptoms: [],
  chatMessages: [],
  geminiApiKey: null,

  addMedication: async (medication) => {
    set((state) => {
      const newMedication = {
        ...medication,
        id: Date.now().toString(),
        taken: false,
      };
      const medications = [...state.medications, newMedication];
      AsyncStorage.setItem('medications', JSON.stringify(medications));
      return { medications };
    });
  },

  addSymptom: async (symptom) => {
    set((state) => {
      const newSymptom = {
        ...symptom,
        id: Date.now().toString(),
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      };
      const symptoms = [...state.symptoms, newSymptom];
      AsyncStorage.setItem('symptoms', JSON.stringify(symptoms));
      return { symptoms };
    });
  },

  removeSymptom: async (id) => {
    set((state) => {
      const symptoms = state.symptoms.filter((symptom) => symptom.id !== id);
      AsyncStorage.setItem('symptoms', JSON.stringify(symptoms));
      return { symptoms };
    });
  },

  addChatMessage: async (message) => {
    set((state) => {
      const newMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      };
      const chatMessages = [...state.chatMessages, newMessage];
      AsyncStorage.setItem('chatMessages', JSON.stringify(chatMessages));
      return { chatMessages };
    });
  },

  setGeminiApiKey: async (key) => {
    await AsyncStorage.setItem('geminiApiKey', key);
    set({ geminiApiKey: key });
  },

  toggleMedicationTaken: async (id) => {
    set((state) => {
      const medications = state.medications.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      );
      AsyncStorage.setItem('medications', JSON.stringify(medications));
      return { medications };
    });
  },
}));

// Initialize store with data from AsyncStorage
async function initializeStore() {
  try {
    const [medications, symptoms, chatMessages, geminiApiKey] = await Promise.all([
      AsyncStorage.getItem('medications'),
      AsyncStorage.getItem('symptoms'),
      AsyncStorage.getItem('chatMessages'),
      AsyncStorage.getItem('geminiApiKey'),
    ]);

    useStore.setState({
      medications: medications ? JSON.parse(medications) : [],
      symptoms: symptoms ? JSON.parse(symptoms) : [],
      chatMessages: chatMessages ? JSON.parse(chatMessages) : [],
      geminiApiKey: geminiApiKey || null,
    });
  } catch (error) {
    console.error('Error initializing store:', error);
  }
}

initializeStore();

export default useStore;