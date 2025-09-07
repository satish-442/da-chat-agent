// src/pages/FullSizeChart.jsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const FullSizeChart = ({ modalId, d3Code, chartData, question, onClose }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && d3Code && chartData && dimensions.width > 0) {
      try {
        console.log("📈 Rendering FullSizeChart:", {
          modalId,
          question,
          dataPoints: chartData?.length || 0,
          d3CodeSnippet: d3Code.substring(0, 100) + "...",
        });

        // Clear previous chart
        d3.select("#" + modalId).selectAll("*").remove();

        // Fix code for dynamic container + dimensions
        const fixedCode = d3Code
          .replace(/d3\.select\((["'])#chart\1\)/g, `d3.select("#" + targetId)`)
          .replace(
            /width\s*=\s*\d+\s*-\s*margin\.left\s*-\s*margin\.right/g,
            `width = ${dimensions.width} - margin.left - margin.right`
          )
          .replace(
            /height\s*=\s*\d+\s*-\s*margin\.top\s*-\s*margin\.bottom/g,
            `height = ${dimensions.height} - margin.top - margin.bottom`
          );

        // Execute chart code
        const chartFunction = new Function(
          "d3",
          "targetId",
          "data",
          fixedCode.replace(/```javascript|```/g, "")
        );

        chartFunction(d3, modalId, chartData);
      } catch (error) {
        console.error("❌ Failed to render FullSizeChart:", { modalId, error });
      }
    }
  }, [d3Code, modalId, dimensions, chartData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-11/12 h-5/6 relative">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-2">{question}</h3>
        <div
          id={modalId}
          ref={containerRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default FullSizeChart;
