import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import {LoginService} from '../service/LoginService';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {InputText} from 'primereact/components/inputtext/InputText';
import sha256 from '../sha256';
import '../resources/css/AppTopbar.css';

const AppTopbar = props => {
    const [displayBasic, setDisplayBasic] = useState(false)
    const [displayModal, setDisplayModal] = useState(false)
    const [position, setPosition] = useState('center')
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const [newPw, setNewPw] = useState("")
    const [confPw, setConfPw] = useState("")

    const loginService = new LoginService()

    const dialogFuncMap = {
        'displayBasic' : setDisplayBasic,
        'displayModal' : setDisplayModal
    }

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = name => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = name => {
        return (
            <div>
                <Button label="취소" icon="pi pi-times" 
                onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }   

    const onMenuButtonClick = (event) => {
        if (props.onMenuButtonClick) {
            props.onMenuButtonClick(event);
        }
    }

    const session = () => {
        const userSession = window.sessionStorage.getItem('userToken');   

        if(userSession != null){
            loginService.getSession().then(data => {
                try {
                    if(data.id == "N"){
                        document.getElementById("loginBtn").style.display = "block";
                        document.getElementById("logoutBtn").style.display = "none";    
                    }else{
                        document.getElementById("loginBtn").style.display = "none";
                        document.getElementById("logoutBtn").style.display = "block";   
                        document.getElementById("loginName").style.display = "block"; 
                        document.getElementById("loginName").innerHTML = data.name + " 님 환영합니다!";             
                    }
                } catch (error) {}            
            });
        }else{
            loginService.getProxySession();
        }
    }

    const onLogout = () => {
        loginService.doLogout().then(data => {
            // console.log(data);
            if(data.responseCode == "000"){
                alert(data.responseMessage);
                window.sessionStorage.removeItem('userToken');
                window.location.reload();
            }else{
                alert(data.responseMessage);
            }
        });
    }

    const onSearch = e => {

        if(id == "" || password == ""){
            window.alert("아이디 혹은 패스워드를 입력바랍니다!");
        }else{            
            window.sessionStorage.removeItem('userToken');
            
            let userInfo={
                'id':id,
                'pw':sha256(password)
            };
          
            loginService.doLogin(JSON.stringify(userInfo)).then(data => {
                if(data.responseCode == "000"){
                    window.alert(data.responseMessage);
                    onHide('displayBasic');
                    window.sessionStorage.setItem('userToken', data.data);
                    window.location.reload();
                }else if(data.responseCode == "003"){
                    alert(data.responseMessage);
                }else if(data.responseCode == "004"){
                    alert(data.responseMessage);
                }else if(data.responseCode == "005"){
                    alert(data.responseMessage);
                    onClick('displayModal');
                }
            });  
        }       
    }    

    const onChange = e => {

        if(id == "" || password == "" || newPw == "" || confPw == ""){
            window.alert("아이디 혹은 패스워드를 입력바랍니다!");
        }else if(newPw != confPw){
            window.alert("새로운 비밀번호가 일치하지 않습니다.");
        }else{
            let newInfo={
                'id':id,
                'pw':sha256(password),
                'newPw':sha256(newPw)
            };

            loginService.setPassWord(newInfo).then(data => {
                if(data.responseCode == "000"){
                    onHide('displayModal');                
                    alert(data.responseMessage);
                }else{
                    alert(data.responseMessage);
                }
            });
        }        
    }

    useEffect(() => {
        session()
    }, [])

    return (
        <div className="layout-topbar">
            <div className="layout-topbar-left">
                <button type="button" className="p-link menu-button" 
                onClick={onMenuButtonClick} aria-expanded={props.menuActive} 
                aria-haspopup={true} aria-label="Menu">
                    <i className="pi pi-bars"></i>
                </button>
                <Link to="/" className="logo" aria-label="PrimeReact logo">
                    <img alt="logo" src="showcase/resources/images/primereact-logo.png" />
                </Link>                    
            </div>

            <div className="layout-topbar-right">
                <ul className="topbar-menu p-unselectable-text"> 
                    <li id="loginBtn" style={{display:'block'}}>                            
                        <button type="button" role="menuitem" className="p-link" onClick={(e) => onClick('displayBasic')}>로그인</button>                             
                    </li>
                    <li id="logoutBtn" style={{display:'none'}}>                            
                        <button type="button" role="menuitem" className="p-link" onClick={(e) => onLogout()}>로그아웃</button>                           
                    </li>                 
                </ul>
            </div>  

            <div className="content-section implementation dialog-demo">
                <Dialog header="온라인 중계시스템 로그인" visible={displayBasic} style={{width: '50vw'}} modal={true} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                    <div>
                        <InputText id="email" className="loginId" placeholder="아이디 입력" type="text" value={id} onChange={(e) => setId(e.target.value)}/>
                    </div>   
                    <div>
                        <InputText id="password" className="loginPw" placeholder="비밀번호 입력" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>  
                    </div>       

                    <button className="loginBtn" onClick={(e) => onSearch(e)}>로그인</button>
                    
                    <div className="loginEnd">
                        <a className="loginLine" onClick={() => onClick('displayModal')}>
                            비밀번호 변경
                        </a>                            
                    </div>
                </Dialog>

                <Dialog header="비밀번호 변경" visible={displayModal} style={{width: '50vw'}} modal={true} footer={renderFooter('displayModal')} onHide={() => onHide('displayModal')}>  
                    <div>
                        <InputText id="email" className="loginId" placeholder="아이디 입력" type="text" value={id} onChange={(e) => setId(e.target.value)}/>
                    </div>
                    <div>
                        <InputText id="password" className="loginPw" placeholder="기존 비밀번호 입력" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <InputText id="newPassword" className="loginNewPw" placeholder="새로운 비밀번호 입력" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}/>
                    </div>
                    <div>
                        <InputText id="passwordRe" className="loginNewPwRe" placeholder="새로운 비밀번호 확인" type="password" value={confPw} onChange={(e) => setConfPw(e.target.value)}/>
                    </div>

                    <button className="loginBtn" onClick={(e) => onChange(e)}>변경</button>
                </Dialog>
            </div>                  
        </div>
    );
};



export default AppTopbar;