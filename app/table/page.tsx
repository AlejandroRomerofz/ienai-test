"use client";
import { Box, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import data from "../../data/users.json";

export default function Table() {
  return (
    <Box>
      <Container className="py-10 *:text-white">
        <DataGrid
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          className="table"
          rows={data}
          columns={[
            { field: "id" },
            { field: "name" },
            { field: "username", flex: 1 },
            {
              field: "creation date",
            },
            { field: "modified on" },
            {
              field: "online",
            },
          ]}
        ></DataGrid>
      </Container>
    </Box>
  );
}
