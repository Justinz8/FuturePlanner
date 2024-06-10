import './Sidebar.css'
import { useState, Children, useEffect } from 'react'
import CourseCard from '../MainContentComponents/BodyComponents/TimeTableComponents/CourseCardComponents/CourseCard'
import {useDroppable} from '@dnd-kit/core';
import SearchBar from './SearchBar/SearchBar';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

export default function Sidebar(props){
    const {isOver, setNodeRef} = useDroppable({
        id: `Container-SideBar`,
    });

    const [OffSetHeight, setOffSetHeight] = useState(92)

    function adjustHeight(value){
        setOffSetHeight(value.current.offsetHeight)   
    }

    return (
    <div ref={setNodeRef} className='SideBar'>
        <SearchBar addNewCourseCard={props.addNewCourseCard} adjustHeight={adjustHeight}/>
        <div className='SideBar-Content' style={{height: `calc(100% - ${OffSetHeight}px - 23px)`}}>
            {props.children}
        </div>
    </div>)
}