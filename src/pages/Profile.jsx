import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { fetchProfileData } from "../utils/Api";
import { SessionContext } from "../utils/SessionContext";

const Profile = () => {
  const { sessionId } = useContext(SessionContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProfileData(sessionId);
        setProfile(response?.profile || null);
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadProfile();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <VStack spacing={4} mt={8}>
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="lg" color="gray.600">
          Loading profile data...
        </Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Text color="red.500" mt={8} textAlign="center">
        {error}
      </Text>
    );
  }

  if (!profile) {
    return (
      <Text color="gray.500" mt={8} textAlign="center">
        No profile data available.
      </Text>
    );
  }

  const { columns, null_counts, describe, nunique, sample_head } = profile;

  return (
    <Box p={8} bg="black" minH="100vh" color="white">
      <Heading textAlign="center" bg="yellow.400" color="black" py={2}>
        Welcome to DA Agent
      </Heading>

      <Box mt={8}>
        <Heading size="md" mb={4} color="white">
          Data Summary (Statistical):
        </Heading>

        <Table variant="simple" size="md" bg="white" color="black">
          <Thead>
            <Tr bg="green.500">
              <Th color="white">Column</Th>
              <Th color="white">Null Values</Th>
              <Th color="white">Mean</Th>
              <Th color="white">Std deviation</Th>
              <Th color="white">Redundant values</Th>
              <Th color="white">Min/Max</Th>
            </Tr>
          </Thead>
          <Tbody>
            {columns.map((col) => {
              const desc = describe[col] || {};
              return (
                <Tr key={col} bg="green.50">
                  <Td>{col}</Td>
                  <Td>{null_counts[col]}</Td>
                  <Td>{desc.mean ?? "-"}</Td>
                  <Td>{desc.std ?? "-"}</Td>
                  <Td>{nunique[col]}</Td>
                  <Td>
                    {desc.min} / {desc.max}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      <Box mt={8}>
        <Heading size="md" mb={4}>
          Context Summary:
        </Heading>
        {sample_head.length > 0 && (
          <Table variant="simple" size="sm" bg="white" color="black">
            <Thead>
              <Tr bg="green.500">
                {Object.keys(sample_head[0]).map((key) => (
                  <Th key={key} color="white">{key}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {sample_head.map((item, index) => (
                <Tr key={index} bg="green.50">
                  {Object.values(item).map((value, valIndex) => (
                    <Td key={valIndex}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default Profile;