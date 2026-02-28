import { createContext, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';

interface DragHandleContextValue {
	listeners: ReturnType<typeof useSortable>['listeners'];
	attributes: ReturnType<typeof useSortable>['attributes'];
}

export const DragHandleContext =
	createContext<DragHandleContextValue | null>(null);

export function useDragHandle() {
	return useContext(DragHandleContext);
}
