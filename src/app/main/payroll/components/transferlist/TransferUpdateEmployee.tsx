import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { AddCircleOutline as AddCircleOutlineIcon, Search } from "@material-ui/icons";
import React, { useState } from "react";
import { LinkProps } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  // custom styling
}));

interface Item {
  id: string;
  checked: boolean;
  title: string;
}

interface Props extends LinkProps {
  loading: boolean;
}

const initialLeftList: Item[] = [
  { id: "item1", checked: false, title: "Doni Saputra" },
  { id: "item2", checked: false, title: "Fitri Aulia" },
  { id: "item3", checked: false, title: "Rizki Ramadhan" },
  { id: "item4", checked: false, title: "Indra Gunawan" },
  { id: "item5", checked: false, title: "Fajar Riyanto" },
];

const initialRightList: Item[] = [
  { id: "item1", checked: false, title: "Sari Dewi" },
  { id: "item2", checked: false, title: "Adit Purnomo" },
  { id: "item3", checked: false, title: "Wulan Sari" },
  { id: "item4", checked: false, title: "Dian Sari" },
  { id: "item5", checked: false, title: "Hendra Pratama " },
];

export const TransferUpdateEmployee: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [leftList, setLeftList] = useState<Item[]>(initialLeftList);
  const [rightList, setRightList] = useState<Item[]>(initialRightList);
  const [searchRightValue, setSearchRightValue] = useState("");
  const [searchLeftValue, setSearchLeftValue] = useState("");
  const [sortingMethod, setSortingMethod] = useState("alphabetical");

  // fetching data with total employee

  // useEffect(() => {
  //   // Fetch data from the API endpoint
  //   const fetchInitialData = async () => {
  //     try {
  //       const response = await fetch("api-endpoint-url");
  //       const data = await response.json();
  //       const initialLeftList = data.leftList.map((item: any) => ({
  //         ...item,
  //         checked: false,
  //       }));
  //       const initialRightList = data.rightList.map((item: any) => ({
  //         ...item,
  //         checked: false,
  //       }));
  //       setLeftList(initialLeftList);
  //       setRightList(initialRightList);
  //     } catch (error) {
  //       console.error("Error fetching data: ", error);
  //     }
  //   };
  //   fetchInitialData();
  // }, []);

  // Checked to right
  const handleCheckedToRight = (item: Item) => {
    const itemsToMove = leftList.filter((item) => item.checked);
    setLeftList(leftList.filter((i) => i.id !== item.id));
    setRightList([...rightList, { ...item, checked: false }, ...itemsToMove]);
    setSortingMethod("alphabetical");
  };

  // All to right
  const handleAllToRight = () => {
    setRightList([...rightList, ...leftList]);
    setLeftList([]);
  };

  // Checked to left
  const handleCheckedToLeft = (item: Item) => {
    const itemsToMove = rightList.filter((item) => item.checked);
    setRightList(rightList.filter((i) => i.id !== item.id));
    setLeftList([...leftList, { ...item, checked: false }, ...itemsToMove]);
  };

  // All to left
  const handleAllToLeft = () => {
    setLeftList([...leftList, ...rightList]);
    setRightList([]);
  };

  // Filter right and left
  const filterRightList = (rightList: Item[], searchValue: string): Item[] => {
    return rightList.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  };

  const filterLeftList = (leftList: Item[], searchValue: string): Item[] => {
    return leftList.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  };

  const filteredRightList = filterRightList(rightList, searchRightValue);
  const filteredLeftList = filterLeftList(leftList, searchLeftValue);

  let sortedLeftList = filteredLeftList;

  if (sortingMethod === "alphabetical") {
    sortedLeftList = [...filteredLeftList].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortingMethod === "length") {
    sortedLeftList = [...filteredLeftList].sort((a, b) => a.title.length - b.title.length);
  }

  // Search change for the right & left
  const rightSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRightValue(event.target.value);
  };

  const leftSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLeftValue(event.target.value);
  };

  // Sort filter by alphabet and by length
  const sortListAlphabetically = (list: Item[], setList: Function) => {
    const sortedList = [...list].sort((a, b) => a.title.localeCompare(b.title));
    setList(sortedList);
  };

  const sortListByLength = (list: Item[], setList: Function) => {
    const sortedList = [...list].sort((a, b) => a.title.length - b.title.length);
    setList(sortedList);
  };

  return (
    <>
      <Box display="flex">
        <Box
          flexGrow={1}
          style={{
            marginRight: "3rem",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <FormControl fullWidth>
            <p style={{ marginBottom: "1rem", fontWeight: "bold" }}>View 15 of 30 employee(s)</p>
            {/* automatic function here with total employee data */}
            <TextField
              hiddenLabel
              defaultValue="Small"
              size="small"
              value={searchLeftValue}
              onChange={leftSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              style={{ borderRadius: 8 }}
              placeholder="Search..."
            ></TextField>
            <Button onClick={() => sortListAlphabetically(leftList, setLeftList)}>Sort Alphabetically</Button>
            <Button onClick={() => sortListByLength(leftList, setLeftList)}>Sort by Length</Button>
          </FormControl>
          <List>
            {filteredLeftList.map((item, index) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.title} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleCheckedToRight(item)}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleAllToRight}>
            Move all to right
          </Button>
        </Box>
        <Box flexGrow={1}>
          <p style={{ marginBottom: "1rem", fontWeight: "bold" }}>2 employee(s) selected</p>
          {/* automatic function here with total employee data */}
          <FormControl fullWidth>
            <TextField
              hiddenLabel
              defaultValue="Small"
              size="small"
              value={searchRightValue}
              onChange={rightSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <Search />
                      {/* filter icon is here. Need styling */}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              style={{ borderRadius: 8 }}
              placeholder="Search..."
            ></TextField>
          </FormControl>
          <List>
            {filteredRightList.map((item, index) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.title} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleCheckedToLeft(item)}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleAllToLeft}>
            Move all to left
          </Button>
        </Box>
      </Box>
    </>
  );
};
