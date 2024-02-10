import {
  faCoins,
  faHome,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { appSelector } from "src/namespaces/app/app.store";
import { AppLink, AppLinkProps } from "src/namespaces/app/components/AppLink";

interface Props extends AppLinkProps {}

export const SceneNavLink: React.FC<Props> = ({
  to,
  query,
  children,
  ...other
}) => {
  const appState = useSelector(appSelector);
  const { scene } = appState;

  const isActive = useMemo(() => {
    return to === scene;
  }, [to, scene]);

  const content = useMemo(() => {
    if (typeof children === "function") {
      return children({ ...appState, active: isActive });
    }

    return children;
  }, [children, isActive]);

  return (
    <AppLink
      {...other}
      to={to}
      query={query}
      className={classNames(
        "flex items-center justify-center",
        "min-w-[3rem] px-4 py-4",
        {
          "text-highlight": isActive,
          "text-white/50": !isActive,
        }
      )}
    >
      {content}
    </AppLink>
  );
};
