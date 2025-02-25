"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";

const TokenomicsChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = [
    { name: "Team & Advisors", value: 24, color: "#E9A76F" },
    { name: "Pre-seed", value: 24, color: "#E28677" },
    { name: "Seed", value: 24, color: "#D06F9A" },
    { name: "Institutional", value: 24, color: "#AF6BBF" },
    { name: "Public Presale", value: 24, color: "#8E68DE" },
    { name: "Public", value: 24, color: "#5A2A91" },
    { name: "Airdrop", value: 24, color: "#7B3DB2" },
    { name: "Treasury", value: 24, color: "#4F2186" },
    { name: "Ecosystem", value: 24, color: "#3E197A" },
    { name: "Mining Rewards", value: 24, color: "#2D126E" },
  ];

  const handleLegendClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const renderCustomizedLegend = () => {
    const firstHalf = data.slice(0, 5);
    const secondHalf = data.slice(5);

    return (
      <div className="flex w-full flex-col pl-12">
        <div className="grid grid-cols-2 gap-x-16 gap-y-2">
          <div className="min-w-[200px] space-y-3">
            {firstHalf.map((entry, index) => (
              <div
                key={`item-${index}`}
                className="flex cursor-pointer items-center space-x-3 whitespace-nowrap"
                onClick={() => handleLegendClick(index)}
                style={{
                  opacity:
                    activeIndex === null || activeIndex === index ? 1 : 0.5,
                }}
              >
                <div
                  className="h-6 w-1.5"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-lg text-gray-200">{entry.name}</span>
                <span className="text-lg text-gray-400">24%</span>
              </div>
            ))}
          </div>
          <div className="min-w-[200px] space-y-3">
            {secondHalf.map((entry, index) => {
              const actualIndex = index + 5;
              return (
                <div
                  key={`item-${actualIndex}`}
                  className="flex cursor-pointer items-center space-x-3 whitespace-nowrap"
                  onClick={() => handleLegendClick(actualIndex)}
                  style={{
                    opacity:
                      activeIndex === null || activeIndex === actualIndex
                        ? 1
                        : 0.5,
                  }}
                >
                  <div
                    className="h-6 w-1.5"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-lg text-gray-200">{entry.name}</span>
                  <span className="text-lg text-gray-400">24%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full rounded-lg pt-24">
      <div className="relative flex-1">
        <h2 className="font-funnel mb-8 text-[32px] leading-[32px] tracking-[-5%] text-gray-200 md:text-[72px] md:leading-[72px]">
          Tokenomics
        </h2>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center"
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 400,
            fontSize: "32px",
            lineHeight: "32px",
            letterSpacing: "-5%",
            left: "45%",
            top: "57%",
          }}
        >
          Allocation
        </div>
        {isClient ? (
          <PieChart width={500} height={500}>
            <Pie
              data={data}
              cx={220}
              cy={250}
              innerRadius={180}
              outerRadius={220}
              paddingAngle={0}
              dataKey="value"
              onClick={() => {
                console.log("clicked");
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                  opacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.2
                  }
                  style={{ outline: "none" }}
                  tabIndex={-1}
                  className="focus:outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <div className="flex h-[400px] w-[400px] items-center justify-center">
            <span className="text-gray-400">Loading chart...</span>
          </div>
        )}
      </div>
      <div className="flex w-full flex-1 items-center">
        {renderCustomizedLegend()}
      </div>
    </div>
  );
};

export default TokenomicsChart;
