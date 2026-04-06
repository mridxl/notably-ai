"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNoteById } from "@/app/(protected)/notes/actions";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { formattedDate } from "@/lib/utils";

interface NoteCardProps {
  note: {
    id: string;
    title: string | null;
    content: string | null;
    summary?: string | null;
    created_at: string;
    updated_at: string;
    user_id: string;
  };
}

export function NoteCard({ note }: NoteCardProps) {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteNote, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteNoteById(note.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note. Please try again.");
    },
  });

  const handleDelete = () => {
    deleteNote();
  };

  return (
    <>
      <Card className="bg-card-background flex h-full min-h-[250px] flex-col transition-all hover:shadow-md">
        <CardHeader className="flex min-h-[70px] flex-col">
          <div className="flex w-full justify-between gap-3">
            <CardTitle className="line-clamp-1 h-7 overflow-hidden text-xl">
              {note.title ?? "Untitled Note"}
            </CardTitle>
            <div className="flex shrink-0 gap-2">
              <Link href={`/notes/edit/${note.id}`}>
                <Button
                  variant="noShadow"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-main/15 hover:text-main"
                >
                  <span className="sr-only">Edit</span>
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="noShadow"
                size="sm"
                className="text-destructive h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <span className="sr-only">Delete</span>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Last updated {formattedDate(note.updated_at)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {note.summary ?? note.content?.substring(0, 300) ?? "No content"}
          </p>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Link href={`/notes/${note.id}`} className="w-full">
            <Button variant="noShadow" className="w-full">
              View Note
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="reverse"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
