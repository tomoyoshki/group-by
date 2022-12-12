import { Link } from 'react-router-dom'
import './Project.scss'
export default function Project({name, matched, element}) {
    return (
        <Link className="project_row" to={`/${element._id}`}>
            <div className="project_image"></div>
            <div className='project_title'>
                <div className='title'>{name}</div>
                {!matched ? (
                    <div className='subtitle'>
                        <div className='progress'>
                            <div className='bar'></div>
                        </div>
                        <div className='dates'>
                            <span>Start Date</span>
                            <span>End Date</span>
                        </div>
                    </div>
                ) : (
                    <div className='project_members'>
                        Team members: 
                        {
                            <>
                                <span>a</span>
                                <span>b</span>
                                <span>c</span>
                                <span>d</span>
                            </>
                        }
                    </div>
                )}
            </div>
            <div className='project-info'>
                {!matched ? (
                    <>
                        <div>Your team</div>
                        <div>40 found groups</div>
                        <div>100 still looking for groups</div>
                    </>
                ) : (
                    <div></div>
                )}
            </div>
            
        </Link>
    )
}