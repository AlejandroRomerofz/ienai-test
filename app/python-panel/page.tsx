"use client";

import ReactCodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { autocompletion } from "@codemirror/autocomplete";

import {
  Button,
  CircularProgress,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import OutputTerminal from "@/components/layout/OutputTerminal";
import dynamic from "next/dynamic";

// This sintax when importing fixes a bug with dependencies
const PlotlyPlot = dynamic(() => import("@/components/shared/PlotlyPlot"), {
  ssr: false,
  loading: () => <></>,
});

type OutputBody = { type: "output" | "plotly"; output: string };

type ResponseBody = {
  error?: string;
  output?: OutputBody[];
};

const defaultScript = `#Use px for plotly.express, pio for plotly.io and go for plotly.graph_objects\r\n#Import them is not necessary\r\ndf = px.data.gapminder().query("country=='Canada'")\r\nfig = px.line(df, x="year", y="lifeExp", title='Life expectancy in Canada')\r\nfig.show()`;

export default function Python() {
  const [outputHeight, setOutputHeight] = useState(250);
  const [code, setCode] = useState(defaultScript);
  const [output, setOutput] = useState<OutputBody[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [outputError, setOutputError] = useState<boolean>(false);

  const executeCode = () => {
    if (loading) return;
    setLoading(true);
    fetch("/api/execute", {
      method: "POST",
      body: JSON.stringify({
        code: code,
      }),
    }).then(async (res) => {
      const response: ResponseBody = await res.json();
      if (response.error) {
        setOutputError(true);
        setError(response.error);
        setLoading(false);
        return;
      }
      if (response.output) {
        setOutputError(false);
        setOutput(response.output);
        setLoading(false);
        return;
      }
      setLoading(false);
      setOutput([]);
    });
  };

  const showResponse = () => {
    if (loading) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (outputError) {
      return (
        <Typography
          sx={{ borderBottom: 2, borderColor: "gray.600", color: "red" }}
        >
          {error}
        </Typography>
      );
    }

    return output.map((out, i) => {
      if (out.output == "") return null;
      return out.type == "output" ? (
        <Typography
          key={i}
          sx={{ color: "green.400", borderBottom: 2, borderColor: "gray" }}
        >
          {out.output}
        </Typography>
      ) : (
        <Box
          key={i}
          sx={{
            color: "green.400",
            borderBottom: 2,
            borderColor: "gray",
            p: 4,
          }}
        >
          <PlotlyPlot id={`plotly_${i}`} data={out.output}></PlotlyPlot>
        </Box>
      );
    });
  };

  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <Box sx={{ height: `calc(100vh - ${outputHeight}px)`, overflow: "auto" }}>
        <Container
          sx={{ py: 5, display: "flex", flexDirection: "column", gap: 3 }}
        >
          <ReactCodeMirror
            extensions={[python(), autocompletion()]}
            onChange={(e) => {
              setCode(e);
            }}
            value={defaultScript}
            minHeight="31"
            style={{
              fontSize: "20px",
              outline: "none",
            }}
            className="text-lg outline-none relative"
            theme="dark"
          ></ReactCodeMirror>
          <Button
            sx={{ alignSelf: "flex-end" }}
            onClick={() => {
              executeCode();
            }}
            variant="outlined"
          >
            {loading ? <CircularProgress size={25} /> : "Execute"}
          </Button>
        </Container>
      </Box>
      <Box
        sx={{ display: "flex", width: "100vw", position: "fixed", bottom: 0 }}
      >
        <OutputTerminal
          height={outputHeight}
          setHeight={setOutputHeight}
          title="Output"
        >
          {showResponse()}
        </OutputTerminal>
      </Box>
    </Box>
  );
}
