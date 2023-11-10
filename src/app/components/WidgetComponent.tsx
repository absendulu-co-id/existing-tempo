import { Card, CardContent, Theme, Typography, useTheme } from "@material-ui/core";
import React from "react";

type ColorCard = "success" | "info" | "warning" | "error";

interface Props {
  title: string;
  total: string | number;
  color?: ColorCard;
}

const getColor = (p: { theme: Theme; color?: ColorCard }) => {
  const { theme, color } = p;

  switch (color) {
    case "error":
      return theme.palette.error.main;
    case "info":
      return theme.palette.info.main;
    case "success":
      return theme.palette.success.main;
    case "warning":
      return theme.palette.warning.main;
    default:
      return "#61e675";
  }
};

const WidgetComponent: React.FC<Props> = (props) => {
  const theme = useTheme();

  return (
    <Card style={{ backgroundColor: getColor({ theme, color: props.color }) }}>
      <CardContent>
        <Typography style={{ fontSize: 16 }} className="text-white font-extrabold" gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="h4" className="text-white font-bold">
          {props.total}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WidgetComponent;
