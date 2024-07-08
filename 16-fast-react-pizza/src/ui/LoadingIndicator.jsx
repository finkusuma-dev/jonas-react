function LoadingIndicator() {
  return (
    <div className="s absolute inset-0 flex items-center justify-center bg-slate-400/50 backdrop-blur-[2px]">
      <div className="loader"></div>
    </div>
  );
}

export default LoadingIndicator;
