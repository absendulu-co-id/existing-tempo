import { generalApiUrl } from "../services/url";
import { FormControl, Icon, IconButton, InputAdornment, OutlinedInput } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import axios from "axios";
import React from "react";

class NewAutoCompleteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoCompleteData: [],
      autoCompleteValue: "",
      autoCompleteShow: false,
    };
  }

  onSearchAutoComplete = async () => {
    await axios
      .post(`${generalApiUrl}/Maps/search`, {
        keyWord: this.state.autoCompleteValue,
      })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            autoCompleteData: res.data,
            autoCompleteShow: true,
          });
        }
      });
  };

  handleChange = (prop) => (event) => {
    this.setState({ autoCompleteValue: event.target.value });
    if (event.target.value === "") {
      this.setState({
        autoCompleteData: [],
      });
    }
  };

  handleClick = async (placeId) => {
    await axios.post(`${generalApiUrl}/Maps/info`, { placeId }).then((res) => {
      if (res.status === 200) {
        const geometry = {
          coords: {
            latitude: res.data.location.lat,
            longitude: res.data.location.lng,
          },
        };
        this.props.selectPlaceId(geometry);
        this.setState({
          autoCompleteData: [],
          autoCompleteValue: "",
          autoCompleteShow: false,
        });
      }
    });
  };

  render() {
    return (
      <ClickAwayListener onClickAway={() => this.setState({ autoCompleteShow: false })}>
        <>
          <FormControl variant="outlined" fullWidth size="small" className="bg-white rounded-md w-full">
            <OutlinedInput
              onFocus={() => {
                if (this.state.autoCompleteData.length > 0) {
                  this.setState({ autoCompleteShow: true });
                }
              }}
              autoComplete="off"
              id="autoCompleteValue"
              type="text"
              value={this.state.autoCompleteValue}
              onChange={this.handleChange()}
              onKeyPress={async (ev) => {
                if (ev.key === "Enter") {
                  await this.onSearchAutoComplete();
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => this.onSearchAutoComplete()}>
                    <Icon style={{ fontSize: 16 }}>search</Icon>
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Search location"
            />
          </FormControl>
          {this.state.autoCompleteShow
            ? this.state.autoCompleteData.length > 0
              ? this.state.autoCompleteData.map((item) => {
                  return (
                    <p
                      onClick={async () => await this.handleClick(item.place_id)}
                      key={item.place_id}
                      className="bg-white shadow p-2"
                      style={{ fontSize: 11 }}
                    >
                      {item.description}
                    </p>
                  );
                })
              : ""
            : ""}
        </>
      </ClickAwayListener>
    );
  }
}
export default NewAutoCompleteComponent;
