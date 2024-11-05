import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, LayoutAnimation, I18nManager, Pressable, Text, Platform } from 'react-native';
import { toggleAnimation } from '../../animations/toggleAnimation';
import { AccordionItemProps } from '../../models/AccordionItem';
import { styles } from './styles';

const AccordionItem = ({
                         customBody,
                         customTitle,
                         customIcon = undefined,
                         containerStyle = {},
                         animationDuration = 300,
                         isRTL = false,
                         isOpen = false,
                         onPress = undefined,
                         pressableProps = {},
                       }: AccordionItemProps): JSX.Element => {
  const [showContent, setShowContent] = useState<boolean>(isOpen);
  const animationController = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    if (isOpen !== showContent) {
      toggleListItem();
    }
  }, [isOpen]);

  const toggleListItem = () => {
    const config = {
      duration: animationDuration,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation(animationDuration));
    if (onPress) onPress(!showContent);
    setShowContent(!showContent);
  };

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', isRTL ? '-90deg' : '90deg'],
  });

  const chevronStyle = {
    fontSize: Platform.select({ ios: 24, android: 22 }),
    fontWeight: Platform.select({ ios: '400', android: '700' }) as '400' | '700',
    lineHeight: Platform.select({ ios: 24, android: 22 }),
    color: '#666',
    paddingHorizontal: 4,
    includeFontPadding: false,
    textAlignVertical: 'center' as const,
    ...(Platform.OS === 'android' && {
      marginTop: -2,
    }),
  };

  const DefaultChevron = () => (
      <Text style={chevronStyle}>
        {isRTL ? '\u2039' : '\u203A'}
      </Text>
  );

  return (
      <View style={[styles.container, containerStyle]}>
        <Pressable {...pressableProps} onPress={() => toggleListItem()}>
          <View style={styles.titleContainer}>
            {(!isRTL || I18nManager.isRTL) && customTitle()}
            <Animated.View
                style={[
                  { transform: [{ rotateZ: arrowTransform }] },
                  { minWidth: 30, alignItems: 'center', justifyContent: 'center' }
                ]}
            >
              {!customIcon ? <DefaultChevron /> : customIcon()}
            </Animated.View>
            {isRTL && !I18nManager.isRTL && customTitle()}
          </View>
        </Pressable>
        {showContent && customBody()}
      </View>
  );
};

export default AccordionItem;
