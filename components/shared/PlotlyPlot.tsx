"use client";

import { Box } from "@mui/material";
import { newPlot } from "plotly.js-dist-min";
import { useEffect } from "react";

type PlotlyPlotType = {
  id: string;
  data: string;
};

export default function PlotlyPlot({ data, id }: PlotlyPlotType) {
  useEffect(() => {
    newPlot(id, JSON.parse(data)["data"], JSON.parse(data)["layout"], {
      setBackground: "transparent",
      responsive: true,
    });
  }, []);

  return <Box id={id} className="w-full"></Box>;
}
