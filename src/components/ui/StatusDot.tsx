import { UserStatus } from '../../types/index';

interface StatusDotProps {
  status?: UserStatus;
  className?: string;
}

const statusStyles: Record<UserStatus, string> = {
  [UserStatus.Online]: 'bg-green-500',
  [UserStatus.Away]: 'bg-orange-400',
  [UserStatus.Offline]: 'bg-gray-400',
};

function StatusDot({ status = UserStatus.Offline, className = '' }: StatusDotProps) {
  return (
    <span
      className={`block h-3 w-3 rounded-full ring-2 ring-black ${statusStyles[status]} ${className}`}
      aria-label={status}
    />
  );
}

export default StatusDot;
