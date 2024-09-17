import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { searchEmail } from '../../services/apiGuests';

function useSearchEmail({ search }) {
  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests', { searchEmail: search }],
    queryFn: () => searchEmail(search),
    onError: (err) => {
      console.log('error searching email', err);
      toast.error('Error searching email');
    },
  });

  return { guests, isLoading };
}

export default useSearchEmail;
