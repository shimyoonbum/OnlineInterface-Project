import axios from 'axios';

if(window.proxy == null)
  window.proxy= '';

export class CommonService {
  getMainInfo() {
    return axios(window.proxy+'/common/getMainInfo', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        if(res.data.proxy != null) {
          window.proxy= res.data.proxy;
          return this.getMainInfo();
        }  
        return res.data;
      });
  }

  getMainSysInfo(data) {
    return axios(window.proxy+'/common/getMainInfo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
      }).then(res => {
        console.log(res);
        if(res.data.proxy != null) {
          window.proxy= res.data.proxy;
          return this.getMainInfo();
        }  
        return res.data;
      });
  }

  getLogs(data) {
      // console.log('CommonService>getLogs>data:', data);

      return axios(window.proxy+'/common/getLogs', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: data
        }).then(res => {
        	// console.log(res.data);
        	return res.data;
        });

      // return axios.get('showcase/resources/demo/data/logs.json').then(res => res.data.data);
  }
  
  getLog(ifSeq) {
      
      return axios(window.proxy+'/common/getLog', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: {
            'ifSeq': ifSeq
          }
        }).then(res => {
          // console.log(res.data);
          if(res.responseCode==null)
            return res.data;
          window.alert("로그인이 필요합니다.");
          return null;
        });

      // return axios.get('showcase/resources/demo/data/log.json')
      //         .then(res => res.data);
  }
  
  getSystems(data) {
    // console.log('CommonService>getSystems>data:', data);

    return axios(window.proxy+'/common/getSystems', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: data
    }).then(res => res.data.data);

    // return axios.get('showcase/resources/demo/data/systems.json')
    //           .then(res => res.data);
  }
  
  getInterfaces(data) {
    // console.log('CommonService>getInterfaces>data:', data);

    return axios(window.proxy+'/common/getInterfaces', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: data
    }).then(res => res.data.data);

    // return axios.get('showcase/resources/demo/data/interfaces.json')
    //         .then(res => res.data);
  }
  
  getStatuses() {
      return axios.get('showcase/resources/demo/data/statuses.json')
              .then(res => res.data);
  }
  
  getDummies(systemId) {
    ///console.log('CommonService>getDummy>data:', data);

    return axios(window.proxy+'/common/getDummies', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: {systemId: systemId}
    }).then(res => res.data   
      // console.log(res.data);
      // if(res.data.responseCode==null)
      //   return res.data.data;
      // window.alert("로그인이 필요합니다.");
      // return null;
    );

    // return axios.get('showcase/resources/demo/data/systems.json')
    //           .then(res => res.data);
  }

  setDummy(isNew, dummy) {
    ///console.log('CommonService>getDummy>data:', data);

    if(isNew) {
      return axios(window.proxy+'/common/dummy', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: dummy
      }).then(res => res.data);
    } else {
      return axios('/common/dummy', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: dummy
      }).then(res => res.data);
    }
  } //setDummy

  setStateDummy(dummy) {
    ///console.log('CommonService>getDummy>data:', data);

    return axios(window.proxy+'/common/dummy', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: dummy
    }).then(res => res.data);
  } //setStateDummy

  deleteDummy(dummy) {
    ///console.log('CommonService>deleteDummy>data:', data);

    return axios(window.proxy+'/common/dummy', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: dummy
    }).then(res => res.data);
  } //deleteDummy

}