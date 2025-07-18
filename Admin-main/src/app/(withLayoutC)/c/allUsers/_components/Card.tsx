const cardData = DashboardData
  ? [
      { title: "Total User", value: dashboardData.totalusers },
      { title: "Total Active User", value: dashboardData.totalactiveusers },
      { title: "Total Suspend User", value: dashboardData.totalSuspendUsers },
      { title: "Total Block User", value: dashboardData.totalblockusers },
      {
        title: "Total Pending Delete Account",
        value: dashboardData.totalPendingDelete,
      },
      {
        title: "Total Complete Deleted Account",
        value: dashboardData.totalCompleteDeleted,
      },
    ]
  : [];
const Card = () => {
  return (
    <div className="grid md:grid-cols-5 items-center grid-cols-1 h-24 gap-5 mb-3  ">
      {cardData.map((card, i) => (
        <Card key={i} title={card.title} value={card.value} />
      ))}
    </div>
  );
};

export default Card;
