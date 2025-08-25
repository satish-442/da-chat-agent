import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  HStack,
  Text,
  IconButton,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { FaRegStar } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import TypewriterText from "../utils/TypewriterText";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      role: "assistant",
      isSaved: false,
      timestamp: new Date().toISOString(),
      parts: [
        { type: "text", content: "Here’s what I found: ..." },
        { type: "image", content: "https://via.placeholder.com/300" },
        { type: "text", content: "Let me know if you want more." },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Restore saved messages on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedMessages") || "[]");
    if (saved.length > 0) {
      setMessages((prev) =>
        prev.map((msg) => {
          const match = saved.find((s) => s.id === msg.id);
          return match ? { ...msg, isSaved: true } : msg;
        })
      );
    }
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: uuidv4(),
      role: "user",
      isSaved: false,
      timestamp: new Date().toISOString(),
      parts: [{ type: "text", content: input }],
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulated bot response
    setTimeout(() => {
      const responseParts = [
        { type: "text", content: "Here’s what I found:" },
        { type: "image", content: "https://via.placeholder.com/300" },
        { type: "text", content: "Details below:" },
        { type: "image", content: "https://via.placeholder.com/200" },
        { type: "text", content: "Let me know if you want more." },
      ];

      const botMsg = {
        id: uuidv4(),
        role: "assistant",
        isSaved: false,
        timestamp: new Date().toISOString(),
        parts: responseParts,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  // Save/unsave toggle
  const toggleSave = (id) => {
    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.id === id ? { ...msg, isSaved: !msg.isSaved } : msg
      );

      const saved = updated.filter((msg) => msg.isSaved);
      localStorage.setItem("savedMessages", JSON.stringify(saved));

      return updated;
    });
  };

  // Format timestamp nicely
  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <VStack spacing={4} height="100%" flex="1" minHeight="0">
      {/* Messages area */}
      <Box
        flex="1"
        overflowY="auto"
        width="100%"
        p={3}
        bg="white"
        borderRadius="md"
        boxShadow="inner"
      >
        {messages.map((msg) => (
          <HStack
            key={msg.id}
            justify={msg.role === "user" ? "flex-end" : "flex-start"}
            align="end"
            mb={2}
          >
            {/* Assistant message: Button on the left */}
            {msg.role === "assistant" && (
              <Tooltip label={msg.isSaved ? "Unsave" : "Save"}>
                <IconButton
                  icon={msg.isSaved ? <StarIcon /> : <FaRegStar />}
                  size="sm"
                  variant="ghost"
                  aria-label="save"
                  color={msg.isSaved ? "yellow.400" : "gray.400"}
                  onClick={() => toggleSave(msg.id)}
                />
              </Tooltip>
            )}

            <Box
              px={4}
              py={2}
              bg={msg.role === "user" ? "blue.500" : "gray.100"}
              color={msg.role === "user" ? "white" : "black"}
              borderRadius="xl"
              maxW="70%"
            >
              {msg.parts.map((part, idx) => {
                if (part.type === "text") {
                  return (
                    <Text key={idx} fontSize="sm" mt={idx > 0 ? 2 : 0}>
                      {msg.role === "assistant" &&
                      idx === msg.parts.length - 1 ? (
                        <TypewriterText text={part.content} />
                      ) : (
                        part.content
                      )}
                    </Text>
                  );
                } else if (part.type === "image") {
                  return (
                    <Image
                      key={idx}
                      src={part.content}
                      alt={`Message media ${idx + 1}`}
                      borderRadius="md"
                      mt={2}
                      maxW="100%"
                    />
                  );
                } else {
                  return null;
                }
              })}

              {/* Timestamp */}
              <Text fontSize="xs" mt={2} opacity={0.6} textAlign="right">
                {formatTime(msg.timestamp)}
              </Text>
            </Box>
          </HStack>
        ))}
        <Box ref={messagesEndRef} />
      </Box>

      {/* Input box */}
      <HStack width="100%">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          bg="white"
          color="black"
        />
        <Button
          colorScheme="blue"
          onClick={sendMessage}
          isDisabled={!input.trim()}
        >
          Send
        </Button>
      </HStack>
    </VStack>
  );
}

export default Chat;