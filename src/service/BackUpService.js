import axios from 'axios';

if(window.proxy == null)
  window.proxy= '';

export class BackUpService {    

  getTableList() {  
    return axios(window.proxy+'/common/getTable', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(res => res.data);
    
    // return axios.get('showcase/resources/demo/data/tables.json').then(res => {
    //   console.log(res.data);
    //   return res.data;
    // });
    
  }
  
  getLogs(data){
    return axios(window.proxy+'/common/backup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data : data
    }).then(res => res.data);
  }

  doRecovery(data){
    return axios(window.proxy+'/common/recovery', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data : data
    }).then(res => res.data);
  }
}