import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// --- Types ---
export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  User?: { username: string };
}

interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
};

// --- Async Thunks (API Actions) ---

// 1. Fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await api.get('/posts');
  return response.data; // Axios puts the JSON in .data
});

// 2. Create a post
export const createPost = createAsyncThunk('posts/createPost', async (newPost: { title: string, content: string }) => {
  const response = await api.post('/posts', newPost);
  return response.data;
});

// 3. Update a post
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, title, content }: { id: number, title: string, content: string }) => {
  const response = await api.put(`/posts/${id}`, { title, content });
  return response.data;
});

// 4. Delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
  await api.delete(`/posts/${id}`);
  return id; // Return the ID so we know which one to remove from the list
});

// --- Slice ---
export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}, // No sync reducers needed
  extraReducers: (builder) => {
    builder
      // Fetch Logic
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = 'succeeded';
      })
      // Create Logic
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // Add new post to top
      })
      // Update Logic
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      // Delete Logic
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;