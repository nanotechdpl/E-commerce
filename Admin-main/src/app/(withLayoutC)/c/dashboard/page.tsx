import { Metadata } from "next";
import Dashboard from './dashboard'

export const metadata: Metadata = {
  title: "TAST | ADMIN PANEL",
  description: "This is admin panel",
};

export default function Home() {

  return (
    <Dashboard/>
  );
}
