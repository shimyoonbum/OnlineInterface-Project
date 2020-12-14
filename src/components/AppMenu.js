import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export class AppMenu extends Component {

    constructor() {
        super();
        this.state = {
            menu: null,
            filteredMenu: []
        };

        this.onSearchInputChange = this.onSearchInputChange.bind(this);
    }

    getMenu() {
        axios.get('showcase/resources/menu/menu.json', { headers: { 'Cache-Control' : 'no-cache' } })
            .then(res => res.data.data)
            .then(data => {            
                //2020.12.14 dummy 메뉴 화면에 안보이게 filter 적용. 나중에 메뉴가 추가될 때 조정 가능
                data[0].children = data[0].children.filter(data => data.name !== 'Dummy 인터페이스');
                this.setState({ menu: data, filteredMenu: data })
            });
    }

    onSearchInputChange(event) {
        if (!this.state.menu){
            this.setState({ filteredMenu : [] });
        }
        else if (!event.target.value) {
            this.setState({ filteredMenu : this.state.menu });
        }
        else if (this.state.menu) {
            const searchVal = event.target.value && event.target.value.toLowerCase();
            let filteredMenu = [];
            for(let item of this.state.menu) {
                let copyItem = {...item};
                if (this.findFilteredItems(copyItem, searchVal) || this.isFilterMatched(copyItem, searchVal)) {
                    filteredMenu.push(copyItem);
                }
            }

            this.setState({ filteredMenu });
        }
    }

    findFilteredItems(item, searchVal) {
        if (item) {
            let matched = false;
            if (item.children) {
                let childItems = [...item.children];
                item.children = [];
                for (let childItem of childItems) {
                    let copyChildItem = {...childItem};
                    if (this.isFilterMatched(copyChildItem, searchVal)) {
                        matched = true;
                        item.children.push(copyChildItem);
                    }
                }
            }

            if (matched) {
                return true;
            }
        }
    }

    isFilterMatched(item, searchVal) {
        let matched = false;
        if(item.name.toLowerCase().indexOf(searchVal) > -1 || this.onFilterOnMeta(item, searchVal)) {
            matched = true;
        }

        if (!matched || !(item.children && item.children.length)) {
            matched = this.findFilteredItems(item, searchVal) || matched;
        }

        return matched;
    }

    onFilterOnMeta(item, searchVal) {
        if (item && item.meta) {
            return item.meta.filter(meta => meta.toLowerCase().indexOf(searchVal) > -1).length > 0
        }

        return false;
    }

    componentDidMount() {
        this.getMenu();
    }

    renderSubmenu(menuitem, menuitemIndex) {
        if (!menuitem.children)
            return null;

        return (
            <ul className="layout-submenu" role="menu" aria-expanded={true}>
                {
                    menuitem.children.map((item, index) => {
                        // console.log('\t'+menuitemIndex+'-'+index+':'+item.name);
                        const submenus = this.renderSubmenu(item, `${menuitemIndex}-${index}`);
                        return (
                            <li key={`menuitem_${menuitemIndex}_${index}`} role="presentation">
                                {item.to ?
                                    <Link to={item.to} role="menuitem" onClick={this.props.onMenuItemClick}>
                                        {item.name}
                                        { item.badge && <span className="layout-menuitem-badge">{item.badge}</span> }
                                    </Link>
                                    :
                                    <React.Fragment>
                                        <span className="layout-menu-header" role="menuitem">
                                            <img alt={item.name} className="layout-menu-icon" src={item['icon']}></img>
                                            <span className="layout-menu-text">{item.name}</span>
                                        </span>
                                        { submenus }
                                    </React.Fragment>
                                }
                            </li>
                        )
                    })
                }
            </ul>
        );
    }

    renderRootMenuItems(menu) {
        if (!menu)
            return null;

        return (
            <React.Fragment>
                {
                    this.state.filteredMenu && this.state.filteredMenu.map((menuitem, index) => {
                        // console.log(index+':'+''+menuitem.name);
                        const submenus = this.renderSubmenu(menuitem, index);
                        return (
                            <li key={`menuitem_${index}`} role="presentation">
                                <span className="layout-menu-header" role="menuitem">
                                    <img alt={menuitem.name} className="layout-menu-icon" src={menuitem['icon']}></img>
                                    <span className="layout-menu-text">{menuitem.name}</span>
                                </span>
                                { submenus }
                            </li>
                        )
                    })
                }
            </React.Fragment>
        );
    }

    render() {
        const menuItems = this.renderRootMenuItems(this.state.menu);

        return (
            <div className="layout-sidebar" role="navigation" onClick={this.props.onSidebarClick}>
                <div className="layout-sidebar-search-wrapper">
                    <i className="pi pi-search layout-sidebar-search-icon"></i>
                    <input type="text" onChange={this.onSearchInputChange} placeholder="Search..." aria-label="Search input" autoComplete="off"/>
                </div>

                <ul className="layout-menu" role="menubar">
                    { menuItems }
                </ul>
            </div>
        );
    }
}