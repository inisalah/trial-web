import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import type { KeyboardEvent, RefObject } from "react";
import { useState } from "react";
import { FaCog, FaPlay, FaStar, FaRobot } from "react-icons/fa";

import { useAgentStore } from "../../stores";
import type { Message } from "../../types/message";
import AppTitle from "../AppTitle";
import Button from "../Button";
import MessageBox from "../MessageBox";
import ExampleAgents from "../console/ExampleAgents";
import { ToolsDialog } from "../dialog/ToolsDialog";
import Globe from "../Globe";
import Input from "../Input";
import { useSettings } from "../../hooks/useSettings";
import React from "react";
import { useTaskStore } from "../../stores/taskStore";
import { ChatWindowTitle } from "../console/ChatWindowTitle";
import FadeIn from "../motions/FadeIn";
import { ChatMessage } from "../console/ChatMessage";
import Summarize from "../console/SummarizeButton";
import { MacWindowHeader } from "../console/MacWindowHeader";

type LandingProps = {
  messages: Message[];
  disableStartAgent: boolean;
  handlePlay: () => void;
  handleKeyPress: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  goalInputRef: RefObject<HTMLInputElement>;
  goalInput: string;
  setGoalInput: (string) => void;
  setShowSignInDialog: (boolean) => void;
  setAgentRun: (newName: string, newGoal: string) => void;
};
const Landing = (props: LandingProps) => {
  const [showToolsDialog, setShowToolsDialog] = useState(false);

  const { t } = useTranslation("indexPage");
  const agent = useAgentStore.use.agent();

  // new states
  const { settings } = useSettings();
  const [chatInput, setChatInput] = React.useState("");
  const agentLifecycle = useAgentStore.use.lifecycle();

  const tasks = useTaskStore.use.tasks();

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="landing-header flex-1">
          <ToolsDialog show={showToolsDialog} setOpen={setShowToolsDialog} />
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, type: "easeInOut" }}
            className="z-10"
          >
            <AppTitle />
          </motion.div>
          <div className="absolute left-0 right-0 m-auto grid place-items-center overflow-hidden opacity-40">
            <Globe />
          </div>
        </div>

        <div className="flex w-full flex-grow overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1, type: "easeInOut" }}
            className="z-10"
          >
            <div
              className={clsx(
                "border-translucent flex h-4/5 w-full max-w-[inherit] flex-1 flex-col overflow-hidden rounded-2xl border-2 border-white/20 bg-zinc-900 text-white shadow-2xl drop-shadow-lg transition-all duration-500"
              )}
            >
              <MacWindowHeader
                title={<ChatWindowTitle model={settings.customModelName} />}
                messages={props.messages}
              />

              <div
                className="mb-2 mr-2 flex-1 overflow-auto transition-all duration-500"
                id="chat-window-message-list"
              >
                <MessageBox>
                  👉 Create an agent by adding a name / goal, and hitting deploy! Try our examples
                  below!
                </MessageBox>

                <ExampleAgents
                  setAgentRun={props.setAgentRun}
                  setShowSignIn={props.setShowSignInDialog}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="goal-btn flex-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.5, type: "easeInOut" }}
            className="z-10 flex w-full flex-col gap-6"
          >
            <Input
              inputRef={props.goalInputRef}
              left={
                <>
                  <FaStar />
                  <span className="ml-2 ">{`${t("LABEL_AGENT_GOAL")}`}</span>
                </>
              }
              disabled={agent != null}
              value={props.goalInput}
              onChange={(e) => props.setGoalInput(e.target.value)}
              onKeyDown={props.handleKeyPress}
              placeholder={`${t("PLACEHOLDER_AGENT_GOAL")}`}
              type="textarea"
            />

            <div className="flex w-full flex-row items-center justify-center gap-3 ">
              {/*Tools Settings*/}
              <Button
                ping
                onClick={() => setShowToolsDialog(true)}
                className="z-100 h-full bg-gradient-to-t from-black to-slate-12 hover:shadow-depth-3"
              >
                <FaCog />
              </Button>

              {/* Play Button */}
              <Button
                onClick={props.handlePlay}
                className="border-0 bg-gradient-to-t from-black to-slate-12 subpixel-antialiased saturate-[75%] hover:saturate-100"
              >
                <FaPlay />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Landing;
