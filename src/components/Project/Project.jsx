import { Link } from 'react-router-dom'
import './Project.scss'
export default function Project({name, matched, assignment}) {
    var s = assignment.start_date
    var e = assignment.end_date

    var sd = Date.parse(s)
    var ed = Date.parse(e)

    var total = (ed - sd)
    var been = (Date.now() - sd)

    var ratio;
    if (been < 0) {
        ratio = 0
    } else {
        ratio = (been / total) * 100
    }

    return (
        <Link className="project_row" to={`/projects/${assignment._id}`}>
            <div className="project_image"></div>
            <div className='project_title'>
                <div className='title'>{name}</div>
                {!matched ? (
                    <div className='subtitle'>
                        <div className='progress'>
                            <div className='bar' style={{width: `${ratio}%`}}></div>
                        </div>
                        <div className='dates'>
                            <span>{assignment.start_date ? assignment.start_date.substr(0, 10) : ""}</span>
                            <span>{assignment.end_date ? assignment.end_date.substr(0, 10) : ""}</span>
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
                        <div>{assignment.join_code}</div>
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