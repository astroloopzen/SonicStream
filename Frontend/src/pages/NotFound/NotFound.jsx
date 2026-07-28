import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="text-gray-400 mb-8">Page not found</p>
    <Link to="/"><Button>Go Home</Button></Link>
  </div>
);
export default NotFound;