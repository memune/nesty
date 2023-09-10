import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { logoutUser } from '@/auth';
import { getUserMetadata } from '../firebase'; // Import our new function
import { auth } from '../firebase';
import { deleteMetadata } from '../firebase'; // Import our new function

function MetadataPage() {
  const [url, setUrl] = useState('');
  const [metadataList, setMetadataList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
        if (user) {
            // Fetch metadata from Firestore and set it in state
            getUserMetadata(user.uid).then(data => setMetadataList(data));
        }
    });

    // Clean up the onAuthStateChanged listener on unmount
    return unsubscribe;
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!url) {
      setError('Please enter a valid URL.'); // 링크가 비어있을 때 오류 메시지를 표시
      setLoading(false);
      return;
    }
  
    
    try {
      const response = await axios.get(`/api/get-metadata?url=${url}`);
      const currentTimestamp = new Date(); 
      const metadata = { ...response.data, url, userId: currentUser.uid, dateAdded: currentTimestamp  };
      
      // 리스트에 메타 데이터 추가
      setMetadataList(prevList => [...prevList, metadata]);

      // Firestore에 데이터 저장
      await addDoc(collection(db, 'metadata'), metadata);

      // URL 입력 초기화
      setUrl('');
    } catch (error) {
      console.error(error);
      setMetadataList(prevList => [...prevList, { url: url, error: 'Failed to fetch metadata' }]);
    }

    setLoading(false);
  };


  const handleDelete = async (docId, index) => {
    try {
      await deleteMetadata(docId);
      
      // UI에서 해당 항목 삭제
      setMetadataList(prevList => {
        const newList = [...prevList];
        newList.splice(index, 1);
        return newList;
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };


  const handleLogout = async () => {
    try {
        await logoutUser();
        console.log("Logged out successfully");
        // 여기에 로그아웃 후 원하는 작업을 추가하실 수 있습니다. (예: 페이지 리다이렉트)
    } catch (error) {
        console.error("Error during logout:", error);
    }
  };


  return (
    <div>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          border: 1px solid #ddd;
          padding: 15px;
          margin: 10px 0;
        }

        a {
          text-decoration: none;
          color: #333;
          transition: color 0.3s;
        }

        a:hover {
          color: #000;
        }

        button {
          background-color: #000;
          color: #fff;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        button:hover {
          background-color: #333;
        }

        form {
          margin-bottom: 20px;
        }

        input[type="text"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
        }

        button[type="submit"] {
          background-color: #000;
          color: #fff;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        button[type="submit"]:hover {
          background-color: #333;
        }
      `}
      </style>

      
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Enter URL" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          style={{ flex: '1', marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>공유하기</button>
      </form>


      <ul>
        {metadataList.map((data, index) => (
          <li key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <strong><a href={data.url} target="_blank" rel="noopener noreferrer">{data.title}</a></strong>
              <p>{data.description}</p>
              <p>{data.bodyContent}</p>
              <button onClick={() => handleDelete(data.docId, index)}>삭제하기</button>
            </div>
            <div style={{ width: '180px', height: '100px', overflow: 'hidden' }}>
              <img src={data.image} alt="Metadata Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </li>
        ))}
      </ul>

      <div>
        <p>{currentUser ? currentUser.email : 'Not logged in'}</p>
        <button onClick={handleLogout}>로그아웃</button>
      </div>

    </div>
  );
}

export default MetadataPage;






