import React from "react";

import { Sidebar, Menu, MenuItem, Submenu, Logo } from "react-mui-sidebar";

const App = () => {
  return (
    <Sidebar width={"270px"}>
      
      <Menu subHeading="Gestion du parc">
        <MenuItem link="/" badge={true}>
          Modern
        </MenuItem>
        <MenuItem>eCommerce</MenuItem>
        <MenuItem>Analytical</MenuItem>
      </Menu>
      <Menu subHeading="APPS">
        <MenuItem>Chat</MenuItem>
        <MenuItem>Calendar</MenuItem>
      </Menu>
      <Menu subHeading="OTHERS">
        <Submenu title="Menu Level">
          <MenuItem>Post</MenuItem>
          <MenuItem>Details</MenuItem>
          <Submenu title="Level 2">
            <MenuItem>new</MenuItem>
            <MenuItem>Hello</MenuItem>
          </Submenu>
        </Submenu>

        <MenuItem>Chip</MenuItem>
        <MenuItem target="_blank" link="google.com">
          External Link
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default App;