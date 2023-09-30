import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';


function Register({ onSwitch }) {
  const [nickname, setNickname] = useState(''); // 닉네임 상태 추가
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // 성공적으로 계정을 생성한 후에 다른 작업을 여기에 수행하실 수 있습니다.
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">회원가입</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        이미 계정이 있으신가요? <button onClick={onSwitch}>로그인</button>
      </p>
    </div>
  );
}

export default Register;
