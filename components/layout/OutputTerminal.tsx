"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export type OutputTerminalProps = {
  title: string;
  children: React.ReactNode;
  borderColor?: string;
  borderSize?: number;
  height: number;
  setHeight: (height: number) => void;
};

export default function OutputTerminal({
  children,
  title,
  borderColor = "gray",
  borderSize = 2,
  height,
  setHeight,
}: OutputTerminalProps) {
  const container = useRef<HTMLDivElement>(null);
  const [mouseY, setMouseY] = useState<number>(0);
  const [resizeTop, setResizeTop] = useState<boolean>(false);

  const disableResize = () => {
    setResizeTop(false);
  };

  useEffect(() => {
    const mouseMoveEvent = (e: MouseEvent) => {
      setMouseY(container.current!.getBoundingClientRect().y - e.clientY);
    };
    const mouseUpEvent = () => {
      disableResize();
    };
    const touchMoveEvent = (e: TouchEvent) => {
      const touch = e.touches[0];
      setMouseY(container.current!.getBoundingClientRect().y - touch.clientY);
    };

    window.addEventListener("mouseup", mouseUpEvent);
    window.addEventListener("mousemove", mouseMoveEvent);
    window.addEventListener("touchend", mouseUpEvent);
    window.addEventListener("touchmove", touchMoveEvent);
    return () => {
      window.removeEventListener("mouseup", mouseUpEvent);
      window.removeEventListener("mousemove", mouseMoveEvent);
      window.removeEventListener("touchend", mouseUpEvent);
      window.removeEventListener("touchmove", touchMoveEvent);
    };
  }, []);

  useEffect(() => {
    if (resizeTop) {
      setHeight(container.current!.getBoundingClientRect().height + mouseY);
    }
  }, [mouseY]);

  return (
    <Box
      style={{ height: height + "px" }}
      ref={container}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100px",
        maxHeight: "90vh",
        position: "relative",
        backgroundColor: "#292929",
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: 8,
          display: "flex",
          alignItems: "center",
          height: 40,
        }}
      >
        <Typography>{title}</Typography>
      </Box>

      <Box
        sx={{
          paddingBottom: 1,
          overflow: "auto",
          color: "lightgreen",
          paddingX: 5,
          height: "calc(100% - 2.5rem)",
        }}
      >
        {children}
      </Box>

      <Box
        onMouseDown={() => setResizeTop(true)}
        onTouchStart={() => setResizeTop(true)}
        sx={{
          backgroundColor: borderColor,
          height: `${borderSize}px`,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          cursor: "row-resize",
        }}
      ></Box>
    </Box>
  );
}
