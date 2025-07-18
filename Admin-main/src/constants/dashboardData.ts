import { BiRupee } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { IoIosCodeWorking } from "react-icons/io";

import {
  MdAccountBalanceWallet,
  MdCancelScheduleSend,
  MdConfirmationNumber,
  MdIncompleteCircle,
  MdPendingActions,
  MdUpcoming,
} from "react-icons/md";
import {
  RiLuggageDepositFill,
  RiLuggageDepositLine,
  RiPassPendingFill,
  RiSpam2Fill,
} from "react-icons/ri";

import type { dashboardData } from "@/types/dashboardData";

export const DashboardData: dashboardData[] = [
  { name: "Total User", icon: FiUsers, number: "7,265" },
  { name: "Total Orders", icon: MdPendingActions, number: "15,320" },
  { name: "Total pending orders", icon: IoIosCodeWorking, number: "1,986" },
  { name: "Total payment order", icon: MdCancelScheduleSend, number: "13,842" },
  { name: "Total waiting order", icon: MdIncompleteCircle, number: "2,745" },
  { name: "Total working orders", icon: BiRupee, number: "4,328" },
  {
    name: "Total complete orders",
    icon: MdAccountBalanceWallet,
    number: "12,034",
  },
  { name: "Total delivery orders", icon: MdUpcoming, number: "9,501" },
  { name: "Total cancel orders", icon: RiLuggageDepositFill, number: "3,112" },
  { name: "Total amount $", icon: RiLuggageDepositLine, number: "78,945" },
  { name: "Total profit amount $", icon: RiPassPendingFill, number: "22,671" },
  {
    name: "Total Arrived amount $",
    icon: MdConfirmationNumber,
    number: "30,420",
  },
  { name: "Total remaining amount $", icon: RiSpam2Fill, number: "18,375" },
  { name: "Total online deposit", icon: RiSpam2Fill, number: "7,845" },
  {
    name: "Total online payment amount $",
    icon: RiSpam2Fill,
    number: "26,498",
  },
  { name: "Total pending payment", icon: RiSpam2Fill, number: "4,190" },
  { name: "Total accepted payment", icon: RiSpam2Fill, number: "19,230" },
  { name: "Total spam payment", icon: RiSpam2Fill, number: "1,024" },
  { name: "Total offline deposit", icon: RiSpam2Fill, number: "8,520" },
  {
    name: "Total offline payment amount $",
    icon: RiSpam2Fill,
    number: "25,340",
  },
  { name: "Total offline Active Check", icon: RiSpam2Fill, number: "12,875" },
  { name: "Total offline Deactive Check", icon: RiSpam2Fill, number: "5,120" },
  { name: "Total offline complete Check", icon: RiSpam2Fill, number: "7,912" },
  { name: "Total online refund", icon: RiSpam2Fill, number: "3,621" },
  { name: "Total online refund amount $", icon: RiSpam2Fill, number: "18,560" },
  { name: "Total online pending refund", icon: RiSpam2Fill, number: "1,430" },
  { name: "Total online sending refund", icon: RiSpam2Fill, number: "2,145" },
  { name: "Total online ineligible refund", icon: RiSpam2Fill, number: "927" },
  { name: "Total offline refund", icon: RiSpam2Fill, number: "4,310" },
  {
    name: "Total offline refund amount $",
    icon: RiSpam2Fill,
    number: "20,815",
  },
  { name: "Total offline pending refund", icon: RiSpam2Fill, number: "3,204" },
  { name: "Total offline sending refund", icon: RiSpam2Fill, number: "1,892" },
  {
    name: "Total offline ineligible refund",
    icon: RiSpam2Fill,
    number: "1,201",
  },
  { name: "Total Subscribe", icon: RiSpam2Fill, number: "14,785" },
  { name: "Total communication", icon: RiSpam2Fill, number: "6,230" },
  { name: "Total live chat user", icon: RiSpam2Fill, number: "2,645" },
];
