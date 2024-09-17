import { useQuery } from '@tanstack/react-query';
import { getGuests } from '../../services/apiGuests';
import toast from 'react-hot-toast';

function useGuests() {
  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: getGuests,
    onError: (err) => {
      console.log('error loading guests', err);
      toast.error('Error loading guests');
    },
  });
  return { guests, isLoading };
}

export default useGuests;
