import { TYPE_FIELD_DATE as dateType } from "./types";
import { Grid, TextField } from "@material-ui/core";

export function createTextField(index, item, handleInputChange) {
  return (
    <Grid item xs={12} sm={6} index={index} key={index}>
      <TextField
        fullWidth
        variant="outlined"
        type={item.type}
        name={item.name}
        label={item.label}
        onChange={handleInputChange}
        multiline={item.multiline}
        minRows={item.rows}
        maxRows={item.rowsMax}
        InputLabelProps={{
          shrink: item.fieldType === dateType ? true : undefined,
        }}
        value={item.value}
      />
    </Grid>
  );
}
