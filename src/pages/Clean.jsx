import React, { useState, useContext } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Input,
  Button,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
} from "@chakra-ui/react";
import { SessionContext } from "../utils/SessionContext";

const Clean = () => {
  const { sessionId } = useContext(SessionContext);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleClean = async () => {
    if (!instruction.trim()) {
      setError("Please provide a cleaning instruction.");
      return;
    }
    if (!sessionId) {
      setError("No active session. Please connect a data source first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = `http://127.0.0.1:8001/clean/${sessionId}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instruction: instruction.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to apply cleaning instruction.");
      }

      setResult(data);
    } catch (err) {
      console.error("API error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color="gray.700">
          Clean Your Data
        </Heading>

        <Box p={6} bg="white" boxShadow="md" borderRadius="lg">
          <Text mb={4}>
            Enter instructions to clean and transform your data. For example, you can ask to "fill missing values with the mean" or "convert the 'Updated at' column to datetime format".
          </Text>
          <HStack>
            <Input
              placeholder="Enter your cleaning instruction here..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleClean()}
            />
            <Button onClick={handleClean} colorScheme="blue" isLoading={loading}>
              Clean
            </Button>
          </HStack>
        </Box>

        {error && (
          <Box p={4} bg="red.100" borderRadius="lg">
            <Text color="red.700">{error}</Text>
          </Box>
        )}

        {loading && (
          <VStack spacing={4} mt={4}>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">
              Applying instructions...
            </Text>
          </VStack>
        )}

        {result && (
          <VStack spacing={6} align="stretch">
            <Box p={6} bg="white" boxShadow="md" borderRadius="lg">
              <Heading as="h2" size="md" mb={4}>
                Instruction Applied
              </Heading>
              <Text fontFamily="monospace" p={3} bg="gray.100" borderRadius="md">
                {result.applied_instruction}
              </Text>
            </Box>

            <Box p={6} bg="white" boxShadow="md" borderRadius="lg">
              <Heading as="h2" size="md" mb={4}>
                Generated Code
              </Heading>
              <Box p={4} bg="gray.800" color="green.200" borderRadius="md" overflowX="auto">
                <Text as="pre" fontFamily="monospace">
                  {result.generated_code}
                </Text>
              </Box>
            </Box>

            <Box p={6} bg="white" boxShadow="md" borderRadius="lg" overflowX="auto">
              <Heading as="h2" size="md" mb={4}>
                Data Preview
              </Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    {result.preview.length > 0 &&
                      Object.keys(result.preview[0]).map((key) => (
                        <Th key={key}>{key}</Th>
                      ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {result.preview.map((row, rowIndex) => (
                    <Tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <Td key={colIndex}>{value !== null ? value.toString() : "null"}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default Clean;