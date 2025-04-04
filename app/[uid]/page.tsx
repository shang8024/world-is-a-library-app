
export default async function UserDashboard({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  try {
    // const user = await fetchUserData(uid); // Fetch user data from the server
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
          <p className="text-gray-700">Welcome, {uid}!</p>
          {/* Add more user-specific content here */}
        </div>
      </div>
    );


  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
