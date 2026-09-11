import { Bell, CreditCard, MapPin, Settings, UserRound } from "lucide-react";

const rows = [
  { icon: MapPin, label: "Home location", value: "Ahmedabad, Gujarat" },
  { icon: Bell, label: "Alerts", value: "Journey delays & fare drops" },
  { icon: CreditCard, label: "Payments", value: "UPI · Cards" },
  { icon: Settings, label: "Preferences", value: "Best Overall" },
];

const Profile = () => {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f4f7fb] p-6 md:p-12 lg:p-16 mt-16">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f172a] text-white">
              <UserRound className="h-8 w-8" strokeWidth={1.6} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#0f172a]">Traveller</h1>
              <p className="text-sm text-slate-500">Signed in as guest · YATRA</p>
            </div>
          </div>

          <ul className="mt-8 divide-y divide-slate-100">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.label} className="flex items-center gap-3 py-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{row.label}</p>
                    <p className="text-xs text-slate-500">{row.value}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Profile;
