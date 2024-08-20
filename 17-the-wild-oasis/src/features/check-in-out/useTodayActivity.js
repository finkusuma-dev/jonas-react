import { useQuery } from '@tanstack/react-query';
import { getStaysTodayActivity } from '../../services/apiBookings';
import toast from 'react-hot-toast';

function useTodayActivity() {
  const { data: todayActivities, isLoading } = useQuery({
    queryKey: ['today-activity'],
    queryFn: getStaysTodayActivity,
    onError: (err) => toast.error(err.message),
  });
  return { todayActivities, isLoading };
}

export default useTodayActivity;
