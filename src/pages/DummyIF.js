import React, { Component } from "react";
import { DataTable } from "primereact/components/datatable/DataTable";
import { Column } from "primereact/components/column/Column";
import { Button } from "primereact/components/button/Button";
import { SelectButton } from "primereact/selectbutton";
import { ToggleButton } from "primereact/togglebutton";
import { InputTextarea } from "primereact/inputtextarea";
import { Messages } from "primereact/messages";
import { Dialog } from "primereact/components/dialog/Dialog";
import { InputText } from "primereact/components/inputtext/InputText";
import { CommonService } from "../service/CommonService";
import { LoginService } from "../service/LoginService";

export class DummyIF extends Component {
  constructor() {
    super();
    this.state = {
      selectedSystemId: null,
      selectedSystem: null,
      systems: [],

      newDummy: false,
      dummy: null,
      dummies: [],
      visibleconfirmDelete: false,

      elemChecked: null,
      expandedRows: null,
    };

    this.loginService = new LoginService();
    this.commonService = new CommonService();
    this.headerTemplate = this.headerTemplate.bind(this);
    this.footerTemplate = this.footerTemplate.bind(this);
    this.actionStatus = this.actionStatus.bind(this);
    this.actionEdit = this.actionEdit.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.setResJson = this.setResJson.bind(this);
    this.updateProperty = this.updateProperty.bind(this);
    this.findSelectedIndex = this.findSelectedIndex.bind(this);

    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.duplicate = this.duplicate.bind(this);
    this.delete = this.delete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);

