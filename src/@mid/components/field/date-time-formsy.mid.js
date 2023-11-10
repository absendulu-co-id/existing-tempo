import { DateTimeFormsy } from "@fuse";
import { Grid } from "@material-ui/core";
import moment from "moment";

export function createDateTimeFormsy(index, item, handleInputChange) {
  return (
    <Grid item xs={12} sm={6} index={index} key={index}>
      <DateTimeFormsy
        inputVarian="outlined"
        type={item.type}
        name={item.name}
        label={item.label}
        onChange={(event) => handleInputChange(event, event, item.name)}
        value={moment(item.value).format("YYYY-MM-DD HH:mm")}
        InputLabelProps={true}
        validations={item.validations}
        validationErrors={item.validationErrors}
      />
    </Grid>
  );
}
