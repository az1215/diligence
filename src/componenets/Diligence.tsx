import { useState, useEffect, useRef, FC } from "react";
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
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@mui/material/Box";

// icon
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import SaveIcon from "@material-ui/icons/Save";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";

import { getDiligenceData } from "../data/getDiligenceData";

import * as CONST from "../common/const";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1025,
      xl: 1536,
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 15,
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    paddingTop: 12,
    paddingBottom: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  container: {
    maxHeight: 57 + 59 * 11,
  },
  container2: {
    maxHeight: 57 + 58.88 * 12,
  },
  formControl: {
    minWidth: 120,
  },
  textBox: {
    width: "100%",
    padding: "1px",
  },
  hodidayRow: {
    backgroundColor: theme.palette.action.hover,
  },
  blueCell: {
    color: "#3f51b5 !important",
  },
  redCell: {
    color: "#ff1744 !important",
  },
  todayCell: {
    backgroundColor: "#ffcdd2 !important",
  },
  approvedText: {
    padding: 5.5,
    fontSize: "16px",
  },
}));

// interface DiligenceProps {
//   setIsShowAlert: (newState: boolean) => void;
//   setSeverityNum: (newState: number) => void;
//   setAlertMessage: (newState: string) => void;
//   setPageLoadingRate: (newState: number) => void;
// }

