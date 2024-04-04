import { Box } from "@mui/material";
import "./App.css";
import EnhancedTable from "./components/tagsTable/TagsTable";
import {
  NumberInput,
  NumberInputAdornment,
} from "./components/numberInput/NumberInput";
import { useState } from "react";
function App() {
  const [perPage, setPerPage] = useState(10);
  return (
    <Box>
      <NumberInput
        min={1}
        endAdornment={<NumberInputAdornment>Per page</NumberInputAdornment>}
        value={perPage}
        onChange={(event, val) => {
          if (val !== null && val >= 0) setPerPage(val);
        }}
      ></NumberInput>
      <EnhancedTable></EnhancedTable>
    </Box>
  );
}

export default App;
