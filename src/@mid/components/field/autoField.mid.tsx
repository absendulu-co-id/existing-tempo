import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FieldCreatorEventHandler } from "@mid/helper/fieldCreator.helper";
import { GeneralConfigField } from "interface";

export const createAutoField = (
  index: number,
  item: GeneralConfigField,
  handleInputChange: FieldCreatorEventHandler,
  isMultiple = false,
) => {
  let value = item.value;
  let options = item.option;

  if (isMultiple) {
    if (value != null && value != "" && typeof value === "string") {
      value = JSON.parse(item.value);
    }
    if (value == "") {
      value = [];
    } else {
      options = options?.filter((option) => !value.find((x) => x[item.valueColumn!] === option[item.valueColumn!]));
    }
  }

  return (
    // @ts-expect-error
    <Grid item xs={12} sm={6} index={index} key={index}>
      <Autocomplete
        key={index}
        value={value}
        id={item.name}
        defaultValue={value}
        multiple={isMultiple}
        fullWidth
        options={options ?? []}
        onChange={(event, newValue) => handleInputChange(event, newValue, item.name)}
        getOptionLabel={(option) => (item.originOptions ? option[item.labelColumn!] : option.label)}
        renderInput={(params) => (
          <TextField
            autoComplete="off"
            {...params}
            fullWidth
            type={item.type}
            name={item.name}
            label={item.label}
            helperText={item.helperText}
            multiline={item.multiline}
            minRows={item.minRows ?? item.rows}
            maxRows={item.maxRows ?? item.rowsMax}
            variant="outlined"
            required={item.required}
          />
        )}
      />
    </Grid>
  );
};
