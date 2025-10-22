import './Navbar.css'

const Navbar=()=>{
    return(
        <div className='main'>
            <li className='list'>
                <ul onClick={open}>Home</ul>
                <ul>Counselling</ul>
                <ul>College </ul>
                <ul>Courses</ul>
                <ul>Registration</ul>
                <ul>Profile</ul>
            </li>
        </div>
    )

}

export default Navbar;