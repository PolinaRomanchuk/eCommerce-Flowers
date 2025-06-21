import { createRoot } from 'react-dom/client';
import { App } from './App/App';
const root = document.getElementById('root');
import '../styles/index.scss';
if (!root) {
  throw new Error('root is not defined');
}
let container = createRoot(root);
container.render(<App />);
