import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, CalendarHeart, ReceiptIndianRupee } from "lucide-react";
import { AppointmentStatus } from "./AppointmentStatus";
import gsap from "gsap";

interface AppointmentModalProps {
  children: React.ReactNode;
}

export function AppointmentModal({ children }: AppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [appointmentType, setAppointmentType] = useState("normal");
  const [activeTab, setActiveTab] = useState<"book" | "status">("book");
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Small delay to ensure Radix content is mounted in the portal
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const elements = containerRef.current.querySelectorAll('.gsap-animate');
          // gsap.from automatically sets the starting state before animating
          gsap.from(elements, {
            y: 15,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.05,
            clearProps: "all"
          });
        }
      });
    }
  }, [open]);

  const fee = appointmentType === "emergency" ? 1000 : 500;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] w-[calc(100%-2rem)] p-0 max-h-[85vh] !flex flex-col overflow-hidden border-border bg-card shadow-luxe rounded-3xl">
        <div className="p-5 pb-6 sm:p-6 flex-1 overflow-y-auto min-h-0" ref={containerRef}>
          <DialogHeader className="mb-4 text-left gsap-animate">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.42_0.18_265)] to-[oklch(0.62_0.15_210)] shadow-glow text-white">
                <CalendarHeart className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="font-display text-lg font-bold">Appointments</DialogTitle>
                <DialogDescription className="text-muted-foreground text-[11px] mt-0.5">
                  Book or track your appointment.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mb-4 flex overflow-hidden rounded-full border border-border bg-muted/50 p-1 gsap-animate">
            <button
              onClick={() => setActiveTab("book")}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${
                activeTab === "book" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Book Appointment
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${
                activeTab === "status" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Check Status
            </button>
          </div>

          {activeTab === "book" ? (

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const phoneStr = formData.get("phone") as string;
              if (phoneStr) {
                const cleanPhone = phoneStr.replace(/\D/g, "");
                const existing = JSON.parse(localStorage.getItem("pulse_bookings") || "{}");
                existing[cleanPhone] = { status: "pending", timestamp: Date.now() };
                localStorage.setItem("pulse_bookings", JSON.stringify(existing));
              }
              setSent(true);
              setTimeout(() => {
                setOpen(false);
                setTimeout(() => setSent(false), 300);
              }, 2000);
            }}
          >
            <div className="grid gap-3 grid-cols-2">
              <div className="col-span-2 gsap-animate">
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                <input name="name" required placeholder="John Doe" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring transition-colors" />
              </div>
              
              <div className="col-span-2 sm:col-span-1 gsap-animate">
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mobile Number</label>
                <input name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring transition-colors" />
              </div>

              <div className="col-span-2 sm:col-span-1 gsap-animate">
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                <input name="email" type="email" required placeholder="john@example.com" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring transition-colors" />
              </div>

              <div className="col-span-1 gsap-animate">
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Date</label>
                <input name="date" type="date" required className="w-full rounded-xl border border-input bg-background px-2.5 py-2 text-sm outline-none focus:border-ring transition-colors" />
              </div>

              <div className="col-span-1 gsap-animate">
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Type</label>
                <select 
                  name="type" 
                  required 
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-2.5 py-2 text-sm outline-none focus:border-ring transition-colors"
                >
                  <option value="normal">Normal</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="col-span-2 gsap-animate">
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Address</label>
                <textarea name="address" required rows={1} placeholder="House No, Street..." className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring transition-colors resize-none" />
              </div>
            </div>
            
            <div className="mt-4 rounded-2xl bg-muted/40 p-2.5 px-3 border border-border flex items-center justify-between gsap-animate">
              <div className="flex items-center gap-2.5">
                <div className="bg-background rounded-full p-1.5 text-primary shadow-sm">
                  <ReceiptIndianRupee className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Consultation Fee</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{appointmentType === "emergency" ? "Priority assessment" : "Standard assessment"}</div>
                </div>
              </div>
              <div className="text-lg font-display font-bold text-primary">
                ₹{fee}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={sent}
              className="btn-lux mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.42_0.18_265)] to-[oklch(0.62_0.15_210)] px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 disabled:opacity-70 disabled:hover:scale-100 gsap-animate"
            >
              {sent ? "Request received ✓" : "Proceed & Pay"}
              {!sent && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          ) : (
            <div className="gsap-animate">
              <AppointmentStatus />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
