import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import WavesIcon from "@mui/icons-material/Waves";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BadgeIcon from "@mui/icons-material/Badge";
import styled from "@emotion/styled";
const pages = [
  {
    name: "Pool",
    url: "/",
    icon: <WavesIcon />,
  },
  {
    name: "Winners",
    url: "/winners",
    icon: <EmojiEventsIcon />,
  },
  {
    name: "Account",
    url: "/account",
    icon: <BadgeIcon />,
  },
];

export default function BottomNav() {
  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();

  return (
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={4}
      >
        <BottomBar
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(pages[newValue].url);
          }}
        >
          {pages.map((page) => (
            <BottomNavigationAction label={page.name} icon={page.icon} />
          ))}
        </BottomBar>
      </Paper>
    </Box>
  );
}

const BottomBar = styled(BottomNavigation)`
  background: #2c3c60;
  .MuiBottomNavigationAction-root.Mui-selected {
    color: #fff !important;
  }
`;
