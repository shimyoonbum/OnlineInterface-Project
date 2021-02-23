import React from 'react';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { InputText } from 'primereact/components/inputtext/InputText';

const LoginModal = ({
    visible,
    visible2,
    onHide,
    onSearch,
    onClick,
    onChange,
    renderFooter,
    id,
    password,
    newPw,
    confPw,
    setId,
    setPassword,
    setNewPw,
    setConfPw,
}) => {
    return (
        <div>
            <div className="content-section implementation dialog-demo">
                <Dialog
                    header="온라인 중계시스템 로그인"
                    visible={visible}
                    style={{ width: '50vw' }}
                    modal={true}
                    footer={renderFooter('displayBasic')}
                    onHide={() => onHide('displayBasic')}
                >
                    <div>
                        <InputText
                            id="email"
                            className="loginId"
                            placeholder="아이디 입력"
                            type="text"
                            value={id}
                            onChange={e => setId(e.target.value)}
                        />
                    </div>
                    <div>
                        <InputText
                            id="password"
                            className="loginPw"
                            placeholder="비밀번호 입력"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="loginBtn" onClick={e => onSearch(e)}>
                        로그인
                    </button>

                    {/* <div
                        className="loginEnd"
                        onClick={() => onClick('displayModal')}
                    >
                        비밀번호 변경
                    </div> */}
                </Dialog>

                {/* <Dialog
                    header="비밀번호 변경"
                    visible={visible2}
                    style={{ width: '50vw' }}
                    modal={true}
                    footer={renderFooter('displayModal')}
                    onHide={() => onHide('displayModal')}
                >
                    <div>
                        <InputText
                            id="email"
                            className="loginId"
                            placeholder="아이디 입력"
                            type="text"
                            value={id}
                            onChange={e => setId(e.target.value)}
                        />
                    </div>
                    <div>
                        <InputText
                            id="password"
                            className="loginPw"
                            placeholder="기존 비밀번호 입력"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <InputText
                            id="newPassword"
                            className="loginNewPw"
                            placeholder="새로운 비밀번호 입력"
                            type="password"
                            value={newPw}
                            onChange={e => setNewPw(e.target.value)}
                        />
                    </div>
                    <div>
                        <InputText
                            id="passwordRe"
                            className="loginNewPwRe"
                            placeholder="새로운 비밀번호 확인"
                            type="password"
                            value={confPw}
                            onChange={e => setConfPw(e.target.value)}
                        />
                    </div>

                    <button className="loginBtn" onClick={e => onChange(e)}>
                        변경
                    </button>
                </Dialog> */}
            </div>
        </div>
    );
};

export default LoginModal;
