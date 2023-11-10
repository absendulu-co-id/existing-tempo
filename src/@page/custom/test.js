import { Button } from "@material-ui/core";
import { Component } from "react";
import { connect } from "react-redux";

class Test extends Component {
  render() {
    return (
      <Button
        onClick={() => this.props.fetchAllData()}
        variant="contained"
        color="secondary"
        style={{ marginBottom: "2%", marginLeft: "1%" }}
      >
        EXPORT DATA 2
      </Button>
    );
  }
}

export default connect(null, null)(Test);
