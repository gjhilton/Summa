import { Renderer } from './display/Renderer';
import { DUMMY_DATA } from './display/ScreenMain';

export default function App() {
	return <Renderer data={DUMMY_DATA} />;
}
