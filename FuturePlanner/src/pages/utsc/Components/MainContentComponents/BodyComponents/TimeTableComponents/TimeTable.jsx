import './TimeTable.css'
import TimeTableCard from './TimeTableCardComponents/TimeTableCard'
import { SortableContext } from '@dnd-kit/sortable';
import CourseCard from './CourseCardComponents/CourseCard'
export default function TimeTable(props){

    const TimeTableCards = props.TimeTablesCards.map(e1 => {const CourseCards = e1.Courses.map((e, i) => {const margin = (i === e1.Courses.length - 1 ? {marginBottom: 0} : {}) //maps all course cards to jsx
                                                                                                          return <CourseCard key={e.Id} 
                                                                                                                  adjustedMargin={margin}
                                                                                                                  Id={e.Id} 
                                                                                                                  courseInfo={e.courseInfo}  
                                                                                                                  activeDND = {props.activeDND}
                                                                                                                  deleteObject={props.deleteObject}/>})
                                                            const items = e1.Courses.map(e => e.Id)
                                                            return (//maps all timetable cards to jsx with the course cards as children
                                                            <TimeTableCard key={e1.Id} 
                                                                           Id={e1.Id}  
                                                                           activeDND = {props.activeDND} 
                                                                           name = {e1.name}
                                                                           updateTimeTableCardName={props.updateTimeTableCardName}
                                                                           deleteObject={props.deleteObject}>
                                                                <SortableContext items={items}>
                                                                    {CourseCards}
                                                                </SortableContext>
                                                            </TimeTableCard>
                                                            )})
    const items = props.TimeTablesCards.map(e => e.Id)
    
    return (
        <div className='TimeTable-Wrapper'>
            <div className='TimeTable'>
                <SortableContext items={items}>
                    {TimeTableCards}
                </SortableContext>
                <button className='AddTimeTable-Button' onClick={props.addTimeTableCard}>
                    <div className='AddTimeTable-Button-Circle'>
                        <h4>
                            Add TimeTable
                        </h4>
                    </div>
                </button>
            </div>
        </div>
        
    )
}