// src/components/Toast.jsx
import { useState, useEffect, useCallback } from 'react';

let showToastFn = null;

export function useToast() {
  return showToastFn;
}

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  const show = useCallback((message) => {
    setMsg(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 2800);
  }, []);

  useEffect(() => {
    showToastFn = show;
    return () => { showToastFn = null; };
  }, [show]);

  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      {msg}
    </div>
  );
}
