"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formattedDate } from "@/lib/utils";

interface NoteContentProps {
  noteId: string;
}

export default function NoteContent({ noteId }: NoteContentProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data?.note) {
    return (
      <Card className="mb-6 border-none shadow-sm">
        <CardContent className="p-6">
          <h1 className="text-xl font-bold text-red-500">Error loading note</h1>
          <p className="text-muted-foreground">
            Unable to load note content. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const note = data.note;

  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-6">
        <h1 className="mb-2 text-3xl font-bold">
          {note.title ?? "Untitled Note"}
        </h1>
        <p className="text-muted-foreground mb-6">
          Last updated: {formattedDate(note.updated_at)}
        </p>

        {note.summary && (
          <div className="bg-card-background mb-6 rounded-base border-2 border-border p-4 shadow-shadow">
            <h2 className="mb-2 text-lg font-semibold">Summary</h2>
            <p className="text-muted-foreground">{note.summary}</p>
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          {note.content ? (
            note.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground">No content</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
