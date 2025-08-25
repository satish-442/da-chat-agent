import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

function TypewriterText({ text, speed = 40 }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText(''); // reset on new text

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <Text fontSize="sm">{displayedText}</Text>;
}

export default TypewriterText;
