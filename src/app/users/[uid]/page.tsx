import { fetchUser, FetchError } from "@/lib/user/fetchUserData";
import ErrorPage from "@/components/Error"

export default async function UserDashboard({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  try {
    const user = await fetchUser(uid);
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
          <p className="text-gray-700">Welcome, {uid}!</p>
          <p className="text-gray-700">Email: {user.email}</p>
          <p className="text-gray-700">Joined: {user.createdAt.toLocaleString()}</p>

          {/* Add more user-specific content here */}
        </div>
      </div>
    );


  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "isFetchError" in error
    ) {
      const fetchError = error as FetchError;
      return (
        <ErrorPage message={fetchError.message} />
      );
    }
    // Fallback for unknown errors
    const unknownError =
      error instanceof Error ? error.message : "Unknown error";
    return <ErrorPage message={unknownError} />;
  }
}
