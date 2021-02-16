import React from 'react';
import {Dialog} from 'primereact/components/dialog/Dialog';

const RecoveryModal = ({visible, renderFooter, onHide}) => {
    return (
        <div>
            <Dialog 
                header="Confirmation" 
                visible={visible} modal 
                style={{ width: '350px' }} 
                footer={renderFooter('displayConfirmation')} 
                onHide={() => onHide('displayConfirmation')}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '1rem' }} />
                    <span>복구 진행 하시겠습니까?</span>
                </div>
            </Dialog>
        </div>
    );
};

export default RecoveryModal;