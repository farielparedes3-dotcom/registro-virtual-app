import React from 'react';
import UpcomingThreeHoursBar from './UpcomingThreeHoursBar';
import docentesData from '../../data/docentesHorarios.json';

export default function ScheduleTimeline(props) {
  if (!props?.currentUser || !docentesData) {
    return null;
  }
  try {
    return <UpcomingThreeHoursBar {...props} />;
  } catch (err) {
    console.error('Error rendering ScheduleTimeline:', err);
    return null;
  }
}
