import './CourseCard.css'
import {useSortable} from '@dnd-kit/sortable';

import { useState } from 'react';

import { CSS } from "@dnd-kit/utilities";

import snowflake from '../../../../../../../assets/snowflake.png'
import sun from '../../../../../../../assets/sun_1102121.png'
import leaf from '../../../../../../../assets/maple-leaf.png'
import plant from '../../../../../../../assets/plant.png'

export default function CourseCard(props){
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.Id});

  const [ShowMoreInfo, SetShowMoreInfo] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...props.adjustedMargin
  };

  function getOfferingProps(e){
    switch(e){
      case "Winter":
        return {img: snowflake, color: "#9EFFEE"}
      case "Spring":
        return {img: plant, color: "#B1E58F"}
      case "Fall":
        return {img: leaf, color: "#FFC187"}
    }
  }


  const Offerings = props.courseInfo.courseType.sort().map(e => {const OfferingProps = getOfferingProps(e)                                             
                                                                 return (<div key={e} className='CourseCard-CourseOffering' style={{backgroundColor: OfferingProps.color}}>
                                                                             <div className='CourseCard-CourseOffering-Body'>
                                                                              <img src={OfferingProps.img} className='CourseCard-CourseOffering-Icon'/>
                                                                               <h4 className='CourseCard-CourseOffering-Title'>{e}</h4>
                                                                             </div>
                                                                         </div>)})
  
    const GeneralActiveTextStyle = {overflow: "visible ",
                                    textOverflow: "clip",
                                    textWrap: "wrap"}
    
    const ActiveCourseCardStyle = {height: "fit-content"}

    return (
        <div ref={setNodeRef} style={ShowMoreInfo ? {...style, height: "fit-content"} : style} {...attributes} className='CourseCard'>
          <div {...listeners} className='CourseCard-Body'>
            <div className='CourseCard-CourseID-Wrapper'>
              <h3 className='CourseCard-CourseID'>
                {props.courseInfo.courseID}
              </h3>
              <div className='CourseCard-CourseID-Underline' />
            </div>
            
            <h4 className='CourseCard-CourseName' style={ShowMoreInfo ? GeneralActiveTextStyle : {}}>
              {props.courseInfo.courseName}
            </h4>
            <p className='CourseCard-Prereqs' style={ShowMoreInfo ? GeneralActiveTextStyle : {}}>
              {props.courseInfo.coursePrereqs ? props.courseInfo.coursePrereqs : "No Prerequisites"}
            </p>
            {ShowMoreInfo && 
            <div className='CourseCard-Description-Wrapper'>
              <p className='CourseCard-Description'>
                {props.courseInfo.courseDescription}
              </p>
            </div>}
            <div className='CourseCard-Offerings-Wrapper'>
              {Offerings}
            </div>
          </div>
          {props.activeDND && props.Id === props.activeDND.id && <div className='obstructor-DND'/>}
          <div className='CourseCard-Buttons-Wrapper'>
            <button className='CourseCard-Button-Wrapper' onClick={()=> SetShowMoreInfo(x=>!x)}>
              <div className='CourseCard-Info-Circle'>
                <p>i</p>
              </div>
            </button>
            <button className='CourseCard-Button-Wrapper' onClick={() => props.deleteObject("CourseCard", props.Id)}>
              <div className='CourseCard-Delete'  />
            </button>
          </div>

        </div>
    )
}