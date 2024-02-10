import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppRouter } from "src/namespaces/app/components/AppRouter";

export const App = () => {
  // const state = useSelector(selector);

  // const handleSave = async (payload) => {
  //   await updateApp(payload);
  // };

  // useEffect(() => {
  //   if (!state?.pathname) {
  //     return;
  //   }

  //   handleSave(state);
  // }, [JSON.stringify(state)]);

  return (
    <React.Fragment>
      <AppRouter />
    </React.Fragment>
  );
};
