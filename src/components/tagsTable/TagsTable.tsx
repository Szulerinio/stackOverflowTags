import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { tagsResponse } from "../../models/tags.model";
import { CircularProgress, Snackbar } from "@mui/material";
import { useEffect } from "react";

/**
 * copied and edited from mui documentation
 * https://mui.com/material-ui/react-table/#basic-table
 *
 * */

interface Data {
  name: string;
  popular: number;
}

type Order = "asc" | "desc";

interface HeadCell {
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    label: "Name",
  },
  {
    id: "popular",
    numeric: true,
    label: "Count",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function TagsTable({ perPage }: { perPage: number }) {
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("popular");
  const [page, setPage] = React.useState(0);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const fetchTags = async (
    page: number = 0,
    perPage: number = 10,
    order: "asc" | "desc" = "desc",
    orderBy: "popular" | "name" = "popular"
  ) => {
    console.log("response");
    const response = await fetch(
      `https://api.stackexchange.com/2.3/tags?page=${page + 1}&pagesize=${perPage}&order=${order}&sort=${orderBy}&site=stackoverflow&filter=!nNPvSNVZJS`
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    return response.json();
  };

  const { isPending, isError, data } = useQuery<tagsResponse>({
    queryKey: ["tags", page, perPage, order, orderBy],
    queryFn: () => fetchTags(page, perPage, order, orderBy),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      setIsSnackbarOpen(true);
    }
  }, [isError]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const emptyRows = perPage - (data?.items?.length || 0);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer className={isPending ? "loading" : ""}>
          <Box sx={{ display: "flex", padding: "16px" }}>
            {`Requests left: `}
            {data?.quota_remaining ?? <CircularProgress></CircularProgress>}
          </Box>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {data?.items?.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={data?.total || 0}
          rowsPerPage={perPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        message="Something went wrong"
      />
    </Box>
  );
}
