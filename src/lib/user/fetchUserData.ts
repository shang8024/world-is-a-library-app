import prisma from '@/db';

interface UserData {
    username: string;
    email: string;
    image: string | null;
    createdAt: Date;
  }
  
  export interface FetchError {
    message: string;
    status?: number;
    isFetchError: true; // Unique identifier
  }
  
  export async function fetchUser(uid: string) : Promise<UserData> {
    const user = await prisma.user.findFirst({
      where: { 
        username: uid,
      },
      select: {
        username: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    if (!user) {
      const error: FetchError = {
        message: `User with id "${uid}" not found`,
        status: 404,
        isFetchError: true,
      };
      throw error;
    }
    if (user.username === null) {
      const error: FetchError = {
        message: `User with id "${uid}" has a null username`,
        status: 500,
        isFetchError: true,
      };
      throw error;
    }
    return user as UserData;
  }