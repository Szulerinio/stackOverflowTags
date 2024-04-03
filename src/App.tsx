import { Box } from "@mui/material";
import "./App.css";
import EnhancedTable from "./components/tagsTable/TagsTable";
import { NumberInput } from "./components/numericInput/NumberInput";
function App() {
  return (
    <Box>
      <span>
        <NumberInput></NumberInput>
      </span>
      <EnhancedTable></EnhancedTable>
    </Box>
  );
}

export default App;
