function Details({ label, data }: { label: string; data: string }) {
    return (
      <article className="font-semibold flex border-b border-b-[#373535]/50 pb-1 px-4 justify-between items-end  last:border-b-0 last:pb-0">
        <p className="text-[#373535] w-3/5">{label}</p>
        <p className="w-2/5 text-sm">{data}</p>
      </article>
    );
  }
  
  export default Details;