import { faHome, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import { SceneNavLink } from "src/core/components/molecules/SceneNavLink";

interface Props {}

export const LandingNavLink: React.FC<Props> = () => {
  return (
    <SceneNavLink to="landing">
      <FontAwesomeIcon icon={faHome} />
    </SceneNavLink>
  );
};
