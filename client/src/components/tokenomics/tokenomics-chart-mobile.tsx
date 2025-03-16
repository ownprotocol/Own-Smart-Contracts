
"use client";

import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { tokenomicsData } from "@/constants";

const TokenomicsChartMobile = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSegmentClick = (_: MouseEvent, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleLegendClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const renderCustomizedLegend = () => {
    return (
      <div className="flex w-full flex-col items-center px-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {tokenomicsData.map((entry, index) => (
            <div
              key={`legend-${index}`}
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
              <span className="text-xs text-gray-200">{entry.name}</span>
              <span className="text-xs text-gray-400">24%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 flex w-full flex-col items-center rounded-lg lg:hidden">
      <h2 className="text-3xl font-semibold text-gray-200">Tokenomics</h2>
      <div className="relative">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-gray-600"
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 400,
            fontSize: "32px",
            lineHeight: "32px",
            letterSpacing: "-5%",
          }}
        >
          {activeIndex !== null ? (
            <div className="flex flex-col items-center">
              <span className="mt-1 text-4xl text-white">
                {tokenomicsData[activeIndex]?.value}%
              </span>
              <span className="text-lg">{tokenomicsData[activeIndex]?.name}</span>
            </div>
          ) : (
            "Allocation"
          )}
        </div>
        {isClient ? (
          <PieChart width={350} height={350}>
            <Pie
              data={tokenomicsData}
              cx={175}
              cy={175}
              innerRadius={120}
              outerRadius={150}
              paddingAngle={0}
              dataKey="value"
              onClick={handleSegmentClick}
            >
              {tokenomicsData.map((entry, index) => (
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
      <div className="mt-8">{renderCustomizedLegend()}</div>
    </div>
  );
};

export default TokenomicsChartMobile;
