import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { Book } from "../types/book";
import CompletionDatePicker from "./completion-date-picker";

type CustomBookDialogProps = {
  open: boolean;
  initialTitle: string;
  onOpenChange: (open: boolean) => void;
  onSave: (
    book: Book,
    options?: {
      completedDate?: Date;
      currentlyReading?: boolean;
      wantToRead?: boolean;
    },
  ) => void;
};

export default function CustomBookDialog({
  open,
  initialTitle,
  onOpenChange,
  onSave,
}: CustomBookDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [authors, setAuthors] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [cover, setCover] = useState<string>();
  const [completedDate, setCompletedDate] = useState<Date>();
  const [currentlyReading, setCurrentlyReading] = useState(false);
  const [wantToRead, setWantToRead] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(initialTitle);
    setCompletedDate(undefined);
    setCurrentlyReading(false);
    setWantToRead(false);
  }, [initialTitle, open]);

  const handleCoverChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const aspect = 2 / 3;
        const imgW = img.width;
        const imgH = img.height;
        let cropW = imgW;
        let cropH = imgH;
        if (imgW / imgH > aspect) {
          cropW = imgH * aspect;
        } else {
          cropH = imgW / aspect;
        }
        const sx = (imgW - cropW) / 2;
        const sy = (imgH - cropH) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
        setCover(canvas.toDataURL("image/jpeg"));
      };
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(
      {
        googleId: `custom-${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`,
        title: title.trim(),
        authors: authors
          .split(",")
          .map((author) => author.trim())
          .filter(Boolean),
        pageCount: pageCount ? Number(pageCount) : undefined,
        thumbnail: cover,
      },
      {
        completedDate: currentlyReading || wantToRead ? undefined : completedDate,
        currentlyReading,
        wantToRead,
      },
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your version</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <Input
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="Author, second author"
          />
          <Input
            type="number"
            min="1"
            value={pageCount}
            onChange={(e) => setPageCount(e.target.value)}
            placeholder="Page count"
          />
          <CompletionDatePicker
            date={completedDate}
            onChange={(date) => {
              setCompletedDate(date);
              setCurrentlyReading(false);
              setWantToRead(false);
            }}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={currentlyReading}
              onChange={(e) => {
                setCurrentlyReading(e.target.checked);
                if (e.target.checked) {
                  setCompletedDate(undefined);
                  setWantToRead(false);
                }
              }}
            />
            Currently reading
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wantToRead}
              onChange={(e) => {
                setWantToRead(e.target.checked);
                if (e.target.checked) {
                  setCompletedDate(undefined);
                  setCurrentlyReading(false);
                }
              }}
            />
            Want to read
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleCoverChange(e.target.files?.[0])}
          />
          {cover && (
            <img src={cover} alt="" className="h-24 w-16 rounded-sm object-cover" />
          )}
        </div>
        <DialogFooter>
          <Button variant="neutral" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !title.trim() ||
              (!completedDate && !currentlyReading && !wantToRead)
            }
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
