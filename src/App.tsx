import { Box } from "@mui/material";
import "./App.css";
import { TagsTable } from "./components/tagsTable/TagsTable";
import {
  NumberInput,
  NumberInputAdornment,
} from "./components/numberInput/NumberInput";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
function App() {
  const [perPage, setPerPage] = useState(10);
  return (
    <QueryClientProvider client={queryClient}>
      <Box>
        <NumberInput
          min={1}
          endAdornment={<NumberInputAdornment>Per page</NumberInputAdornment>}
          value={perPage}
          onChange={(event, val) => {
            if (val !== null && val >= 1) setPerPage(val);
          }}
        ></NumberInput>
        <TagsTable perPage={perPage}></TagsTable>
      </Box>
    </QueryClientProvider>
  );
}

export default App;
