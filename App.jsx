import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

// 🔥 Firebase 설정 (나중에 본인 키로 교체)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 글 불러오기
  useEffect(() => {
    const loadPosts = async () => {
      const q = query(
        collection(db, "posts"),
        orderBy("date", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    };
    loadPosts();
  }, []);

  // 글 저장
  const addPost = async () => {
    if (!title || !content) return;

    await addDoc(collection(db, "posts"), {
      title,
      content,
      date: new Date().toISOString(),
    });

    setTitle("");
    setContent("");
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>조태희의 세상읽기</h1>

      {/* 관리자 글쓰기 */}
      <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 24 }}>
        <h3>✏️ 관리자 글쓰기</h3>
        <input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button onClick={addPost}>글 등록</button>
      </div>

      {/* 글 목록 */}
      {!selectedPost &&
        posts.map((post) => (
          <div
            key={post.id}
            style={{ borderBottom: "1px solid #eee", padding: 12, cursor: "pointer" }}
            onClick={() => setSelectedPost(post)}
          >
            <h3>{post.title}</h3>
            <small>{post.date?.slice(0, 10)}</small>
            <p>{post.content.slice(0, 80)}...</p>
          </div>
        ))}

      {/* 상세 보기 */}
      {selectedPost && (
        <div>
          <button onClick={() => setSelectedPost(null)}>← 뒤로</button>
          <h2>{selectedPost.title}</h2>
          <small>{selectedPost.date?.slice(0, 10)}</small>
          <p>{selectedPost.content}</p>
        </div>
      )}
    </div>
  );
}
