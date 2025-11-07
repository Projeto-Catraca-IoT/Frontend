import { useNavigate } from "react-router-dom"

const Search = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-end w-full">
      <div className="flex flex-row gap-1 w-full sm:w-auto">
        <button 
          className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-3 sm:px-4 md:px-3 py-1.5 sm:py-2 rounded-lg text-purple-primary transition-all cursor-pointer font-medium text-sm md:text-base flex-1 sm:flex-none whitespace-nowrap" 
          onClick={() => navigate("/group/create")}
        >
          New Group
        </button>
        <button 
          className="bg-bg-secondary border border-line hover:bg-bg-secondary-hover px-3 sm:px-4 md:px-3 py-1.5 sm:py-2 rounded-lg text-purple-primary transition-all cursor-pointer font-medium text-sm md:text-base flex-1 sm:flex-none whitespace-nowrap" 
          onClick={() => navigate("/secret/create")}
        >
          New Secret
        </button>
      </div>
    </div>
  )
}

export default Search