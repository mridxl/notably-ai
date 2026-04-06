"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus, Search } from "lucide-react";
import { NoteCard } from "@/components/note-card";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "./actions";
import { useIsMobile } from "@/hooks/useMobile";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesClientComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  const notes = data?.notes ?? [];

  const filteredNotes =
    searchTerm.trim() === ""
      ? notes
      : notes.filter(
          (note) =>
            (note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ??
              false) ||
            (note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ??
              false) ||
            (note.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ??
              false),
        );

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <div className="relative w-full sm:max-w-xs md:max-w-md">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={isMobile ? "Search" : "Search notes..."}
              className="min-h-11 pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <Link href="/notes/create" className="w-full shrink-0 sm:w-auto">
            <Button
              className="flex w-full items-center justify-center gap-2 sm:w-auto"
              variant="default"
            >
              <Plus size={18} />
              {!isMobile && <span>Create Note</span>}
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid h-[calc(100svh-11rem)] gap-6 overflow-y-hidden px-2 max-sm:h-[calc(100svh-13rem)] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
          <Skeleton className="bg-card-background h-full min-h-[250px]" />
        </div>
      ) : error ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <h3 className="mb-2 text-xl font-medium text-red-500">
            Error loading notes
          </h3>
          <p className="text-muted-foreground mb-6">
            {error.message}. Please try refreshing the page.
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex h-[calc(100vh-14.5rem)] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          {searchTerm.trim() !== "" ? (
            <>
              <h3 className="mb-2 text-xl font-medium">
                No matching notes found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try using different keywords or clear the search
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                }}
                variant="default"
              >
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <FileText
                className="text-muted-foreground mb-4 h-12 w-12"
                strokeWidth={1.25}
                aria-hidden
              />
              <h3 className="mb-2 text-xl font-medium">No notes yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first note to get started
              </p>
              <Link href="/notes/create">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Create Note</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="mb-6 grid gap-6 px-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  );
}
