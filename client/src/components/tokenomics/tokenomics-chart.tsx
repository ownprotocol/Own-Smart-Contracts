"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { tokenomicsData } from "@/constants";

const TokenomicsChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLegendHover = (index: number) => {
    setActiveIndex(index);
  };

  const handleLegendLeave = () => {
    setActiveIndex(null);
  };

  const renderCustomizedLegend = () => {
    const firstHalf = tokenomicsData.slice(0, 5);
    const secondHalf = tokenomicsData.slice(5);

    return (
      <div className="flex w-full flex-col">
        <div
          className="grid grid-cols-2 gap-x-36 gap-y-2"
          onMouseLeave={handleLegendLeave}
        >
          <div className="min-w-[200px] space-y-3">
            {firstHalf.map((entry, index) => (
              <div
                key={`item-${index}`}
                className="flex cursor-pointer items-center space-x-3 whitespace-nowrap"
                onMouseEnter={() => handleLegendHover(index)}
                // onMouseLeave={handleLegendLeave}
                style={{
                  opacity:
                    activeIndex === null || activeIndex === index ? 1 : 0.5,
                }}
              >
                <div
                  className="h-6 w-1.5"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-200 md:text-xs">
                  {entry.name}
                </span>
                <span className="text-sm text-gray-400 md:text-xs">
                  {entry.value}%
                </span>
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
                  onMouseEnter={() => handleLegendHover(actualIndex)}
                  // onMouseLeave={handleLegendLeave}
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
                  <span className="text-sm text-gray-200 md:text-xs">
                    {entry.name}
                  </span>
                  <span className="text-sm text-gray-400 md:text-xs">
                    {entry.value}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="z-20 mt-[10%] hidden min-h-[500px] w-full rounded-lg lg:flex">
      <div className="relative flex-1">
        <h2 className="header">Tokenomics</h2>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-gray-600"
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 400,
            fontSize: "32px",
            lineHeight: "32px",
            letterSpacing: "-5%",
            left: "42%",
            top: "58%",
          }}
        >
          {activeIndex !== null ? (
            <div className="flex flex-col items-center">
              <span className="mt-1 text-white md:text-7xl">
                {tokenomicsData[activeIndex]?.value}%
              </span>
              <span>{tokenomicsData[activeIndex]?.name}</span>
            </div>
          ) : (
            "Allocation"
          )}
        </div>
        {isClient && (
          <PieChart width={500} height={500}>
            <Pie
              data={tokenomicsData}
              cx={215}
              cy={250}
              innerRadius={180}
              outerRadius={220}
              paddingAngle={0}
              dataKey="value"
              onMouseEnter={(_, index) => handleLegendHover(index)}
              onMouseLeave={handleLegendLeave}
            >
              {tokenomicsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={
                    activeIndex === index ? "rgba(255,255,255,0.5)" : "none"
                  }
                  strokeWidth={activeIndex === index ? 2 : 0}
                  opacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.2
                  }
                  style={{
                    outline: "none",
                    transition: "all 0.3s ease",
                    filter:
                      activeIndex === index
                        ? "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25))"
                        : "none",
                  }}
                  className="hover:scale-102 hover:drop-shadow-lg hover:[stroke-width:2px] hover:[stroke:rgba(255,255,255,0.5)] focus:outline-none"
                  tabIndex={-1}
                />
              ))}
            </Pie>
          </PieChart>
        )}
      </div>
      <div className="flex w-full flex-1 items-center">
        {renderCustomizedLegend()}
      </div>
    </div>
  );
};

export default TokenomicsChart;
