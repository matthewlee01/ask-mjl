import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="layout">
    {props.children}
    <style jsx>{`
      .layout {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        align-items: flex-end;
      }
    `}</style>
  </div>
);

export default Layout;
