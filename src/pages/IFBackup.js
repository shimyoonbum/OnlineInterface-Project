import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { Dropdown } from 'primereact/dropdown';
import { BackUpService } from '../service/BackUpService';
import { LoginService } from '../service/LoginService';
import { InputText } from 'primereact/components/inputtext/InputText';
import '../sass/resources/style/DataTable.scss';
import RecoveryModal from '../modals/RecoveryModal';

const IFBackup = () => {
    const [position, setPosition] = useState('center');
    const [displayConfirmation, setDisplayConfirmation] = useState(false);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [option, setOption] = useState([]);
    const [logs, setLogs] = useState(null);
    const [tableNm, setTableNm] = useState(null);
    const [searchDates, setSearchDates] = useState(null);
    const [selectedLogs, setSelectedLogs] = useState(null);
    const [tables, setTables] = useState([]);
    const [columns, setColumns] = useState([]);

    const backUpService = new BackUpService();
    const loginService = new LoginService();

    const dialogFuncMap = {
        displayConfirmation: setDisplayConfirmation,
    };

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    };

    const onHide = name => {
        dialogFuncMap[`${name}`](false);
    };

    const renderFooter = name => {
        return (
            <div>
                <Button
                    label="취소"
                    icon="pi pi-times"
                    onClick={() => onHide(name)}
                    className="p-button-danger"
                />
                <Button
                    label="복구"
                    icon="pi pi-check"
                    onClick={() => onRecovery()}
                    className="p-button-text"
                    autoFocus
                />
            </div>
        );
    };

    const handleClick = () => {
        setOption([]);
    };

    const onPage = event => {
        setTimeout(() => {
            getLogs(event.first);
        }, 250);
    };

    const getLogs = startRow => {
        if (tableNm.name == null) alert('조회할 테이블을 선택해 주세요');
        else {
            let param = null;

            var table = tableNm.name.toUpperCase();

            if (option.length === 0) {
                param = {
                    table: table,
                    dateFrom:
                        formatDateToString('Ymd', searchDates[0]) + '000000',
                    dateTo:
                        formatDateToString('Ymd', searchDates[1]) + '235959',
                    startRow: startRow,
                    endRow: startRow + rows,
                    option: '',
                };
            } else {
                param = {
                    table: table,
                    dateFrom:
                        formatDateToString('Ymd', searchDates[0]) + '000000',
                    dateTo:
                        formatDateToString('Ymd', searchDates[1]) + '235959',
                    startRow: startRow,
                    endRow: startRow + rows,
                    option: option,
                };
            }

            backUpService
                .getLogs(param)
                .then(data => {
                    setColumns(data.data2);
                    setLogs(data.data);
                    setTotalRecords(data.total.CNT);
                    setFirst(param.startRow);
                })
                .catch(error => {
                    var errorString = error.response.data.responseMessage.split(
                        ';',
                    );
                    window.alert('SQL 오류 : ' + errorString[2]);
                });
        }
    };

    const onSearch = e => {
        getLogs(0);
    };

    const onRecovery = e => {
        if (tableNm.name == null) alert('복구할 테이블을 선택해 주세요');
        else if (totalRecords === 0) {
            alert('복구할 데이터가 검색되지 않았습니다!');
        } else {
            let param = {
                table: tableNm.name.toUpperCase(),
                dateFrom: formatDateToString('Ymd', searchDates[0]) + '000000',
                dateTo: formatDateToString('Ymd', searchDates[1]) + '235959',
            };

            backUpService.doRecovery(param).then(() => {
                window.alert('백업 데이터 복구 되었습니다.');
                onHide('displayConfirmation');
                getLogs(0);
            });
        }
    };

    const formatDateToString = (format, date) => {
        if (!format) {
            format = 'Y-m-d';
        }
        if (!date) {
            date = new Date();
        }

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
            s: ('0' + date.getSeconds()).toString().slice(-2),
        };

        const modifiers = Object.keys(parts).join('');
        const reDate = new RegExp('(?<!\\\\)[' + modifiers + ']', 'g');
        const reEscape = new RegExp('\\\\([' + modifiers + '])', 'g');

        return format
            .replace(reDate, $0 => parts[$0])
            .replace(reEscape, ($0, $1) => $1);
    };

    useEffect(() => {
        session();
    }, []);

    const session = () => {
        const userSession = window.sessionStorage.getItem('userToken');

        if (userSession != null) {
            loginService.getSession().then(data => {
                let userInfo = data.data.user;
                if (userInfo.role === 'ADMIN') {
                    let searchDates = [];
                    let d = new Date();
                    d.setDate(d.getDate() - 7);
                    searchDates[0] = d;
                    searchDates[1] = new Date();
                    setSearchDates(searchDates);

                    document.getElementById('recoverBtn').style.display =
                        'block';
                    document.getElementById('searchBtn').style.display =
                        'block';

                    backUpService.getTableList().then(data => {
                        setTables(data);
                        setTableNm(data);
                    });
                } else {
                    alert('메뉴 사용 권한이 없습니다. 관리자에게 문의 바랍니다!');
                }
            });
        } else {
            alert('로그인이 필요합니다.');
        }
    };

    const renderHeader = () => {
        return (
            <div className="content-section backup">
                <div className=".backup-intro">
                    <h1>백업 데이터 조회 / 복구</h1>
                    <div
                        style={{
                            padding: '10px 0px 0px 20px',
                            textAlign: 'left',
                        }}
                    >
                        백업일자{' '}
                        <Calendar
                            style={{
                                width: '300px',
                                fontSize: 'large',
                                marginLeft: '50px',
                            }}
                            value={searchDates}
                            onChange={e => setSearchDates(e.value)}
                            selectionMode="range"
                            dateFormat="yy-mm-dd"
                            readOnlyInput={true}
                            showIcon
                        />
                    </div>
                    <div
                        style={{
                            padding: '10px 0px 0px 20px',
                            textAlign: 'left',
                        }}
                    >
                        테이블 선택{' '}
                        <Dropdown
                            style={{
                                width: '300px',
                                fontSize: 'large',
                                marginLeft: '33px',
                                textAlign: 'center',
                            }}
                            optionLabel="name"
                            value={tableNm}
                            options={tables}
                            onChange={e => setTableNm(e.value)}
                            placeholder="테이블 선택"
                        />
                    </div>

                    <div
                        style={{
                            padding: '10px 0px 0px 20px',
                            textAlign: 'left',
                        }}
                    >
                        검색 조건 입력
                        <InputText
                            id="optionChange"
                            style={{
                                width: '500px',
                                margin: '0px 5px 0px 5px',
                                marginLeft: '19px',
                            }}
                            value={option}
                            onChange={e => setOption(e.target.value)}
                        />
                        <Button
                            icon="pi pi-times"
                            className="p-button-rounded p-button-danger p-button-text"
                            style={{ width: '27px', height: '27px' }}
                            onClick={handleClick}
                        />
                        <RecoveryModal
                            visible={displayConfirmation}
                            renderFooter={renderFooter}
                            onHide={onHide}
                        />
                    </div>

                    <div style={{ display: 'flex', paddingTop: '10px' }}>
                        <div
                            id="searchBtn"
                            style={{
                                textAlign: 'start',
                                display: 'none',
                                margin: '10px 10px 0px 10px',
                                fontSize: '16px',
                                float: 'left',
                            }}
                        >
                            <Button
                                style={{ width: '100px' }}
                                label="검색"
                                onClick={e => onSearch(e)}
                                icon="pi pi-search"
                                className="p-button"
                            />
                        </div>
                        <div
                            id="recoverBtn"
                            style={{
                                textAlign: 'start',
                                display: 'none',
                                margin: '10px 10px 0px 10px',
                                fontSize: '16px',
                                float: 'left',
                            }}
                        >
                            <Button
                                style={{ width: '100px' }}
                                label="복구"
                                onClick={() => onClick('displayConfirmation')}
                                icon="pi pi-check"
                                className="p-button"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const dynamicColumns = columns.map((col, i) => {
        return (
            <Column
                key={col.field}
                field={col.field}
                header={col.field}
                headerStyle={{ width: '200px' }}
                style={{ overflow: 'auto' }}
                sortable
            />
        );
    });

    return (
        <>
            <div className="datatable-doc-demo">
                <div className="content-section implementation">
                    <DataTable
                        header={header}
                        responsive
                        className="p-datatable-logs"
                        emptyMessage="조회된 항목 없음."
                        value={logs}
                        scrollable
                        scrollWidth="200px"
                        paginator={true}
                        rows={rows}
                        first={first}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        lazy={true}
                        currentPageReportTemplate="{totalRecords}건 중 {first}에서 {last}까지 조회"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        style={{ padding: '10px 0px 0px 0px', width: 'auto' }}
                        selection={selectedLogs}
                        onSelectionChange={e => setSelectedLogs(e.value)}
                    >
                        {dynamicColumns}
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default IFBackup;
