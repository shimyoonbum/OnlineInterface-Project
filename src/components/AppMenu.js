import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AppMenu = (props) => {
    const [menu, setMenu] = useState(null)
    const [filteredMenu, setFilteredMenu] = useState([])

    useEffect(() => {
        axios.get('showcase/resources/menu/menu.json', { headers: { 'Cache-Control' : 'no-cache' } })
            .then(res => res.data.data)
            .then(data => {            
                //2020.12.14 dummy 메뉴 화면에 안보이게 filter 적용. 나중에 메뉴가 추가될 때 조정 가능
                data[0].children = data[0].children.filter(data => data.name !== 'Dummy 인터페이스')
                setMenu(data)
                setFilteredMenu(data)
            })
    }, [])

    const renderSubmenu = (menuitem, menuitemIndex) => {
        if (!menuitem.children)
            return null;

        return (
            <ul className="layout-submenu" role="menu" aria-expanded={true}>
                {
                    menuitem.children.map((item, index) => {

                        const submenus = renderSubmenu(item, `${menuitemIndex}-${index}`);
                        return (
                            <li key={`menuitem_${menuitemIndex}_${index}`} role="presentation">
                                {item.to ?
                                    <Link to={item.to} role="menuitem" onClick={props.onMenuItemClick}>
                                        {item.name}
                                    </Link>
                                    :
                                    <React.Fragment>
                                        <span className="layout-menu-header" role="menuitem">
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

    const renderRootMenuItems = (menu) => {
        if (!menu)
            return null;

        return (
            <React.Fragment>
                {
                    filteredMenu && filteredMenu.map((menuitem, index) => {
                        const submenus = renderSubmenu(menuitem, index)
                        return (
                            <li key={`menuitem_${index}`} role="presentation">
                                <span className="layout-menu-header" role="menuitem">
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

    const menuItems = renderRootMenuItems(menu);

    return (
        <div className="layout-sidebar" role="navigation" onClick={props.onSidebarClick}>
            <ul className="layout-menu" role="menubar">
                { menuItems }
            </ul>
        </div>
    );
};

export default AppMenu;