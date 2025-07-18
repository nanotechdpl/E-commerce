import Card from "@/components/Card/Card";

const AgencyCard = ({ cardData }: { cardData: any }) => {
  return (
    <div className="grid md:grid-cols-5 grid-cols-5 gap-2 lg:gap-5 mb-3">
      {cardData.map((card: any, i: number) => (
        <Card key={i} title={card.title} value={card.value} />
      ))}
    </div>
  );
};

export default AgencyCard;
