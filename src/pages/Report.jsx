import React, { useState, useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { fetchChartData } from "../utils/Api";
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  HStack,
} from "@chakra-ui/react";
import { SessionContext } from "../utils/SessionContext";

// Utility: Fix D3 code property access for keys with spaces
const fixD3CodeProperties = (d3Code) => {
  const regex = /d\.(\w+\s+\w+)/g;
  return d3Code.replace(regex, (match, p1) => `d["${p1}"]`);
};

// Replaces hardcoded width/height (600/400) with container size
const makeCodeResponsive = (d3Code, width, height, chart_id, prefix = "chart") => {
  return fixD3CodeProperties(d3Code)
    .replace(/```javascript|```/g, "")
    .replace(/d3\.select\("#chart"\)/g, `d3.select("#${prefix}-${chart_id}")`)
    .replace(/\b600\b/g, width)
    .replace(/\b400\b/g, height);
};

// Chart Card Component (small preview)
const ChartCard = ({ chart, onOpen }) => {
  const { chart_id, d3: d3Code } = chart;
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !d3Code) return;

    try {
      d3.select(ref.current).selectAll("*").remove();

      const { width, height } = ref.current.getBoundingClientRect();
      const fixedCode = makeCodeResponsive(d3Code, width, height, chart_id, "chart");

      const chartFn = new Function("d3", "targetId", fixedCode);
      chartFn(d3, `chart-${chart_id}`);
    } catch (err) {
      console.error(`❌ Error rendering chart ${chart_id}:`, err);
    }
  }, [d3Code, chart_id]);

  return (
    <Box
      id={`chart-${chart_id}`}
      ref={ref}
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      height="250px"
      cursor="pointer"
      onClick={() => onOpen(chart)}
      _hover={{ boxShadow: "lg" }}
    />
  );
};

// Full-size chart in modal
const FullSizeChart = ({ chart }) => {
  const { chart_id, d3: d3Code } = chart;
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !d3Code) return;

    try {
      d3.select(ref.current).selectAll("*").remove();

      const { width, height } = ref.current.getBoundingClientRect();
      const fixedCode = makeCodeResponsive(d3Code, width, height, chart_id, "full-chart");

      const chartFn = new Function("d3", "targetId", fixedCode);
      chartFn(d3, `full-chart-${chart_id}`);
    } catch (err) {
      console.error(`❌ Error rendering full chart ${chart_id}:`, err);
    }
  }, [d3Code, chart_id]);

  return (
    <Box
      id={`full-chart-${chart_id}`}
      ref={ref}
      width="100%"
      height="calc(100vh - 120px)"
    />
  );
};

// Main Report Component
const Report = () => {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const { sessionId } = useContext(SessionContext);

  console.log("📌 Report component mounted with sessionId:", sessionId);

  useEffect(() => {
    const loadCharts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔄 Fetching charts for session:", sessionId);
        const fetchedCharts = await fetchChartData(sessionId);
        console.log("✅ Fetched charts:", JSON.stringify(fetchedCharts, null, 2));
        setCharts(Array.isArray(fetchedCharts) ? fetchedCharts : []);
      } catch (err) {
        console.error("❌ Error loading charts:", err);
        setError("Failed to load charts.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadCharts();
    }
  }, [sessionId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        {/* <Heading as="h1" size="xl" textAlign="center" color="gray.700">
          Traffic Report
        </Heading> */}

        <Box p={6} bg="white" boxShadow="md" borderRadius="lg">
          <HStack justifyContent="space-between" mb={4}>
            {/* <Heading as="h2" size="lg">
              Website Traffic Report
            </Heading> */}
            <Button onClick={handlePrint} colorScheme="blue" className="no-print">
              Print All Charts
            </Button>
          </HStack>

          {/* Loading state */}
          {loading && (
            <VStack spacing={4} mt={4}>
              <Spinner size="xl" color="blue.500" />
              <Text fontSize="lg" color="gray.600">
                Loading charts...
              </Text>
            </VStack>
          )}

          {/* Error state */}
          {error && (
            <Text color="red.500" mt={4} textAlign="center">
              {error}
            </Text>
          )}

          {/* No charts */}
          {!loading && !error && charts.length === 0 && (
            <Text color="gray.500" textAlign="center" pt="200px">
              No charts available for this session.
            </Text>
          )}

          {/* Chart grid */}
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} mt={4}>
            {charts.map((chart) => (
              <ChartCard
                key={chart.chart_id}
                chart={chart}
                onOpen={setSelectedChart}
              />
            ))}
          </Grid>
        </Box>
      </VStack>

      {/* Full-size modal */}
      <Modal isOpen={!!selectedChart} onClose={() => setSelectedChart(null)} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack justifyContent="space-between">
              <Heading size="md">{selectedChart?.question || "Full Chart View"}</Heading>
              <HStack>
                <Button onClick={handlePrint} colorScheme="blue" size="sm" className="no-print">
                  Print This Chart
                </Button>
                <ModalCloseButton />
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalBody>
            {selectedChart && <FullSizeChart chart={selectedChart} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Report;