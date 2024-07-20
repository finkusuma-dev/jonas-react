import { useQuery } from '@tanstack/react-query';
import { getSettingsApi } from '../../services/apiSettings';

export function useSettings() {
  const { isLoading, data: settings } = useQuery({
    queryFn: getSettingsApi,
    queryKey: ['settings'],
  });

  return { isLoading, settings };
}
