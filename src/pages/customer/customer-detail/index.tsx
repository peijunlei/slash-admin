import { useEffect } from 'react';

import { useParams } from '@/router/hooks';

function IndexPage() {
  // get id from url
  const { id } = useParams();
  console.log('id', id);
  useEffect(() => {}, []);
  return <div>Customer: {id}</div>;
}
export default IndexPage;
