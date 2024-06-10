import './SearchBar.css'
import Courses from '../../../CourseInformation-UW/CoursesUW.json'
import { useState, useEffect, useRef } from 'react'
import FiltersButton from './SearchBarComponents/FiltersButton/FiltersButton'
import FiltersMenu from './SearchBarComponents/FiltersMenu/FiltersMenu'

export default function SearchBar(props){

    const [SearchCourses, setSearchCourses] = useState("")
    const [SearchResults, setSearchResults] = useState([])
    const [SearchResultsVisible, SetSearchResultsVisible] = useState(false)
    const SearchCoursesRef = useRef(null)

    useEffect(() => {
        function handleClick(e) {
            if (SearchCoursesRef.current && !SearchCoursesRef.current.contains(e.target)) {
                SetSearchResultsVisible(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    }, [])

    const [customCourseCardForm, setCustomCourseCardForm] = useState({courseID: "", courseName: "", courseDescription: "", coursePrereqs: "", courseExclusions: "", courseType:[]})

    const [DropdownVisible, setDropdownVisible] = useState(false)

    const [SpringFilter, setSpringFilter] = useState(false)
    const [WinterFilter, setWinterFilter] = useState(false)
    const [FallFilter, setFallFilter] = useState(false)
    const [SubjectFilter, setSubjectFilter] = useState("ALL")
    const [YearFilter, setYearFilter] = useState("ALL")

    const SearchBar = useRef(null)
    

    function handleChange(e){
        setSearchCourses(e.target.value)
    }
    // course subject in uw course code is a substring of letters always appearing before the first number
    function getCourseSubject(courseID) {
        let i = 0
        while (courseID[i] <= '0' || courseID[i] >= '9') {
            i++
        }
        return courseID.substring(0, i)
    }
    // course year is always first number to come after subject in uw course code
    function getCourseYear(courseID) {
        let i = 0
        while (courseID[i] <= '0' || courseID[i] >= '9') {
            i++
        }
        return courseID.substring(i, i + 1)
    }
    // see utsc side for explanations, most is the same
    useEffect(() => {
        if (SearchCourses === "") {
            setSearchResults([])
            return
        }
        const results = Courses.courseList.filter(course =>{
            let a = course.courseID.toLowerCase().includes(SearchCourses.toLowerCase())
            if (SpringFilter === true) {
                a = a && course.courseType.includes("Spring")
            }
            if (WinterFilter === true) {
                a = a && course.courseType.includes("Winter")
            }
            if (FallFilter === true) {
                a = a && course.courseType.includes("Fall")
            }
            // when subject specified, apply subject filter based on uw course code standards
            if (SubjectFilter !== "ALL") {
                a = a && getCourseSubject(course.courseID) === SubjectFilter
            }
            // when year specified, apply year filter based on uw course code standards
            if (YearFilter !== "ALL") {
                a = a && getCourseYear(course.courseID) === YearFilter
            }
            return a
        });
        
        
        setSearchResults(results);
    }, [SearchCourses, SpringFilter, WinterFilter, FallFilter, SubjectFilter, YearFilter]);

    function handleClickChange(e){
        const targetCourse = Courses.courseList.filter(course => course.courseID === e.currentTarget.value)
        props.addNewCourseCard(targetCourse[0])
        setSearchCourses('')
        setSearchResults([])
    }

    function customCourseCardFormHandler(e){
        
        setCustomCourseCardForm({...customCourseCardForm, [e.target.name]: e.target.value})
        
    }

    function customCourseCardFormSubmit(e){
        e.preventDefault()
        console.log(customCourseCardForm)
        props.addNewCourseCard(customCourseCardForm)
        setCustomCourseCardForm({courseID: "", courseName: "", courseDescription: "", coursePrereqs: "", courseExclusions: "", courseType:[]})
        setSearchCourses('')
        setSearchResults([])
    }



    function RenderSearchResults(){
        if(SearchResults.length === 0 && SearchCourses.length > 1){
            return (
                <div className='customCourseCard-Wrapper'>
                    <h4>It seems we can't find the course you're looking for</h4>
                    <p>Please fill in the information below to add the course</p>
                    <form onSubmit={customCourseCardFormSubmit} className='customCourseCard-Form'>
                        <label htmlFor='customCourseCardFormHandler-courseID'>Course Code</label>
                        <input type='text' maxLength="6" className='customCourseCardUW-textinput' id='customCourseCardFormHandler-courseID' name='courseID' value={customCourseCardForm.courseID} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-courseName'>Course Name</label>
                        <input type='text' className='customCourseCardUW-textinput'  id='customCourseCardFormHandler-courseName' name='courseName' value={customCourseCardForm.courseName} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-courseDescription'>Course Description</label>
                        <textarea name='courseDescription' className='customCourseCardUW-textarea' id='customCourseCardFormHandler-courseDescription' value={customCourseCardForm.courseDescription} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-coursePrereqs'>Course Prerequisites</label>
                        <textarea name='coursePrereqs' className='customCourseCardUW-textarea'  id='customCourseCardFormHandler-coursePrereqs' value={customCourseCardForm.coursePrereqs} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-courseExclusions'>Course Exclusions</label>
                        <textarea name='courseExclusions' className='customCourseCardUW-textarea'  id='customCourseCardFormHandler-courseExclusions' value={customCourseCardForm.courseExclusions} onChange={customCourseCardFormHandler}/>
                        <br />
                        <button type='submit' className='customCourseCardUW-Submit'>Submit</button>
                    </form>
                </div>
            )
        }
        
        return SearchResults.map(course => (
            <li key={course.courseID}>
                <button type="button" className='SearchBar-CourseUW' value={course.courseID} onClick={handleClickChange}>
                    <div>
                        <h3>{course.courseID}</h3>
                    </div>
                </button>
            </li>))
        


        
    }
  
    return (
    <div className='SearchBar' ref={SearchBar}>
        <h3 className='SearchBar-Title'>Search for Courses</h3>
        
        <div className='SearchBar-Wrapper' ref={SearchCoursesRef}>
            <input className='SearchBar-BarUW' type='text' maxLength="8" onChange={handleChange} onFocus={()=>SetSearchResultsVisible(true)} value={SearchCourses} placeholder=''/>
            {SearchCourses !== "" && SearchResultsVisible &&
            <div className='SearchBar-Results-Wrapper'>
                <ul className='SearchBar-Results'>
                    {RenderSearchResults()}
                </ul>
            </div>
            }
        </div>
        
        <FiltersButton label={"Filters"} handler={async () => {await setDropdownVisible(x => !x)
                                                               props.adjustHeight(SearchBar)}}/>
        {DropdownVisible && <FiltersMenu changeSpringFilterFunc={() => setSpringFilter(!SpringFilter)} 
                                         changeWinterFilterFunc={() => setWinterFilter(!WinterFilter)}
                                         changeFallFilterFunc={() => setFallFilter(!FallFilter)}
                                         changeSubjectFilterFunc={(e) => {setSubjectFilter(e.target.value)}}
                                         changeYearFilterFunc={(e) => {setYearFilter(e.target.value)}}
        />}
    </div>)
}