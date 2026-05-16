const Panel = ({ children, className = "", title, actionText }) => (
    <div className={`bg-[#0f172a] border border-blue-500/10 rounded-xl flex flex-col overflow-hidden shadow-xl ${className}`}>
    {(title || actionText) && (
        <div className="px-6 py-4 flex justify-between items-center border-b border-blue-500/10 bg-blue-500/[0.02]">
        <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400/70 uppercase">{title}</h3>
        {actionText && (
            <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors tracking-widest uppercase">
            {actionText}
          </button>
        )}
      </div>
    )}
    <div className="p-6 flex-1">{children}</div>
  </div>
);
export default Panel