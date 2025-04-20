"use client"
import { useSession } from "@/lib/auth/auth-client"
import Link from "next/link"

export default function Home() {
    const {
      data: session,
      isPending,
    } = useSession()
  return (
    <main className=" bg-white text-gray-900">
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-br from-indigo-100 to-white">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
      World Is a Library
    </h1>
    <p className="text-lg md:text-xl max-w-2xl mb-8">
      Share your knowledge. Publish chapters. Connect with readers.
    </p>
    <Link
      href="/books"
      className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
    >
      Start Exploring
    </Link>
  </section>

  {/* Features */}
  <section className="py-20 px-6 max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-center">
    <div>
      <h3 className="text-xl font-semibold mb-2">Create Chapters</h3>
      <p>Write and organize your thoughts like books or journal entries.</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">Share with the World</h3>
      <p>Publish public chapters, control privacy, and build your audience.</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">Simple and Clean</h3>
      <p>No distractions — just content and creativity.</p>
    </div>
  </section>

  <section className="py-12 pb-20 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-12">For Readers</h2>
        <div className="grid gap-12 md:grid-cols-3 text-center max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">Danmaku Comments</h3>
            <p>Leave floating comments directly over chapter content — react in real time.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Reading History</h3>
            <p>Pick up where you left off with smart tracking of your last read position.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Community Feedback</h3>
            <p>React, like, and comment on chapters to support your favorite writers.</p>
          </div>
        </div>
      </section>

  {/* Call to Action */}
  <section className="bg-indigo-50 py-16 px-6 text-center">
    <h2 className="text-3xl font-bold mb-4">Start writing today</h2>
    <p className="mb-6">Join writers and thinkers around the world</p>
    <Link
      href={isPending || !session ? "/login" : "/dashboard"}
      className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
    >
      Create Your First Chapter
    </Link>
  </section>
  </main>
  );
}
