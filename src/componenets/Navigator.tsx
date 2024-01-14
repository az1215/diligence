import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import ScheduleIcon from "@material-ui/icons/Schedule";
import DnsRoundedIcon from "@material-ui/icons/DnsRounded";
import TimerIcon from "@material-ui/icons/Timer";
import SettingsIcon from "@material-ui/icons/Settings";

import personal_logo from "../public/company_name_logo_white.png";

const categories = [
  {
    id: "Build",
    children: [
      {
        index: 0,
        title: "勤怠",
        icon: <ScheduleIcon />,
        active: true,
      },
      { index: 1, title: "Database", icon: <DnsRoundedIcon /> },
    ],
  },
  {
    id: "Quality",
    children: [
      { index: 2, title: "Performance", icon: <TimerIcon /> },
      { index: 3, title: "Analytics", icon: <SettingsIcon /> },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

interface ListItemProps {
  setSelectedMenuIndex: (newState: number) => void;
}
type CombinedProps = DrawerProps & ListItemProps;

export default function Navigator(props: CombinedProps) {
  const { setSelectedMenuIndex, ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <Typography
        variant="h4"
        noWrap
        component="div"
        style={{
          alignItems: "center",
        }}
      >
        <img
          src={personal_logo}
          style={{
            height: "32px",
            margin: "20px",
          }}
        />
      </Typography>
      <List disablePadding>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            {children.map(({ index, title, icon, active }) => (
              <ListItem disablePadding key={index}>
                <ListItemButton
                  selected={active}
                  sx={item}
                  onClick={() => {
                    setSelectedMenuIndex(index);
                  }}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{title}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
