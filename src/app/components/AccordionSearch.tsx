import { Icon } from "@iconify-icon/react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Typography,
} from "@material-ui/core";
import React from "react";

interface Props {
  onClearSearch: () => void;
  onSearch: () => void;
}

export const AccordionSearch: React.FC<Props> = ({ onClearSearch, onSearch, children }) => {
  return (
    <Accordion defaultExpanded className="mb-16">
      <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
        <Typography>Pencarian</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* {children} */}
        <div className="search">
          <input type="text" name="search" id="search" placeholder=" " />
          <label htmlFor="search">Search</label>
          <Icon icon={"mdi:search"} />
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button onClick={onClearSearch}>Hapus Pencarian</Button>
        <Button color="primary" onClick={onSearch}>
          Cari
        </Button>
      </AccordionActions>
    </Accordion>
  );
};
