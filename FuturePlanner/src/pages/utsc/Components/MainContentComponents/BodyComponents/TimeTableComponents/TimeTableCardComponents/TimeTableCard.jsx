import './TimeTableCard.css'
import {useSortable, SortableContext} from '@dnd-kit/sortable';
import CourseCard from '../CourseCardComponents/CourseCard';
import {useDroppable} from '@dnd-kit/core';

export default function TimeTableCard(props){
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.Id});

  const style = {
    transform: `translate3d(${transform != null ? transform.x: 0}px, ${transform != null ? transform.y : 0}px, 0)`,
    transition
  };
  
    return (
      <div ref={setNodeRef} style={style} {...attributes}  className='TimeTableCard'>
        <header className='TimeTableCard-Header' >
          <div className='TimeTableCard-Listener' {...listeners}>
            <div />
          </div>
          <input type='text' value={`${props.name}`} onChange = {(e) => props.updateTimeTableCardName(props.Id, e.target.value)} className='TimeTableCard-Title' />
          <div className='TimeTableCard-Delete-Wrapper'>
            <div className='TimeTableCard-Delete' onClick={() => props.deleteObject("TimeTableCard", props.Id)} />
          </div>
        </header>
        <div className='TimeTableCard-Body'>
          {(props.activeDND && props.Id === props.activeDND.id) && <div className='obstructor-DND'/>}
          {props.children}
        </div>
      </div>
    )
}