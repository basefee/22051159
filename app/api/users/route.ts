import { NextResponse } from 'next/server';
import axios from 'axios';

const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjA0NzE1LCJpYXQiOjE3NDM2MDQ0MTUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijc4MzU4MTM3LTg0MjItNGRkYy1hMWNmLWZhZWIxNjNlZmNlNyIsInN1YiI6IjIyMDUxMTU5QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MTE1OUBraWl0LmFjLmluIiwibmFtZSI6ImdhcnYgYWdhcndhbCIsInJvbGxObyI6IjIyMDUxMTU5IiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiNzgzNTgxMzctODQyMi00ZGRjLWExY2YtZmFlYjE2M2VmY2U3IiwiY2xpZW50U2VjcmV0IjoiYWhGUlZjR1RVWXV2ZUhtWiJ9.fB5hFinL04IfrDMvIXLqe18pNxfoe49-P1c4NpimIrI";
const BASE_URL = 'http://20.244.56.144/evaluation-service';

const apiClient = axios.create({
  headers: { Authorization: TOKEN }
});

async function fetchAllUsers() {
  try {
    const response = await apiClient.get(`${BASE_URL}/users`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return {};
  }
}

async function fetchUserPosts(userId: string) {
  try {
    const response = await apiClient.get(`${BASE_URL}/users/${userId}/posts`);
    return response.data.posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const users = await fetchAllUsers();
    const usersWithPostCounts = await Promise.all(
      Object.keys(users).map(async (userId) => {
        const posts = await fetchUserPosts(userId);
        return {
          userid: userId,
          name: users[userId],
          postCount: posts.length
        };
      })
    );

    const topUsers = usersWithPostCounts
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Error generating top users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}