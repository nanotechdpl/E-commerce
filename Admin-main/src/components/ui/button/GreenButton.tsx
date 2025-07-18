
interface GreenButtonProps {
  onClick?: () => void;
  title: string;
}

const GreenButton: React.FC<GreenButtonProps> = ({ onClick, title }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-x-1.5 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default GreenButton;
