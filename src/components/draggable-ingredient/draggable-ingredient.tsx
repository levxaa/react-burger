import { useAppDispatch } from '@/services/store';
import {
  DragIcon,
  ConstructorElement,
} from '@krgaa/react-developer-burger-ui-components';
import {
  useDrag,
  type DragSourceMonitor,
  useDrop,
  type DropTargetMonitor,
} from 'react-dnd';

import type { moveIngredient } from '@/services/burger-constructor/reducer';
import type { TIngredient } from '@/utils/types';

import styles from './draggable-ingredient.module.css';

type DragItem = {
  index: number;
};

type DraggableIngredientProps = {
  item: TIngredient & { id: string };
  index: number;
  onRemove: (id: string) => void;
  moveIngredient: typeof moveIngredient;
};

export const DraggableIngredient = ({
  item,
  index,
  onRemove,
  moveIngredient,
}: DraggableIngredientProps): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const [{ isDragging }, dragRef] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'CONSTRUCTOR_INGREDIENT',
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop<DragItem, unknown, { isOver: boolean }>({
    accept: 'CONSTRUCTOR_INGREDIENT',
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index !== index) {
        dispatch(
          moveIngredient({
            fromIndex: draggedItem.index,
            toIndex: index,
          })
        );
        draggedItem.index = index;
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  console.log(isOver);
  return (
    <div
      ref={(node) => {
        if (node) {
          dragRef(node);
          dropRef(node);
        }
      }}
      className={styles.list_item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onRemove(item.id)}
      />
    </div>
  );
};
