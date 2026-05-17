import { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = (id) => setToasts((current) => current.filter((toast) => toast.id !== id));

  const push = ({ title, description, variant = "success" }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, description, variant }]);
    window.setTimeout(() => remove(id), 4200);
  };

  const value = useMemo(
    () => ({
      toast: push,
      success: (title, description) => push({ title, description, variant: "success" }),
      error: (title, description) => push({ title, description, variant: "error" })
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className={cn(
                "rounded-lg border bg-card p-4 text-card-foreground shadow-panel",
                toast.variant === "error" && "border-destructive/40"
              )}
            >
              <div className="flex items-start gap-3">
                {toast.variant === "error" ? (
                  <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(toast.id)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
