import JWTLoginTab from "./tabs/JWTLoginTab";
import JWTLoginTabSelfService from "./tabs/JWTLoginTabSelfService";
import { Tab, Tabs } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";

interface Props {
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  titleState: [
    (() => React.ReactNode) | string,
    React.Dispatch<React.SetStateAction<(() => React.ReactNode) | string>>,
  ];
}

const Login: React.FC<Props> = ({ loadingState, titleState }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    titleState[1](() => {
      return "Login";
    });
  }, []);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  return (
    <Fragment>

      {selectedTab === 0 && <JWTLoginTab />}
      {selectedTab === 1 && <JWTLoginTabSelfService />}
    </Fragment>
  );
};

export default Login;
