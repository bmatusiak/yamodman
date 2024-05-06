import React from 'react';

export default function (profile, imports) {
    
    return {
        id: 'start_modded',
        catagory: 'game',
        title: 'Start Modded',
        icon: 'play-circle-fill',
        component: function component(props) {

            return (<>
                {JSON.stringify(profile)}
            </>);

        }
    }
}
