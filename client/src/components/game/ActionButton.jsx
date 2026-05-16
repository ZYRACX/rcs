const ActionButton = ({ icon: Icon, title, description, color }) => (
  <button className="w-full group flex items-center justify-between p-4 bg-blue-950/20 border border-blue-500/10 rounded-xl hover:bg-blue-900/30 hover:border-blue-400/30 transition-all text-left">
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-lg border bg-blue-500/5 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs font-bold text-slate-200 tracking-wide">{title}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{description}</div>
      </div>
    </div>
    <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
  </button>
);
export default ActionButton;