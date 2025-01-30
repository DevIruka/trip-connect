interface AlertModalProps {
  message: string; // 알림 메시지
  show: boolean; // 표시 여부
}

const AlertModal = ({ message, show }: AlertModalProps) => {
  if (!show) return null;

  return (
    <div
      className="w-full max-w-[324px] h-[41px] bg-black/50 rounded-lg justify-center items-center gap-1 inline-flex overflow-hidden text-center text-white text-sm font-semibold fixed bottom-5 left-1/2 z-[100] transform -translate-x-1/2 transition-all duration-500 opacity-100"
      style={{ transition: 'opacity 1s ease-in-out, transform 1s ease' }}
    >
      {message}
    </div>
  );
};

export default AlertModal;
