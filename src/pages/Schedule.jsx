import React, { useState, useContext } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Input,
  Button,
  Spinner,
  Textarea,
  Radio,
  RadioGroup,
  HStack,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { SessionContext } from "../utils/SessionContext";

const Schedule = () => {
  const { sessionId } = useContext(SessionContext);
  const [questions, setQuestions] = useState("");
  const [scheduleType, setScheduleType] = useState("interval");
  const [cronExpression, setCronExpression] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [reportResult, setReportResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  const handleCreateSchedule = async () => {
    if (!sessionId) {
      setError("No active session. Please connect a data source first.");
      return;
    }

    const questionsArray = questions.split("\n").filter((q) => q.trim() !== "");
    if (questionsArray.length === 0) {
      setError("Please enter at least one question to schedule.");
      return;
    }

    let payload = {
      session_id: sessionId,
      questions: questionsArray,
    };

    if (scheduleType === "interval") {
      const minutes = parseInt(intervalMinutes, 10);
      if (isNaN(minutes) || minutes <= 0) {
        setError("Please enter a valid positive number for the interval.");
        return;
      }
      payload.interval_minutes = minutes;
    } else {
      if (!cronExpression.trim()) {
        setError("Please enter a valid CRON expression.");
        return;
      }
      payload.cron = cronExpression.trim();
    }

    setLoading(true);
    setResult(null);
    setError(null);
    setReportResult(null);
    setReportData(null);

    try {
      const apiUrl = `http://127.0.0.1:8001/schedule/create`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create schedule.");
      }

      setResult(data);
    } catch (err) {
      console.error("API error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunJob = async () => {
    if (!result || !result.schedule_id) {
      setError("No schedule ID found to execute.");
      return;
    }
    setRunning(true);
    setReportResult(null);
    setError(null);
    setReportData(null);

    try {
      const apiUrl = `http://127.0.0.1:8001/schedule/run_now/${sessionId}/${result.schedule_id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to execute job.");
      }

      setReportResult(data);
    } catch (err) {
      console.error("API error:", err);
      setError(err.message || "An unexpected error occurred during job execution.");
    } finally {
      setRunning(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!result || !result.schedule_id) {
      setError("No schedule ID found to generate a report.");
      return;
    }
    setReportLoading(true);
    setReportData(null);
    setError(null);

    try {
      const apiUrl = `http://127.0.0.1:8001/schedule/report/${sessionId}/${result.schedule_id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate report.");
      }

      setReportData(data);
    } catch (err) {
      console.error("Report API error:", err);
      setError(err.message || "An unexpected error occurred while generating the report.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" color="gray.700">
          My Schedule
        </Heading>

        <Box p={6} bg="white" boxShadow="md" borderRadius="lg">
          <FormControl id="questions" mb={4}>
            <FormLabel>Questions to Schedule</FormLabel>
            <Textarea
              placeholder="Enter one question per line..."
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              rows={5}
            />
          </FormControl>

          <FormControl as="fieldset" mb={4}>
            <FormLabel as="legend">Schedule Type</FormLabel>
            <RadioGroup onChange={setScheduleType} value={scheduleType}>
              <HStack spacing="24px">
                <Radio value="interval">Interval (minutes)</Radio>
                <Radio value="cron">CRON Expression</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          {scheduleType === "interval" ? (
            <FormControl id="interval">
              <FormLabel>Interval (minutes)</FormLabel>
              <Input
                type="number"
                placeholder="e.g., 60"
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(e.target.value)}
              />
            </FormControl>
          ) : (
            <FormControl id="cron">
              <FormLabel>CRON Expression</FormLabel>
              <Input
                placeholder="e.g., 0 8 * * *"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
              />
            </FormControl>
          )}

          <Button
            mt={6}
            onClick={handleCreateSchedule}
            colorScheme="blue"
            isLoading={loading}
            isFullWidth
          >
            Create Schedule
          </Button>
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
              Creating schedule...
            </Text>
          </VStack>
        )}

        {result && (
          <Box p={6} bg="green.100" borderRadius="lg" mt={4}>
            <Heading as="h2" size="md" mb={2} color="green.700">
              Schedule Created Successfully!
            </Heading>
            <Text color="green.700">
              **Schedule ID:** {result.schedule_id}
            </Text>
            <HStack mt={4} spacing={4}>
              <Button
                onClick={handleRunJob}
                isLoading={running}
                colorScheme="teal"
              >
                Run Job Now
              </Button>
              {reportResult && (
                <Button
                  onClick={handleGenerateReport}
                  isLoading={reportLoading}
                  colorScheme="purple"
                >
                  View Report
                </Button>
              )}
            </HStack>
          </Box>
        )}

        {running && (
          <VStack spacing={4} mt={4}>
            <Spinner size="xl" color="teal.500" />
            <Text fontSize="lg" color="gray.600">
              Executing job...
            </Text>
          </VStack>
        )}

        {reportData && (
          <Box p={6} bg="white" boxShadow="md" borderRadius="lg" mt={4}>
            <Heading as="h2" size="md" mb={4}>
              Full Scheduled Report
            </Heading>

            {/* Display the top-level report summary */}
            <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
              <Heading as="h3" size="sm" mb={2}>Report Summary:</Heading>
              <Text>{reportData.report}</Text>
            </Box>

            {/* Iterate through each output for detailed results */}
            {reportData.outputs.map((output, index) => (
              <Box key={index} p={4} bg="gray.100" borderRadius="md" mb={4}>
                <Heading as="h3" size="sm" mb={2}>Question {index + 1}:</Heading>
                <Text>{output.question}</Text>

                <Heading as="h3" size="sm" mt={4} mb={2}>Summary:</Heading>
                <Text>{output.summary}</Text>

                <Heading as="h3" size="sm" mt={4} mb={2}>Data Preview:</Heading>
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        {output.result_preview.length > 0 &&
                          Object.keys(output.result_preview[0]).map((key) => (
                            <Th key={key}>{key}</Th>
                          ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {output.result_preview.map((row, rowIndex) => (
                        <Tr key={rowIndex}>
                          {Object.values(row).map((value, colIndex) => (
                            <Td key={colIndex}>{value !== null ? value.toString() : "null"}</Td>
                          ))}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Schedule;