const Diligence = () => {
  const classes = useStyles();

  type filteredData = {
    day: number;
    startTime: string;
    endTime: string;
    breakTime: string;
    workTime: string;
    overTime: string;
    paid: string;
    transExp: number;
    remarks: string;
  };

  type dispData = {
    check: boolean;
    day: number;
    dispDay: string;
    startTime: string;
    endTime: string;
    breakTime: string;
    workTime: string;
    overTime: string;
    paid: string;
    transExp: number;
    remarks: string;
    isHoliday: boolean;
    isToday: boolean;
    fontColorCls: number; // 0:黒、1:赤、2:青
  };

  // 勤怠データ（編集前）
  const [orgDiligenceData, setOrgDiligenceData] = useState<dispData[]>([]);
  // 勤怠データ（編集用）
  const [diligenceData, setDiligenceData] = useState<dispData[]>([]);

  // 承認済みかどうか
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const [dispYear, setDispYear] = useState<String>("");
  const [dispMonth, setDispMonth] = useState<String>("");

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      const dt = new Date();
      const year = dt.getFullYear();
      const month = dt.getMonth() + 1;
      setDispDiligenceData(year, month);
    }
  }, []);

  // 表示月の祝日を取得する
  const getHoliday = (year: number, month: number) => {
    type holidays = { month: Number; date: Number; name: String };
    let JapaneseHolidays = require("japanese-holidays");
    let result = JapaneseHolidays.getHolidaysOf(year)
      .filter((d: holidays) => d.month === month)
      .map((d: holidays) => d.date);
    return result;
  };

  // 勤怠一覧にデータをセットする
  const setDispDiligenceData = (year: number, month: number) => {
    const lastDay = new Date(year, month, 0).getDate();
    let holidays = getHoliday(year, month);
    let result: dispData[] = [];
    setDispYear(String(year));
    setDispMonth(String(month).padStart(2, "0"));

    let dt = new Date();
    let currentYear = dt.getFullYear();
    let currentMonth = dt.getMonth() + 1;
    let currentDay = dt.getDate();

    let dateCls: -1 | 0 | 1 = 0; // -1:先月以前,0:今月,1:来月以降
    let registeredata: filteredData[] = [];
    let isApproved: boolean = false;

    if ((currentYear === year && currentMonth > month) || currentYear > year) {
      // 先月以前
      dateCls = -1;
      let gotData = getDiligenceData(year, month);
      registeredata = gotData.data;
      isApproved = gotData.isApproved;
    } else if (
      (currentYear === year && currentMonth < month) ||
      currentYear < year
    ) {
      // 来月以降
      dateCls = 1;
    } else {
      // 今月
      let gotData = getDiligenceData(year, month);
      registeredata = gotData.data;
      isApproved = gotData.isApproved;
    }

    for (let i = 1; i <= lastDay; i++) {
      let weekDay = new Date(year, month - 1, i).getDay();
      let weekStr = CONST.DAY_OF_WEEKSTR_JA[weekDay];
      let day = `${i}日(${weekStr})`;

      let isHoliday = false;
      let fontColorCls = 0;
      if (holidays.includes(i)) {
        isHoliday = true;
        fontColorCls = 1;
      } else {
        if (weekDay === 0) {
          isHoliday = true;
          fontColorCls = 1;
        } else if (weekDay === 6) {
          isHoliday = true;
          fontColorCls = 2;
        }
      }

      let isToday: boolean = dateCls === 0 && i === currentDay ? true : false;

      let blankData: dispData = {
        check: false,
        day: i,
        dispDay: day,
        startTime: "",
        endTime: "",
        breakTime: "",
        workTime: "",
        overTime: "",
        paid: "",
        transExp: 0,
        remarks: "",
        isHoliday: isHoliday,
        isToday: isToday,
        fontColorCls: fontColorCls,
      };

      if (registeredata.length > 0) {
        let filteredData = registeredata.find((d) => d.day === i);
        if (filteredData) {
          let data = {
            check: false,
            day: i,
            dispDay: day,
            startTime: filteredData.startTime,
            endTime: filteredData.endTime,
            breakTime: filteredData.breakTime,
            workTime: filteredData.workTime,
            overTime: filteredData.overTime,
            paid: filteredData.paid,
            transExp: filteredData.transExp,
            remarks: filteredData.remarks,
            isHoliday: isHoliday,
            isToday: isToday,
            fontColorCls: fontColorCls,
          };
          result.push(data);
        } else {
          result.push(blankData);
        }
      } else {
        result.push(blankData);
      }
    }

    if (result.length > 0) {
      setDiligenceData(result);
      setOrgDiligenceData(result);
      setIsApproved(isApproved);
    }
  };

  const [moveButton, setMoveButton] = useState(1); // 1:前の月に移動、2:次の月に移動

  // 前の月に移動
  const onClickBack = () => {
    let newYear = Number(dispYear);
    let newMonth = Number(dispMonth) - 1;
    if (newMonth === 0) {
      newYear--;
      newMonth = 12;
    }
    setDispYear(String(newYear));
    setDispMonth(String(newMonth).padStart(2, "0"));
    setDispDiligenceData(newYear, newMonth);
  };

  // 次の月に移動
  const onClickNext = () => {
    let newYear = Number(dispYear);
    let newMonth = Number(dispMonth) + 1;
    if (newMonth === 13) {
      newYear++;
      newMonth = 1;
    }
    setDispYear(String(newYear));
    setDispMonth(String(newMonth).padStart(2, "0"));
    setDispDiligenceData(newYear, newMonth);
  };

  // 編集中チェック
  const checkEditing = () => {
    let result = false;
    for (let i = 0; i < diligenceData.length; i++) {
      if (
        diligenceData[i].startTime !== orgDiligenceData[i].startTime ||
        diligenceData[i].endTime !== orgDiligenceData[i].endTime ||
        diligenceData[i].breakTime !== orgDiligenceData[i].breakTime ||
        diligenceData[i].transExp !== orgDiligenceData[i].transExp ||
        diligenceData[i].remarks !== orgDiligenceData[i].remarks
      ) {
        result = true;
        break;
      }
    }
    return result;
  };

  // 値更新
  const updateData = (day: number, column: number, value: any) => {
    let newData = JSON.parse(JSON.stringify(diligenceData));
    let index = newData.findIndex((d: dispData) => d.day === day);

    switch (column) {
      case 1:
        if (newData[index].check) {
          newData[index].check = false;
        } else {
          newData[index].check = true;
        }
        break;
      case 2:
        newData[index].startTime = value;
        const time = calcTime(
          value,
          newData[index].endTime,
          newData[index].breakTime
        );
        newData[index].workTime = time.workTime;
        newData[index].overTime = time.overTime;
        break;
      case 3:
        newData[index].endTime = value;
        const time2 = calcTime(
          newData[index].startTime,
          value,
          newData[index].breakTime
        );
        newData[index].workTime = time2.workTime;
        newData[index].overTime = time2.overTime;
        break;
      case 4:
        newData[index].breakTime = value;
        const time3 = calcTime(
          newData[index].startTime,
          newData[index].endTime,
          value
        );
        newData[index].workTime = time3.workTime;
        newData[index].overTime = time3.overTime;
        break;
      case 5:
        newData[index].paid = value;
        break;
      case 6:
        newData[index].transExp = value;
        break;
      case 7:
        newData[index].remarks = value;
        break;
      case 8:
        newData[index].startTime = "";
        newData[index].endTime = "";
        newData[index].breakTime = "";
        newData[index].workTime = "";
        newData[index].overTime = "";
        newData[index].paid = "";
        newData[index].transExp = "";
        newData[index].remarks = "";
        break;
    }
    setDiligenceData(newData);
  };

  // 勤務時間・残業時間計算
  const calcTime = (
    startTime: string,
    endTime: string,
    breakTime: string
  ): { workTime: String; overTime: String } => {
    let result = { workTime: "", overTime: "" };
    if (startTime !== "" && endTime !== "") {
      let startDate = new Date("1990/01/01");
      startDate.setHours(parseInt(startTime.slice(0, 2)));
      startDate.setMinutes(parseInt(startTime.slice(-2)));

      let endDate = new Date("1990/01/01");
      endDate.setHours(parseInt(endTime.slice(0, 2)));
      endDate.setMinutes(parseInt(endTime.slice(-2)));

      let workSec = (endDate.getTime() - startDate.getTime()) / 1000;

      // 終了時間が日をまたぐ場合
      if (workSec <= 0) {
        let endDate2 = new Date("1990/01/02");
        endDate2.setHours(parseInt(endTime.slice(0, 2)));
        endDate2.setMinutes(parseInt(endTime.slice(-2)));
        workSec = (endDate2.getTime() - startDate.getTime()) / 1000;
      }

      if (breakTime !== "") {
        let breakSec =
          parseInt(breakTime.slice(0, 2)) * 60 * 60 +
          parseInt(breakTime.slice(-2)) * 60;
        workSec -= breakSec;
      }

      const workHours = Math.floor(workSec / 3600);
      const workMin = Math.floor((workSec % 3600) / 60);

      const workTime =
        workHours.toString().padStart(2, "0") +
        ":" +
        workMin.toString().padStart(2, "0");

      // 残業時間計算
      const overSec = workSec - 60 * 60 * 8;
      const overHours = Math.floor(overSec / 3600);
      const overMin = Math.floor((overSec % 3600) / 60);

      let overTime = "";
      if (overSec > 0) {
        overTime =
          overHours.toString().padStart(2, "0") +
          ":" +
          overMin.toString().padStart(2, "0");
      }
      result.workTime = workTime;
      result.overTime = overTime;
    }
    return result;
  };

  const [isShowSaveConfirm, setIsShowSaveConfirm] = useState(false);
  const [isShowMoveConfirm, setIsShowMoveConfirm] = useState(false);

  const saveData = () => {
    setIsShowSaveConfirm(false);
    // setIsShowAlert(true);
    // setSeverityNum(0);
    // setAlertMessage("勤怠情報を登録しました");
  };

  const onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newData = JSON.parse(JSON.stringify(diligenceData));
    for (let i = 0; i < newData.length; i++) {
      if (e.target.checked) {
        if (!newData[i].isHoliday) newData[i].check = true;
      } else {
        newData[i].check = false;
      }
    }
    setDiligenceData(newData);
  };

  const [bulkStartTime, setBulkStartTime] = useState("");
  const [bulkEndTime, setBulkEndTime] = useState("");
  const [bulkBreakTime, setBulkBreakTime] = useState("");
  const [bulkPaid, setBulkPaid] = useState("");

  // 一括入力
  const batchInput = () => {
    let newData = JSON.parse(JSON.stringify(diligenceData));
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].check) {
        newData[i].check = false;
        newData[i].startTime = bulkStartTime;
        newData[i].endTime = bulkEndTime;
        newData[i].breakTime = bulkBreakTime;
        let time = calcTime(bulkStartTime, bulkEndTime, bulkBreakTime);
        newData[i].workTime = time.workTime;
        newData[i].overTime = time.overTime;
        newData[i].paid = bulkPaid;
      }
    }
    setDiligenceData(newData);
    setBulkStartTime("");
    setBulkEndTime("");
    setBulkBreakTime("");
    setBulkPaid("");
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{ display: "flex", marginBottom: "5px", lineHeight: "35px" }}
        >
          <IconButton
            onClick={() => {
              let isEditing = false;
              if (!isApproved) isEditing = checkEditing();
              if (isEditing) {
                setMoveButton(1);
                setIsShowMoveConfirm(true);
              } else {
                onClickBack();
              }
            }}
          >
            <ArrowLeftIcon fontSize="large" />
          </IconButton>
          <TextField
            type="month"
            value={`${dispYear}-${dispMonth}`}
            onChange={(e) => {
              let date = e.target.value.split("-");
              let year = date[0];
              let month = date[1];
              setDispYear(year);
              setDispMonth(month.padStart(2, "0"));
              setDispDiligenceData(Number(year), Number(month));
            }}
            style={{ marginTop: "8px" }}
          />
          <IconButton
            onClick={() => {
              let isEditing = false;
              if (!isApproved) isEditing = checkEditing();
              if (isEditing) {
                setMoveButton(2);
                setIsShowMoveConfirm(true);
              } else {
                onClickNext();
              }
            }}
          >
            <ArrowRightIcon fontSize="large" />
          </IconButton>
        </div>
        {!isApproved && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={() => {
              setIsShowSaveConfirm(true);
            }}
          >
            保存
          </Button>
        )}
      </Box>
      {!isApproved && (
        <Box sx={{ my: 2 }}>
          <TextField
            type="time"
            label="開始時間"
            InputLabelProps={{
              shrink: true,
            }}
            value={bulkStartTime}
            onChange={(e) => {
              setBulkStartTime(e.target.value);
            }}
            style={{ marginRight: "5px", backgroundColor: "fff" }}
            variant="outlined"
            size="small"
          />
          <TextField
            type="time"
            label="終了時間"
            InputLabelProps={{
              shrink: true,
            }}
            value={bulkEndTime}
            onChange={(e) => {
              setBulkEndTime(e.target.value);
            }}
            style={{ marginRight: "5px" }}
            variant="outlined"
            size="small"
          />
          <TextField
            type="time"
            label="休憩時間"
            InputLabelProps={{
              shrink: true,
            }}
            value={bulkBreakTime}
            onChange={(e) => {
              setBulkBreakTime(e.target.value);
            }}
            style={{ marginRight: "10px" }}
            variant="outlined"
            size="small"
          />
          <TextField
            type="time"
            label="有給"
            InputLabelProps={{
              shrink: true,
            }}
            value={bulkPaid}
            onChange={(e) => {
              setBulkPaid(e.target.value);
            }}
            style={{ marginRight: "10px" }}
            variant="outlined"
            size="small"
          />
          <Button
            onClick={batchInput}
            variant="contained"
            color="primary"
            style={{ height: "40px" }}
            disabled={!diligenceData.some((d) => d.check)}
          >
            一括入力
          </Button>
        </Box>
      )}
      {isApproved ? (
        <TableContainer component={Paper} className={classes.container2}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: "100px" }}>日</StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  開始時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  終了時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  休憩時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  勤務時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  残業時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  有給
                </StyledTableCell>
                <StyledTableCell style={{ width: "200px" }}>
                  交通費
                </StyledTableCell>
                <StyledTableCell>備考</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diligenceData.map((data, index) => (
                <StyledTableRow
                  key={data.day}
                  style={{ margin: 0 }}
                  className={
                    data.isToday
                      ? classes.todayCell
                      : data.isHoliday
                      ? classes.hodidayRow
                      : ""
                  }
                  aria-checked={data.check}
                  selected={data.check}
                >
                  <StyledTableCell
                    className={
                      data.fontColorCls === 1
                        ? classes.redCell
                        : data.fontColorCls === 2
                        ? classes.blueCell
                        : ""
                    }
                  >
                    {data.dispDay}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.startTime === "" ? "　" : data.startTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.endTime === "" ? "　" : data.endTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell style={{}}>
                    <div className={classes.approvedText}>
                      {data.breakTime === "" ? "　" : data.breakTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.workTime === "" ? "　" : data.workTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.overTime === "" ? "　" : data.overTime}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.paid === "" ? "　" : data.paid}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className={classes.approvedText}>
                      {data.transExp === 0 ? "　" : data.transExp}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: {
                        xs: "none",
                        sm: "block",
                      },
                    }}
                  >
                    <div className={classes.approvedText}>
                      {data.remarks === "" ? "　" : data.remarks}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: {
                        sm: "none",
                      },
                    }}
                  >
                    <IconButton
                      color="primary"
                      style={{ padding: 5 }}
                      // onClick={() => {
                      //   updateData(data.day, 8, null);
                      // }}
                    >
                      <CreateRoundedIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} className={classes.container}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Tooltip
                    title={
                      diligenceData.some((d) => !d.isHoliday && !d.check)
                        ? "営業日を一括選択"
                        : "一括選択を解除"
                    }
                    style={{ fontSize: "10px" }}
                    placement="right"
                    arrow
                  >
                    <Checkbox
                      style={{
                        padding: "12px",
                        color: "white",
                      }}
                      checked={
                        !diligenceData.some((d) => !d.isHoliday && !d.check)
                      }
                      onChange={onSelectAllClick}
                      inputProps={{ "aria-label": "select all desserts" }}
                    />
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>日</StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  開始時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  終了時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  休憩時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  勤務時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  残業時間
                </StyledTableCell>
                <StyledTableCell style={{ width: "100px" }}>
                  有給
                </StyledTableCell>
                <StyledTableCell style={{ width: "200px" }}>
                  交通費
                </StyledTableCell>
                <StyledTableCell>備考</StyledTableCell>
                <StyledTableCell style={{ width: "50px" }}></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diligenceData.map((data, index) => {
                let labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow
                    key={data.day}
                    style={{ margin: 0 }}
                    className={
                      data.isToday
                        ? classes.todayCell
                        : data.isHoliday
                        ? classes.hodidayRow
                        : ""
                    }
                    aria-checked={data.check}
                    selected={data.check}
                  >
                    <StyledTableCell>
                      <Checkbox
                        style={{ padding: 0 }}
                        checked={data.check}
                        onClick={() => {
                          updateData(data.day, 1, null);
                        }}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      className={
                        data.fontColorCls === 1
                          ? classes.redCell
                          : data.fontColorCls === 2
                          ? classes.blueCell
                          : ""
                      }
                    >
                      {data.dispDay}
                    </StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        type="time"
                        value={data.startTime}
                        inputProps={{
                          step: 1800,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          updateData(data.day, 2, e.target.value);
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        type="time"
                        value={data.endTime}
                        inputProps={{
                          step: 1800,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          updateData(data.day, 3, e.target.value);
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{}}>
                      <TextField
                        type="time"
                        value={data.breakTime}
                        inputProps={{
                          step: 1800,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          updateData(data.day, 4, e.target.value);
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className={classes.approvedText}>
                        {data.workTime === "" ? "　" : data.workTime}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className={classes.approvedText}>
                        {data.overTime === "" ? "　" : data.overTime}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        type="time"
                        value={data.paid}
                        inputProps={{
                          step: 1800,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          updateData(data.day, 5, e.target.value);
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        className={classes.textBox}
                        value={data.transExp === 0 ? "" : data.transExp}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          updateData(data.day, 6, e.target.value);
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        display: {
                          xs: "none",
                          sm: "block",
                        },
                      }}
                    >
                      <TextField
                        className={classes.textBox}
                        value={data.remarks}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          updateData(data.day, 7, e.target.value);
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        display: {
                          sm: "none",
                        },
                      }}
                    >
                      <IconButton color="primary" style={{ padding: 5 }}>
                        <CreateRoundedIcon />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        color="primary"
                        style={{ padding: 5 }}
                        onClick={() => {
                          updateData(data.day, 8, null);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div>
        <Dialog
          open={isShowSaveConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              入力内容を保存します。よろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsShowSaveConfirm(false);
              }}
              variant="contained"
              color="default"
            >
              いいえ
            </Button>
            <Button
              // onClick={saveData}
              variant="contained"
              color="primary"
              autoFocus
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isShowMoveConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              入力内容が破棄されます。移動してよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsShowMoveConfirm(false);
              }}
              variant="contained"
              color="default"
            >
              いいえ
            </Button>
            <Button
              onClick={() => {
                if (moveButton === 1) {
                  onClickBack();
                } else {
                  onClickNext();
                }
                setIsShowMoveConfirm(false);
              }}
              variant="contained"
              color="primary"
              autoFocus
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Diligence;
