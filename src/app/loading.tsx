export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mb-4"></div>
        <h2 className="text-xl font-semibold text-green-800">
          天気データを読み込み中...
        </h2>
        <p className="text-green-600 mt-2">しばらくお待ちください</p>
      </div>
    </div>
  );
}
