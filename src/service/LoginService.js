import axios from 'axios';

if (window.proxy == null) window.proxy = '';

export class LoginService {
    doLogin(data) {
        return axios(window.proxy + '/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: data,
        }).then(res => {
            if (res.data.proxy != null) {
                window.proxy = res.data.proxy;
                return this.doLogin(data);
            }

            return res;
        });

        // return axios.get('showcase/resources/demo/data/login.json').then(res => res.data);

        // {debugger;return res.data}
    }

    setPassWord(data) {
        return axios(window.proxy + '/users/setPassword', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: data,
        })
            .then(res => res.data)
            .catch(res => console.log(res));

        //return axios.get('showcase/resources/demo/data/password.json').then(res => res.data);
    }

    doLogout() {
        return axios(window.proxy + '/users/doLogout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
            .then(res => {
                if (res.data.proxy != null) {
                    window.proxy = res.data.proxy;
                    return this.doLogout();
                }

                return res.data;
            })
            .catch(res => console.log(res));
        // return axios.get('showcase/resources/demo/data/logout.json').then(res => res.data);
    }

    getSession() {
        return axios
            .get(window.proxy + '/users/getSession', {
                headers: {
                    Authorization: window.sessionStorage.getItem('userToken'),
                },
            })
            .then(res => {
                if (res.data.proxy != null) {
                    window.proxy = res.data.proxy;
                    return this.getSession();
                }

                return res.data;
            })
            .catch(res => console.log(res));
        // return axios.get('showcase/resources/demo/data/logout.json').then(res => res.data);
    }

    getProxySession() {
        return axios(window.proxy + '/users/getProxySession', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
            .then(res => {
                // console.log(res);
                if (res.data.proxy != null) {
                    window.proxy = res.data.proxy;
                }

                return null;
            })
            .catch(res => console.log(res));
        // return axios.get('showcase/resources/demo/data/logout.json').then(res => res.data);
    }
}
