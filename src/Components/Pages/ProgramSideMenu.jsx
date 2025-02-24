import React from 'react'
import { FaFolder, FaTasks } from "react-icons/fa";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { IoChatbox } from "react-icons/io5";

function ProgramSideMenu({ step , setStep }) {
  return (
    <div>
      <h2 className="sidebar-title">Tasks</h2>
      <ul className="task-list">
        <li className={step === "1" ? "active-menu" : ""} onClick={()=>setStep("1")}><IoChatbox  className="icon-program" /> Chats</li>
        <li className={step === "2" ? "active-menu" : ""} onClick={()=>setStep("2")}><FaFolder className="icon-program" /> Contents</li>
        <li className={step === "3" ? "active-menu" : ""} onClick={()=>setStep("3")}><FaTasks className="icon-program" /> Assignments</li>
        <li className={step === "4" ? "active-menu" : ""} onClick={()=>setStep("4")}><MdAssignmentTurnedIn className="icon-program" /> Submitted Assignments</li>
      </ul>
    </div>
  )
}

export default ProgramSideMenu
