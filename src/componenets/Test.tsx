import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@material-ui/core/TextField";

import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import * as CONST from "../common/const";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles({
  container: {
    maxHeight: 800,
  },
});

export default function CustomizedTables() {
  const classes = useStyles();

  type dispData = {
    day: number;
    dispDay: string;
    startTime: string;
    endTime: string;
    breakTime: string;
    overTime: string;
    remarks: string;
  };

  const [rows, setRows] = useState<dispData[]>([]);

  const dt = new Date();
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  useEffect(() => {
    let holidays = getHoliday(year, month);
    let data: dispData[] = [];
    let today = dt.getDay();
    for (let i = 1; i <= lastDay; i++) {
      let weekDay = new Date(year, month - 1, i).getDay();
      let weekStr = CONST.DAY_OF_WEEKSTR_JA[weekDay];
      let day = `${i}日(${weekStr})`;
      let isHoliday = holidays.includes(i);
      let startTime = "9:00";
      let endTime = "18:00";
      let breakTime = "1:00";
      let overTime = "0:00";
      if (isHoliday || [0, 6].includes(weekDay)) {
        data.push({
          day: i,
          dispDay: day,
          startTime: "",
          endTime: "",
          breakTime: "",
          overTime: "",
          remarks: "",
        });
      } else {
        data.push({
          day: i,
          dispDay: day,
          startTime: startTime,
          endTime: endTime,
          breakTime: breakTime,
          overTime: overTime,
          remarks: "",
        });
      }
    }
    if (data.length > 0) setRows(data);
  }, []);

  function getHoliday(year: number, month: number) {
    type holidays = { month: Number; date: Number; name: String };
    let JapaneseHolidays = require("japanese-holidays");
    let result = JapaneseHolidays.getHolidaysOf(year)
      .filter((d: holidays) => d.month === month)
      .map((d: holidays) => d.date);
    return result;
  }

  return (
    <>
      <div
        style={{ display: "flex", marginBottom: "10px", lineHeight: "35px" }}
      >
        <ArrowLeftIcon fontSize="large" />
        <span style={{ margin: "0 10px" }}>
          {year}年{month}月
        </span>
        <ArrowRightIcon fontSize="large" />
      </div>
      <TableContainer component={Paper} className={classes.container}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>日</StyledTableCell>
              <StyledTableCell>開始時間</StyledTableCell>
              <StyledTableCell>終了時間</StyledTableCell>
              <StyledTableCell>休憩時間</StyledTableCell>
              <StyledTableCell>残業時間</StyledTableCell>
              <StyledTableCell>備考</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.day}>
                <StyledTableCell>{row.dispDay}</StyledTableCell>
                <StyledTableCell>
                  <TextField
                    type="time"
                    value={row.startTime}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    type="time"
                    value={row.endTime}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    type="time"
                    value={row.breakTime}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    type="time"
                    value={row.overTime}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <TextField
                    value={row.remarks}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
