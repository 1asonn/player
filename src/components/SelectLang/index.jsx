import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  I18nManager
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { rootStore } from '../../store';
import { dw, dh, dt } from '../../utils/util';
// import { MaterialIcons } from '@expo/vector-icons';

const LANGUAGES = [
  { id: 'zh', name: '中文', flag: '🇨🇳' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: '한국어', flag: '🇰🇷' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const { infoStore } = rootStore;
  const { langType, changeLangType } = infoStore;
  const [expanded, setExpanded] = useState(false);
  const [selectedLang, setSelectedLang] = useState(
    LANGUAGES.find(lang => lang.id === langType) || LANGUAGES[0]
  );
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggleLanguageMenu = () => {
    const toValue = expanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: toValue * 180,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: toValue * (LANGUAGES.length * 60),
        duration: 300,
        useNativeDriver: false,
      })
    ]).start();
    
    setExpanded(!expanded);
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang.id);
    changeLangType(lang.id);
    toggleLanguageMenu();
    
    // Handle RTL/LTR layout changes if needed
    if (lang.id === 'ar' || lang.id === 'he') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selectorButton}
        onPress={toggleLanguageMenu}
        activeOpacity={0.8}
      >
        <View style={styles.selectedLanguage}>
          <Text style={styles.flag}>{selectedLang.flag}</Text>
          <Text style={styles.languageName}>{selectedLang.name}</Text>
        </View>
        {/* <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialIcons 
            name="keyboard-arrow-down" 
            size={24} 
            color="#333" 
          />
        </Animated.View> */}
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.languageList,
          { 
            height: heightAnim,
            opacity: heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          }
        ]}
      >
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            style={[
              styles.languageItem,
              selectedLang.id === lang.id && styles.selectedLanguageItem
            ]}
            onPress={() => handleLanguageSelect(lang)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={styles.languageName}>{lang.name}</Text>
            {/* {selectedLang.id === lang.id && (
              <MaterialIcons 
                name="check" 
                size={20} 
                color="#4CAF50" 
                style={styles.checkIcon}
              />
            )} */}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
    width: dw(200),
    alignSelf: 'flex-end',
    marginRight: dw(20),
    marginTop: dh(10),
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: dw(12),
    borderRadius: dw(8),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: dt(20),
    marginRight: dw(8),
  },
  languageName: {
    fontSize: dt(16),
    color: '#333',
    fontWeight: '500',
  },
  languageList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: dw(8),
    marginTop: dh(5),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dw(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  selectedLanguageItem: {
    backgroundColor: '#f8f9fa',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
});

export default observer(LanguageSelector);