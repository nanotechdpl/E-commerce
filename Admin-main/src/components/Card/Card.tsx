import { NetworkBar } from "@/utils/Icons";

interface CardProps {
  title: string;
  color?: string;
  value: number | string;
}

function Card({ title, value }: CardProps) {
  return (
    <article className="rounded-md px-3 py-2 h-[90px] hover:bg-[#FFB200] bg-[rgb(255,255,255)] text-[#231F20]   relative">
      <div className="flex  justify-between mb-4 ">
        <h3 className="font-medium font-inter text-base capitalize  ">
          {title}
        </h3>
        <div className="flex  ">
          <NetworkBar className="" />
        </div>
      </div>
      <p className="text-right font-inter absolute bottom-1 right-3   font-semibold">
        {value !== undefined ? value : 0}
      </p>
     
    </article>
  );
}

export default Card;
