import { EventTracker } from '@devexpress/dx-react-chart';
import { ValueScale } from '@devexpress/dx-react-chart';
import {
  ArgumentAxis,
  BarSeries,
  Chart,
  LineSeries,
  Tooltip,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { semesterMeta } from 'src/constants/semesterMeta';
import { CourseSeriesItem } from 'src/graphql';

import { useStyles } from './TrendsChart.styles';

interface Props {
  data: CourseSeriesItem[];
  title: string;
  field: keyof Omit<CourseSeriesItem, 'semester' | '__typename'>;
  max?: number;
  reference?: number;
}

const TrendsChart: React.FC<Props> = ({
  data,
  title,
  field,
  max,
  reference,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography
        variant="body2"
        color="textSecondary"
        style={{ textAlign: 'center' }}
      >
        {title}
      </Typography>
      <Chart
        data={data.map((item) => ({
          ...item,
          x: getArgumentAxisLabel(item),
          reference,
        }))}
      >
        <ArgumentAxis />
        <ValueAxis tickSize={1} />
        {max != null && <ValueScale modifyDomain={() => [0, max]} />}
        <BarSeries name="bar" valueField={field} argumentField="x" />
        {reference != null && (
          <LineSeries
            name="reference"
            valueField="reference"
            argumentField="x"
          />
        )}
        <EventTracker />
        <Tooltip />
      </Chart>
    </Paper>
  );
};

export default TrendsChart;

const getArgumentAxisLabel = ({ semester }: CourseSeriesItem): string => {
  const season = semesterMeta.season[semester.season];

  return `${season.label.substring(0, 2)}.${semester.year}`;
};
