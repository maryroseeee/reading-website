import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applyThemeColor,
  formatThemeColorName,
  getThemeColor,
  getSavedThemeColorName,
  THEME_COLORS,
} from "@/lib/theme-colors";

type ThemeColorSelectProps = {
  value?: string;
  onChange?: (themeColor: string) => void | Promise<void>;
};

export default function ThemeColorSelect({
  value,
  onChange,
}: ThemeColorSelectProps) {
  const [themeColor, setThemeColor] = useState("pink");

  useEffect(() => {
    setThemeColor(getThemeColor(value ?? getSavedThemeColorName()).name);
  }, [value]);

  const handleChange = (value: string) => {
    setThemeColor(value);
    applyThemeColor(value);
    void onChange?.(value);
  };

  return (
    <div className="mt-4 space-y-1 text-left">
      <label className="text-sm font-heading" htmlFor="theme-color">
        Theme Color
      </label>
      <Select value={themeColor} onValueChange={handleChange}>
        <SelectTrigger
          id="theme-color"
          className="bg-background text-foreground"
        >
          <SelectValue placeholder="Theme color" />
        </SelectTrigger>
        <SelectContent className="bg-background text-foreground">
          {THEME_COLORS.map((color) => (
            <SelectItem key={color.name} value={color.name}>
              <span
                className="size-4 rounded-full border-2 border-border"
                style={{ backgroundColor: color.main }}
              />
              {formatThemeColorName(color.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
