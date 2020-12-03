import React, { Component } from 'react';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {Button} from 'primereact/components/button/Button';
import {Calendar} from 'primereact/components/calendar/Calendar';
import {Dialog} from 'primereact/components/dialog/Dialog';
import { Dropdown } from 'primereact/dropdown';
import {BackUpService} from '../service/BackUpService';
import {LoginService} from '../service/LoginService';
import {InputText} from "primereact/components/inputtext/InputText";
import "../sass/resources/style/DataTable.scss";
import "../resources/css/IFBackup.css"

export class IFBackup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            logs: null,
            tableNm: null,     
            searchDates: null,             
            selectedLogs: null,
            first: 0,
            rows: 10,
            totalRecords: 0,
            option : [],
            displayConfirmation: false,            
            position: 'center'            
            // checked: false
        };

        this.tables = [];

        this.columns = [];

        this.backUpService = new BackUpService();
        this.loginService = new LoginService();

        this.onPage = this.onPage.bind(this);

        this.optionTemplete = this.optionTemplete.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onHide = this.onHide.bind(this);
        // this.onCheck = this.onCheck.bind(this);
    }

    componentDidMount() {
        
        const userSession = window.sessionStorage.getItem('userToken');

        if(userSession != null){
            this.loginService.getSession().then(data => {

                if(data.role == "A"){
                    let searchDates = [];
                    let d = new Date();
                    d.setDate(d.getDate() - 30);
                    searchDates[0] = d;
                    searchDates[1] = new Date();
                    this.setState({searchDates: searchDates});

                    document.getElementById("recoverBtn").style.display = "block";    
                    document.getElementById("searchBtn").style.display = "block"; 

                    this.backUpService.getTableList().then(data => {  
                        // console.log(data);  
                        this.tables = data;

                        this.setState({tableNm: data})
                    });
                }else{
                    alert("메뉴 사용 권한이 없습니다. 관리자에게 문의 바랍니다!"); 
                }
            });
        }else{                            
            alert("로그인이 필요합니다.");
        }
    }    

    onClick(name, position) {
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    renderFooter(name) {
        return (
            <div>
                <Button label="취소" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-danger" />
                <Button label="복구" icon="pi pi-check" onClick={() => this.onRecovery()} className="p-button-text" autoFocus />
            </div>
        );
    }

    handleClick(){
        this.setState({option: [] })
    }

    onPage(event) {
        setTimeout(() => {
            this.getLogs(event.first);
        }, 250);
    }

    getLogs(startRow){
        if(this.state.tableNm.name == null)
            alert("조회할 테이블을 선택해 주세요");
        else{
            let param = null;

            var table = this.state.tableNm.name.toUpperCase();

            if(this.state.option.length == 0){
                param = {           
                    table: table,
                    dateFrom: this.formatDateToString('Ymd', this.state.searchDates[0]) + '000000',
                    dateTo: this.formatDateToString('Ymd', this.state.searchDates[1]) + '235959',
                    startRow: startRow, 
                    endRow: startRow+this.state.rows,
                    option: ""
                };
            }else{
                param = {           
                    table: table,
                    dateFrom: this.formatDateToString('Ymd', this.state.searchDates[0]) + '000000',
                    dateTo: this.formatDateToString('Ymd', this.state.searchDates[1]) + '235959',
                    startRow: startRow, 
                    endRow: startRow+this.state.rows,
                    option: this.state.option
                };
            }
                            
            this.backUpService.getLogs(param).then(data => {                 
                this.columns = data.data2;
                
                this.setState({ 
                    logs: data.data,
                    totalRecords: data.total.CNT,
                    first: param.startRow
                });
            }).catch(error => {
                var errorString = error.response.data.responseMessage.split(';')
                window.alert('SQL 오류 : ' +errorString[2]);                
            });
        }
    }

    onSearch(e) {       
        this.getLogs(0)
    }

    onRecovery(e){
        if(this.state.tableNm.name == null)
            alert("복구할 테이블을 선택해 주세요");
        else if(this.state.totalRecords == 0){
            alert("복구할 데이터가 검색되지 않았습니다!")
        }
        else{
            let param = {           
                table: this.state.tableNm.name.toUpperCase(),
                dateFrom: this.formatDateToString('Ymd', this.state.searchDates[0]) + '000000',
                dateTo: this.formatDateToString('Ymd', this.state.searchDates[1]) + '235959'
            };

            this.backUpService.doRecovery(param).then(() => {                 
                window.alert("백업 데이터 복구 되었습니다.")
                this.onHide('displayConfirmation')
                this.getLogs(0);
            })
        }
    }

    optionTemplete(option) {
        return (
            <div className="country-item">
                <div>{option.tableNm}</div>
            </div>
        );
    }

    renderHeader() {
        return (
            <div className="content-section backup">
                <div className=".backup-intro">
                    <h1>백업 데이터 조회 / 복구</h1>                    
                    <div style={{padding : '10px 0px 0px 20px', textAlign : 'left'}}>백업일자 <Calendar style={{width: '300px', fontSize : 'large', marginLeft : '50px'}} 
                        value={this.state.searchDates} onChange={(e) => this.setState({searchDates: e.value} )} 
                        selectionMode="range" dateFormat="yy-mm-dd" readOnlyInput={true}/></div>
                    <div style={{padding : '10px 0px 0px 20px', textAlign : 'left'}}>테이블 선택 <Dropdown style={{width: '300px', fontSize : 'large' , marginLeft : '33px', textAlign : 'center'}} 
                        optionLabel="name" value={this.state.tableNm} options={this.tables} onChange={(e) => this.setState({tableNm: e.value})} 
                        placeholder="테이블 선택"/>
                    </div>
               
                    <div style={{padding : '10px 0px 0px 20px', textAlign : 'left'}}>
                        검색 조건 입력<InputText id='optionChange' style={{width: '500px', margin : '0px 5px 0px 5px' , marginLeft : '19px'}} 
                        value={this.state.option} onChange={(e) => this.setState({option: e.target.value})}/> 
                        
                        <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" style={{width:'27px', height:'27px'}} onClick={this.handleClick}/> 

                        <Dialog header="Confirmation" visible={this.state.displayConfirmation} modal style={{ width: '350px' }} footer={this.renderFooter('displayConfirmation')} onHide={() => this.onHide('displayConfirmation')}>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '1rem' }} />
                                <span>복구 진행 하시겠습니까?</span>
                            </div>
                        </Dialog>
                    </div>                    

                    <div style={{display: 'flex', paddingTop : '10px'}}>
                        <div id="searchBtn" style={{flex: '1', textAlign : 'start', display : 'none', margin : '10px 10px 0px 10px', fontSize : '16px'}}>
                            <Button style={{width: '150px'}} label="검색" onClick={(e) => this.onSearch(e)} className="p-button-success" />
                        </div>
                        <div id="recoverBtn" style={{flex: '7', textAlign : 'start', display : 'none', margin : '10px 10px 0px 10px', fontSize : '16px'}}>
                            <Button style={{width: '150px'}} label="복구" onClick={() => this.onClick('displayConfirmation')} className="p-button-success" />
                        </div>
                    </div>                       
                    
                </div>
            </div>
        );
    }

    formatDateToString(format, date) {
        if (!format) { format = 'Y-m-d' }
        if (!date) { date = new Date() }
      
        const parts = {
          Y: date.getFullYear().toString(),
          y: ('00' + (date.getYear() - 100)).toString().slice(-2),
          m: ('0' + (date.getMonth() + 1)).toString().slice(-2),
          n: (date.getMonth() + 1).toString(),
          d: ('0' + date.getDate()).toString().slice(-2),
          j: date.getDate().toString(),
          H: ('0' + date.getHours()).toString().slice(-2),
          G: date.getHours().toString(),
          i: ('0' + date.getMinutes()).toString().slice(-2),
          s: ('0' + date.getSeconds()).toString().slice(-2)
        }
      
        const modifiers = Object.keys(parts).join('')
        const reDate = new RegExp('(?<!\\\\)[' + modifiers + ']', 'g')
        const reEscape = new RegExp('\\\\([' + modifiers + '])', 'g')
      
        return format
          .replace(reDate, $0 => parts[$0])
          .replace(reEscape, ($0, $1) => $1)
    }


    render() {
        const header = this.renderHeader();        

        const dynamicColumns = this.columns.map((col,i) => {
            return <Column key={col.field} field={col.field} header={col.field} headerStyle={{ width: '200px' }} style={{overflow: 'auto'}} sortable/>;
        });

        return (     
            <div>
                <div className="datatable-doc-demo">
                    <div className="content-section implementation">
                        <DataTable ref={(el) => this.dt = el}
                            header={header} responsive className="p-datatable-logs" emptyMessage="조회된 항목 없음."                    
	                        value={this.state.logs} scrollable scrollWidth="200px" responsive 
	                        paginator={true} rows={this.state.rows} first={this.state.first} totalRecords={this.state.totalRecords} onPage={this.onPage} lazy={true}
	                        currentPageReportTemplate="{totalRecords}건 중 {first}에서 {last}까지 조회"
	                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" //rowsPerPageOptions={[10,25,50]}
	                        style={{padding: '10px 0px 0px 0px', width: 'auto'}}
	                        selection={this.state.selectedLogs} onSelectionChange={e => this.setState({ selectedLogs: e.value })} 
	                    >
                            {dynamicColumns}
                        </DataTable>
                    </div>
                </div>                
            </div>
        );
    }
}
