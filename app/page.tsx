'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    };
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('http://localhost:5000/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return alert('You must be logged in to post!'); // Basic guard

    const payload = { title, content };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:5000/posts/${editingId}`
      : 'http://localhost:5000/posts';

    // UPDATED: Using getAuthHeaders() for security
    const res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      // REMOVED: userId is no longer sent in the body
      body: JSON.stringify(payload), 
    });

    if (res.status === 403 || res.status === 401) {
      alert("Access Denied: You cannot modify this post.");
    }

    if (editingId) {
      setEditingId(null);
    }
    setTitle('');
    setContent('');
    fetchPosts();
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDelete = async (id: number) => {
    if (!user) return alert('You must be logged in to delete!');

    // UPDATED: Using getAuthHeaders() for security
    const res = await fetch(`http://localhost:5000/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.status === 403 || res.status === 401) {
      alert("Access Denied: You cannot delete this post.");
    }
    
    fetchPosts();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 max-w-md w-full text-center transform transition-all hover:scale-105">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Join our community to create and manage your stories.
          </p>
          <div className="space-y-4">
            <Link href="/login" className="block w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-bold shadow-lg transition-all duration-200">
              Login to Account
            </Link>
            <Link href="/register" className="block w-full py-4 px-6 bg-white border-2 border-purple-100 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all duration-200">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              ✨ Posts Manager
            </h1>
            <p className="text-gray-600 font-medium">Welcome back, <span className="text-purple-600">{user.username}</span>! 👋</p>
          </div>
          <button onClick={handleLogout} className="mt-4 md:mt-0 px-6 py-2 bg-red-50 text-red-500 rounded-xl font-medium hover:bg-red-100 transition-colors border border-red-100">
            Logout 🕸️
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            {editingId ? '✏️ Edit Post' : '➕ Create New Post'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" placeholder="Enter post title..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea placeholder="Write your content here..." rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none" value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            
            <div className="flex gap-3">
              <button type="submit" className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${editingId ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'}`}>
                {editingId ? '✅ Update Post' : '🚀 Create Post'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setTitle(''); setContent(''); }} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            📝 Your Posts ({posts.length})
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No posts yet</h3>
              <p className="text-gray-500">Create your first post to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post: any) => {
                const isOwner = user && post.userId === user.id;

                return (
                  <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight">{post.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-3">{post.content}</p>
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          By: {post.User ? post.User.username : 'Unknown'}
                        </div>
                      </div>
                      
                      {isOwner && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleEdit(post)} className="p-2 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-all duration-200 transform hover:scale-110" title="Edit post">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200 transform hover:scale-110" title="Delete post">
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}