import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { appSelector } from "src/namespaces/app/app.store";
import {
  AppSceneType,
  handleNavigate,
} from "src/namespaces/app/components/AppRouter";

export interface AppLinkProps {
  to: AppSceneType;
  children: any;
  className?: string;
  active?: boolean;
  query?: Object;
  onClick?: () => void;
}

export const AppLink: React.FC<AppLinkProps> = ({
  to,
  children,
  className = null,
  query,
  onClick,
  ...other
}) => {
  const handleClick = useCallback(() => {
    handleNavigate(to, query);

    if (onClick) {
      onClick();
    }
  }, [onClick, to, query]);

  return (
    <a
      {...other}
      className={classNames("cursor-pointer select-none", className)}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
