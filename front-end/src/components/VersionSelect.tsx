import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import type { Book } from "@/components/ShelfCard";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";

interface VersionSelectProps {
  versions: Book[];
  selected: Book;
  onChange: (book: Book) => void;
}

export default function VersionSelect({ versions, selected, onChange }: VersionSelectProps) {
    const [open, setOpen] = useState(false);
    const [pageCount, setPageCount] = useState("" + (selected.pageCount ?? ""));
    const [cover, setCover] = useState<string | undefined>(selected.thumbnail);
  
    const handleSave = () => {
      onChange({
        ...selected,
        googleId: "custom",
        pageCount: pageCount ? parseInt(pageCount, 10) : undefined,
        thumbnail: cover,
      });
      setOpen(false);
    };
  return (
    <>
    <Select
      value={selected.googleId}
      onValueChange={(val) => {
        if (val === "__custom") {
          setOpen(true);
          return;
        }
        const found = versions.find((v) => v.googleId === val);
        if (found) onChange(found);
      }}
    >
      <SelectTrigger className="w-[140px]">
        <span>Change version</span>
      </SelectTrigger>
      <SelectContent>
        {versions.map((v) => (
          <SelectItem key={v.googleId} value={v.googleId!}>
            <div className="flex items-center gap-2">
              {v.thumbnail && (
                <img src={v.thumbnail} alt="" className="w-8 h-12 object-cover" />
              )}
              <span className="text-left">{v.pageCount ?? "?"} pages</span>
            </div>
          </SelectItem>
        ))}
        <SelectItem value="__custom">No matches?</SelectItem>
      </SelectContent>
    </Select>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your version</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Page Count</label>
            <Input
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Cover URL</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCover(URL.createObjectURL(file));
                }
              }}
            />
            {cover && (
              <div className="mt-2">
                <img src={cover} alt="" className="w-8 h-12 object-cover" />
              </div>
            )}
            
            {versions.some((v) => v.thumbnail) && (
              <div className="flex gap-2 mt-2">
                {versions
                  .filter((v) => v.thumbnail)
                  .map((v) => (
                    <button
                      type="button"
                      key={v.googleId}
                      onClick={() => setCover(v.thumbnail)}
                      className={`border-2 rounded-sm overflow-hidden w-8 h-12 flex-none ${
                        cover === v.thumbnail ? "border-main" : "border-border"
                      }`}
                    >
                      <img
                        src={v.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
              )}
              
            </div>
            </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="neutral">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}