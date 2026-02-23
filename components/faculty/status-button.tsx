import { cn } from "@/lib/utils";

export function StatusButton({ active, onClick, variant, icon: Icon, label }: any) {
    const colors = {
        present: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
        absent: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
        late: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
        excused: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
    };

    const activeColors = {
        present: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700",
        absent: "bg-red-600 text-white border-red-600 hover:bg-red-700",
        late: "bg-amber-500 text-white border-amber-500 hover:bg-amber-600",
        excused: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200",
                active ? activeColors[variant as keyof typeof activeColors] : colors[variant as keyof typeof colors],
                active ? "shadow-sm scale-105" : "opacity-70 hover:opacity-100"
            )}
            title={label}
        >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
