"use client"
import React from "react";
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { ChapterIndexMenu } from "@/components/editor/ChapterIndexMenu";
import { EditorContextProvider } from "@/hooks/useEditorContext";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { bid } = useParams() as { bid: string };
  return (
    <div className="min-h-[calc(100vh-56px)] flex w-full items-center justify-center">
      <EditorContextProvider bookId={bid}>
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-56px)]">
          <ResizablePanel defaultSize={20} className="hidden sm:w-full bg-gray-100 border-r px-4 py-6 sm:flex flex-col space-y-4 dark:bg-gray-800 dark:border-gray-700">
            <ChapterIndexMenu />
          </ResizablePanel>
          <ResizableHandle withHandle className="hidden sm:flex"/>
          <ResizablePanel defaultSize={80}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </EditorContextProvider>
    </div>
  );
}