    this.elemChecked = null;
    this.dummyEditKey = null;
    this.dummySelected = null;
  }

  componentDidMount() {
    // const userSession = JSON.parse(window.sessionStorage.getItem('user'));
    const userSession = window.sessionStorage.getItem("userToken");

    if (userSession != null) {
      this.loginService.getSession().then((data) => {
        let user = null;

        if (data.role === "A") {
          user = {
            id: data.id,
            role: data.role,
          };
        } else {
          user = {
            id: data.id,
            system_id: data.system_id,
            role: data.role,
          };
        }

        this.commonService.getSystems(user).then((data) => {
          //console.log('componentDidMount>getSystems>data:', data);
          let array = [];
          data.forEach(function(element) {
            //console.log(element);
            array.push({ label: element.systemNm, value: element.systemId });
          });
          //this.systems = data;
          this.setState({
            systems: array,
          });
        });
      });
    } else {
      window.alert("로그인이 필요합니다.");
    }
  }

  getDummies(systemId) {
    this.setState({ selectedSystemId: systemId });

    this.commonService.getDummies(systemId).then((data) => {
      // console.log('getDummies>getDummies', data);
      this.setState({ dummies: data.data });
    });
  }

  headerTemplate(data) {
    return (
      <Button style={{ float: "left" }} label={data.ifNm} icon="pi pi-plus" />
    ); //onClick={this.addNew}
    //return data.ifId;
  }

  footerTemplate(data, index) {
    return <React.Fragment></React.Fragment>;
  }

  actionStatus(rowData, column) {
    let id = rowData.ifSeq;
    // let isActive = this.state[id];
    let isActive = rowData.active === "Y" ? true : false;
    if (
      this.elemChecked &&
      rowData.ifId === this.elemChecked.group &&
      rowData.ifSeq !== this.elemChecked.id &&
      isActive
    ) {
      this.setState({
        [id]: false,
      });
      isActive = false;
      rowData.active = "N";
      // console.log('actionStatus>actionStatus>'+id+':', isActive);

      this.commonService.setStateDummy(rowData).then((data) => {
        //console.log('save>setDummy', data);
      });
    }
    // console.log('actionStatus>'+id+':', isActive, this.elemChecked);

    return (
      <ToggleButton
        id={id}
        checked={isActive}
        onLabel="활성"
        offLabel="비활성"
        onIcon="pi pi-check"
        offIcon="pi pi-times"
        onChange={(e) => {
          this.setState({
            [id]: e.value,
          });
          this.elemChecked = e.value ? { id: e.target.id } : null;

          rowData.active = isActive ? "N" : "Y";
          // console.log('actionStatus>ToggleButton>'+e.target.id+':',e.value);

          this.commonService.setStateDummy(rowData).then((data) => {
            //console.log('actionStatus>setDummy', data);
          });
        }}
      />
    );
  }

  actionEdit(rowData, column) {
    let id = rowData.ifSeq;
    //console.log('actionEdit:', rowData, column, this.findSelectedIndex());
    return (
      <ToggleButton
        id={id}
        checked={true}
        onLabel="수정"
        onIcon="pi pi-pencil"
        offIcon="pi pi-times"
        onChange={(e) => {
          this.dummyEditKey = e.target.id;
          // console.log('actionEdit>ToggleButton>onChange:', this.findSelectedIndex(), e.target);

          this.setState({
            displayDialog: true,
            dummy: Object.assign({}, rowData),
          });
        }}
      />
    );
  }

  onSelect(e) {
    // console.log('onSelect:', e, this.findSelectedIndex());
    if (this.elemChecked && e.data.ifSeq === this.elemChecked.id)
      this.elemChecked.group = e.data.ifId;

    // let showEdit = false;
    // if(this.dummyEditKey && e.data.ifSeq===this.dummyEditKey) {
    //     //this.dummyEditKey= null;
    //     showEdit = true;
    // }

    this.dummySelected = e.data;
  }

  setResJson() {
    let resJson = this.state.dummy.resJson;
    if (resJson == null) return "";
    let json;
    try {
      json = JSON.parse(resJson);
    } catch (err) {
      this.messages.show({
        severity: "error",
        summary: "Error Message",
        detail: err.message,
      });
      return resJson;
    }
    return JSON.stringify(json, undefined, 2);
  }

  updateProperty(id, val) {
    // console.log('updateProperty('+id+','+val+'):',this.findSelectedIndex(),this.state.dummy);
    let dummy = this.state.dummy;
    dummy[id] = val;
    this.setState({
      dummy: dummy,
      displayDialog: true,
    });
  }

  /** 
    addNew() {
        console.log('addNew:', this.findSelectedIndex(), this.state.dummies);
        this.state.newDummy = true;
        this.setState({
            dummy: {ifSeq:0, ifNm: '', dummyNm: '', ifId: '', active: ''},
            displayDialog: true
        });
    }
    **/

  duplicate() {
    this.setState({ newDummy: true });
  }

  save() {
    // console.log('save('+this.state.newDummy+'):', this.findSelectedIndex(), this.state.dummy);

    let dummies = [...this.state.dummies];
    this.commonService
      .setDummy(this.state.newDummy, this.state.dummy)
      .then((data) => {
        // this.setState({newDummy: false});
        if (this.state.newDummy) {
          let dummy = Object.assign({}, this.state.dummy);
          dummy.ifSeq = data.ifSeq;
          dummies.push(dummy);
        } else dummies[this.findSelectedIndex()] = this.state.dummy;

        this.setState({
          dummies: dummies,
          selectedSystem: null,
          newDummy: false,
          dummy: null,
          displayDialog: false,
        });

        // console.log('save>setDummy', data);
      });
  }

  confirmDelete() {
    // console.log('confirmDelete('+this.state.newDummy+'):', this.findSelectedIndex(), this.state.dummy);

    if (this.state.newDummy) {
      this.setState({
        selectedSystem: null,
        newDummy: false,
        dummy: null,
        displayDialog: false,
      });
      return;
    }

    this.setState({ visibleconfirmDelete: true });
  }

  delete() {
    // console.log('deleteDummy:', this.findSelectedIndex(), this.state.dummy);

    let dummies = [...this.state.dummies];
    this.commonService.deleteDummy(this.state.dummy).then((data) => {
      // this.setState({newDummy: false});
      dummies.splice(this.findSelectedIndex(), 1);
      this.setState({
        dummies: dummies,
        selectedSystem: null,
        newDummy: false,
        dummy: null,
        visibleconfirmDelete: false,
        displayDialog: false,
      });

      //console.log('deleteDummy>confirmDeleteDummy', data);
    });
  }

  cancel() {
    this.setState({
      selectedSystem: null,
      newDummy: false,
      dummy: null,
      displayDialog: false,
    });
  }

  findSelectedIndex() {
    // console.log('findSelectedIndex:', this.dummyEditKey);
    let idx = -1;
    let key = this.dummyEditKey;
    this.state.dummies.forEach((dummy, index) => {
      if (dummy.ifSeq === key) {
        idx = index;
        return index;
      }
    });

    return idx;
    // return this.state.dummies.indexOf(this.state.selectedDummy);    //selectedSystem
  }

  render() {
    let header = "";

    let dialogFooter = (
      <div className="ui-dialog-buttonpane p-clearfix">
        <Button label="닫기" icon="pi pi-times" onClick={this.cancel} />
        <Button label="저장" icon="pi pi-check" onClick={this.save} />
        <Button label="복사" icon="pi pi-check" onClick={this.duplicate} />
        <Button label="삭제" icon="pi pi-check" onClick={this.confirmDelete} />
      </div>
    );

    const confirmDeleteFooter = (
      <div>
        <Button label="삭제" icon="pi pi-check" onClick={this.delete} />
        <Button
          label="취소"
          icon="pi pi-times"
          onClick={() => this.setState({ visibleconfirmDelete: false })}
        />
      </div>
    );

    return (
      <div>
        <div className="content-section introduction">
          <div className="feature-intro">
            <h1>중계서버 Dummy 응답 제어판</h1>
            <p>
              각 인터페이스별 Dummy 응답을 추가/수정 및 활성화 시킬수 있습니다.
            </p>
          </div>
        </div>

        <div className="content-section implementation">
          <h3>조회할 시스템을 선택하세요!</h3>
          <SelectButton
            value={this.state.selectedSystemId}
            options={this.state.systems}
            onChange={(e) => this.getDummies(e.value)}
          />
          <br />

          <DataTable
            header={header} //footer={footer}
            selectionMode="multi"
            selection={this.state.selectedDummy}
            onSelectionChange={(e) => this.setState({ selectedDummy: e.value })}
            onRowSelect={this.onSelect}
            value={this.state.dummies}
            rowGroupMode="subheader"
            sortField="ifNm"
            sortOrder={1}
            groupField="ifId"
            rowGroupHeaderTemplate={this.headerTemplate}
            rowGroupFooterTemplate={this.footerTemplate}
            expandableRowGroups={true}
            expandedRows={this.state.expandedRows}
            onRowToggle={(e) => this.setState({ expandedRows: e.data })}
          >
            <Column
              body={this.actionStatus}
              style={{ textAlign: "center", width: "10em" }}
            />
            <Column field="ifId" header="ID" />
            <Column field="dummyNm" header="Dummy" />
            <Column
              body={this.actionEdit}
              style={{ textAlign: "center", width: "8em" }}
            />
          </DataTable>

          <Dialog
            visible={this.state.displayDialog}
            style={{ width: "500px" }}
            header="Dummy 인터페이스 상세"
            modal={true}
            footer={dialogFooter}
            onHide={() =>
              this.setState({ newDummy: false, displayDialog: false })
            }
            blockScroll={true}
          >
            {this.state.dummy && (
              <div className="p-grid p-fluid">
                <div className="p-col-12" style={{ padding: ".5em" }}>
                  ( {this.state.dummy.ifNm} )
                </div>

                {this.state.newDummy && (
                  <>
                    <div className="p-col-4" style={{ padding: ".75em" }}>
                      <label htmlFor="ifId">ID</label>
                    </div>
                    <div className="p-col-8" style={{ padding: ".5em" }}>
                      <InputText
                        id="ifId"
                        onChange={(e) => {
                          this.updateProperty("ifId", e.target.value);
                        }}
                        value={this.state.dummy.ifId}
                      />
                    </div>
                  </>
                )}

                <div className="p-col-4" style={{ padding: ".75em" }}>
                  <label htmlFor="dummyNm">Dummy</label>
                </div>
                <div className="p-col-8" style={{ padding: ".5em" }}>
                  <InputText
                    id="dummyNm"
                    onChange={(e) => {
                      this.updateProperty("dummyNm", e.target.value);
                    }}
                    value={this.state.dummy.dummyNm}
                  />
                </div>

                <div className="p-col-4" style={{ padding: ".75em" }}>
                  <label htmlFor="active">JSON</label>
                </div>
                <div className="p-col-8" style={{ padding: ".5em" }}>
                  <InputTextarea
                    id="resJson"
                    rows={15}
                    cols={50}
                    onChange={(e) => {
                      this.updateProperty("resJson", e.target.value);
                    }}
                    value={this.setResJson()}
                  />
                </div>

                <Messages ref={(el) => (this.messages = el)} />

                <Dialog
                  header="삭제"
                  footer={confirmDeleteFooter}
                  visible={this.state.visibleconfirmDelete}
                  style={{ width: "25vw" }}
                  modal={true}
                  onHide={() => this.setState({ visibleconfirmDelete: false })}
                >
                  Dummy 인터페이스를 삭제하시겠습니까?
                </Dialog>
              </div>
            )}
          </Dialog>
        </div>
      </div>
    );
  }
}
