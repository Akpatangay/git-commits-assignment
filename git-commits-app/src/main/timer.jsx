import React, { useEffect, useState } from 'react';
import moment from 'moment/moment.js';


function Timer(props) {
	const [time, setTime] = useState(0);
	const [logTime, setLogTime] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			finalTime(logTime-1);
		}, 1000);
		if(logTime<1) {
			clearInterval(interval);
			reset();
		}
		return ()=>clearInterval(interval);
	}, [time]);

	const finalTime=(time)=>{
		let t = moment('10-01-01').startOf('day').seconds(time).format('mm:ss');
		setLogTime(time);
		setTime(t);
	}

    useEffect(() => {
        let time = 30;
        setLogTime(time);
        finalTime(time);
    }, [props.start])

	const reset=()=>{
		setTime(0);
		setLogTime(0);
        props.fetchDetails();
	}

	return (
		<div className='timer'>
			<h3>{`${!props.start ? '00:00' : time}`}</h3>
		</div>
	);
}

export default Timer;
