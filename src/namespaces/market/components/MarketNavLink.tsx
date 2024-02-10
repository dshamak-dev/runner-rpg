import { faCoins, faHome, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import { SceneNavLink } from "src/core/components/molecules/SceneNavLink";
import { AppLink, AppLinkProps } from "src/namespaces/app/components/AppLink";

interface Props {}

export const MarketNavLink: React.FC<Props> = () => {
  return (
    <SceneNavLink to="market">
      <FontAwesomeIcon icon={faCoins} />
    </SceneNavLink>
  );
};
