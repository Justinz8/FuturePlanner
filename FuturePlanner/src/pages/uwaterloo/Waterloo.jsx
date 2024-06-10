import './Waterloo.css'
import MainContent from './Components/MainContentComponents/MainContent'
import Sidebar from './Components/SideBarComponents/Sidebar'
import CourseCard from './Components/MainContentComponents/BodyComponents/TimeTableComponents/CourseCardComponents/CourseCard';
import {SortableContext, sortableKeyboardCoordinates, arrayMove} from '@dnd-kit/sortable';
import { closestCorners, pointerWithin, useSensor, useSensors, PointerSensor, KeyboardSensor, DragOverlay } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import TimeTableCard from './Components/MainContentComponents/BodyComponents/TimeTableComponents/TimeTableCardComponents/TimeTableCard';

import {DndContext} from '@dnd-kit/core';
function App() {

  //Keyboard sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    }),
  );

  //Vars that dictate the state of the planner:
  //handles which coursecards are in which conteiners
  const [CourseCards, SetCourseCards] = useState([{Courses: [], Id: "Container-SideBar", name: "SideBar"},
                                                  {Courses: [], Id:`Container-Timetable-1`, name: "TimeTableCard-1"}])

  //total number of timetablecards and coursecards created so far (for id purposes) 
  const [nmbTimeTableCards, SetNmbTimeTableCards] = useState(1)
  const [nmbCourseCards, SetNmbCourseCards] = useState(1)

  //name of current timetable (need to format)
  const [TimeTableName, SetTimeTableName] = useState("TimeTable-1")

  //List of timetable names that the current user has
  const [TimeTableNames, SetTimeTableNames] = useState([])

  //helper function that changes the current timetable name given the name
  function changeTimeTableName(name){
    SetTimeTableName(name)
  }

  //on render fetches the list of timetable names that the current user has
  useEffect(()=>{
    updateLoadPlannerList()
  }, [])

  //Saves the current timetable to the database and updates the list of timetables under load timetables
  async function saveTimeTable(){
    fetch('http://localhost:3000/savetimetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({TimeTableName: TimeTableName, 
                            TimeTable: CourseCards, 
                            nmbTimeTableCards: nmbTimeTableCards, 
                            nmbCourseCards:nmbCourseCards,
                            TimeTableType: 'UW'}),
      credentials: "include"
    }).then(() => updateLoadPlannerList()).catch(err => console.log(err.error))
  }

  //Deletes a timetable from the database and updates the list of timetables under load timetables given the name of the timetable
  async function DeleteTimeTable(name){
    fetch('http://localhost:3000/deletetimetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({TimeTableName: name, 
                            TimeTableType: 'UW'}),
      credentials: "include"
    }).then(() => updateLoadPlannerList()).catch(err => console.log(err.error))
  }

  //Fetches the list of timetable names that the current user has
  async function updateLoadPlannerList(){
    fetch('http://localhost:3000/gettimetableNames', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TimeTableType: 'UW'
      }),
      credentials: 'include'
    }).then((result) => {
      return result.json()
    }).then((data) =>{
      SetTimeTableNames(data)
    }).catch(err=>console.log(err))
  }

  //Given the timetable name fetches the timetable from the database and updates the state of the planner
  async function loadTImeTable(TimeTableName){
    fetch('http://localhost:3000/getTimeTableById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({TimeTableName: TimeTableName, 
                            TimeTableType: 'UW'}),
      credentials: "include"
    }).then(result => result.json()).then(data => {
      SetTimeTableName(data.timetablename)
      SetNmbCourseCards(parseInt(data.coursecardnmb))
      SetNmbTimeTableCards(parseInt(data.timetablenmb))
      SetCourseCards(JSON.parse(data.timetablecontent))
      
    }).catch(err => console.log(err))
  }

  //variable that stores the functions that the loader has to call
  const LoaderFuncs = {
    changeTimeTableName: changeTimeTableName,
    saveTimeTable: saveTimeTable,
    loadTImeTable:loadTImeTable,
    DeleteTimeTable:DeleteTimeTable
  }

  //on load if the local storage contains values for the planner then update the state of the planner to those values
  useEffect(() => {
    const LSCourseCards = localStorage.getItem('CourseCards-UW')
    const LSNmbTimeTableCards = localStorage.getItem('nmbTimeTableCards-UW')
    const LSNmbCourseCards = localStorage.getItem('nmbCourseCards-UW')
    const LSTimeTableName = localStorage.getItem('TimeTableName-UW')
    if (LSCourseCards) {
      SetCourseCards(JSON.parse(LSCourseCards))
    }
    if (LSNmbTimeTableCards) {
      SetNmbTimeTableCards(JSON.parse(LSNmbTimeTableCards))
    }
    if(LSNmbCourseCards){
      SetNmbCourseCards(JSON.parse(LSNmbCourseCards))
    }
    if(LSTimeTableName){
      SetTimeTableName(JSON.parse(LSTimeTableName))
    }
  }, [])

  //if any of the values of the planner changes also update the localstorage so data saves inbetween refreshes
  useEffect(() => {
    localStorage.setItem('CourseCards-UW', JSON.stringify(CourseCards))
  }, [CourseCards])

  useEffect(() => {
    localStorage.setItem('nmbTimeTableCards-UW', JSON.stringify(nmbTimeTableCards))
  }, [nmbTimeTableCards])

  useEffect(() => {
    localStorage.setItem('nmbCourseCards-UW', JSON.stringify(nmbCourseCards))
  }, [nmbCourseCards])

  useEffect(() => {
    localStorage.setItem('TimeTableName-UW', JSON.stringify(TimeTableName))
  }, [TimeTableName])

  //functions that manipulate the state of the planner:

  //delete a coursecard or timetablecard dictated by ObjectType with id Id from the planner
  function deleteObject(ObjectType, Id){
    if (ObjectType === "CourseCard") {
      SetCourseCards(prevCourseCards => {
        let newCourseCards = [...prevCourseCards]
        newCourseCards.forEach(Container => {//for each container filter out the coursecard with the id Id
          Container.Courses = Container.Courses.filter(CourseCard => CourseCard.Id !== Id)
        })
        return newCourseCards
      })
    }
    else if (ObjectType === "TimeTableCard") {
      SetCourseCards(prevCourseCards => {
        let newCourseCards = [...prevCourseCards]
        newCourseCards = newCourseCards.filter(Container => Container.Id !== Id)//filter out contianer with id Id
        return newCourseCards
      })
    }
  }

  //add a new coursecard to the sidebar with the course information contained in courseObject
  function addNewCourseCard(courseObject){
    SetNmbCourseCards(x => x+1)
    SetCourseCards(prevCourseCards => {
      let newCourseCards = [...prevCourseCards]
      newCourseCards[newCourseCards.findIndex(Container => Container.Id==="Container-SideBar")].Courses.push({Id: `CourseCard-${nmbCourseCards+1}`, 
                                                                                                              courseInfo: {courseID: courseObject.courseID,
                                                                                                                           courseName: courseObject.courseName,
                                                                                                                           courseType: courseObject.courseType,
                                                                                                                           courseDescription: courseObject.courseDescription,
                                                                                                                           coursePrereqs: courseObject.coursePrereqs}})
      return newCourseCards
    })
  }

  //update the name of the timetablecard with id Id to Name
  function updateTimeTableCardName(Id, Name){
    SetCourseCards(x => {
      const CurTimeTableCardIndex = x.findIndex(Card => Card.Id === Id)

      if (CurTimeTableCardIndex === -1) {
        return x
      }

      let newCourseCards = [...x]
      newCourseCards[CurTimeTableCardIndex].name=Name
      return newCourseCards
    })
  }

  //adds a timetable card with no coursecards and default name to the planner
  function addTimeTableCard(){
    SetNmbTimeTableCards(x => x+1)
    SetCourseCards(prevCourseCards => {
      let newCourseCards = [...prevCourseCards]
      newCourseCards.push({Courses: [], Id:`Container-Timetable-${nmbTimeTableCards+1}`, name: `TimeTableCard-${nmbTimeTableCards+1}`})
      return newCourseCards
    })
  }

  //DND related functions:

  //State that tracks which object is currently being dragged
  const [activeDND, SetActiveDND] = useState(null)

  //Sets the activeDND state to the object being dragged on dragstart
  function handleDragStart(event){
    SetActiveDND(event.active)
  }

  //helper function that gets the container that the coursecard is in given the CourseCardId
  function getContainerOfCourseCard(CourseCardId){
    return CourseCards.find(CourseCards => CourseCards.Courses.find(CourseCard => CourseCard.Id===CourseCardId))
  }

  //handles coursecard dragging over a container/ another coursecard and container dragging over a container
  function DragMoveDragEndHelper(event, type){ //1 = dragend, 0 = dragmove
    const {active, over} = event //destructer the object being dragged (active) and the current container its over (over)

    //handle switches between containers during dragging a coursecard

    //CourseCard dragged over another course card
    if(active.id.toString().includes('CourseCard') && 
      over.id.toString().includes('CourseCard') && 
      active.id !== over.id){
      
      //get the container of the active and over coursecard
        
      let activeContainer = getContainerOfCourseCard(active.id.toString())
      let overContainer = getContainerOfCourseCard(over.id.toString())

      if (!activeContainer || !overContainer) return
      
      //if the active and over coursecard are in different containers then update which container the active coursecard is located in
      //if handling dragend then update the final position of the active coursecard regardless of containers
      if (activeContainer !== overContainer || type){ 
        activeContainer = activeContainer.Id
        overContainer = overContainer.Id
        
        //find indicies of the active and over containers, and the active and over coursecards
        const ActiveContainerIndex = CourseCards.findIndex(Container => Container.Id === activeContainer)
        const OverContainerIndex = CourseCards.findIndex(Container => Container.Id === overContainer)

        const ActiveItemIndex = CourseCards[ActiveContainerIndex].Courses.findIndex(CourseCard => CourseCard.Id === active.id)
        const OverItemIndex = CourseCards[OverContainerIndex].Courses.findIndex(CourseCard => CourseCard.Id === over.id)

        //update the state of the coursecard containers by putting the active coursecard in the over container at the right coursecard index
        SetCourseCards(prevCourseCards => {
          let newCourseCards = [...prevCourseCards]
          const temp = newCourseCards[ActiveContainerIndex].Courses[ActiveItemIndex]
          newCourseCards[ActiveContainerIndex].Courses.splice(ActiveItemIndex, 1)
          newCourseCards[OverContainerIndex].Courses.splice(OverItemIndex, 0, temp)
          return newCourseCards
        })
      }
    }

    //CourseCard dragged over a container (mostly same logic as above)
    if(active.id.toString().includes('CourseCard') &&
       over.id.toString().includes('Container')){

        //get the container of the active coursecard and over container
        let activeContainer = getContainerOfCourseCard(active.id.toString())
        let overContainer = CourseCards.find(Container => Container.Id === over.id)

        if (!activeContainer || !overContainer) return
         
        activeContainer = activeContainer.Id
        overContainer = overContainer.Id

        //find indicies of the active and over containers, and the active coursecard

        const ActiveContainerIndex = CourseCards.findIndex(Container => Container.Id === activeContainer)
        const OverContainerIndex = CourseCards.findIndex(Container => Container.Id === overContainer)

        const ActiveItemIndex = CourseCards[ActiveContainerIndex].Courses.findIndex(CourseCard => CourseCard.Id === active.id)

        //update the state of the coursecard containers by pushing the active coursecard to the over container
        SetCourseCards(prevCourseCards => {
          let newCourseCards = [...prevCourseCards]
          const temp = newCourseCards[ActiveContainerIndex].Courses[ActiveItemIndex]
          newCourseCards[ActiveContainerIndex].Courses.splice(ActiveItemIndex, 1)
          newCourseCards[OverContainerIndex].Courses.push(temp)
          return newCourseCards
        })
        
    }

    //update the state of the coursecard containers by putting the active container at the over container index
    if(active.id.toString().includes('Container') &&
       over.id.toString().includes('Container') &&
       active.id !== over.id && type){
        //find indicies of the active and over containers
        const ActiveContainerIndex = CourseCards.findIndex(Container => Container.Id === active.id)
        const OverContainerIndex = CourseCards.findIndex(Container => Container.Id === over.id)

        //update the state of the coursecard containers by switching the active and over containers
        SetCourseCards(prevCourseCards => {
          let newCourseCards = [...prevCourseCards]
          const temp = newCourseCards[ActiveContainerIndex]
          newCourseCards.splice(ActiveContainerIndex, 1)
          newCourseCards.splice(OverContainerIndex, 0, temp)
          return newCourseCards
        })
    }
  }

  //updates the state of the coursecard containers on dragend and sets the active object being dragged to null
  function handleDragEnd(event) {
    DragMoveDragEndHelper(event, 1)
    SetActiveDND(null)
  }

   //updates the state of the coursecard containers on dragmove
  function handleDragMove(event){ 
    DragMoveDragEndHelper(event, 0)
  }

  //composed collision algorithm for DND
  function collisionAlgorithm(args){
    const pointerWithinCollision = pointerWithin(args)
    if (pointerWithinCollision.length>0) {//if there is an object detected with pointer collision then use pointer collision
      return pointerWithinCollision
    }
    return closestCorners(args)//if there is no pointer collision then use closest corners collision as a back up
  }

  //renders the object being dragged based on the activeDND state
  function DragOverlayRender(){
    if(activeDND!=null && activeDND.id.toString().includes('CourseCard')){ //if activeDND is a coursecard then render the coursecard dragoverlay
      let activeContainer = getContainerOfCourseCard(activeDND.id.toString()) //get container of the coursecard

      if (!activeContainer) return <CourseCard />//if the container is not found then return an empty coursecard

      const ActiveContainerIndex = CourseCards.findIndex(Container => Container.Id === activeContainer.Id)
      const ActiveItem = CourseCards[ActiveContainerIndex].Courses.find(CourseCard => CourseCard.Id === activeDND.id)

      return <CourseCard Content={ActiveItem.Content} courseInfo={ActiveItem.courseInfo}  />//reproduces the coursecard as a dragoverlay
    }
    else if(activeDND!=null && activeDND.id.toString().includes('Container')){ //if activeDND is a Container then render the timetablecard dragoverlay (only containers that are timetablecards are draggable)
      const e1 = CourseCards.find(val => val.Id===activeDND.id.toString()) //get the container based on container id in activeDND

      const CourseCards1 = e1.Courses.map(e => <CourseCard key={e.Id} Id={e.Id} Content={e.Content} courseInfo={e.courseInfo} />)
      const items = e1.Courses.map(e => e.Id)
      
      return (//reproduces the timetablecard as a dragoverlay
      <TimeTableCard key={e1.Id} Id={e1.Id} name={e1.name}>
          <SortableContext items={items}>
              {CourseCards1}
          </SortableContext>
      </TimeTableCard>
      )
    } 
  }

  //variables that store the sidebar coursecards
  const SideBarCourses=CourseCards.find(val => val.Id==="Container-SideBar")
  const SideBarCourseCards = SideBarCourses.Courses.map(e => <CourseCard key={e.Id} Id = {e.Id} courseInfo={e.courseInfo} activeDND = {activeDND} deleteObject={deleteObject}/>)
  const SideBaritems = SideBarCourses.Courses.map(e => e.Id)

  return (
    <div className='Page-Wrapper'>
      <DndContext onDragStart={handleDragStart}
                  onDragOver={handleDragMove}
                  onDragEnd={handleDragEnd}
                  collisionDetection={collisionAlgorithm}
                  sensors={sensors}>

        <MainContent activeDND = {activeDND} 
                    TimeTablesCards = {CourseCards.filter(val => val.Id!=="Container-SideBar")} 
                    addTimeTableCard = {addTimeTableCard}
                    updateTimeTableCardName = {updateTimeTableCardName}
                    deleteObject={deleteObject}
                    LoaderFuncs={LoaderFuncs}
                    TimeTableName = {TimeTableName}
                    TimeTableNames={TimeTableNames}/>

        <Sidebar  addNewCourseCard={addNewCourseCard}>
          <SortableContext items={SideBaritems}>
              {SideBarCourseCards}
          </SortableContext>
        </Sidebar>

        <DragOverlay adjustScale={false}>
          <DragOverlayRender />
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default App
