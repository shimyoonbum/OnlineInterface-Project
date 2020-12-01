import React, { Component } from 'react';
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Button} from 'primereact/components/button/Button';
import {Calendar} from 'primereact/components/calendar/Calendar';
import {InputTextarea} from 'primereact/inputtextarea';
import {MultiSelect} from 'primereact/multiselect';
import {CommonService} from '../service/CommonService';
import {LoginService} from '../service/LoginService';
import classNames from 'classnames';
import "../sass/resources/style/DataTable.scss";

export class IFLogs extends Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            first: 0,
            rows: 10,
            totalRecords: 0,
            expandedRows: null,
            logs: null,
            globalFilter: null,
            dateFilter: null,
            retrievedRows: {},
            ipaddress: '',
            systems: [],
            interfaces: [],
            statuses: [],
            dummys: []
        };

        this.commonService = new CommonService();
        this.loginService = new LoginService();
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);

        //body cells
        this.dummyBodyTemplate = this.dummyBodyTemplate.bind(this);
        this.statusBodyTemplate = this.statusBodyTemplate.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);

        //filters
        this.onDateFilterChange = this.onDateFilterChange.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.statusItemTemplate = this.statusItemTemplate.bind(this);

        this.onExpandRow = this.onExpandRow.bind(this);
        this.onPage = this.onPage.bind(this);

        this.retrievedRows = {};
        this.systems = null;
        this.interfaces = null;
        this.statuses = null;
        this.statusNm = {};        
        this.dummys = [
            {"dummyNm": "정상", "dummyId": "N"},
            {"dummyNm": "DUMMY", "dummyId": "Y"}
        ];
    }

    componentDidMount() {             
        const userSession = window.sessionStorage.getItem('userToken');

        if(userSession != null){
            this.loginService.getSession().then(data => {

                let searchDates = [];
                let d = new Date();
                d.setDate(d.getDate() - 6);
                searchDates[0] = d;
                searchDates[1] = new Date();
                this.setState({searchDates: searchDates});
                this.setState({dummys: this.dummys});         
                
                if(data.id == "N"){     
                    this.setState({loading: false});  

                }else{                
                    let user = null;
    
                    setTimeout(() => {
                        this.getLogs(0);
                    }, 1000);
                    
                    document.getElementById("interface").style.display = "block";    
                    document.getElementById("searchBtn").style.display = "block";   
    
                    if(data.role == "A"){
                        document.getElementById("system").style.display = "block";      
                        user={
                            'id':data.id,
                            'role':data.role
                        };              
                    }else{
                        user={
                            'id':data.id,
                            'system_id':data.system_id,
                            'role':data.role
                        }; 
                    }          
                    this.commonService.getSystems(user).then(data => {
                        // console.log('componentDidMount>getSystems>data:', data);
                        this.systems = data;
                        this.setState({
                            systems: data
                        });
                    });               
            
                    this.commonService.getInterfaces(user).then(data => {
                        // console.log('componentDidMount>getInterfaces>data:', data);
                        this.interfaces = data;
                        this.setState({
                            interfaces: data
                        });
                    });
            
                    this.commonService.getStatuses().then(data => {
                        // console.log('componentDidMount>getStatuses>data:', data);
                        for(let status of data)
                            this.statusNm[status.statusId] = status.statusNm;
            
                        this.statuses = data;
                        this.setState({
                            statuses: data
                        });
                    });                                            
                }                            
            });
        }else{
            this.setState({loading: false});                
            alert("로그인이 필요합니다.");
        }  
    }

    getLogs(startRow) {
        let param = {
            startRow: startRow, 
            endRow: startRow+this.state.rows,
            dateFrom: this.formatDateToString('Ymd', this.state.searchDates[0]),
            dateTo: this.formatDateToString('Ymd', this.state.searchDates[1]),
            systems: this.state.systems,
            interfaces: this.state.interfaces,
            ipaddress: this.state.ipaddress,
            statuses: this.state.statuses,
            dummys: this.state.dummys
        };

        this.commonService.getLogs(param).then(data => {
            // console.log('componentDidMount>getLogs>data:', data);
            this.datasource = data.data;
            this.setState({
                totalRecords: data.total,
                first: param.startRow,
                logs: this.datasource.slice(0, this.state.rows),
            });

            this.setState({loading: false});  
        })
    }

    onSearch(e) {
        this.getLogs(0);
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

    onPage(event) {
        this.setState({
            loading: true
        });

        //imitate delay of a backend call
        setTimeout(() => {
            this.getLogs(event.first);

            // this.setState({
            //     first: startIndex,
            //     logs: this.datasource.slice(startIndex, endIndex),
            //     loading: false
            // });
        }, 250);
    }

    onExpandRow(e) {
        let data = e.expandedRows;
        //console.log('onExpandRow>data:',data);
        let keys = Object.keys(data);
        let key;
        let found = false;
        for(let i in keys) {
            key = keys[i];
            //console.log('onExpandRow>key:'+i+','+key);
            if(!this.state.retrievedRows[key]) {
                found = true;
                break;
            }
        }
        if(!found) {
            this.setState({expandedRows:data});
            return;
        }
        console.log('onExpandRow:'+key);
        this.commonService.getLog(key).then(res => {
            this.retrievedRows[key] = res;
            this.setState({retrievedRows:this.retrievedRows, expandedRows:data});
        });
    }

    renderHeader() {
        return (
            <div className="content-section introduction">
                <div className="feature-intro">
                    <h1>인터페이스 로그 조회</h1>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{flex: '1'}}>
                            <div style={{textAlign: 'left'}}>
                                <div style={{padding: '0px 0px 0px 55px'}}>전송 일자</div>
                                <Calendar value={this.state.searchDates} onChange={(e) => this.setState({searchDates: e.value} )} 
                                selectionMode="range" dateFormat="yy-mm-dd" readOnlyInput={true}/></div>
                                <div id="system" style={{display: 'none', textAlign: 'left'}}>
                                <div style={{padding: '13px 0px 0px 45px'}}>시스템</div>
                                <MultiSelect style={{width: '150px'}} optionLabel="systemNm" value={this.state.systems} options={this.systems} 
                                onChange={(e) => this.setState({systems: e.value})} />
                            </div> {/* optionValue="code" */}
                        </div>
                        <div style={{flex: '1'}}>
                            <div id="interface" style={{display: 'none', textAlign: 'left'}}>
                                <div style={{padding: '0px 0px 0px 55px'}}>인터페이스</div>
                                <MultiSelect style={{width: '180px'}} optionLabel="interfaceNm" value={this.state.interfaces} 
                                options={this.interfaces} onChange={(e) => this.setState({interfaces: e.value})}/></div>
                                <div style={{textAlign: 'left'}}>
                                <div style={{padding: '10px 0px 0px 65px'}}>전송IP</div>    
                                <InputText style={{width: '180px'}} type="search" onInput={(e) => this.setState({ipaddress: e.target.value} )} placeholder="127.0.0.1"/>
                            </div>
                        </div>
                        <div style={{flex: '1'}}>    
                            <div style={{textAlign: 'left'}}>
                                <div style={{padding: '0px 0px 0px 40px'}}>처리결과</div>    
                                <MultiSelect style={{width: '150px'}} optionLabel="statusNm" 
                                value={this.state.statuses} options={this.statuses} onChange={(e) => this.setState({statuses: e.value})}/></div>
                                <div style={{textAlign: 'left'}}>
                                <div style={{padding: '10px 0px 0px 30px'}}>Dummy여부</div>    
                                <MultiSelect style={{width: '150px'}} optionLabel="dummyNm" 
                                value={this.state.dummys} options={this.dummys} onChange={(e) => this.setState({dummys: e.value})}/>
                            </div>
                        </div>

                        <div id="searchBtn" style={{display: 'none', marginRight:'20px'}}>
                            <Button style={{marginTop: '40px', height:'50px'}} label="검색" onClick={(e) => this.onSearch(e)} className="p-button-raised p-button-rounded" />
                        </div>
                                               
                    </div>
                </div>
            </div>
        );
    }

    rowExpansionTemplate(e) {
        //console.log('rowExpansionTemplate:', data);
        let data= this.state.retrievedRows[e.ifSeq];
        if(!data) {
            alert('rowExpansionTemplate: Can not found '+e.ifSeq+' in retrievedRows!');
            return;
        }
        data.url = data.method+':'+data.uri+(data.param? '?'+data.param:'');
        data.reqJson = JSON.stringify(JSON.parse(data.reqJson), undefined, 2);
        data.resJson = JSON.stringify(JSON.parse(data.resJson), undefined, 2);
 
        return  (
            <div className="p-grid p-fluid" style={{padding: '2em 1em 1em 1em'}}>
                <div className="p-col-12 p-md-9">
                    <div className="p-grid" style={{width:'100%'}}>
                        <div className="p-md-2">URL: </div>
                        <div className="p-md-10" style={{fontWeight:'bold'}}>{data.url}</div>

                        <div className="p-carousel-items-container" style={{width:'100%'}}>
                            <div className="p-md-2">요청: </div>
                            <InputTextarea rows={5} value={data.reqJson} autoResize={false} style={{overflow:'scroll', width:'100%'}} readOnly/>
                        </div>

                        <div className="p-carousel-items-container" style={{width:'100%'}}>
                            <div className="p-md-2">응답: </div>
                            <InputTextarea rows={5} value={data.resJson} autoResize={false} style={{overflow:'scroll', width:'100%'}} readOnly/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    actionBodyTemplate() {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>
        );
    }

    statusBodyTemplate(rowData) {
        return <span className={classNames('interface-badge', 'status-' + rowData.ifResult)}>{this.statusNm[rowData.ifResult]}</span>;
    }

    dummyBodyTemplate(rowData) {
        return (
            <>
                <span style={{verticalAlign: 'middle', marginLeft: '.5em'}}>{rowData.isDummy==='Y'?'O':''}</span>
            </>
        );
    }

    renderDateFilter() {
        return (
            <Calendar value={this.state.dateFilter} onChange={this.onDateFilterChange} placeholder="Registration Date" dateFormat="yy-mm-dd" className="p-column-filter" />
        );
    }

    onDateFilterChange(event) {
        if (event.value !== null)
            this.dt.filter(this.formatDate(event.value), 'ifDate', 'equals');
        else
            this.dt.filter(null, 'ifDate', 'equals');

        this.setState({dateFilter: event.value});
    }

    filterDate(value, filter) {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === this.formatDate(filter);
    }

    formatDate(ifDate) {
        let month = ifDate.getMonth() + 1;
        let day = ifDate.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return ifDate.getFullYear() + '-' + month + '-' + day;
    }

    statusItemTemplate(option) {
        return (
            <span className={classNames('interface-badge', 'status-' + option)}>{option}</span>
        );
    }

    render() {
        const header = this.renderHeader();
        //const dateFilter = this.renderDateFilter();

        return (
            <div className="datatable-doc-demo">
                <div className="content-section implementation">
                    <DataTable ref={(el) => this.dt = el} value={this.state.logs}
                        header={header} responsive className="p-datatable-logs" rowHover 
                        globalFilter={this.state.globalFilter} 
                        emptyMessage="No logs found" 
                        paginator={true} rows={this.state.rows} totalRecords={this.state.totalRecords} first={this.state.first} onPage={this.onPage} loading={this.state.loading} lazy={true}
                        currentPageReportTemplate="{totalRecords}건 중 {first}에서 {last}까지 조회"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" //rowsPerPageOptions={[10,25,50]}
                        expandedRows={this.state.expandedRows} onRowToggle={(e) => this.onExpandRow({expandedRows:e.data})} rowExpansionTemplate={this.rowExpansionTemplate} dataKey="ifSeq"
                    >
                        <Column expander={true} style={{width: '4em', overflow: 'auto'}} />
                        <Column field="ifDate" header="전송일자" style={{overflow: 'auto'}} sortable />
                        <Column field="systemNm" header="시스템" style={{overflow: 'auto'}} sortable />
                        <Column field="ifId" header="ID" style={{overflow: 'auto'}} sortable />
                        <Column field="ifNm" header="인터페이스" style={{overflow: 'auto'}} sortable />
                        <Column field="client" header="전송IP" style={{overflow: 'auto'}} sortable />
                        <Column field="ifResult" header="처리결과" style={{overflow: 'auto'}} body={this.statusBodyTemplate} sortable />
                        <Column field="serverId" header="서버ID" style={{overflow: 'auto'}} sortable />
                        <Column field="isDummy" header="Dummy여부" style={{overflow: 'auto'}} body={this.dummyBodyTemplate} sortable />
                    </DataTable>
                </div>
            </div>
        );
    }
}
