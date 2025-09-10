import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { SessionContext } from "../utils/SessionContext"; // ✅ Change this import
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// A reusable component to render different chart types
const ChartRenderer = ({ data, chartType }) => {
  if (!data || !data.length || !chartType) {
    return <Text color="red.500">No chart data or type provided.</Text>;
  }

  // A simple way to guess the x and y axis keys
  const keys = Object.keys(data[0]);
  const xAxisKey = keys.find((key) => isNaN(data[0][key])) || keys[0];
  const yAxisKey = keys.find((key) => !isNaN(data[0][key])) || keys[1];

  if (!xAxisKey || !yAxisKey) {
    return <Text color="red.500">Could not determine chart axes from data.</Text>;
  }

  switch (chartType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yAxisKey} fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      );
    // Add other cases here for different chart types (e.g., 'line', 'pie')
    case "line":
      // Example for line chart
      // return <LineChart ... />;
      return <Text>Line chart support coming soon!</Text>;
    default:
      return <Text>Unsupported chart type: {chartType}</Text>;
  }
};

// New: A component to display each chat message and its content
const ChatMessage = ({ msg, onSaveChart }) => {
  return (
    <Box
      p={3}
      borderRadius="md"
      bg={msg.sender === "user" ? "blue.100" : "gray.100"}
    >
      <Text>{msg.text}</Text>
      {msg.chart_data && msg.chart_type && (
        <HStack mt={3} alignItems="flex-end" spacing={2}>
          <Box height="300px" flex="1">
            <ChartRenderer data={msg.chart_data} chartType={msg.chart_type} />
          </Box>
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => onSaveChart(msg.chart_data, msg.chart_type)}
          >
            Save Chart
          </Button>
        </HStack>
      )}
    </Box>
  );
};

const Chat = () => {
  const { sessionId, chatMessages, setChatMessages } = useContext(SessionContext);
  const [chartID, setChartID] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // New: Function to call the save chart API
  const saveChart = async (chartData, chartType) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/dashboard/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
         chart_ids: chartID // Send the chart ID in an array
        }),
      });

      if (res.ok) {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Chart has been saved successfully!' },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Sorry, I could not save the chart.' },
        ]);
      }
    } catch (err) {
      console.error('Save API error:', err);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'An unexpected error occurred while saving.' },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setChatMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const initialRes = await fetch(`http://127.0.0.1:8000/insight/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text }),
      });
      console.log("sessionId=", sessionId);
      const initialData = await initialRes.json();
      
     //if ((!initialData.result_preview || !initialData.summary) && initialData.convert_to_chart_hint) {
        
        const chartApiUrl = "http://127.0.0.1:8000/chart/from_insight";
        
        const chartRes = await fetch(chartApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            question: userMessage.text,
            result_preview: initialData.result_preview || []
          })
        });

        const chartData = await chartRes.json();
        console.log("chartData=", chartData);
        setChartID((prev) => [...prev, chartData.chart_id]); // Store the returned chart ID

        // const botMessage = {
        //   sender: "bot",
        //   text: initialData.summary || "Here is the chart result:",
        //   chart_data: chartData.result_preview,
        //   chart_type: chartData.chart_type
        // };
        // setMessages((prev) => [...prev, botMessage]);

     // } else {
        const botMessage = {
          sender: "bot",
          text: initialData.summary || "Here’s the result:",
          chart_data: initialData.result_preview,
          chart_type: "bar",
        };
        setChatMessages((prev) => [...prev, botMessage]);
      //}

    } catch (err) {
      console.error("API error:", err);
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, an error occurred while processing your request." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <VStack
        ref={chatContainerRef}
        align="stretch"
        spacing={4}
        height="70vh"
        overflowY="auto"
      >
        {chatMessages.map((msg, i) => (
          <ChatMessage key={i} msg={msg} onSaveChart={saveChart} />
        ))}

        {loading && (
          <HStack>
            <Spinner size="sm" />
            <Text>Thinking...</Text>
          </HStack>
        )}
      </VStack>

      <HStack mt={4}>
        <Input
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button colorScheme="blue" onClick={sendMessage} isLoading={loading}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default Chat;