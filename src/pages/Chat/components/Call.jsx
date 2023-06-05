import React, { useCallback, useEffect } from 'react'

export default function Call({ roomName, username, handleCloseCall }) {

    const domain = "meet.jit.si";
    let api = {};
    const name = username;

    // INTIALISE THE MEET WITH THIS FUNCTION
    const startMeet = useCallback(() => {
        const options = {
            roomName: roomName,
            width: "100%",
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
                // overwrite interface properties if you want
            },
            // VIDEO FRAME WILL BE ADDED HERE
            parentNode: document.querySelector("#jitsi-iframe"),
            userInfo: {
                displayName: name,
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        api = new window.JitsiMeetExternalAPI(domain, options);

        api.addEventListeners({
            readyToClose: handleClose,
            participantLeft: handleParticipantLeft,
            participantJoined: handleParticipantJoined,
            videoConferenceJoined: handleVideoConferenceJoined,
            videoConferenceLeft: handleVideoConferenceLeft,
        });
    }, [api]);


    // ALL OUR HANDLERS
    const handleClose = () => {
        console.log("handleClose..........................");
    };

    const handleParticipantLeft = async (participant) => {
        console.log("handleParticipantLeft", participant);
        await getParticipants();
    };

    const handleParticipantJoined = async (participant) => {
        console.log("handleParticipantJoined", participant);
        await getParticipants();
    };

    const handleVideoConferenceJoined = async (participant) => {
        console.log("handleVideoConferenceJoined", participant);
        await getParticipants();
    };

    const handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        handleCloseCall();
    };

    // GETTING ALL PARTICIPANTS
    const getParticipants = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(api.getParticipantsInfo());
            }, 500);
        });
    };

    useEffect(() => {
        if (window.JitsiMeetExternalAPI) {
            startMeet();
        } else {
            alert("JitsiMeetExternalAPI not loaded");
        }
    }, [startMeet]);
    return (
        <div id="jitsi-iframe"></div>
    )
}
