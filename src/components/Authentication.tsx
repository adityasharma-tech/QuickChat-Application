import React from 'react'
import AuthComponent from './AuthComponent'
import GuideScreenComponent from './GuideScreenComponent';

export default function Authentication() {
    const [authenticating, setIsAuthenticating] = React.useState(false)
    if(authenticating) return <AuthComponent onBack={()=>setIsAuthenticating(false)}/>;
    else return <GuideScreenComponent onPress={()=>setIsAuthenticating(true)}/>;
}