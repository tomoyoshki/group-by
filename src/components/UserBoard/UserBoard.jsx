import "./UserBoard.scss"
import { removeToken } from "../../utils/useToken"
import { useNavigate } from "react-router-dom";
export default function UserBoard() {
    const navigate = useNavigate();
    const handleSignout = ()=> {
        removeToken();
        navigate('/login')
    }
    return (
        <div className="user_board">
            <div className="user_section">
                <div className="user_image"></div>
                <div className="title">Test user</div>
                <div className="user_action">
                    <span>setting</span>
                    <span onClick={()=>{handleSignout()}}>sign out</span>
            </div>
            </div>
            <div className="message_section">
                <div className="message_title">Incomming Messages</div>
            </div>
            <div className="message_section">
                <div className="message_title">Response Messages</div>
            </div>
        </div>
    )
}