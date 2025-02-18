import { useSession } from "next-auth/react";
import React from "react";

import { ExampleAgentButton } from "./ExampleAgentButton";
import { useSID } from "../../hooks/useSID";
import FadeIn from "../motions/FadeIn";

type ExampleAgentsProps = {
  setAgentRun?: (name: string, goal: string) => void;
  setShowSignIn: (show: boolean) => void;
};

const ExampleAgents = ({ setAgentRun, setShowSignIn }: ExampleAgentsProps) => {
  const { data: session } = useSession();
  const sid = useSID(session);

  return (
    <>
      <FadeIn delay={0.9} duration={0.5}>
        <div className="m-2 grid grid-cols-1 grid-rows-2 items-stretch gap-2 sm:m-4 sm:grid-cols-3">
          <ExampleAgentButton name="ResearchGPT 📜" setAgentRun={setAgentRun}>
            Create a comprehensive report of the Nike company
          </ExampleAgentButton>

          <ExampleAgentButton name="TravelGPT 🌴" setAgentRun={setAgentRun}>
            Plan a detailed trip to Hawaii.
          </ExampleAgentButton>

          <ExampleAgentButton name="StudyGPT 📚" setAgentRun={setAgentRun}>
            Create a study plan for a History 101 exam about world events in the 1980s
          </ExampleAgentButton>
        </div>
      </FadeIn>
    </>
  );
};

export default ExampleAgents;
