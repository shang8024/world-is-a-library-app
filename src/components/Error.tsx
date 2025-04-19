"use client"
export default function ErrorPage({
  message,
}: {
  message?: string | null
}) {

  return (
    <div className="min-h-[calc(100svh-56px)] flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">{message || "An unknown error occurred"}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Try Again
      </button>
    </div>
  )
}