import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { Nullable } from 'src/core';
import { Course } from 'src/graphql';

interface Props {
  disabled?: boolean;
  options: Course[];
  onChange: (course: Nullable<Course>) => void;
}

const CourseSelect: React.FC<Props> = ({
  disabled = false,
  options,
  onChange,
}) => {
  return (
    <Autocomplete
      fullWidth
      noOptionsText="No matching courses..."
      disabled={disabled}
      options={options}
      getOptionLabel={({ id, name }: Course) => `${id} ${name}`}
      renderOption={({ id, name }: Course) => (
        <Typography key={id} noWrap>
          {id} {name}
        </Typography>
      )}
      onChange={(e, course: Nullable<Course>) => {
        onChange(course);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Course" variant="outlined" />
      )}
    />
  );
};

export default CourseSelect;
