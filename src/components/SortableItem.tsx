import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleContext } from './DragHandleContext';

interface SortableItemProps {
	id: string;
	children: React.ReactNode;
}

export default function SortableItem({ id, children }: SortableItemProps) {
	const {
		listeners,
		attributes,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	return (
		<DragHandleContext.Provider value={{ listeners, attributes }}>
			<div
				ref={setNodeRef}
				style={{
					transform: CSS.Transform.toString(transform),
					transition,
					opacity: isDragging ? 0.5 : 1,
					position: 'relative',
					zIndex: isDragging ? 1 : undefined,
				}}
			>
				{children}
			</div>
		</DragHandleContext.Provider>
	);
}
