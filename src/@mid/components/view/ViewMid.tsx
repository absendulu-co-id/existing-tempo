import * as types from "@mid/components/field/types";
import * as fieldCreator from "@mid/helper/fieldCreator.helper";
import * as Model from "@mid/store/model/action.model";
import * as Actions from "app/store/actions";
import axios from 'axios';
import { FuseLoading, FusePageCarded } from "@fuse";
import { Icon, listIcons } from "@iconify-icon/react";
import { Action as MaterialTableAction } from "@material-table/core";
import {
  Button,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
  WithStyles,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { data } from "@mid/components/config/general.config";
import { addField, clearField, getOptions, resetField, setValue } from "@mid/store/formMaker/action.formMaker";
import { HeaderColumn } from "@mid/store/formMaker/reducer.formMaker";
import { AccordionSearch } from "app/components/AccordionSearch";
import ExportExcelComponent, { NewExcelComponent } from "app/components/ExportExcelComponent";
import HeaderComponent from "app/components/HeaderComponent";
import { MyMaterialTable } from "app/components/MyMaterialTable";
import { RootState } from "app/store";
import { GeneralConfig } from "interface/general-config";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/id_ID";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

const styles = (theme: Theme) => ({
  layoutRoot: {},
});

const hrefUrl = window.location.pathname.split("/");

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, WithTranslation, WithStyles<typeof styles, true> { }

interface States<RowData extends object = any> {
  actions: (
    | MaterialTableAction<RowData>
    | ((rowData: RowData) => MaterialTableAction<RowData>)
    | {
      action: (rowData: RowData) => MaterialTableAction<RowData>;
      position: string;
    }
  )[];
  spinner: boolean;
  redirect: boolean;
  loading: boolean;
  elementAnchorMenu: HTMLElement | null;
  menuExportDisabled: boolean;
  allDataArea: any;
  isLoadingSyncDevice: boolean;
}

class ViewMid extends React.Component<Props, States> {
  state: States = {
    actions: [
      {
        icon: "delete",
        iconProps: { style: { color: "red" } },
        tooltip: "Hapus " + this.props.t(hrefUrl[2]) + " Terpilih",
        onClick: async (evt, selectedData) => {
          const findStatus = selectedData.find((x) => x?.auditStatus?.toLowerCase() == "approved");
          if (findStatus) {
            await Swal.fire({
              title: "Data tidak bisa dihapus",
              icon: "info",
            });
            return;
          }

          const swalResult = await Swal.fire({
            title: "Yakin untuk menghapus data ini?",
            text: "Data yang terhapus tidak dapat dikembalikan lagi!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Batal",
            confirmButtonText: "OK",
          });

          if (swalResult.isConfirmed) {
            await this.props.deleteData(selectedData);
          }
        },
      },
    ],
    spinner: false,
    redirect: false,
    loading: true,
    elementAnchorMenu: null,
    menuExportDisabled: false,
    allDataArea: null,
    isLoadingSyncDevice: false,
  };

  refExportExcel: React.RefObject<HTMLButtonElement>;

  constructor(props) {
    super(props);

    this.refExportExcel = React.createRef();
  }

  async onGetDataArea() {
    try {
      const res = await axios.get('/area/findAndCount?&filter[order]=areaName+asc')
      const mappedData = res?.data?.rows?.map((list: any) => {
        return list.areaId
      })

      console.log('mappedData', mappedData);
      console.log('res onGetDataArea =>', res);
      this.setState({
        allDataArea: mappedData
      });

    } catch (error) {

    }
  }

  async onSyncDevice() {
    console.log('onSyncDevice');
    this.setState({
      isLoadingSyncDevice: true
    })
    try {
      const res = await axios.request({
        method: 'POST',
        url: '/device-upload-user',
        data: this.state.allDataArea
      })
      console.log('res onSyncDevice =>', res);

      if (res.data.message === 'Success') {
        this.props.showMessage({
          message: "Sync perangkat berhasil !", // text or html
          autoHideDuration: 3000, // ms
          anchorOrigin: {
            vertical: "top", // top bottom
            horizontal: "center", // left center right
          },
          variant: "info", // success
        });
      }

      this.setState({
        isLoadingSyncDevice: false
      })

    } catch (error) {
      console.log('error', error)
      this.setState({
        isLoadingSyncDevice: false
      })
    } finally {
      this.setState({
        isLoadingSyncDevice: false
      })
    }



  }

  async componentDidMount() {
    const pathUrl = window.location.pathname.split("/");
    const generalConfig: GeneralConfig = data[`/${pathUrl[1]}/${pathUrl[2]}`];

    this.props.initModel({
      model: generalConfig.model,
      endPoint: generalConfig.endPoint,
      customEndpoint: generalConfig.customEndpoint,
      customFilterApi: generalConfig.customFilterApi,
      isImportEnabled: generalConfig.isImportEnabled,
      include: generalConfig.include,
      defaultOrder: generalConfig.defaultOrder,
      sortDirection: generalConfig.sortDirection,
      primaryKey: generalConfig.primaryKey,
      customDataSelect: generalConfig.customDataSelect,
    });
    this.props.clearField();
    this.props.resetField();
    // this.props.clearFilter();
    generalConfig.fields?.forEach((item) => {
      this.props.addField(item);
      if (
        (item.fieldType === types.TYPE_FIELD_SELECT || item.fieldType === types.TYPE_FIELD_AUTOCOMPLETE) &&
        item.dataSource === "API"
      ) {
        void this.props.getOptions(item);
      }
    });

    await this.props.fetchData();
    await this.onGetDataArea();
    this.setState({
      loading: false,
      // allData: 'wafa',
    });
  }

  getColumns(): HeaderColumn[] {
    const pathUrl = window.location.pathname.split("/");
    const generalConfig = data[`/${pathUrl[1]}/${pathUrl[2]}`];
    const CustomAction = generalConfig.CustomAction;

    return [
      {
        width: CustomAction == null ? "64px" : "88px",
        title: "Tindakan",
        field: "tombolActions",
        sorting: false,
        export: false,
        render: (row) => {
          return (
            <span style={{ margin: "auto", display: "block", textAlign: "center" }}>
              {generalConfig.isOverWriteAction == null && (
                <Tooltip title={"Ubah " + this.props.t(pathUrl[2])}>
                  <IconButton
                    disabled={
                      !this.props.access.editRule ||
                      (row.auditStatus !== undefined ? row.auditStatus !== "Pending" : false) ||
                      !!row.isUsed
                    }
                    component={Link}
                    to={{
                      pathname: `/${pathUrl[1]}/${pathUrl[2]}/edit/${row[this.props.model.primaryKey]}`,
                      state: { id: row[this.props.model.primaryKey] },
                    }}
                    size="small"
                  >
                    <Icon icon="mdi:pencil" />
                  </IconButton>
                </Tooltip>
              )}

              {CustomAction != null && (
                <span className="ml-12" style={{ display: "contents" }}>
                  <CustomAction dataRow={row}></CustomAction>
                </span>
              )}
            </span>
          );
        },
      },
    ];
  }

  async onExportClick() {
    if (this.state.elementAnchorMenu == null) {
      return;
    }
    NewExcelComponent.preload();

    this.setState({ menuExportDisabled: true });
    await this.props.fetchAllData();
    this.setState(
      {
        elementAnchorMenu: null,
        menuExportDisabled: false,
      },
      () => {
        this.refExportExcel.current?.click();
      },
    );
  }

  // console.log('midpage =>');

  render() {
    const { classes, t, access, model } = this.props;
    const href = window.location.pathname.split("/");
    const generalConfig: GeneralConfig = data[`/${href[1]}/${href[2]}`];
    const title = t(href[1]);
    const title2 = t(href[2]);
    document.title = `${process.env.REACT_APP_WEBSITE_NAME!} | ${title2}`;

    if (model.loading) {
      return <FuseLoading />;
    }

    if (this.state.isLoadingSyncDevice) {
      return <FuseLoading />
    }

    // const res = await axios.get('/api/area/findAndCount?&filter[order]=areaName+asc')

    // console.log('generalConfig', generalConfig);

    // console.log('midpage =>');
    // console.log('state', this.state);
    // console.log('listIcons =>', listIcons());
    console.log('this.state.isLoadingSyncDevice', this.state.isLoadingSyncDevice)


    return (
      <React.Fragment>
        <FusePageCarded
          classes={{
            root: classes.layoutRoot,
          }}
          header={<HeaderComponent breadcrumbs={[title, title2]} titlePage={title2} />}
          contentToolbar={
            <div className="mx-24">
              <Typography variant="h5" color="textPrimary">
                {title2}
              </Typography>
            </div>
          }
          content={
            <div className="m-16">
              <AccordionSearch
                onClearSearch={() => {
                  this.props.clearField();
                  this.props.clearFilter();
                }}
                onSearch={this.props.filterData}
              >
                <Grid container spacing={2}>
                  {this.props.formMaker.searchField().map((item, index) => {
                    return fieldCreator.createField(index, item, this.props.setValue, false);
                  })}
                </Grid>
              </AccordionSearch>

              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      {access.addRule && (
                        <Button
                          variant="contained"
                          color="primary"
                          component={Link}
                          to={{ pathname: `/${href[1]}/${href[2]}/add` }}
                          startIcon={<Icon icon="mdi:plus" />}
                        >
                          Tambah
                        </Button>
                      )}

                    </Grid>
                    <Grid item>
                      {/* Edit di sini */}
                      {generalConfig.model === 'device' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          // component={Link}
                          // to={{ pathname: `/${href[1]}/${href[2]}/add` }}
                          onClick={async () => await this.onSyncDevice()}
                          startIcon={<Icon icon="mdi:sync" />}
                        >
                          Sync Perangkat
                        </Button>
                      )}

                    </Grid>
                  </Grid>

                </Grid>
                <Grid item>
                  <IconButton
                    aria-haspopup="true"
                    onClick={(e) => {
                      this.setState({ elementAnchorMenu: e.currentTarget });
                    }}
                  >
                    <Icon icon="mdi:dots-vertical" />
                  </IconButton>

                  <Menu
                    anchorEl={this.state.elementAnchorMenu}
                    keepMounted
                    open={Boolean(this.state.elementAnchorMenu)}
                    onClose={() => this.setState({ elementAnchorMenu: null })}
                  >
                    <MenuItem onClick={async () => await this.onExportClick()}>
                      <ListItemIcon style={{ minWidth: "44px" }}>
                        <Icon icon="mdi:export" width="24" height="24" />
                      </ListItemIcon>
                      <ListItemText primary={t("export")} />

                      <ExportExcelComponent
                        ref={this.refExportExcel}
                        filename={title2}
                        data={this.props.model.allData}
                        style={{ display: "none" }}
                      />
                    </MenuItem>
                    {this.props.model.isImportEnabled && access.addRule && (
                      <Link to={`/import/add/${this.props.model.model}`}>
                        <MenuItem disabled={!access.addRule}>
                          <ListItemIcon style={{ minWidth: "44px" }}>
                            <Icon icon="mdi:import" width="24" height="24" />
                          </ListItemIcon>
                          <ListItemText primary={t("import")} />
                        </MenuItem>
                      </Link>
                    )}
                  </Menu>
                </Grid>
              </Grid>

              <div className="mt-16" />

              {generalConfig.prependContentTable != null && (
                <div className="mb-16">
                  <generalConfig.prependContentTable />
                </div>
              )}

              <MyMaterialTable
                columns={[...this.getColumns(), ...this.props.formMaker.tableHeaderColumn()] as any}
                totalCount={this.props.model.data.count}
                data={this.props.model.data.rows}
                isLoading={this.props.model.spinner}
                actions={access.deleteRule ? this.state.actions : []}
                options={{
                  selection: access.deleteRule,
                }}
                initOrderBy={this.props.model.filter.sortColumn}
                initSortDirection={this.props.model.filter.sortDirection}
                components={{
                  Pagination: (props) => {
                    return (
                      <td>
                        <Pagination
                          showTotal={(total, range) => `${range[0]} - ${range[1]} dari ${total} baris`}
                          className="ant-pagination my-16 mx-12"
                          onChange={this.props.setPage}
                          current={this.props.model.filter.page}
                          total={this.props.model.data.count}
                          pageSize={this.props.model.filter.limit}
                          locale={localeInfo}
                        />
                      </td>
                    );
                  },
                }}
              />

              {generalConfig.appendContentTable != null && (
                <div className="mt-16">
                  <generalConfig.appendContentTable></generalConfig.appendContentTable>
                </div>
              )}
            </div>
          }
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  initModel: Model.initModel,
  fetchData: Model.fetchData,
  fetchAllData: Model.fetchAllData,
  deleteData: Model.deleteData,
  filterData: Model.filterData,
  clearFilter: Model.clearFilter,
  sortColumn: Model.sortColumn,
  setPage: Model.setPage,
  addField,
  getOptions,
  setValue,
  resetField,
  clearField,
  showMessage: Actions.showMessage
};

const mapStateToProps = (state: RootState) => {
  return {
    access: state.globalReducer.pageRule,
    formMaker: state.formMaker,
    model: state.model,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles, { withTheme: true })(withTranslation()(ViewMid)));
