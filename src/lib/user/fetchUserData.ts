interface UserData {
    uid: string;
    username: string;
    totalSeries: number;
    totalBooks: number;
    numFollowers: number;
    numFollowing: number;
    bio: string;
    image: string;
  }
  
  export interface FetchError {
    message: string;
    status?: number;
    isFetchError: true; // Unique identifier
  }
  
  export async function fetchPost(id: string): Promise<Post> {
    const posts: Post[] = [
      { id: "1", title: "First Post", content: "Hello world" },
      { id: "2", title: "Second Post" },
    ];
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const post = posts.find((p) => p.id === id);
    if (!post) {
      const error: FetchError = {
        message: `Post with id "${id}" not found`,
        status: 404,
        isFetchError: true,
      };
      throw error;
    }
    return post;
  }