"use client";

import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

const TokenomicsChartMobile = () => {
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
    return (
      <div className="flex w-full flex-col items-center px-4">
        <div className="grid grid-cols-1 gap-y-3">
          {data.map((entry, index) => (
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
              <span className="text-lg text-gray-200">{entry.name}</span>
              <span className="text-lg text-gray-400">24%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col items-center rounded-lg mt-12 md:hidden">
      <h2 className="text-3xl font-semibold text-gray-200">Tokenomics</h2>
      <div className="relative">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center"
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 400,
            fontSize: "32px",
            lineHeight: "32px",
            letterSpacing: "-5%",
          }}
        >
          Allocation
        </div>
        {isClient ? (
          <PieChart width={350} height={350}>
            <Pie
              data={data}
              cx={175}
              cy={175}
              innerRadius={120}
              outerRadius={150}
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
      <div className="mt-8">{renderCustomizedLegend()}</div>
    </div>
  );
};

export default TokenomicsChartMobile;
