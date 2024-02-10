import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faBolt, faDragon, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { ReactElement, ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import { appSelector } from "src/namespaces/app/app.store";
import { LandingNavLink } from "src/namespaces/landing/components/LandingNavLink";
import { MarketNavLink } from "src/namespaces/market/components/MarketNavLink";
import { SessionNavLink } from "src/namespaces/session/components/SessionNavLink";

interface Props {
  name: string;
  navigation?: boolean;
  children: any;
  icon?: IconProp;
}

export const Scene: React.FC<Props> = ({
  name,
  children,
  navigation = true,
  icon,
}) => {
  return (
    <div className="scene-wrap relative h-screen overflow-hidden">
      <div className="relative h-full overflow-y-auto">{children}</div>
      {navigation ? (
        <nav
          className={classNames(
            "fixed left-0 bottom-0",
            "flex justify-center gap-4 justify-between items-start",
            "w-full px-8",
            "bg-secondary"
          )}
        >
          <LandingNavLink  />
          <SessionNavLink />
          <MarketNavLink />
        </nav>
      ) : null}
    </div>
  );
};
