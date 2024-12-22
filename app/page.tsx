"use client";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Home() {
  return (
    <Box
      sx={{
        width: "100vw",
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        gap: 5,
        alignItems: "center",
      }}
      className="w-screen h-screen flex justify-center gap-5 items-center"
    >
      <Link href={"/table"}>
        <Button variant="contained">Table</Button>
      </Link>
      <Link href={"/python-panel"}>
        <Button variant="contained">Python panel</Button>
      </Link>
    </Box>
  );
}
