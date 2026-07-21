import { useState, useEffect } from "react";
import { Search, CheckCircle2, Clock, Calendar, Info, HeartPulse, CreditCard } from "lucide-react";
import gsap from "gsap";

export function AppointmentStatus() {
  const [phone, setPhone] = useState("");
  const [statusState, setStatusState] = useState<"idle" | "not_found" | "pending" | "confirmed">("idle");
  const [loading, setLoading] = useState(false);
  
  const [mockDetails, setMockDetails] = useState({ id: "", token: "" });

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusState("idle");
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      const cleanPhone = phone.replace(/\D/g, "");
      
      const date = new Date();
      const yyyy = date.getFullYear();
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      
      // Generate random token for demo (1 to 50)
      const tokenNum = Math.floor(Math.random() * 50) + 1;
      const formattedId = `PHC-${yyyy}${dd}${mm}-${String(tokenNum).padStart(2, '0')}`;
      
      setMockDetails({ id: formattedId, token: String(tokenNum) });

      // Admin Demo Mode
      if (cleanPhone === "9999999999") {
        setStatusState("confirmed");
        animateResult();
        return;
      }
      
      // Check localStorage
      const bookingsStr = localStorage.getItem("pulse_bookings");
      if (bookingsStr) {
        try {
          const bookings = JSON.parse(bookingsStr);
          if (bookings[cleanPhone]) {
            setStatusState("pending");
            animateResult();
            return;
          }
        } catch (e) {}
      }
      
      setStatusState("not_found");
      animateResult();
    }, 800);
  };

  const animateResult = () => {
    requestAnimationFrame(() => {
      gsap.fromTo(".status-result", 
        { y: 20, opacity: 0, scale: 0.98 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(".status-stagger", 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.15 }
      );
    });
  };

  useEffect(() => {
    if (statusState === "idle" && phone === "") {
      gsap.fromTo(".status-entry",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [statusState]);

  const resetSearch = () => {
    setStatusState("idle");
    setPhone("");
  };

  return (
    <div className="flex w-full flex-col">
      {(statusState === "idle" || statusState === "not_found") && (
        <>
          <h3 className="status-entry font-display text-xl font-bold">Check Appointment Status</h3>
          <p className="status-entry mt-1 text-xs text-muted-foreground">
            Enter your registered mobile number to track your booking.
          </p>

          <form onSubmit={handleCheck} className="status-entry mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-2xl border border-input bg-background py-3.5 pl-5 pr-12 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button
              type="submit"
              disabled={loading || !phone}
              className="btn-lux inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[oklch(0.4_0.18_265)] to-[oklch(0.62_0.15_210)] px-8 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Checking..." : "Track Status"}
            </button>
          </form>
        </>
      )}

      {/* Result Area */}
      <div className={statusState === "idle" || statusState === "not_found" ? "mt-8 min-h-[200px]" : "mt-2"}>
        {statusState === "idle" && !loading && (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
            <Clock className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">Your status will appear here.</p>
          </div>
        )}

        {statusState === "not_found" && (
          <div className="status-result flex flex-col items-center justify-center rounded-3xl border border-border bg-muted/30 p-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
              <Search className="h-8 w-8 opacity-50" />
            </div>
            <div className="font-display text-lg font-bold">No Booking Found</div>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              We couldn't find an appointment associated with {phone}. Please check the number or book a new appointment.
            </p>
          </div>
        )}

        {statusState === "pending" && (
          <div className="status-result overflow-hidden rounded-3xl border border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/5">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 px-6 py-4">
              <div className="flex items-center gap-3 text-amber-700 dark:text-amber-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="font-display font-bold">Provisional Booking</span>
              </div>
            </div>
            <div className="p-6">
              <p className="status-stagger text-sm leading-relaxed text-muted-foreground">
                If you have already made the payment, your appointment will be confirmed shortly after verification. If you haven't paid yet, you can securely pay now to guarantee your slot.
              </p>
              <div className="status-stagger mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95">
                  <CreditCard className="h-4 w-4" /> Pay Now
                </button>
                <button onClick={resetSearch} className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted active:scale-95">
                  Back to Search
                </button>
              </div>
            </div>
          </div>
        )}

        {statusState === "confirmed" && (
          <div className="status-result relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[oklch(0.62_0.15_210)]/20 blur-[50px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[oklch(0.42_0.18_265)]/10 blur-[50px]" />

            <div className="bg-gradient-to-r from-[oklch(0.42_0.18_265)] to-[oklch(0.62_0.15_210)] px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="font-display text-lg font-bold tracking-wide">Appointment Confirmed</span>
              </div>
            </div>
            
            <div className="relative z-10 p-6">
              <div className="status-stagger grid gap-4 rounded-2xl border border-border bg-muted/30 p-5 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Appointment ID</div>
                  <div className="mt-1 font-mono text-base font-semibold text-foreground">#{mockDetails.id}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Token No.</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.62_0.15_210)]/10 text-sm font-bold text-[oklch(0.62_0.15_210)]">
                      {mockDetails.token}
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2 border-t border-border/50 pt-4 mt-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date & Slot</div>
                  <div className="mt-1 flex items-center gap-2 text-base font-semibold text-foreground">
                    <Calendar className="h-4 w-4 text-[oklch(0.62_0.15_210)]" /> 
                    <span>Tomorrow · 10:30 AM</span>
                  </div>
                </div>
              </div>
              
              <div className="status-stagger mt-5 rounded-2xl bg-muted/30 p-5 text-sm border border-border">
                <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-[oklch(0.62_0.15_210)]" /> Key Notes
                </div>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1.5">
                  <li>Please arrive 15 minutes before your scheduled time.</li>
                  <li>Bring any previous medical reports or ECGs.</li>
                  <li>Fasting is not required unless specifically advised.</li>
                </ul>
              </div>
              
              <div className="status-stagger mt-6 flex flex-col items-center justify-center gap-4 border-t border-border pt-6">
                <div className="flex items-center gap-2 opacity-80">
                  <HeartPulse className="h-4 w-4 text-[oklch(0.62_0.15_210)]" />
                  <span className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">Pulse Heart Centre</span>
                </div>
                <button onClick={resetSearch} className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted active:scale-95 sm:w-auto">
                  Check another booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
