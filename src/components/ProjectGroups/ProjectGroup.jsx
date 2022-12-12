import './ProjectGroup.scss'
import '../UserBoard/UserBoard'
import Users from '../Users/Users'
import { Link } from 'react-router-dom'

export default function ProjectGroup({setUser}) {

    return (
        <div className="project_group">
            <div className='project_header'>
                <Link className='back_button' to="/">&#8592;</Link>
                <div className='title_tab'>
                    <div className='image'></div>
                    CS 409 Final Project
                </div>
            </div>
            <div className='group_list'>
                <Users setUser={setUser} user={"user1"}/>
                <Users setUser={setUser} user={"user2"}/>
                <Users setUser={setUser} user={"user3"}/>
                <Users setUser={setUser} user={"user4"}/>
                <Users setUser={setUser} user={"user5"}/>
                <Users setUser={setUser} user={"user6"}/>
                <Users setUser={setUser} user={"user7"}/>
                <Users setUser={setUser} user={"user8"}/>
                <Users setUser={setUser} user={"user9"}/>
            </div>
        </div>
    )
}