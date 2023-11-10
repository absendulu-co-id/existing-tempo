import { SelectFormsy } from "@fuse";
import { Grid, MenuItem } from "@material-ui/core";
import { FieldCreatorEventHandler } from "@mid/helper/fieldCreator.helper";
import { GeneralConfigField } from "interface";

export function createSelectFormsy(
  index: number,
  item: GeneralConfigField,
  handleInputChange: FieldCreatorEventHandler,
) {
  return (
    <Grid item xs={12} sm={6} key={index}>
      <SelectFormsy
        name={item.name}
        label={item.label}
        value={item.value !== null ? item.value : ""}
        validations={item.validations}
        validationErrors={item.validationErrors}
        variant="outlined"
        onChange={handleInputChange}
        helperText={item.helperText}
        required={item.required ? item.required : false}
      >
        {item.option?.map((item, index) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </SelectFormsy>
    </Grid>
  );
}
