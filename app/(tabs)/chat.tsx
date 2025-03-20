import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Linking,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Key, X, ExternalLink } from 'lucide-react-native';
import { format } from 'date-fns';
import useStore from '@/store/useStore';
import { chatWithGemini } from '@/utils/gemini';

const GEMINI_API_KEY_URL = 'https://aistudio.google.com/app/apikey';

export default function ChatScreen() {
  const { geminiApiKey, chatMessages, addChatMessage, setGeminiApiKey } = useStore();
  const [message, setMessage] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const scrollViewRef = useState<ScrollView | null>(null);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setError(null);
    addChatMessage({ role: 'user', content: userMessage });
    Keyboard.dismiss();

    setIsLoading(true);
    try {
      const response = await chatWithGemini(geminiApiKey!, userMessage);
      addChatMessage({ role: 'assistant', content: response });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
      addChatMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again later.',
      });
    }
    setIsLoading(false);
  };

  const handleSetApiKey = () => {
    if (apiKeyInput.trim()) {
      setGeminiApiKey(apiKeyInput.trim());
      setApiKeyInput('');
      setError(null);
      setIsKeyModalVisible(false);
    }
  };

  const handleRemoveKey = () => {
    setGeminiApiKey('');
    setIsKeyModalVisible(false);
    setIsChatStarted(false);
  };

  const handleStartChat = () => {
    if (!geminiApiKey) {
      setIsKeyModalVisible(true);
    } else {
      setIsChatStarted(true);
    }
  };

  const handleEndChat = () => {
    setIsChatStarted(false);
    useStore.setState(state => ({
      ...state,
      chatMessages: []
    }));
  };

  const openApiKeyPage = () => {
    Linking.openURL(GEMINI_API_KEY_URL);
  };

  if (!isChatStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>AI Nurse Assistant</Text>
          <Text style={styles.welcomeText}>
            Your personal health companion powered by AI. Get instant answers to your health-related questions and concerns.
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.keyButton}
              onPress={() => setIsKeyModalVisible(true)}
            >
              <Key size={24} color="#2c346b" />
              <Text style={styles.keyButtonText}>
                {geminiApiKey ? 'Update API Key' : 'Set API Key'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.startButton, !geminiApiKey && styles.startButtonDisabled]}
              onPress={handleStartChat}
              disabled={!geminiApiKey}
            >
              <Text style={styles.startButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={isKeyModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>API Key Management</Text>
                <TouchableOpacity onPress={() => setIsKeyModalVisible(false)}>
                  <X size={24} color="#2c346b" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.apiKeyLink}
                onPress={openApiKeyPage}
              >
                <Text style={styles.apiKeyLinkText}>Get Gemini API Key</Text>
                <ExternalLink size={20} color="#2563EB" />
              </TouchableOpacity>

              <TextInput
                style={styles.modalInput}
                placeholder="Enter API key"
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                secureTextEntry
                placeholderTextColor="rgba(44, 52, 107, 0.5)"
              />

              <View style={styles.modalButtons}>
                {geminiApiKey && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.removeButton]}
                    onPress={handleRemoveKey}
                  >
                    <Text style={styles.removeButtonText}>Remove Key</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.saveButton,
                    !apiKeyInput.trim() && styles.saveButtonDisabled
                  ]}
                  onPress={handleSetApiKey}
                  disabled={!apiKeyInput.trim()}
                >
                  <Text style={styles.saveButtonText}>Save Key</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Nurse Assistant</Text>
        <TouchableOpacity 
          style={styles.endChatButton}
          onPress={handleEndChat}
        >
          <X size={24} color="#2c346b" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          ref={(ref) => scrollViewRef[1](ref)}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef[0]?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled">
          {error && <Text style={styles.errorBanner}>{error}</Text>}
          {chatMessages.map((chat) => (
            <View
              key={chat.id}
              style={[
                styles.messageContainer,
                chat.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}>
              <Text style={[
                styles.messageText,
                chat.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
              ]}>{chat.content}</Text>
              <Text style={[
                styles.timestamp,
                chat.role === 'user' ? styles.userTimestamp : styles.assistantTimestamp,
              ]}>
                {format(new Date(chat.timestamp), 'HH:mm')}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#2c346b" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me about your health..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxHeight={100}
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim() || isLoading}>
              <Send size={24} color={message.trim() ? '#FFFFFF' : '#A0AEC0'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f16b',
  },
  keyboardAvoid: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 24,
  },
  actionButtons: {
    width: '100%',
    gap: 16,
  },
  keyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  keyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c346b',
  },
  startButton: {
    backgroundColor: '#2c346b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#e1f16b',
    borderBottomWidth: 1,
    borderBottomColor: '#d1e15b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#2c346b',
  },
  endChatButton: {
    padding: 8,
  },
  errorBanner: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#e1f16b',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#2c346b',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#2c346b',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  assistantTimestamp: {
    color: 'rgba(44, 52, 107, 0.7)',
  },
  inputWrapper: {
    backgroundColor: '#2c346b',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    marginBottom: Platform.OS === 'ios' ? 85 : 65,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#2c346b',
    borderTopWidth: 1,
    borderTopColor: '#1f2547',
  },
  input: {
    flex: 1,
    backgroundColor: '#3d446b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4d547b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3d446b',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
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
  apiKeyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  apiKeyLinkText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2563EB',
  },
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c346b',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
  },
  removeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#DC2626',
  },
  saveButton: {
    backgroundColor: '#2c346b',
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