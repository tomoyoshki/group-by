import './ProjectGroup.scss'
import '../UserBoard/UserBoard'
import Users from '../Users/Users'
import { Link } from 'react-router-dom'

export default function ProjectGroup() {
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
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
                <Users />
            </div>
        </div>
    )
}