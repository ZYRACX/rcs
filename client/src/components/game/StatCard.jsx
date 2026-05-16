const StatCard = ({ icon: Icon, label, value, trend, colorClass }) => (
  <div className="bg-blue-950/20 border border-blue-500/10 rounded-xl p-5 flex items-center gap-4 transition-all hover:bg-blue-900/20">
    <div className={`p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-slate-100 font-mono tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-blue-400' : 'text-slate-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default StatCard;