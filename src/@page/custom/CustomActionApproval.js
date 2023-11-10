import * as Actions from "app/store/actions";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { setValue } from "@mid/store/formMaker/action.formMaker";
import { fetchApprovalDetail, updateApproval } from "@mid/store/model/action.model";
import { closeDialog, openDialog } from "app/store/actions/fuse/dialog.actions";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";

class CustomActionApproval extends Component {
  approveAction = (rowData) => {
    const primaryKey = this.props.model.primaryKey;
    this.props.openDialog({
      children: (
        <React.Fragment>
          <DialogTitle>Terima Permintaan</DialogTitle>
          <DialogContent>
            <TextField
              autoComplete="off"
              autoFocus
              size="large"
              name="auditRemark"
              label="Catatan"
              type="text"
              onChange={this.props.setValue}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.closeDialog()}>Batal</Button>
            <Button
              onClick={() => {
                const auditRemark = this.props.fieldList.filter((item) => item.name === "auditRemark")[0].value;
                const data = {
                  auditStatus: "approved",
                  auditRemark,
                };
                this.props.updateApproval(rowData[primaryKey], data);
              }}
            >
              Simpan
            </Button>
          </DialogActions>
        </React.Fragment>
      ),
    });
  };

  rejectAction = (rowData) => {
    const primaryKey = this.props.model.primaryKey;
    this.props.openDialog({
      children: (
        <React.Fragment>
          <DialogTitle id="alert-dialog-title">Tolak Permintaan</DialogTitle>
          <DialogContent>
            <TextField
              autoComplete="off"
              autoFocus
              size="large"
              name="auditRemark"
              label="Catatan"
              type="text"
              onChange={this.props.setValue}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.closeDialog()}>Batal</Button>
            <Button
              onClick={() => {
                const auditRemark = this.props.fieldList.filter((item) => item.name === "auditRemark")[0].value;
                const data = {
                  auditStatus: "rejected",
                  auditRemark,
                };
                this.props.updateApproval(rowData[primaryKey], data);
              }}
            >
              Simpan
            </Button>
          </DialogActions>
        </React.Fragment>
      ),
    });
  };

  handleShowDetail = () => {
    if (this.props.model.approvalDetail.length > 0) {
      this.props.openDialog({
        children: (
          <React.Fragment>
            <DialogTitle>Detail Persetujuan</DialogTitle>
            <DialogContent>
              {this.props.model.approvalDetail.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`p-12 mb-12 text-white ${
                      item.approvalStatus === "rejected"
                        ? "bg-red"
                        : item.approvalStatus === "approved"
                        ? "bg-blue"
                        : "bg-orange"
                    }`}
                  >
                    <p className="text-md font-bold">
                      {item.nodeNumber}. {item.workflowNodeName}
                    </p>
                    <p className="text-xs">Approver Code: {item.approverCode}</p>
                    <p className="text-xs">Approver Name: {item.approverName}</p>
                    <p className="text-xs">
                      Approval Status:{" "}
                      {item.approvalStatus === "active" ? "Pending" : String(item.approvalStatus).toCapitalCase()}
                    </p>
                    <p className="text-xs">
                      Approval Time:{" "}
                      {item.approvalStatus === "pending" || item.approvalStatus === "active"
                        ? ""
                        : moment(item.updatedAt).format("DD-MM-YYYY HH:mm")}
                    </p>
                    <p className="text-xs">Catatan: {item.approvalRemark}</p>
                  </div>
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.props.closeDialog()}>Tutup</Button>
            </DialogActions>
          </React.Fragment>
        ),
      });
    } else {
      this.props.showMessage({
        message: "Tidak ada detail approval!", // text or html
        autoHideDuration: 3000, // ms
        anchorOrigin: {
          vertical: "top", // top bottom
          horizontal: "center", // left center right
        },
        variant: "info", // success
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.model.approvalDetail !== this.props.model.approvalDetail) {
      this.handleShowDetail();
    }
  }

  render() {
    if (this.props.dataRow.auditStatus === "Pending") {
      return (
        <div style={{ display: "inline-flex" }}>
          <Tooltip title={"Setujui "}>
            <IconButton disabled={false} onClick={() => this.approveAction(this.props.dataRow)}>
              <Icon fontSize="small">check</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title={"Tolak "}>
            <IconButton disabled={false} onClick={() => this.rejectAction(this.props.dataRow)}>
              <Icon fontSize="small">block</Icon>
            </IconButton>
          </Tooltip>
          {this.props.model.model !== "ApprovalShift" && (
            <Tooltip title={"Detail "}>
              <IconButton
                disabled={false} // this.state.navigationAccess.allowEdit
                onClick={() => {
                  this.props.fetchApprovalDetail(this.props.dataRow[this.props.model.primaryKey]);

                  // this.handleShowDetail(this.props.dataRow, this.props.model);
                }}
              >
                <Icon fontSize="small">details</Icon>
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    } else {
      return "";
    }
  }
}

const mapStateToProps = (state) => ({
  model: state.model,
  fieldList: state.formMaker.fieldList,
});

const mapDispatchToProps = {
  openDialog,
  closeDialog,
  fetchApprovalDetail,
  showMessage: Actions.showMessage,
  setValue: setValue,
  updateApproval: updateApproval,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomActionApproval);
