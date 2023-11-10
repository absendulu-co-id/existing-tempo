import { TYPE_FIELD_DATE as dateType } from "./types";
import { TextFieldFormsy } from "@fuse";
import { Grid } from "@material-ui/core";
import { FieldCreatorEventHandler } from "@mid/helper/fieldCreator.helper";
import { GeneralConfigField } from "interface/general-config";
import moment from "moment";

export function createTextFieldFormsy(
  index: number,
  item: GeneralConfigField,
  handleInputChange: FieldCreatorEventHandler,
) {
  return (
    // @ts-expect-error
    <Grid item xs={12} sm={6} index={index} key={index}>
      <TextFieldFormsy
        variant="outlined"
        type={item.type}
        name={item.name}
        label={item.label}
        onChange={handleInputChange}
        value={item.type === "date" ? moment(item.value).format("YYYY-MM-DD") : item.value}
        helperText={item.helperText}
        multiline={item.multiline}
        minRows={item.minRows ?? item.rows}
        maxRows={item.maxRows ?? item.rowsMax}
        validations={item.validations}
        validationErrors={item.validationErrors}
        InputLabelProps={{
          shrink: item.fieldType === dateType ? true : undefined,
        }}
        required={item.required}
      />
    </Grid>
  );
}
