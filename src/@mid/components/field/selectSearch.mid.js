import { FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";

export function createSelectSearch(index, item, handleInputChange) {
  return (
    <Grid item xs={12} sm={6} key={index}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>{item.label}</InputLabel>
        <Select
          labelWidth={item.label.length * 8}
          name={item.name}
          value={item.value}
          variant="outlined"
          onChange={(event) => handleInputChange(event, event.target.value, event.target.name)}
        >
          {item.option.map((subItem, subIndex) => {
            return (
              <MenuItem key={subIndex} value={subItem.value}>
                {subItem.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Grid>
  );
}
