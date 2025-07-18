interface Notice {
  title: string;
  updatedDate: string;
  status: "Ongoing" | "expired" | "coming soon";
  documents: string[];
  visible: boolean;
}

export default Notice;
