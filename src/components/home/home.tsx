export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Mind Space</h1>
      <div className="flex gap-4">
        <a href="/login" className="px-4 py-2 bg-blue-600 rounded">로그인</a>
        <a href="/signup" className="px-4 py-2 bg-gray-600 rounded">회원가입</a>
        <a href="/canvas" className="px-4 py-2 bg-green-600 rounded">캔버스</a>
      </div>
    </div>
  );
}
