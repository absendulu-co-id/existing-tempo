import { Grid } from "@material-ui/core";
import { KeyboardDateTimePicker } from "@material-ui/pickers";

export function createDateTimePicker(index, item, handleInputChange) {
  return (
    <Grid item xs={12} sm={6} index={index} key={index}>
      <KeyboardDateTimePicker
        error={Boolean(false)}
        helperText={false}
        fullWidth
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
        InputLabelProps={{
          shrink: true,
        }}
        format="DD/MM/YYYY HH:mm"
        ampm={false}
        inputVariant="outlined"
        type={item.type}
        name={item.name}
        label={item.label}
        onChange={(event) => handleInputChange(event, event, item.name)}
        value={item.value}
        validations={item.validations}
        validationErrors={item.validationErrors}
      />
    </Grid>
  );
}
