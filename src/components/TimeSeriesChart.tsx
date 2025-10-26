import React from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Brush,
  Scatter,
  LineChart,
} from "recharts";
import moment from "moment";
import type { ChartProps, DataPoint } from "../interfaces";

interface ChartDataPoint extends DataPoint {
  time: string;
  badValue: number | null;
}

const TimeSeriesChart: React.FC<ChartProps> = ({ data, tagLabel, unit }) => {
  // Pre-process data to conform to ChartDataPoint interface
  const processedData: ChartDataPoint[] = data.map((d) => ({
    ...d,
    time: d.ts,
    badValue: d.q === "bad" ? d.value : null,
  }));

  // Start zoomed into the last 30 data points (assuming 1 minute interval = last 30 mins)
  const startIndex = Math.max(0, processedData.length - 30);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={processedData}
        margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-Axis: Time/Timestamp */}
        <XAxis
          dataKey="time"
          type="category"
          allowDuplicatedCategory={false}
          tickFormatter={(tick: string) => moment(tick).format("HH:mm M/D")}
          label={{ value: "Time (UTC)", position: "bottom", dy: 10 }}
        />

        {/* Y-Axis: Tag Value with dynamic unit/label */}
        <YAxis
          label={{
            value: `${tagLabel} (${unit})`,
            angle: -90,
            position: "left",
          }}
        />

        <Legend verticalAlign="top" height={36} />

        {/* 1. Line Chart for the overall data trend */}
        <Line
          type="monotone"
          dataKey="value"
          name="Data Trend"
          stroke="#007bff"
          dot={false}
        />

        {/* 2. Scatter Chart to highlight 'bad' signals */}
        <Scatter
          dataKey="badValue"
          name="Bad Signals"
          fill="#dc3545"
          shape="circle"
          line={false}
        />

        {/* Brush for Zooming and Panning */}
        <Brush
          dataKey="time"
          height={30}
          stroke="#007bff"
          travellerWidth={10}
          startIndex={startIndex}
        >
          <LineChart>
            <Line dataKey="value" stroke="#007bff" dot={false} />
          </LineChart>
        </Brush>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
