import Alert from '@material-ui/lab/Alert';
import React from 'react';

const TrendsGuidance: React.FC = () => {
  return (
    <Alert severity="info">
      Select a course to see aggregate metrics across all semesters and charts
      that display semester-by-semester trends.
    </Alert>
  );
};

export default TrendsGuidance;
