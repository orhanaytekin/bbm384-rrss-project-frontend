import React from 'react';
import Navbar from '../Navbar/Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar onSearch={(query) => console.log(query)} />
      <div>{children}</div>
    </>
  );
};

export default Layout;
