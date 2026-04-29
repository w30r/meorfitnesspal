import { Scale, Calendar } from "lucide-react";
import { upsertWeight } from "@/app/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function LogWeightPage() {
  /**
   * Inline Server Action
   * This handles the form submission directly on the server.
   */
  async function handleAction(formData: FormData) {
    "use server";
    const weight = parseFloat(formData.get("weight") as string);
    const date = formData.get("date") as string;

    if (weight && date) {
      // Ensure date is in DD-MM-YYYY for our database consistency
      const [y, m, d] = date.split("-");
      const formattedDate = `${d}-${m}-${y}`;

      await upsertWeight(weight, formattedDate);

      // Redirect back to the weight graph page
      redirect("/weight");
    }
  }

  // Set default value for the date picker to today (YYYY-MM-DD format)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container max-w-md min-h-screen mx-auto px-6 flex flex-col justify-center items-center">
      <div className="text-center mb-10">
        <div className="inline-flex p-5 rounded-3xl bg-primary/10 text-primary mb-6 animate-in fade-in zoom-in duration-500">
          <Scale size={48} />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Log Weight</h1>
        <p className="text-muted-foreground font-medium">
          Consistency is the key to progress.
        </p>
      </div>

      <form action={handleAction} className="space-y-8">
        <div className="space-y-6">
          {/* Weight Input Group */}
          <div className="relative group">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-3 block">
              Current Weight (kg)
            </label>
            <div className="relative border-b-2 border-border focus-within:border-primary transition-all duration-300">
              <input
                name="weight"
                type="number"
                step="0.1"
                required
                placeholder="00.0"
                className="w-full text-6xl font-black bg-transparent py-4 outline-none placeholder:text-muted/20 appearance-none"
                autoFocus
              />
              <span className="absolute right-0 bottom-6 text-xl font-bold text-muted-foreground">
                kg
              </span>
            </div>
          </div>

          {/* Date Input Group */}
          <div className="pt-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 mb-3 block">
              Log Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={20}
              />
              <input
                name="date"
                type="date"
                defaultValue={today}
                required
                className="w-full bg-muted/40 hover:bg-muted/60 rounded-2xl border border-border p-4 pl-12 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-extrabold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
          >
            Save Entry
          </button>

          <Link
            href="/weight"
            className="block w-full text-center text-sm font-bold text-muted-foreground hover:text-foreground py-2 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
