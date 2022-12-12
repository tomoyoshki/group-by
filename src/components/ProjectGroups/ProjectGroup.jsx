import './ProjectGroup.scss'
import '../UserBoard/UserBoard'
import Users from '../Users/Users'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProjectGroup({project, setUser}) {
    const [userinfo, setUserInfo] = useState([])
    const getIndividualInfo = async () => {
        const params = {
            assignment_id: project._id
        }
        const url = `http://localhost:4000/api/infos`
        try {
            const res = await axios.get(url, {params: {
                where: JSON.stringify(params)
            }});

            if (res.status === 404) {
                return null
            }

            const user_data = res.data.data
            setUserInfo(user_data)
        } catch(e) {
            console.log(e)
        }
    }
    useEffect(()=> {
        getIndividualInfo()
    }, [])

    useEffect(()=> {
        console.log("eff: ", userinfo)
    }, [userinfo])
    return (
        <div className="project_group">
            <div className='project_header'>
                <Link className='back_button' to="/">&#8592;</Link>
                <div className='title_tab'>
                    <div className='image'></div>
                    {project.assignment_name}
                </div>
            </div>
            <div className='group_list'>
            {
                userinfo.map((element) => {
                    return <Users key={element.user_id} setUser={setUser} user={element} />
                })
            }
            </div>
        </div>
    )
}