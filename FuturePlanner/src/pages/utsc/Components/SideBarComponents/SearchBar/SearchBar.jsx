import './SearchBar.css'
import Courses from '../../../CourseInformation-UTSC/Courses.json'
import { useState, useEffect, useRef } from 'react'
import FiltersButton from './SearchBarComponents/FiltersButton/FiltersButton'
import FiltersMenu from './SearchBarComponents/FiltersMenu/FiltersMenu'

export default function SearchBar(props){

    const [SearchCourses, setSearchCourses] = useState("") //value of the search bar
    const [SearchResults, setSearchResults] = useState([]) //results of the search bar
    const [SearchResultsVisible, SetSearchResultsVisible] = useState(false) //visibility of the search results
    const SearchCoursesRef = useRef(null) 

    //effect that closes the search results when the user clicks outside of the search bar
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

    //state that holds the values of the custom course card form
    const [customCourseCardForm, setCustomCourseCardForm] = useState({courseID: "", courseName: "", courseDescription: "", coursePrereqs: "", courseExclusions: "", courseType:[]})

    const [DropdownVisible, setDropdownVisible] = useState(false)//visibility of the filters dropdown

    //filter states
    const [SummerFilter, setSummerFilter] = useState(false)
    const [WinterFilter, setWinterFilter] = useState(false)
    const [FallFilter, setFallFilter] = useState(false)
    const [SubjectFilter, setSubjectFilter] = useState("ALL")
    const [YearFilter, setYearFilter] = useState("ALL")

    const SearchBar = useRef(null)
    
    //function that handles the change in the search bar
    function handleChange(e){
        setSearchCourses(e.target.value)
    }

    
    useEffect(() => {
        // if nothing in searchbar, dont search
        if (SearchCourses === "") {
            setSearchResults([])
            return
        }
        const results = Courses.courseList.filter(course =>{
            // courses which contain the string entered in search bar
            let a = course.courseID.toLowerCase().includes(SearchCourses.toLowerCase())
            // filter courses to only include those that are offered in summer (winter, fall)
            if (SummerFilter === true) {
                a = a && course.courseType.includes("Summer")
            }
            if (WinterFilter === true) {
                a = a && course.courseType.includes("Winter")
            }
            if (FallFilter === true) {
                a = a && course.courseType.includes("Fall")
            }
            // when subject specified, ensure subject code present in course code (all utsc course codes are 4 characters, so one subject is not a substring of another)
            if (SubjectFilter !== "ALL") {
                a = a && course.courseID.includes(SubjectFilter)
            }
            // utsc course codes have the course year as a letter which is always the 4th character
            if (YearFilter !== "ALL") {
                a = a && (course.courseID.charAt(3) === YearFilter)
            }
            return a
        });
        
        setSearchResults(results);
    }, [SearchCourses, SummerFilter, WinterFilter, FallFilter, SubjectFilter, YearFilter]);

    //adds a course card to the sidebar when a course is clicked given the name and resets search bar
    function handleClickChange(e){
        const targetCourse = Courses.courseList.filter(course => course.courseID === e.currentTarget.value)
        props.addNewCourseCard(targetCourse[0])
        setSearchCourses('')
        setSearchResults([])
    }

    //handles the change in the custom course card form
    function customCourseCardFormHandler(e){
        setCustomCourseCardForm({...customCourseCardForm, [e.target.name]: e.target.value})
    }

    //adds a course card to the sidebar when the custom course card form is submitted and resets search bar
    function customCourseCardFormSubmit(e){
        e.preventDefault()
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
                        <input type='text' maxLength="6" className='customCourseCard-textinput' id='customCourseCardFormHandler-courseID' name='courseID' value={customCourseCardForm.courseID} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-courseName'>Course Name</label>
                        <input type='text' className='customCourseCard-textinput'  id='customCourseCardFormHandler-courseName' name='courseName' value={customCourseCardForm.courseName} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-courseDescription'>Course Description</label>
                        <textarea name='courseDescription' className='customCourseCard-textarea' id='customCourseCardFormHandler-courseDescription' value={customCourseCardForm.courseDescription} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-coursePrereqs'>Course Prerequisites</label>
                        <textarea name='coursePrereqs' className='customCourseCard-textarea'  id='customCourseCardFormHandler-coursePrereqs' value={customCourseCardForm.coursePrereqs} onChange={customCourseCardFormHandler}/>
                        <br />
                        <label htmlFor='customCourseCardFormHandler-courseExclusions'>Course Exclusions</label>
                        <textarea name='courseExclusions' className='customCourseCard-textarea'  id='customCourseCardFormHandler-courseExclusions' value={customCourseCardForm.courseExclusions} onChange={customCourseCardFormHandler}/>
                        <br />
                        <button type='submit' className='customCourseCard-Submit'>Submit</button>
                    </form>
                </div>
            )
        }
        
        return SearchResults.map(course => (
            <li key={course.courseID}>
                <button type="button" className='SearchBar-Course' value={course.courseID} onClick={handleClickChange}>
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
            <input className='SearchBar-Bar' type='text' maxLength="8" onChange={handleChange} onFocus={()=>SetSearchResultsVisible(true)} value={SearchCourses} placeholder=''/>
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
        {DropdownVisible && <FiltersMenu changeSummerFilterFunc={() => setSummerFilter(!SummerFilter)} 
                                         changeWinterFilterFunc={() => setWinterFilter(!WinterFilter)}
                                         changeFallFilterFunc={() => setFallFilter(!FallFilter)}
                                         changeSubjectFilterFunc={(e) => {setSubjectFilter(e.target.value)}}
                                         changeYearFilterFunc={(e) => {setYearFilter(e.target.value)}}
        />}
    </div>)
}