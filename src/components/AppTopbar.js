import React, { Component } from 'react';
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import {LoginService} from '../service/LoginService';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {InputText} from 'primereact/components/inputtext/InputText';
import sha256 from '../sha256';
import '../resources/css/AppTopbar.css';

export class AppTopbar extends Component {

    static defaultProps = {
        activeTopbarItem: null,
        menuActive: false,
        onMenuButtonClick: null,
        onTopbarItemClick: null,
        onThemeChange: null,
        onClick : null,
        onLogout : null
    }

    static propTypes = {
        activeTopbarItem: PropTypes.string,
        menuActive: PropTypes.bool,
        onMenuButtonClick: PropTypes.func,
        onTopbarItemClick: PropTypes.func,
        onThemeChange: PropTypes.func,
        onClick : PropTypes.func,
        onLogout : PropTypes.func
    }

    constructor() {
        super();

        this.state = {
            displayBasic: false,
            displayBasic2: false,
            displayBlockScroll: false,
            displayModal: false,
            displayMaximizable: false,
            displayPosition: false,
            position: 'center',
            id: "",
            password: "",
            newPw : "",
            confPw: ""
        };

        this.loginService = new LoginService();
        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onHide = this.onHide.bind(this);

        const footer = (
            <div>
                <Button label="취소" icon="pi pi-check" onClick={this.onHide} />                
            </div>
        );
        
    }

    componentDidMount(){ 
        this.session();
    }

    onClick(name, position){
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

    session(){
        const userSession = window.sessionStorage.getItem('userToken');   

        // console.log(userSession);

        if(userSession != null){
            this.loginService.getSession().then(data => {
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
            this.loginService.getProxySession();
        }
    }

    onLogout(){
        this.loginService.doLogout().then(data => {
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

    onSearch(e) {

        if(this.state.id == "" || this.state.password == ""){
            window.alert("아이디 혹은 패스워드를 입력바랍니다!");
        }else{            
            window.sessionStorage.removeItem('userToken');
            
            let userInfo={
                'id':this.state.id,
                'pw':sha256(this.state.password)
            };
          
            this.loginService.doLogin(JSON.stringify(userInfo)).then(data => {
                if(data.responseCode == "000"){
                    window.alert(data.responseMessage);
                    this.onHide('displayBasic');
                    window.sessionStorage.setItem('userToken', data.data);
                    window.location.reload();
                }else if(data.responseCode == "003"){
                    alert(data.responseMessage);
                }else if(data.responseCode == "004"){
                    alert(data.responseMessage);
                }else if(data.responseCode == "005"){
                    alert(data.responseMessage);
                    this.onClick('displayModal');
                }
            });  
        }       
    }    

    onChange(e) {

        if(this.state.id == "" || this.state.password == "" || this.state.newPw == "" || this.state.confPw == ""){
            window.alert("아이디 혹은 패스워드를 입력바랍니다!");
        }else if(this.state.newPw != this.state.confPw){
            window.alert("새로운 비밀번호가 일치하지 않습니다.");
        }else{
            let newInfo={
                'id':this.state.id,
                'pw':sha256(this.state.password),
                'newPw':sha256(this.state.newPw)
            };

            this.loginService.setPassWord(newInfo).then(data => {
                if(data.responseCode == "000"){
                    this.onHide('displayModal');                
                    alert(data.responseMessage);
                }else{
                    alert(data.responseMessage);
                }
            });
        }        
    }

    renderFooter(name) {
        return (
            <div>
                <Button label="취소" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-text" />
            </div>
        );
    }   

    onMenuButtonClick(event) {
        if (this.props.onMenuButtonClick) {
            this.props.onMenuButtonClick(event);
        }
    }

    render() {
        return (
            <div className="layout-topbar">
                <div className="layout-topbar-left">
                    <button type="button" className="p-link menu-button" onClick={this.onMenuButtonClick} aria-expanded={this.props.menuActive} aria-haspopup={true} aria-label="Menu">
                        <i className="pi pi-bars"></i>
                    </button>
                    <Link to="/" className="logo" aria-label="PrimeReact logo">
                        <img alt="logo" src="showcase/resources/images/primereact-logo.png" />
                    </Link>                    

                    {/* <span id="loginName"></span> */}
                </div>

                <div className="layout-topbar-right">
                    <ul className="topbar-menu p-unselectable-text"> 
                        <li id="loginBtn" style={{display:'block'}}>                            
                            <button type="button" role="menuitem" className="p-link" onClick={(e) => this.onClick('displayBasic')}>로그인</button>                             
                        </li>
                        <li id="logoutBtn" style={{display:'none'}}>                            
                            <button type="button" role="menuitem" className="p-link" onClick={(e) => this.onLogout()}>로그아웃</button>                           
                        </li>                 
                    </ul>
                </div>  

                <div className="content-section implementation dialog-demo">
                    <Dialog header="온라인 중계시스템 로그인" visible={this.state.displayBasic} style={{width: '50vw'}} modal={true} footer={this.renderFooter('displayBasic')} onHide={() => this.onHide('displayBasic')}>
                        <div>
                            <InputText id="email" className="loginId" placeholder="아이디 입력" type="text" value={this.state.id} onChange={(e) => this.setState({id: e.target.value})}/>
                        </div>   
                        <div>
                            <InputText id="password" className="loginPw" placeholder="비밀번호 입력" type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>  
                        </div>       

                        <button className="loginBtn" onClick={(e) => this.onSearch(e)}>로그인</button>
                        
                        <div className="loginEnd">
                            <a className="loginLine" onClick={() => this.onClick('displayModal')}>
                                비밀번호 변경
                            </a>                            
                        </div>
                    </Dialog>

                    <Dialog header="비밀번호 변경" visible={this.state.displayModal} style={{width: '50vw'}} modal={true} footer={this.renderFooter('displayModal')} onHide={() => this.onHide('displayModal')}>  
                        <div>
                            <InputText id="email" className="loginId" placeholder="아이디 입력" type="text" value={this.state.id} onChange={(e) => this.setState({id: e.target.value})}/>
                        </div>
                        <div>
                            <InputText id="password" className="loginPw" placeholder="기존 비밀번호 입력" type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
                        </div>
                        <div>
                            <InputText id="newPassword" className="loginNewPw" placeholder="새로운 비밀번호 입력" type="password" value={this.state.newPw} onChange={(e) => this.setState({newPw: e.target.value})}/>
                        </div>
                        <div>
                            <InputText id="passwordRe" className="loginNewPwRe" placeholder="새로운 비밀번호 확인" type="password" value={this.state.confPw} onChange={(e) => this.setState({confPw: e.target.value})}/>
                        </div>

                        <button className="loginBtn" onClick={(e) => this.onChange(e)}>변경</button>
                    </Dialog>
                </div>                  
            </div>
        );
    }
}

export default AppTopbar;
