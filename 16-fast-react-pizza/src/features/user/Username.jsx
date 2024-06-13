import { useSelector } from 'react-redux';

function Username() {
  const username = useSelector((store) => store.user.username);

  if (!username) return null;

  return (
    <p className="md: hidden text-sm font-semibold md:block">{username}</p>
  );
}

export default Username;
