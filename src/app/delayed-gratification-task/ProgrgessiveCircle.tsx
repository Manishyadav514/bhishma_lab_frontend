import { useEffect, useState } from "react";

const ProgressiveCircle = ({ setCircleCompStatus }: any) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCircleCompStatus(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 600); // 600ms interval to fill in 60 (600x100=300000ms) seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-52 h-52 rounded-full relative flex items-center justify-center shadow-xl border border-gray-300">
      <div
        className="absolute inset-0 rounded-full z-40"
        style={{
          background: `conic-gradient(#941212 ${progress}%, #dedee2 ${progress}%)`,
        }}
      ></div>
      <div className="w-44 h-44 bg-gray-100 rounded-full z-50 border border-gray-300"></div>
    </div>
  );
};

export default ProgressiveCircle;
