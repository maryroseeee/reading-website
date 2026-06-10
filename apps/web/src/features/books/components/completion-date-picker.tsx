import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface CompletionDatePickerProps {
  date?: Date;
  onChange: (date: Date | undefined) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const onlyDigits = (s: string) => s.replace(/\D+/g, "");
const daysInMonth = (y: number, m0: number) => new Date(y, m0 + 1, 0).getDate();

export default function CompletionDatePicker({ date, onChange }: CompletionDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<null | "m" | "d" | "y">(null);
  const [mm, setMM] = useState(date ? pad2(date.getMonth() + 1) : "");
  const [dd, setDD] = useState(date ? pad2(date.getDate()) : "");
  const [yyyy, setYYYY] = useState(date ? String(date.getFullYear()) : "");
  const mRef = useRef<HTMLInputElement>(null);
  const dRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);
  const [calMonth, setCalMonth] = useState<Date>(() => {
    const b = date ?? new Date();
    return new Date(b.getFullYear(), b.getMonth(), 1);
  });

  useEffect(() => {
    if (isEditing !== null) return;
    setMM(date ? pad2(date.getMonth() + 1) : "");
    setDD(date ? pad2(date.getDate()) : "");
    setYYYY(date ? String(date.getFullYear()) : "");
    const b = date ?? new Date();
    setCalMonth(new Date(b.getFullYear(), b.getMonth(), 1));
  }, [date, isEditing]);

  useEffect(() => {
    if (isEditing === null) return;
    const today = new Date();
    const b = date ?? today;
    let y = yyyy ? Math.max(1, Math.min(9999, Number(yyyy))) : b.getFullYear();
    let m = mm ? Math.max(1, Math.min(12, Number(mm))) : b.getMonth() + 1;
    if (!Number.isFinite(y)) y = b.getFullYear();
    if (!Number.isFinite(m)) m = b.getMonth() + 1;
    const next = new Date(y, m - 1, 1);
    if (calMonth.getFullYear() !== next.getFullYear() || calMonth.getMonth() !== next.getMonth()) {
      setCalMonth(next);
    }
  }, [calMonth, date, isEditing, mm, yyyy]); 

  const label = useMemo(() => {
    if (yyyy.length === 4 && mm.length === 2 && dd.length === 2) {
      const y = +yyyy, m = +mm, d = +dd, dt = new Date(y, m - 1, d);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31 &&
          dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
        return format(dt, "MMM d, yyyy");
      }
    }
    return "Set date";
  }, [yyyy, mm, dd]);

  function commitIfComplete(nY = yyyy, nM = mm, nD = dd) {
    if (nY.length === 4 && nM.length === 2 && nD.length === 2) {
      const y = +nY, m = +nM, d = +nD;
      if (m >= 1 && m <= 12) {
        const maxD = daysInMonth(y || 2000, m - 1);
        const dClamped = Math.min(Math.max(d, 1), maxD);
        const norm = new Date(y, m - 1, dClamped);
        if (norm.getFullYear() === y && norm.getMonth() === m - 1 && norm.getDate() === dClamped) {
          onChange(norm);
        }
      }
    }
  }

  function finalizeMonthFromValue(v: string) {
    const raw = onlyDigits(v).slice(0, 2);
    if (!raw) return;
    let n = +raw; if (!Number.isFinite(n) || n < 1) n = 1; if (n > 12) n = 12;
    const out = pad2(n); if (out !== mm) setMM(out); commitIfComplete(yyyy, out, dd);
  }

  function finalizeDayFromValue(v: string) {
    const raw = onlyDigits(v).slice(0, 2);
    if (!raw) return;
    const y = +(yyyy || "2000");
    const m = Math.max(1, Math.min(12, +(mm || "1")));
    const maxD = daysInMonth(y, m - 1);
    let n = +raw; if (!Number.isFinite(n) || n < 1) n = 1; if (n > maxD) n = maxD;
    const out = pad2(n); if (out !== dd) setDD(out); commitIfComplete(yyyy, mm, out);
  }

  function handleMonthChange(v: string) {
    const raw = onlyDigits(v).slice(0, 2);
    if (!raw) return setMM("");
    if (raw.length < 2) return setMM(raw);
    let n = +raw; if (n < 1) n = 1; if (n > 12) n = 12;
    const out = pad2(n); setMM(out); dRef.current?.focus(); commitIfComplete(yyyy, out, dd);
  }

  function handleDayChange(v: string) {
    const raw = onlyDigits(v).slice(0, 2);
    if (!raw) return setDD("");
    if (raw.length < 2) return setDD(raw);
    const y = +(yyyy || "2000");
    const m = Math.max(1, Math.min(12, +(mm || "1")));
    const maxD = daysInMonth(y, m - 1);
    let n = +raw; if (n < 1) n = 1; if (n > maxD) n = maxD;
    const out = pad2(n); setDD(out); yRef.current?.focus(); commitIfComplete(yyyy, mm, out);
  }

  function handleYearChange(v: string) {
    const raw = onlyDigits(v).slice(0, 4);
    setYYYY(raw);
    if (raw.length === 4) commitIfComplete(raw, mm, dd);
  }

  function incDec(field: "m" | "d" | "y", dir: 1 | -1, e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    if (field === "m") {
      const n = +(mm || "1"); const next = Math.min(12, Math.max(1, n + dir)); const out = pad2(next);
      setMM(out);
      const y = +(yyyy || "2000"), maxD = daysInMonth(y, next - 1);
      if (dd) { const dN = Math.min(+dd, maxD), dOut = pad2(dN); if (dOut !== dd) setDD(dOut); commitIfComplete(yyyy, out, dOut); }
      else commitIfComplete(yyyy, out, dd);
    } else if (field === "d") {
      const y = +(yyyy || "2000"), m = +(mm || "1"), maxD = daysInMonth(y, Math.max(1, Math.min(12, m)) - 1);
      const n = +(dd || "1"); const next = Math.min(maxD, Math.max(1, n + dir)); const out = pad2(next);
      setDD(out); commitIfComplete(yyyy, mm, out);
    } else {
      const n = +(yyyy || "2000"); const next = Math.max(1, n + dir); const out = String(next).slice(0, 4);
      setYYYY(out); commitIfComplete(out, mm, dd);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="h-6 px-2 text-xs justify-start">
          <CalendarIcon className="mr-1 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 pb-0">
          <div className="flex items-center gap-1">
            <Input
              ref={mRef}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="MM"
              className="bg-background w-14 h-8 text-xs"
              value={mm}
              onFocus={(e) => { setIsEditing("m"); e.currentTarget.select(); }}
              onChange={(e) => handleMonthChange(e.currentTarget.value)}
              onBlur={(e) => { finalizeMonthFromValue(e.currentTarget.value); setIsEditing(null); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") incDec("m", 1, e);
                else if (e.key === "ArrowDown") incDec("m", -1, e);
                else if (e.key === "Backspace" && !mm) mRef.current?.select();
                else if (e.key === "/" || e.key === "ArrowRight") dRef.current?.focus();
              }}
            />
            <span className="text-xs opacity-70">/</span>
            <Input
              ref={dRef}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="DD"
              className="bg-background w-14 h-8 text-xs"
              value={dd}
              onFocus={(e) => { setIsEditing("d"); e.currentTarget.select(); }}
              onChange={(e) => handleDayChange(e.currentTarget.value)}
              onBlur={(e) => { finalizeDayFromValue(e.currentTarget.value); setIsEditing(null); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") incDec("d", 1, e);
                else if (e.key === "ArrowDown") incDec("d", -1, e);
                else if (e.key === "Backspace" && !dd) mRef.current?.focus();
                else if (e.key === "/" || e.key === "ArrowRight") yRef.current?.focus();
                else if (e.key === "ArrowLeft") mRef.current?.focus();
              }}
            />
            <span className="text-xs opacity-70">/</span>
            <Input
              ref={yRef}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="YYYY"
              className="bg-background w-20 h-8 text-xs"
              value={yyyy}
              onFocus={(e) => { setIsEditing("y"); e.currentTarget.select(); }}
              onChange={(e) => handleYearChange(e.currentTarget.value)}
              onBlur={() => { commitIfComplete(yyyy, mm, dd); setIsEditing(null); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") incDec("y", 1, e);
                else if (e.key === "ArrowDown") incDec("y", -1, e);
                else if (e.key === "Backspace" && !yyyy) dRef.current?.focus();
                else if (e.key === "ArrowLeft") dRef.current?.focus();
              }}
            />
          </div>
        </div>

        <Calendar
          mode="single"
          month={calMonth}
          onMonthChange={setCalMonth}
          selected={
            yyyy.length === 4 && mm.length === 2 && dd.length === 2
              ? new Date(+yyyy, +mm - 1, +dd)
              : undefined
          }
          onSelect={(d) => {
            if (!d) { setYYYY(""); setMM(""); setDD(""); onChange(undefined); return; }
            const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
            setIsEditing(null);
            setYYYY(String(y)); setMM(pad2(m)); setDD(pad2(day));
            setCalMonth(new Date(y, m - 1, 1));
            onChange(new Date(y, m - 1, day));
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
