import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  createStyles,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props<T extends object = any> {
  data: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
  render: (item: T) => React.ReactNode;
  idPropertyName: string;
  title?: string;
  renderSecondary?: (item: T) => React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "auto",
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      minWidth: 250,
      height: 300,
      backgroundColor: theme.palette.background.paper,
      overflow: "auto",
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  }),
);

function not(a: any[], b: any[]) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a: any[], b: any[]) {
  return a.filter((value) => b.includes(value));
}

function union(a: any[], b: any[]) {
  return [...a, ...not(b, a)];
}

export const TransferList = <T extends object = any>({
  data,
  onChange,
  render,
  renderSecondary,
  idPropertyName,
  title,
  ...props
}: Props<T>) => {
  const right = props.selected;

  const { t } = useTranslation();
  const classes = useStyles();
  const [left, setLeft] = React.useState<T[]>(not(data, right));
  const [checked, setChecked] = React.useState<number[]>([]);

  const leftChecked = intersection(
    checked,
    left.map((x) => x[idPropertyName]),
  );
  const rightChecked = intersection(
    checked,
    right.map((x) => x[idPropertyName]),
  );

  useEffect(() => {
    setLeft(not(data, right));
  }, [right, data]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: number[]) => intersection(checked, items).length;

  const handleToggleAll = (items: number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setLeft(
      not(
        left,
        left.filter((x) => leftChecked.includes(x[idPropertyName])),
      ),
    );
    onChange(right.concat(left.filter((x) => leftChecked.includes(x[idPropertyName]))));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(right.filter((x) => rightChecked.includes(x[idPropertyName]))));
    onChange(
      not(
        right,
        right.filter((x) => rightChecked.includes(x[idPropertyName])),
      ),
    );
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: T[]) => {
    const itemIds = items.map((x) => x[idPropertyName]);

    return (
      <Card>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={handleToggleAll(itemIds)}
              checked={numberOfChecked(itemIds) === items.length && items.length !== 0}
              indeterminate={numberOfChecked(itemIds) !== items.length && numberOfChecked(itemIds) !== 0}
              disabled={items.length === 0}
            />
          }
          title={title}
          subheader={`${numberOfChecked(itemIds)}/${items.length} ${t("selected")}`}
        />
        <Divider />
        <List className={classes.list} dense component={"div" as any} role="list">
          {items.map((value) => (
            <ListItem key={value[idPropertyName]} button onClick={handleToggle(value[idPropertyName])}>
              <ListItemIcon>
                <Checkbox checked={checked.includes(value[idPropertyName])} tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText primary={render(value)} secondary={renderSecondary ? renderSecondary(value) : null} />
            </ListItem>
          ))}
          <ListItem />
        </List>
      </Card>
    );
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" className={classes.root}>
      <Grid item>{customList(t("choices", { t: title }), left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(t("chosen", { t: title }), right)}</Grid>
    </Grid>
  );
};
