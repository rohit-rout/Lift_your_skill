import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({component:Component, ...rest }) => {
  const { loading, isAuthenticated} = useSelector((state) => state.userInfo);
  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <Redirect to="/loginSignUp" />;
            }

    

            return <Component {...props}/>;
          }}
        />
      )}
    </Fragment>
  );
 
};

export default ProtectedRoute;