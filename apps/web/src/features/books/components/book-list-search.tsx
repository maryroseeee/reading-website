import { Input } from "@/components/ui/input";

type BookListSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export default function BookListSearch({
  value,
  onChange,
  placeholder,
}: BookListSearchProps) {
  return (
    <div className="mx-auto max-w-md">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="bg-background"
      />
    </div>
  );
}
